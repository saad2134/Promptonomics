import { EXTENSION_CONFIG, AuthStatus, UserStats, ExtensionSettings, PromptHistoryItem } from "../shared/types";

type StorageArea = chrome.storage.StorageArea;

async function get<T>(keys: string | string[], area: StorageArea = "local"): Promise<Record<string, T>> {
  return new Promise((resolve, reject) => {
    (chrome.storage[area] as chrome.storage.StorageArea).get(keys, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(result as Record<string, T>);
      }
    });
  });
}

async function set(data: Record<string, unknown>, area: StorageArea = "local"): Promise<void> {
  return new Promise((resolve, reject) => {
    (chrome.storage[area] as chrome.storage.StorageArea).set(data, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

async function remove(keys: string | string[], area: StorageArea = "local"): Promise<void> {
  return new Promise((resolve, reject) => {
    (chrome.storage[area] as chrome.storage.StorageArea).remove(keys, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

async function clear(area: StorageArea = "local"): Promise<void> {
  return new Promise((resolve, reject) => {
    (chrome.storage[area] as chrome.storage.StorageArea).clear(() => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

export const storage = {
  async getAuthStatus(): Promise<AuthStatus | null> {
    const result = await get<AuthStatus>(EXTENSION_CONFIG.storageKeys.authToken);
    const token = result[EXTENSION_CONFIG.storageKeys.authToken];
    if (!token) return null;

    const userResult = await get<UserData>(EXTENSION_CONFIG.storageKeys.userData);
    const user = userResult[EXTENSION_CONFIG.storageKeys.userData];

    return user ? { isAuthenticated: true, user, token } : { isAuthenticated: false, user: null, token };
  },

  async setAuthStatus(status: AuthStatus): Promise<void> {
    if (status.token) {
      await set({ [EXTENSION_CONFIG.storageKeys.authToken]: status.token });
    }
    if (status.user) {
      await set({ [EXTENSION_CONFIG.storageKeys.userData]: status.user });
    }
  },

  async clearAuth(): Promise<void> {
    await remove([
      EXTENSION_CONFIG.storageKeys.authToken,
      EXTENSION_CONFIG.storageKeys.userData
    ]);
  },

  async getStats(): Promise<UserStats | null> {
    const result = await get<UserStats>(EXTENSION_CONFIG.storageKeys.stats);
    return result[EXTENSION_CONFIG.storageKeys.stats] || null;
  },

  async setStats(stats: UserStats): Promise<void> {
    await set({ [EXTENSION_CONFIG.storageKeys.stats]: stats });
  },

  async getSettings(): Promise<ExtensionSettings> {
    const defaults: ExtensionSettings = {
      autoAnalyze: true,
      showInlinePanel: true,
      theme: "system",
      notifications: true,
      modelHints: true,
      suggestions: true,
      compactMode: false
    };

    const result = await get<ExtensionSettings>(EXTENSION_CONFIG.storageKeys.settings);
    const stored = result[EXTENSION_CONFIG.storageKeys.settings];
    return stored ? { ...defaults, ...stored } : defaults;
  },

  async updateSettings(settings: Partial<ExtensionSettings>): Promise<void> {
    const current = await this.getSettings();
    await set({ [EXTENSION_CONFIG.storageKeys.settings]: { ...current, ...settings } });
  },

  async getHistory(): Promise<PromptHistoryItem[]> {
    const result = await get<PromptHistoryItem[]>(EXTENSION_CONFIG.storageKeys.promptHistory);
    return result[EXTENSION_CONFIG.storageKeys.promptHistory] || [];
  },

  async addToHistory(item: PromptHistoryItem): Promise<void> {
    const history = await this.getHistory();
    const updated = [item, ...history].slice(0, 100);
    await set({ [EXTENSION_CONFIG.storageKeys.promptHistory]: updated });
  },

  async clearHistory(): Promise<void> {
    await remove(EXTENSION_CONFIG.storageKeys.promptHistory);
  },

  async setLocalStats(stats: Partial<UserStats>): Promise<void> {
    const current = await this.getStats();
    await this.setStats({ ...current, ...stats } as UserStats);
  }
};

export default storage;
