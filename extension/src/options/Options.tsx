import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { AuthStatus, UserStats, ExtensionSettings } from "../shared/types";
import "./Options.css";

const EXTENSION_VERSION = "0.1.0";

function getInitials(email: string): string {
  return email
    .split("@")[0]
    .split(".")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function LoadingSpinner() {
  return (
    <div className="opt-loading">
      <div className="opt-spinner"></div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="opt-toggle-item">
      <span className="opt-toggle-label">{label}</span>
      <button
        className={`opt-toggle-switch ${checked ? "active" : ""}`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span className="opt-toggle-thumb" />
      </button>
    </div>
  );
}

function AuthenticatedView({ auth }: { auth: AuthStatus }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, settingsRes] = await Promise.all([
          browser.runtime.sendMessage({ type: "GET_STATS" }) as Promise<{ ok: boolean; data: UserStats }>,
          browser.runtime.sendMessage({ type: "GET_SETTINGS" }) as Promise<{ ok: boolean; data: ExtensionSettings }>
        ]);

        if (statsRes.ok) setStats(statsRes.data);
        if (settingsRes.ok) setSettings(settingsRes.data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await browser.runtime.sendMessage({ type: "CLEAR_AUTH" });
    window.location.reload();
  };

  const handleSettingChange = async (key: keyof ExtensionSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value } as ExtensionSettings;
    setSettings(newSettings);
    await browser.runtime.sendMessage({ type: "UPDATE_SETTINGS", payload: newSettings });
  };

  return (
    <div className="opt-container">
      <header className="opt-header">
        <div className="opt-header-left">
          <img src="/icons/icon-48.png" alt="GreenPrompt" className="opt-logo" />
          <div>
            <h1 className="opt-title">GreenPrompt Settings</h1>
            <p className="opt-subtitle">Manage your account and preferences</p>
          </div>
        </div>
      </header>

      <main className="opt-content">
        <section className="opt-section">
          <h2 className="opt-section-title">Account</h2>
          <div className="opt-card">
            <div className="opt-profile">
              <div className="opt-avatar">{getInitials(auth.user?.email || "")}</div>
              <div className="opt-profile-info">
                <h3 className="opt-name">{auth.user?.name || auth.user?.email}</h3>
                <p className="opt-email">{auth.user?.email}</p>
                <span className="opt-plan">{auth.user?.plan || "Free"} Plan</span>
              </div>
            </div>
            <button className="opt-btn opt-btn-outline" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </section>

        <section className="opt-section">
          <h2 className="opt-section-title">Your Impact</h2>
          {loading ? (
            <LoadingSpinner />
          ) : stats ? (
            <div className="opt-stats-grid">
              <div className="opt-stat">
                <div className="opt-stat-value">{stats.totalAnalyzed}</div>
                <div className="opt-stat-label">Prompts Analyzed</div>
              </div>
              <div className="opt-stat">
                <div className="opt-stat-value">{(stats.totalEnergySaved / 1000).toFixed(1)}kJ</div>
                <div className="opt-stat-label">Energy Saved</div>
              </div>
              <div className="opt-stat">
                <div className="opt-stat-value">{stats.totalCarbonPrevented.toFixed(1)}g</div>
                <div className="opt-stat-label">CO₂ Prevented</div>
              </div>
              <div className="opt-stat">
                <div className="opt-stat-value">${stats.totalCostSaved.toFixed(2)}</div>
                <div className="opt-stat-label">Cost Saved</div>
              </div>
            </div>
          ) : (
            <p className="opt-empty">No stats yet. Start analyzing prompts!</p>
          )}
        </section>

        <section className="opt-section">
          <h2 className="opt-section-title">Preferences</h2>
          {settings && (
            <div className="opt-card">
              <Toggle
                label="Auto-analyze prompts"
                checked={settings.autoAnalyze}
                onChange={(v) => handleSettingChange("autoAnalyze", v)}
              />
              <Toggle
                label="Show inline panel"
                checked={settings.showInlinePanel}
                onChange={(v) => handleSettingChange("showInlinePanel", v)}
              />
              <Toggle
                label="Model suggestions"
                checked={settings.modelHints}
                onChange={(v) => handleSettingChange("modelHints", v)}
              />
              <Toggle
                label="Optimization suggestions"
                checked={settings.suggestions}
                onChange={(v) => handleSettingChange("suggestions", v)}
              />
              <Toggle
                label="Notifications"
                checked={settings.notifications}
                onChange={(v) => handleSettingChange("notifications", v)}
              />
              <Toggle
                label="Compact mode"
                checked={settings.compactMode}
                onChange={(v) => handleSettingChange("compactMode", v)}
              />
            </div>
          )}
        </section>

        <section className="opt-section">
          <h2 className="opt-section-title">Supported Sites</h2>
          <div className="opt-sites">
            <div className="opt-site">
              <span className="opt-site-name">ChatGPT</span>
              <span className="opt-site-status active">Supported</span>
            </div>
            <div className="opt-site">
              <span className="opt-site-name">Claude</span>
              <span className="opt-site-status active">Supported</span>
            </div>
            <div className="opt-site">
              <span className="opt-site-name">Gemini</span>
              <span className="opt-site-status active">Supported</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="opt-footer">
        <p>GreenPrompt v{EXTENSION_VERSION}</p>
        <div className="opt-footer-links">
          <a href="https://greenprompt.vercel.app/privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a href="https://greenprompt.vercel.app/terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          <a href="https://greenprompt.vercel.app/help" onClick={(e) => e.preventDefault()}>Help</a>
        </div>
      </footer>
    </div>
  );
}

function UnauthorizedView() {
  const handleLogin = () => {
    chrome.tabs.create({ url: "https://greenprompt.vercel.app/auth" });
  };

  return (
    <div className="opt-container">
      <header className="opt-header">
        <div className="opt-header-left">
          <div className="opt-logo">
            <img src="/icons/icon-48.png" alt="Logo" />
          </div>
          <div>
            <h1 className="opt-title">GreenPrompt</h1>
            <p className="opt-subtitle">Sign in to manage your settings</p>
          </div>
        </div>
      </header>

      <main className="opt-content">
        <div className="opt-unauth">
          <div className="opt-unauth-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>
          <h2>Sign in to GreenPrompt</h2>
          <p>Connect your account to analyze prompts, track your impact, and get personalized optimizations.</p>
          <button className="opt-btn opt-btn-primary opt-btn-lg" onClick={handleLogin}>
            Sign In
          </button>
        </div>
      </main>

      <footer className="opt-footer">
        <p>GreenPrompt v{EXTENSION_VERSION}</p>
      </footer>
    </div>
  );
}

function Options() {
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await browser.runtime.sendMessage({ type: "GET_AUTH_STATUS" }) as { ok: boolean; data: AuthStatus };
        setAuth(response.ok ? response.data : null);
      } catch {
        setAuth(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="opt-container">
        <LoadingSpinner />
      </div>
    );
  }

  return auth?.isAuthenticated && auth.user ? (
    <AuthenticatedView auth={auth} />
  ) : (
    <UnauthorizedView />
  );
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<Options />);
}
