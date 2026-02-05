export const EXTENSION_CONFIG = {
  appName: "GreenPrompt",
  version: "0.1.0",
  apiBaseUrl: import.meta.env.VITE_API_URL || "https://api.greenprompt.dev",
  authUrl: import.meta.env.VITE_AUTH_URL || "https://greenprompt.ai",
  storageKeys: {
    authToken: "gp_auth_token",
    userData: "gp_user_data",
    settings: "gp_settings",
    stats: "gp_stats",
    promptHistory: "gp_prompt_history"
  }
};

export type AuthStatus = {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
};

export type UserData = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: "free" | "pro" | "team";
  createdAt: string;
};

export type PromptAnalysis = {
  energy: number;
  energyUnit: "J" | "mJ" | "kJ";
  carbon: number;
  carbonUnit: "kg" | "g" | "mg";
  water: number;
  waterUnit: "L" | "mL";
  cost: number;
  costUnit: "$" | "¢";
  tokens: number;
  suggestions: Suggestion[];
  confidence: number;
  modelSuggestions?: ModelSuggestion[];
};

export type Suggestion = {
  id: string;
  text: string;
  type: "optimization" | "warning" | "info";
  energySavings?: number;
  percentage?: number;
  priority: "high" | "medium" | "low";
};

export type ModelSuggestion = {
  modelId: string;
  modelName: string;
  energy: number;
  accuracy: number;
  savings: number;
  recommendation: "recommended" | "alternative" | "fallback";
};

export type UserStats = {
  totalAnalyzed: number;
  totalEnergySaved: number;
  totalCarbonPrevented: number;
  totalWaterSaved: number;
  totalCostSaved: number;
  streak: number;
  lastAnalyzed: string | null;
  weeklyData: WeeklyData[];
  teamRank?: number;
};

export type WeeklyData = {
  date: string;
  energySaved: number;
  promptsAnalyzed: number;
};

export type ExtensionSettings = {
  autoAnalyze: boolean;
  showInlinePanel: boolean;
  theme: "light" | "dark" | "system";
  notifications: boolean;
  modelHints: boolean;
  suggestions: boolean;
  compactMode: boolean;
};

export type PromptHistoryItem = {
  id: string;
  originalPrompt: string;
  optimizedPrompt?: string;
  analysis: PromptAnalysis;
  timestamp: string;
  source: string;
};

export type PopupMessage =
  | { type: "GET_AUTH_STATUS" }
  | { type: "SET_AUTH_STATUS"; payload: AuthStatus }
  | { type: "CLEAR_AUTH" }
  | { type: "ANALYZE_PROMPT"; payload: { prompt: string; token?: string } }
  | { type: "GET_STATS" }
  | { type: "GET_SETTINGS" }
  | { type: "UPDATE_SETTINGS"; payload: Partial<ExtensionSettings> }
  | { type: "GET_HISTORY" }
  | { type: "CLEAR_HISTORY" }
  | { type: "OPEN_OPTIONS" }
  | { type: "CLOSE_PANEL" }
  | { type: "TOGGLE_PANEL" }
  | { type: "SET_LOADING"; payload: boolean };

export type InjectedMessage =
  | { type: "ANALYZE_PROMPT"; prompt: string }
  | { type: "TOGGLE_PANEL" }
  | { type: "CLOSE_PANEL" }
  | { type: "SHOW_RESULT"; analysis: PromptAnalysis }
  | { type: "SHOW_ERROR"; error: string };

export type BackgroundMessage =
  | { type: "ANALYZE_PROMPT"; prompt: string; token: string }
  | { type: "FETCH_STATS"; token: string }
  | { type: "FETCH_HISTORY"; token: string }
  | { type: "GET_USER_SETTINGS"; token: string }
  | { type: "SAVE_PROMPT"; payload: PromptHistoryItem; token: string };

export type ExtensionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export function isExtensionMessage(message: unknown): message is PopupMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    typeof (message as Record<string, unknown>).type === "string"
  );
}

export function isInjectedMessage(message: unknown): message is InjectedMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    typeof (message as Record<string, unknown>).type === "string"
  );
}
