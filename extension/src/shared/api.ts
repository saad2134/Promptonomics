import { EXTENSION_CONFIG, APIResponse, PromptAnalysis, UserStats, ExtensionSettings, PromptHistoryItem, UserData } from "../shared/types";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const mockPromptAnalysis = (prompt: string): PromptAnalysis => {
  const tokens = prompt.split(" ").length * 1.3;
  const baseEnergy = tokens * 0.5;
  return {
    energy: Math.round(baseEnergy * 100) / 100,
    energyUnit: "J",
    carbon: Math.round(baseEnergy * 0.05 * 100) / 100,
    carbonUnit: "g",
    water: Math.round(baseEnergy * 2 * 100) / 100,
    waterUnit: "mL",
    cost: Math.round(tokens * 0.0003 * 100) / 100,
    costUnit: "$",
    tokens: Math.round(tokens),
    suggestions: [
      {
        id: crypto.randomUUID(),
        text: "Consider using fewer words for better efficiency",
        type: "optimization",
        energySavings: Math.round(baseEnergy * 0.2 * 100) / 100,
        percentage: 20,
        priority: "medium"
      },
      {
        id: crypto.randomUUID(),
        text: "Claude 3 Haiku uses 60% less energy for simple tasks",
        type: "info",
        priority: "low"
      }
    ],
    confidence: 0.85,
    modelSuggestions: [
      {
        modelId: "claude-3-haiku",
        modelName: "Claude 3 Haiku",
        energy: Math.round(baseEnergy * 0.4 * 100) / 100,
        accuracy: 0.92,
        savings: 60,
        recommendation: "recommended"
      },
      {
        modelId: "gpt-3.5-turbo",
        modelName: "GPT-3.5 Turbo",
        energy: Math.round(baseEnergy * 0.7 * 100) / 100,
        accuracy: 0.88,
        savings: 30,
        recommendation: "alternative"
      }
    ]
  };
};

const mockUserStats: UserStats = {
  totalAnalyzed: 47,
  totalEnergySaved: 1250,
  totalCarbonPrevented: 62.5,
  totalWaterSaved: 2500,
  totalCostSaved: 12.75,
  streak: 7,
  lastAnalyzed: new Date().toISOString(),
  weeklyData: [
    { date: "2026-01-29", energySaved: 120, promptsAnalyzed: 5 },
    { date: "2026-01-30", energySaved: 180, promptsAnalyzed: 8 },
    { date: "2026-01-31", energySaved: 90, promptsAnalyzed: 4 },
    { date: "2026-02-01", energySaved: 210, promptsAnalyzed: 10 },
    { date: "2026-02-02", energySaved: 150, promptsAnalyzed: 7 },
    { date: "2026-02-03", energySaved: 200, promptsAnalyzed: 9 },
    { date: "2026-02-04", energySaved: 300, promptsAnalyzed: 12 }
  ],
  teamRank: 3
};

const mockSettings: ExtensionSettings = {
  autoAnalyze: true,
  showInlinePanel: true,
  theme: "system",
  notifications: true,
  modelHints: true,
  suggestions: true,
  compactMode: false
};

const mockUser: UserData = {
  id: "demo-user-123",
  email: "demo@greenprompt.ai",
  name: "Demo User",
  plan: "pro",
  createdAt: "2026-01-01T00:00:00Z"
};

class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: APIResponse<unknown>
  ) {
    super(message);
    this.name = "APIError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<APIResponse<T>> {
  if (DEMO_MODE) {
    return mockRequest<T>(endpoint, options, token);
  }

  const url = `${EXTENSION_CONFIG.apiBaseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error || "Request failed",
        response.status,
        data
      );
    }

    return { success: true, ...data };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error"
    };
  }
}

async function mockRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  _token?: string
): Promise<APIResponse<T>> {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (endpoint === "/analyze" && options.method === "POST") {
    const body = JSON.parse(options.body as string || "{}");
    return { success: true, data: mockPromptAnalysis(body.prompt) as T };
  }

  if (endpoint === "/stats" && options.method === "GET") {
    return { success: true, data: mockUserStats as T };
  }

  if (endpoint === "/settings" && options.method === "GET") {
    return { success: true, data: mockSettings as T };
  }

  if (endpoint === "/settings" && options.method === "PATCH") {
    return { success: true, data: mockSettings as T };
  }

  if (endpoint.startsWith("/history")) {
    return { success: true, data: [] as T };
  }

  return { success: false, error: "Unknown endpoint" };
}

export const api = {
  async analyzePrompt(prompt: string, token?: string): Promise<APIResponse<PromptAnalysis>> {
    return request<PromptAnalysis>("/analyze", {
      method: "POST",
      body: JSON.stringify({ prompt, includeSuggestions: true }),
    }, token);
  },

  async getUserStats(token: string): Promise<APIResponse<UserStats>> {
    return request<UserStats>("/stats", { method: "GET" }, token);
  },

  async getUserSettings(token: string): Promise<APIResponse<ExtensionSettings>> {
    return request<ExtensionSettings>("/settings", { method: "GET" }, token);
  },

  async updateUserSettings(settings: Partial<ExtensionSettings>, token: string): Promise<APIResponse<ExtensionSettings>> {
    return request<ExtensionSettings>("/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    }, token);
  },

  async getPromptHistory(token: string, limit = 50): Promise<APIResponse<PromptHistoryItem[]>> {
    return request<PromptHistoryItem[]>(`/history?limit=${limit}`, { method: "GET" }, token);
  },

  async savePrompt(item: Omit<PromptHistoryItem, "id" | "timestamp">, token: string): Promise<APIResponse<PromptHistoryItem>> {
    return request<PromptHistoryItem>("/history", {
      method: "POST",
      body: JSON.stringify(item),
    }, token);
  },

  async getModels(): Promise<APIResponse<{ id: string; name: string; efficiency: number }[]>> {
    return request("/models", { method: "GET" });
  },

  async benchmarkPrompt(prompt: string, modelIds: string[], token: string): Promise<APIResponse<{ results: { modelId: string; analysis: PromptAnalysis }[] }>> {
    return request("/benchmark", {
      method: "POST",
      body: JSON.stringify({ prompt, modelIds }),
    }, token);
  }
};

export { APIError };
