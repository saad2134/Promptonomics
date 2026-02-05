import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { AuthStatus, UserStats } from "../shared/types";
import "./Popup.css";

const EXTENSION_VERSION = "0.1.0";
const BASE_URL = "https://greenprompt.vercel.app";

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
    <div className="loading">
      <div className="spinner"></div>
    </div>
  );
}

function UnauthorizedView() {
  const handleLogin = () => {
    chrome.tabs.create({ url: `${BASE_URL}/auth` });
  };

  return (
    <div className="unauth-section">
      <div className="unauth-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      </div>
      <h3 className="unauth-title">Sign in to GreenPrompt</h3>
      <p className="unauth-desc">
        Connect your account to analyze prompts, track your impact, and get personalized optimizations.
      </p>
      <button className="btn btn-primary" onClick={handleLogin}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        Sign In
      </button>
    </div>
  );
}

function StatsSection({ stats }: { stats: UserStats | null }) {
  if (!stats) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
        </div>
        <h4 className="empty-title">No stats yet</h4>
        <p className="empty-desc">Start analyzing prompts to see your impact</p>
      </div>
    );
  }

  return (
    <div className="stats-grid">
      <div className="stat-card highlight">
        <div className="stat-value">{stats.totalAnalyzed}</div>
        <div className="stat-label">Prompts Analyzed</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{(stats.totalEnergySaved / 1000).toFixed(1)}k</div>
        <div className="stat-label">Energy Saved (J)</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.totalCarbonPrevented.toFixed(1)}g</div>
        <div className="stat-label">CO₂ Prevented</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">${stats.totalCostSaved.toFixed(2)}</div>
        <div className="stat-label">Cost Saved</div>
      </div>
    </div>
  );
}

function AuthenticatedView({ auth }: { auth: AuthStatus }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await browser.runtime.sendMessage({ type: "GET_STATS" }) as { ok: boolean; data: UserStats };
        if (response.ok) {
          setStats(response.data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <>
      <div className="section">
        <div className="auth-status">
          <div className="auth-avatar">{getInitials(auth.user?.email || "")}</div>
          <div className="auth-info">
            <div className="auth-name">{auth.user?.name || auth.user?.email}</div>
            <div className="auth-email">{auth.user?.email}</div>
            <span className="auth-plan">{auth.user?.plan || "Free"}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">
            <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
            Your Impact
          </span>
        </div>
        {loading ? <LoadingSpinner /> : <StatsSection stats={stats} />}
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">
            <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Quick Actions
          </span>
        </div>
        <div className="quick-actions">
          <button className="action-btn">
            <div className="action-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div className="action-content">
              <div className="action-title">Analyze Prompt</div>
              <div className="action-desc">Check efficiency of any prompt</div>
            </div>
          </button>
          <button className="action-btn">
            <div className="action-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="action-content">
              <div className="action-title">View History</div>
              <div className="action-desc">See past analyses</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

function Header() {
  const handleSettings = () => {
    browser.runtime.openOptionsPage?.();
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="icons/icon-48.png" alt="GreenPrompt" className="header-logo" />
        <div>
          <div className="header-title">GreenPrompt</div>
          <div className="header-subtitle">Make AI greener</div>
        </div>
      </div>
      <div className="header-right">
        <button className="icon-btn" title="Settings" onClick={handleSettings}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a className="footer-link" href={`${BASE_URL}/help`} target="_blank" rel="noopener noreferrer">
          Help
        </a>
        <a className="footer-link" href={`${BASE_URL}/terms`} target="_blank" rel="noopener noreferrer">
          Terms
        </a>
        <a className="footer-link" href={`${BASE_URL}/privacy`} target="_blank" rel="noopener noreferrer">
          Privacy
        </a>
      </div>
      <span className="version">v{EXTENSION_VERSION}</span>
    </footer>
  );
}

function Popup() {
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      try {
        const response = await browser.runtime.sendMessage({ type: "GET_AUTH_STATUS" }) as { ok: boolean; data: AuthStatus };
        setAuth(response.ok ? response.data : null);
      } catch {
        setAuth(null);
      } finally {
        setLoading(false);
      }
    }
    loadAuth();
  }, []);

  if (loading) {
    return (
      <div className="popup-container">
        <LoadingSpinner />
      </div>
    );
  }

  const isAuthenticated = auth?.isAuthenticated && auth?.user;

  return (
    <div className="popup-container">
      <Header />

      <main className="content">
        {isAuthenticated ? (
          <AuthenticatedView auth={auth!} />
        ) : (
          <UnauthorizedView />
        )}
      </main>

      <Footer />
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<Popup />);
}
