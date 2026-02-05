interface SiteConfig {
  name: string;
  textareaSelector: string;
  sendButtonSelector: string[];
  micButtonSelector?: string;
  attachmentButtonSelector?: string;
  containerSelector: string;
  inputContainerSelector?: string;
  buttonPosition: "beside-send" | "inside-input" | "above-input";
  buttonStyle?: {
    borderRadius?: string;
    width?: string;
    height?: string;
  };
}

const SITES: Record<string, SiteConfig> = {
  "chat.openai.com": {
    name: "ChatGPT",
    textareaSelector: "#prompt-textarea",
    sendButtonSelector: ["button[data-testid='send-button']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='Attach']",
    containerSelector: "main form",
    inputContainerSelector: ".relative.flex.w-full.items-end",
    buttonPosition: "inside-input"
  },
  "www.chat.openai.com": {
    name: "ChatGPT",
    textareaSelector: "#prompt-textarea",
    sendButtonSelector: ["button[data-testid='send-button']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='Attach']",
    containerSelector: "main form",
    inputContainerSelector: ".relative.flex.w-full.items-end",
    buttonPosition: "inside-input"
  },
  "chatgpt.com": {
    name: "ChatGPT",
    textareaSelector: "#prompt-textarea",
    sendButtonSelector: ["button[data-testid='send-button']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='Attach']",
    containerSelector: "main form",
    inputContainerSelector: ".relative.flex.w-full.items-end",
    buttonPosition: "inside-input"
  },
  "www.chatgpt.com": {
    name: "ChatGPT",
    textareaSelector: "#prompt-textarea",
    sendButtonSelector: ["button[data-testid='send-button']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='Attach']",
    containerSelector: "main form",
    inputContainerSelector: ".relative.flex.w-full.items-end",
    buttonPosition: "inside-input"
  },
  "claude.ai": {
    name: "Claude",
    textareaSelector: "[contenteditable='true']",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='Attach']",
    containerSelector: "main",
    inputContainerSelector: ".flex.gap-2",
    buttonPosition: "inside-input"
  },
  "www.claude.ai": {
    name: "Claude",
    textareaSelector: "[contenteditable='true']",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='Attach']",
    containerSelector: "main",
    inputContainerSelector: ".flex.gap-2",
    buttonPosition: "inside-input"
  },
  "gemini.google.com": {
    name: "Gemini",
    textareaSelector: "textarea",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='mic']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: "main",
    inputContainerSelector: ".flex.items-end",
    buttonPosition: "inside-input"
  },
  "www.gemini.google.com": {
    name: "Gemini",
    textareaSelector: "textarea",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='mic']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: "main",
    inputContainerSelector: ".flex.items-end",
    buttonPosition: "inside-input"
  },
  "perplexity.ai": {
    name: "Perplexity",
    textareaSelector: "textarea[placeholder*='Ask']",
    sendButtonSelector: ["button[aria-label*='Submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".prompt-form",
    inputContainerSelector: ".flex.w-full",
    buttonPosition: "inside-input"
  },
  "www.perplexity.ai": {
    name: "Perplexity",
    textareaSelector: "textarea[placeholder*='Ask']",
    sendButtonSelector: ["button[aria-label*='Submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".prompt-form",
    inputContainerSelector: ".flex.w-full",
    buttonPosition: "inside-input"
  },
  "deepseek.com": {
    name: "DeepSeek",
    textareaSelector: "textarea",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='mic']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".conversation-input-container",
    inputContainerSelector: ".flex.items-center",
    buttonPosition: "inside-input"
  },
  "www.deepseek.com": {
    name: "DeepSeek",
    textareaSelector: "textarea",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='mic']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".conversation-input-container",
    inputContainerSelector: ".flex.items-center",
    buttonPosition: "inside-input"
  },
  "mistral.ai": {
    name: "Mistral",
    textareaSelector: "#chat-input",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".input-container",
    inputContainerSelector: ".flex.w-full",
    buttonPosition: "inside-input"
  },
  "www.mistral.ai": {
    name: "Mistral",
    textareaSelector: "#chat-input",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".input-container",
    inputContainerSelector: ".flex.w-full",
    buttonPosition: "inside-input"
  },
  "huggingface.co": {
    name: "HuggingChat",
    textareaSelector: "#chat-input",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".conversation-container",
    inputContainerSelector: ".flex.items-center",
    buttonPosition: "inside-input"
  },
  "www.huggingface.co": {
    name: "HuggingChat",
    textareaSelector: "#chat-input",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".conversation-container",
    inputContainerSelector: ".flex.items-center",
    buttonPosition: "inside-input"
  },
  "you.com": {
    name: "YouChat",
    textareaSelector: "#chat-input",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".you-chat-container",
    inputContainerSelector: ".flex.w-full",
    buttonPosition: "inside-input"
  },
  "www.you.com": {
    name: "YouChat",
    textareaSelector: "#chat-input",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='Voice']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".you-chat-container",
    inputContainerSelector: ".flex.w-full",
    buttonPosition: "inside-input"
  },
  "copilot.microsoft.com": {
    name: "Copilot",
    textareaSelector: "#chat-input",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='mic']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".copilot-container",
    inputContainerSelector: ".flex.items-center",
    buttonPosition: "inside-input"
  },
  "www.copilot.microsoft.com": {
    name: "Copilot",
    textareaSelector: "#chat-input",
    sendButtonSelector: ["button[type='submit']"],
    micButtonSelector: "button[aria-label*='mic']",
    attachmentButtonSelector: "button[aria-label*='attach']",
    containerSelector: ".copilot-container",
    inputContainerSelector: ".flex.items-center",
    buttonPosition: "inside-input"
  }
};

function getCurrentSiteConfig(): SiteConfig | null {
  const hostname = window.location.hostname;
  return SITES[hostname] || null;
}

function findSendButton(): HTMLElement | null {
  const siteConfig = getCurrentSiteConfig();
  if (!siteConfig) return null;

  for (const selector of siteConfig.sendButtonSelector) {
    const btn = document.querySelector<HTMLElement>(selector);
    if (btn) return btn;
  }
  return null;
}

function findTextarea(): HTMLElement | null {
  const siteConfig = getCurrentSiteConfig();
  if (!siteConfig) return null;

  return document.querySelector<HTMLElement>(siteConfig.textareaSelector);
}

function findContainer(): HTMLElement | null {
  const siteConfig = getCurrentSiteConfig();
  if (!siteConfig) return null;

  return document.querySelector<HTMLElement>(siteConfig.containerSelector);
}

function findInputContainer(): HTMLElement | null {
  const siteConfig = getCurrentSiteConfig();
  if (!siteConfig?.inputContainerSelector) return findContainer();

  return document.querySelector<HTMLElement>(siteConfig.inputContainerSelector);
}

function findClosestButtonToSend(): HTMLElement | null {
  const siteConfig = getCurrentSiteConfig();
  if (!siteConfig) return findSendButton();

  const sendButton = findSendButton();
  if (!sendButton) return null;

  const parent = sendButton.parentElement;
  if (!parent) return sendButton;

  const buttons = parent.querySelectorAll("button");
  for (const button of buttons) {
    if (button === sendButton) {
      continue;
    }
    const rect = button.getBoundingClientRect();
    const sendRect = sendButton.getBoundingClientRect();
    if (Math.abs(rect.top - sendRect.top) < 50) {
      return button;
    }
  }

  return sendButton;
}

function getButtonPosition(sendButton: HTMLElement, container: HTMLElement): { top: number; left: number } {
  const siteConfig = getCurrentSiteConfig();
  const containerRect = container.getBoundingClientRect();
  const sendRect = sendButton.getBoundingClientRect();

  if (siteConfig?.buttonPosition === "inside-input") {
    return {
      top: sendRect.top - containerRect.top + (sendRect.height - 36) / 2,
      left: sendRect.right - containerRect.left + 8
    };
  }

  return {
    top: sendRect.top - containerRect.top,
    left: sendRect.right - containerRect.left + 8
  };
}

function injectPanel() {
  if (document.getElementById("greenprompt-root")) {
    return;
  }

  const root = document.createElement("div");
  root.id = "greenprompt-root";
  document.body.appendChild(root);

  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("injected.js");
  script.async = true;
  script.onload = () => {
    script.remove();
  };
  document.body.appendChild(script);
}

function injectStyles(siteConfig: SiteConfig | null) {
  const styleId = "greenprompt-styles";
  if (document.getElementById(styleId)) {
    return;
  }

  const defaultRadius = "8px";
  const defaultWidth = "36px";
  const defaultHeight = "36px";

  const borderRadius = siteConfig?.buttonStyle?.borderRadius || defaultRadius;
  const width = siteConfig?.buttonStyle?.width || defaultWidth;
  const height = siteConfig?.buttonStyle?.height || defaultHeight;

  const styles = document.createElement("style");
  styles.id = styleId;
  styles.textContent = `
    .gp-injected-button {
      position: absolute !important;
      z-index: 999998 !important;
      width: ${width} !important;
      height: ${height} !important;
      border-radius: ${borderRadius} !important;
      background: transparent !important;
      border: none !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: transform 0.2s, box-shadow 0.2s !important;
      margin: 8px !important;
      padding: 4px !important;
      overflow: hidden !important;
    }

    .gp-injected-button:hover {
      transform: scale(1.05) !important;
    }

    .gp-injected-button img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
      pointer-events: none !important;
    }

    .gp-injected-button.placing {
      opacity: 0.5;
      pointer-events: none;
    }
  `;
  document.head.appendChild(styles);
}

function injectFloatingButton() {
  if (document.getElementById("gp-floating-btn")) {
    return;
  }

  const siteConfig = getCurrentSiteConfig();
  if (!siteConfig) return;

  const btn = document.createElement("button");
  btn.id = "gp-floating-btn";
  btn.className = "gp-injected-button";
  
  const iconUrl = chrome.runtime.getURL("icons/icon-48.png");
  btn.innerHTML = `<img src="${iconUrl}" alt="GreenPrompt" />`;
  btn.title = "GreenPrompt - Analyze your prompt";

  const positionButton = () => {
    const siteConfig = getCurrentSiteConfig();
    const inputContainer = findInputContainer();
    const container = findContainer();
    const textarea = findTextarea();
    const sendButton = findSendButton();

    if (inputContainer && sendButton) {
      inputContainer.style.position = "relative";
      if (!inputContainer.contains(btn)) {
        inputContainer.appendChild(btn);
      }

      const pos = getButtonPosition(sendButton, inputContainer);
      btn.style.top = `${pos.top}px`;
      btn.style.left = `${pos.left}px`;
    } else if (container && textarea) {
      container.style.position = "relative";
      if (!container.contains(btn)) {
        container.appendChild(btn);
      }

      const textareaRect = textarea.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (sendButton) {
        const sendRect = sendButton.getBoundingClientRect();
        btn.style.top = `${sendRect.top - containerRect.top + (sendRect.height - 36) / 2}px`;
        btn.style.left = `${sendRect.right - containerRect.left + 8}px`;
      } else {
        btn.style.top = `${textareaRect.top - containerRect.top - 44}px`;
        btn.style.left = `${textareaRect.right - containerRect.left - 44}px`;
      }
    } else {
      document.body.appendChild(btn);
      btn.style.position = "fixed";
      btn.style.bottom = "20px";
      btn.style.right = "20px";
      btn.style.top = "auto";
      btn.style.left = "auto";
    }
  };

  const attemptPosition = () => {
    btn.classList.add("placing");
    const textarea = findTextarea();
    if (textarea || findInputContainer() || findSendButton()) {
      positionButton();
      setTimeout(() => btn.classList.remove("placing"), 100);
    } else {
      setTimeout(attemptPosition, 500);
    }
  };

  btn.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await browser.runtime.sendMessage({ type: "GET_AUTH_STATUS" }) as { ok: boolean; data: { isAuthenticated: boolean } };
      if (!response.ok || !response.data?.isAuthenticated) {
        window.open("https://greenprompt.vercel.app/auth", "_blank");
        return;
      }
    } catch {
      window.open("https://greenprompt.vercel.app/auth", "_blank");
      return;
    }

    if (!document.getElementById("greenprompt-root")) {
      injectPanel();
    }

    chrome.runtime.sendMessage({ type: "TOGGLE_PANEL" });
  };

  document.body.appendChild(btn);
  setTimeout(attemptPosition, 500);

  const observer = new MutationObserver(() => {
    if ((findTextarea() || findInputContainer()) && !document.body.contains(btn)) {
      attemptPosition();
    }
    if (findSendButton() && btn.parentElement !== findInputContainer()) {
      positionButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const resizeObserver = new ResizeObserver(() => {
    if (findSendButton() || findInputContainer()) {
      positionButton();
    }
  });

  resizeObserver.observe(document.body);
}

let panelOpen = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "OPEN_PANEL":
      if (!document.getElementById("greenprompt-root")) {
        injectPanel();
      }
      panelOpen = true;
      sendResponse({ ok: true });
      break;

    case "CLOSE_PANEL":
      panelOpen = false;
      sendResponse({ ok: true });
      break;

    case "TOGGLE_PANEL":
      if (!document.getElementById("greenprompt-root")) {
        injectPanel();
      }
      panelOpen = !panelOpen;
      sendResponse({ ok: true, data: { panelOpen } });
      break;

    case "GET_PROMPT":
      const textarea = findTextarea();
      let prompt: string | null = null;
      if (textarea) {
        if (textarea instanceof HTMLTextAreaElement) {
          prompt = textarea.value.trim();
        } else {
          prompt = textarea.innerText.trim();
        }
      }
      sendResponse({ ok: true, data: prompt });
      break;

    case "GET_SITE_INFO":
      const siteConfig = getCurrentSiteConfig();
      sendResponse({
        ok: true,
        data: {
          name: siteConfig?.name || "Unknown",
          hostname: window.location.hostname,
          hasPromptArea: !!siteConfig && !!findTextarea()
        }
      });
      break;

    case "PING":
      sendResponse({ ok: true, data: { alive: true } });
      break;
  }

  return true;
});

function init() {
  const siteConfig = getCurrentSiteConfig();

  if (siteConfig) {
    injectStyles(siteConfig);
    injectFloatingButton();
  }

  const observer = new MutationObserver(() => {
    const currentSiteConfig = getCurrentSiteConfig();
    if (currentSiteConfig) {
      injectStyles(currentSiteConfig);
      if (!document.getElementById("gp-floating-btn") && !panelOpen) {
        injectFloatingButton();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(() => {
      const currentSiteConfig = getCurrentSiteConfig();
      if (currentSiteConfig) {
        injectStyles(currentSiteConfig);
        injectFloatingButton();
      }
    }, 1000);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
