import { useState, useEffect, useCallback } from "react";
import { PromptAnalysis, Suggestion, ModelSuggestion, AuthStatus } from "../shared/types";
import "./app.css";

interface AppProps {
  isEmbedded?: boolean;
}

function LoadingSpinner() {
  return (
    <div className="gp-loading">
      <div className="gp-spinner"></div>
    </div>
  );
}

function AuthRequiredModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  return (
    <div className="gp-overlay" onClick={onClose}>
      <div className="gp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gp-modal-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </div>
        <h3 className="gp-modal-title">Sign in Required</h3>
        <p className="gp-modal-desc">You need to sign in to analyze prompts and track your impact.</p>
        <button className="gp-btn gp-btn-primary gp-btn-full" onClick={onLogin}>
          Sign In
        </button>
        <button className="gp-btn gp-btn-outline gp-btn-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function StatsDisplay({ analysis }: { analysis: PromptAnalysis }) {
  return (
    <div className="gp-stats-grid">
      <div className="gp-stat-card">
        <div className="gp-stat-value">{analysis.energy} {analysis.energyUnit}</div>
        <div className="gp-stat-label">Energy</div>
      </div>
      <div className="gp-stat-card">
        <div className="gp-stat-value">{analysis.carbon}{analysis.carbonUnit}</div>
        <div className="gp-stat-label">CO₂</div>
      </div>
      <div className="gp-stat-card">
        <div className="gp-stat-value">{analysis.tokens}</div>
        <div className="gp-stat-label">Tokens</div>
      </div>
      <div className="gp-stat-card">
        <div className="gp-stat-value">{analysis.cost}{analysis.costUnit}</div>
        <div className="gp-stat-label">Cost</div>
      </div>
    </div>
  );
}

function SuggestionsList({ suggestions }: { suggestions: Suggestion[] }) {
  if (!suggestions.length) return null;

  return (
    <div className="gp-suggestions">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className={`gp-suggestion ${suggestion.type === "warning" ? "warning" : suggestion.type === "error" ? "error" : ""}`}
        >
          <div className="gp-suggestion-icon">
            {suggestion.type === "warning" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
          </div>
          <div className="gp-suggestion-content">
            <div className="gp-suggestion-title">{suggestion.text}</div>
            {suggestion.energySavings && (
              <span className="gp-savings-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                </svg>
                Save {suggestion.energySavings}J
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ModelSuggestionsList({ models }: { models: ModelSuggestion[] }) {
  if (!models?.length) return null;

  return (
    <div className="gp-model-list">
      {models.map((model) => (
        <div key={model.modelId} className={`gp-model-item ${model.recommendation === "recommended" ? "recommended" : ""}`}>
          <div>
            <div className="gp-model-name">{model.modelName}</div>
            <div className="gp-model-stats">
              <span>{model.energy}J</span>
              <span>•</span>
              <span>{model.accuracy}% accuracy</span>
            </div>
          </div>
          {model.recommendation === "recommended" && (
            <span className="gp-model-badge">Best</span>
          )}
        </div>
      ))}
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: PromptAnalysis }) {
  return (
    <>
      <div className="gp-section">
        <div className="gp-section-header">
          <span className="gp-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
            Analysis Results
          </span>
        </div>
        <StatsDisplay analysis={analysis} />
        <div className="gp-energy-bar">
          <div className="gp-energy-fill" style={{ width: `${Math.min(analysis.confidence * 100, 100)}%` }} />
        </div>
        <p style={{ fontSize: "10px", color: "var(--gp-muted-foreground)", marginTop: "6px", textAlign: "center" }}>
          {analysis.confidence * 100}% confidence
        </p>
      </div>

      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="gp-section">
          <div className="gp-section-header">
            <span className="gp-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Optimizations
            </span>
          </div>
          <SuggestionsList suggestions={analysis.suggestions} />
        </div>
      )}

      {analysis.modelSuggestions && analysis.modelSuggestions.length > 0 && (
        <div className="gp-section">
          <div className="gp-section-header">
            <span className="gp-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Recommended Models
            </span>
          </div>
          <ModelSuggestionsList models={analysis.modelSuggestions} />
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="gp-empty">
      <div className="gp-empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h4 className="gp-empty-title">Ready to analyze</h4>
      <p className="gp-empty-desc">Enter a prompt above to see its energy impact and get optimization suggestions.</p>
    </div>
  );
}

export default function App({ isEmbedded = false }: AppProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await chrome.runtime.sendMessage({ type: "GET_AUTH_STATUS" }) as { ok: boolean; data: AuthStatus };
        setAuth(response.ok ? response.data : null);
      } catch {
        setAuth(null);
      }
    }
    checkAuth();

    function handleMessage(message: { type: string; analysis?: PromptAnalysis; error?: string }) {
      if (message.type === "SHOW_RESULT" && message.analysis) {
        setAnalysis(message.analysis);
        setLoading(false);
      } else if (message.type === "SHOW_ERROR" && message.error) {
        setError(message.error);
        setLoading(false);
      } else if (message.type === "SET_LOADING") {
        setLoading(message);
      } else if (message.type === "CLOSE_PANEL") {
        setIsOpen(false);
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    if (!auth?.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await chrome.runtime.sendMessage({
        type: "ANALYZE_PROMPT",
        payload: { prompt: prompt.trim() }
      }) as { ok: boolean; data?: PromptAnalysis; error?: string };

      if (response.ok && response.data) {
        setAnalysis(response.data);
      } else {
        setError(response.error || "Failed to analyze prompt");
      }
    } catch (err) {
      setError("Failed to analyze prompt. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [prompt, loading, auth]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    chrome.runtime.sendMessage({ type: "CLOSE_PANEL" });
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleLogin = useCallback(async () => {
    setShowAuthModal(false);
    try {
      await browser.action.openPopup?.();
    } catch {
      browser.runtime.openOptionsPage?.();
    }
  }, []);

  if (!isEmbedded && !isOpen) {
    return (
      <div className="gp-panel collapsed" onClick={handleToggle}>
        <div className="gp-header">
          <div className="gp-header-left">
            <div className="gp-logo">GP</div>
          </div>
          <span style={{ fontSize: "12px" }}>Click to open</span>
        </div>
      </div>
    );
  }

  return (
    <div className="gp-panel">
      <div className="gp-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="gp-header-left">
          <div className="gp-logo">GP</div>
          <span className="gp-title">GreenPrompt</span>
        </div>
        <div className="gp-header-right">
          <button className="gp-close-btn" onClick={(e) => { e.stopPropagation(); handleClose(); }}>
            ×
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="gp-content">
          <div className="gp-section">
            <div className="gp-input-group">
              <label className="gp-label">Your Prompt</label>
              <textarea
                className="gp-textarea"
                placeholder="Enter your prompt to analyze..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleAnalyze();
                  }
                }}
              />
            </div>
            <button
              className="gp-btn gp-btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <div className="gp-spinner" style={{ width: "14px", height: "14px" }}></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Analyze
                </>
              )}
            </button>
          </div>

          {!auth?.isAuthenticated && (
            <div className="gp-banner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Sign in to save your analysis history</span>
            </div>
          )}

          {error && (
            <div className="gp-section" style={{ borderColor: "var(--gp-destructive)" }}>
              <p style={{ color: "var(--gp-destructive)", fontSize: "12px" }}>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="gp-section">
              <LoadingSpinner />
            </div>
          ) : analysis ? (
            <AnalysisResult analysis={analysis} />
          ) : (
            <EmptyState />
          )}
        </div>
      )}

      {showAuthModal && (
        <AuthRequiredModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      )}

      <div className="gp-footer">
        <a className="gp-footer-link" href="#" onClick={(e) => { e.preventDefault(); }}>
          Privacy
        </a>
        <a className="gp-footer-link" href="#" onClick={(e) => { e.preventDefault(); }}>
          Help
        </a>
      </div>
    </div>
  );
}
