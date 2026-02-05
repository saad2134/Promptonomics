import browser from "webextension-polyfill";
import { PopupMessage, InjectedMessage, PromptAnalysis, UserStats, ExtensionSettings, PromptHistoryItem } from "./shared/types";
import { api, APIError } from "./shared/api";
import { storage } from "./shared/storage";

let panelOpen = false;
let currentTabId: number | null = null;

browser.runtime.onMessage.addListener(
  async (message: PopupMessage | InjectedMessage, sender, sendResponse) => {
    try {
      if ("tabId" in sender && sender.tabId) {
        currentTabId = sender.tabId;
      }

      if (isPopupMessage(message)) {
        await handlePopupMessage(message, sendResponse);
      } else if (isInjectedMessage(message)) {
        await handleInjectedMessage(message, sendResponse);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      sendResponse({ ok: false, error: errorMessage });
    }
    return true;
  }
);

function isPopupMessage(message: PopupMessage | InjectedMessage): message is PopupMessage {
  return "payload" in message || message.type === "GET_AUTH_STATUS" || message.type === "GET_STATS" || message.type === "GET_SETTINGS";
}

function isInjectedMessage(message: PopupMessage | InjectedMessage): message is InjectedMessage {
  return "prompt" in message || message.type === "TOGGLE_PANEL" || message.type === "CLOSE_PANEL" || message.type === "SHOW_RESULT";
}

async function handlePopupMessage(message: PopupMessage, sendResponse: (response?: unknown) => void) {
  switch (message.type) {
    case "GET_AUTH_STATUS": {
      const authStatus = await storage.getAuthStatus();
      sendResponse({ ok: true, data: authStatus });
      break;
    }

    case "SET_AUTH_STATUS": {
      await storage.setAuthStatus(message.payload);
      sendResponse({ ok: true });
      break;
    }

    case "CLEAR_AUTH": {
      await storage.clearAuth();
      sendResponse({ ok: true });
      break;
    }

    case "ANALYZE_PROMPT": {
      const authStatus = await storage.getAuthStatus();
      const token = message.payload.token || authStatus?.token;

      if (!token) {
        sendResponse({ ok: false, error: "Authentication required" });
        return;
      }

      const result = await api.analyzePrompt(message.payload.prompt, token);

      if (result.success && result.data) {
        const stats = await storage.getStats();
        const newStats: Partial<UserStats> = {
          totalAnalyzed: (stats?.totalAnalyzed || 0) + 1,
          lastAnalyzed: new Date().toISOString()
        };
        await storage.setLocalStats(newStats);

        const historyItem: PromptHistoryItem = {
          id: crypto.randomUUID(),
          originalPrompt: message.payload.prompt,
          analysis: result.data,
          timestamp: new Date().toISOString(),
          source: "extension"
        };
        await storage.addToHistory(historyItem);
      }

      sendResponse(result);
      break;
    }

    case "GET_STATS": {
      const localStats = await storage.getStats();
      const authStatus = await storage.getAuthStatus();

      if (authStatus?.token) {
        try {
          const serverStats = await api.getUserStats(authStatus.token);
          if (serverStats.success && serverStats.data) {
            await storage.setStats(serverStats.data);
            sendResponse({ ok: true, data: serverStats.data });
            return;
          }
        } catch {
        }
      }

      sendResponse({ ok: true, data: localStats });
      break;
    }

    case "GET_SETTINGS": {
      const settings = await storage.getSettings();
      sendResponse({ ok: true, data: settings });
      break;
    }

    case "UPDATE_SETTINGS": {
      await storage.updateSettings(message.payload);
      broadcastToAllTabs({ type: "SETTINGS_UPDATED", settings: await storage.getSettings() });
      sendResponse({ ok: true });
      break;
    }

    case "GET_HISTORY": {
      const history = await storage.getHistory();
      sendResponse({ ok: true, data: history });
      break;
    }

    case "CLEAR_HISTORY": {
      await storage.clearHistory();
      sendResponse({ ok: true });
      break;
    }

    case "OPEN_OPTIONS": {
      browser.runtime.openOptionsPage?.();
      sendResponse({ ok: true });
      break;
    }

    case "CLOSE_PANEL": {
      panelOpen = false;
      if (currentTabId) {
        await browser.tabs.sendMessage(currentTabId, { type: "CLOSE_PANEL" });
      }
      sendResponse({ ok: true });
      break;
    }

    case "TOGGLE_PANEL": {
      panelOpen = !panelOpen;
      if (currentTabId) {
        await browser.tabs.sendMessage(currentTabId, { type: panelOpen ? "OPEN_PANEL" : "CLOSE_PANEL" });
      }
      sendResponse({ ok: true, data: { panelOpen } });
      break;
    }

    case "SET_LOADING": {
      if (currentTabId) {
        await browser.tabs.sendMessage(currentTabId, { type: "SET_LOADING", loading: message.payload });
      }
      sendResponse({ ok: true });
      break;
    }

    default:
      sendResponse({ ok: false, error: "Unknown message type" });
  }
}

async function handleInjectedMessage(message: InjectedMessage, sendResponse: (response?: unknown) => void) {
  switch (message.type) {
    case "ANALYZE_PROMPT": {
      const authStatus = await storage.getAuthStatus();
      const token = authStatus?.token;

      if (!token) {
        sendResponse({ ok: false, error: "Authentication required" });
        return;
      }

      const result = await api.analyzePrompt(message.prompt, token);

      if (result.success && result.data) {
        const stats = await storage.getStats();
        const newStats: Partial<UserStats> = {
          totalAnalyzed: (stats?.totalAnalyzed || 0) + 1,
          lastAnalyzed: new Date().toISOString()
        };
        await storage.setLocalStats(newStats);
      }

      sendResponse(result);
      break;
    }

    case "TOGGLE_PANEL": {
      panelOpen = !panelOpen;
      sendResponse({ ok: true, data: { panelOpen } });
      break;
    }

    case "CLOSE_PANEL": {
      panelOpen = false;
      sendResponse({ ok: true });
      break;
    }

    default:
      sendResponse({ ok: false, error: "Unknown injected message type" });
  }
}

async function broadcastToAllTabs(message: PopupMessage) {
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, message).catch(() => {});
    }
  }
}

browser.runtime.onInstalled.addListener(async () => {
  const defaultSettings: ExtensionSettings = {
    autoAnalyze: true,
    showInlinePanel: true,
    theme: "system",
    notifications: true,
    modelHints: true,
    suggestions: true,
    compactMode: false
  };
  await storage.updateSettings(defaultSettings);
});

export {};
