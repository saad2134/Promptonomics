// AI Model Detection Service
class ModelDetectionService {
  constructor() {
    this.config = null;
    this.loadConfig();
  }

  async loadConfig() {
    try {
      const response = await fetch(chrome.runtime.getURL('model-config.json'));
      this.config = await response.json();
    } catch (error) {
      console.error('Failed to load model config:', error);
      this.config = {
        modelEnergyConstants: { models: {}, sizeBuckets: {} }
      };
    }
  }

  /**
   * Detect current AI model and provider based on URL and page content
   */
  detectModel() {
    const url = window.location.href;
    const domain = window.location.hostname;
    
    // Platform-specific detection
    if (domain.includes('openai.com')) {
      return this.detectOpenAIModel(url);
    } else if (domain.includes('claude.ai')) {
      return this.detectClaudeModel(url);
    } else if (domain.includes('gemini.google.com')) {
      return this.detectGeminiModel(url);
    } else if (domain.includes('bing.com')) {
      return this.detectCopilotModel(url);
    } else if (domain.includes('copilot.microsoft.com')) {
      return this.detectCopilotModel(url);
    }
    
    // Fallback detection based on page content
    return this.detectFromPageContent();
  }

  /**
   * Detect OpenAI models
   */
  detectOpenAIModel(url) {
    const model = {
      provider: 'openai',
      platform: 'chatgpt'
    };

    // URL-based detection
    if (url.includes('/gpt-4o')) {
      model.name = 'gpt-4o';
      model.sizeBucket = '288B';
    } else if (url.includes('/gpt-4-turbo')) {
      model.name = 'gpt-4-turbo';
      model.sizeBucket = '288B';
    } else if (url.includes('/gpt-3.5-turbo')) {
      model.name = 'gpt-3.5-turbo';
      model.sizeBucket = '70B';
    } else {
      // Default to GPT-4o for new ChatGPT
      model.name = 'gpt-4o';
      model.sizeBucket = '288B';
    }

    // Try page content detection for more accuracy
    const contentModel = this.detectFromPageContent();
    if (contentModel && contentModel.provider === 'openai') {
      Object.assign(model, contentModel);
    }

    return model;
  }

  /**
   * Detect Claude models
   */
  detectClaudeModel(url) {
    const model = {
      provider: 'anthropic',
      platform: 'claude'
    };

    // URL-based detection
    if (url.includes('/claude-3-5-sonnet') || url.includes('/sonnet')) {
      model.name = 'claude-3.5-sonnet';
      model.sizeBucket = '288B';
    } else if (url.includes('/claude-3-opus') || url.includes('/opus')) {
      model.name = 'claude-3-opus';
      model.sizeBucket = '288B+';
    } else if (url.includes('/claude-3-haiku') || url.includes('/haiku')) {
      model.name = 'claude-3-haiku';
      model.sizeBucket = '70B';
    } else {
      // Default to Claude 3.5 Sonnet
      model.name = 'claude-3.5-sonnet';
      model.sizeBucket = '288B';
    }

    return model;
  }

  /**
   * Detect Gemini models
   */
  detectGeminiModel(url) {
    const model = {
      provider: 'google',
      platform: 'gemini'
    };

    // URL-based detection
    if (url.includes('/gemini-2.5')) {
      model.name = 'gemini-2.5';
      model.sizeBucket = '288B';
    } else if (url.includes('/gemini-1.5-pro')) {
      model.name = 'gemini-1.5-pro';
      model.sizeBucket = '288B';
    } else if (url.includes('/gemini-1.5-flash')) {
      model.name = 'gemini-1.5-flash';
      model.sizeBucket = '70B';
    } else {
      // Default to Gemini 1.5 Pro
      model.name = 'gemini-1.5-pro';
      model.sizeBucket = '288B';
    }

    return model;
  }

  /**
   * Detect Copilot models
   */
  detectCopilotModel(url) {
    const model = {
      provider: 'microsoft',
      platform: 'copilot'
    };

    // Copilot typically uses GPT-4 variants
    model.name = 'gpt-4-turbo';
    model.sizeBucket = '288B';

    return model;
  }

  /**
   * Detect from page content as fallback
   */
  detectFromPageContent() {
    const pageText = document.body.innerText.toLowerCase();
    
    // Look for model mentions in page content
    const patterns = [
      { name: 'gpt-4o', patterns: ['gpt-4o', 'gpt4o'] },
      { name: 'gpt-4-turbo', patterns: ['gpt-4 turbo', 'gpt4 turbo'] },
      { name: 'gpt-3.5-turbo', patterns: ['gpt-3.5', 'gpt3.5'] },
      { name: 'claude-3.5-sonnet', patterns: ['claude 3.5 sonnet', 'claude-3-5-sonnet'] },
      { name: 'claude-3-opus', patterns: ['claude 3 opus', 'claude-3-opus'] },
      { name: 'claude-3-haiku', patterns: ['claude 3 haiku', 'claude-3-haiku'] },
      { name: 'gemini-2.5', patterns: ['gemini 2.5', 'gemini-2.5'] },
      { name: 'gemini-1.5-pro', patterns: ['gemini 1.5 pro', 'gemini-1.5-pro'] },
      { name: 'gemini-1.5-flash', patterns: ['gemini 1.5 flash', 'gemini-1.5-flash'] }
    ];

    for (const modelPattern of patterns) {
      for (const pattern of modelPattern.patterns) {
        if (pageText.includes(pattern)) {
          return this.getModelByName(modelPattern.name);
        }
      }
    }

    return null;
  }

  /**
   * Get model configuration by name
   */
  async getModelByName(modelName) {
    if (!this.config) await this.loadConfig();
    
    const models = this.config.modelEnergyConstants.models;
    const model = models[modelName];
    
    if (model) {
      return {
        name: modelName,
        provider: this.getProviderFromModel(modelName),
        ...model
      };
    }
    
    return null;
  }

  /**
   * Get provider from model name
   */
  getProviderFromModel(modelName) {
    if (modelName.startsWith('gpt-')) return 'openai';
    if (modelName.startsWith('claude-')) return 'anthropic';
    if (modelName.startsWith('gemini-')) return 'google';
    if (modelName.startsWith('llama-')) return 'meta';
    if (modelName.includes('copilot')) return 'microsoft';
    return 'unknown';
  }

  /**
   * Get energy constants for detected model
   */
  async getModelEnergyConstants() {
    const detectedModel = this.detectModel();
    
    if (!this.config) await this.loadConfig();
    
    const models = this.config.modelEnergyConstants.models;
    const sizeBuckets = this.config.modelEnergyConstants.sizeBuckets;
    
    // Try to get specific model data
    if (detectedModel.name && models[detectedModel.name]) {
      return {
        ...detectedModel,
        ...models[detectedModel.name]
      };
    }
    
    // Fallback to size bucket
    if (detectedModel.sizeBucket && sizeBuckets[detectedModel.sizeBucket]) {
      return {
        ...detectedModel,
        ...sizeBuckets[detectedModel.sizeBucket]
      };
    }
    
    // Ultimate fallback to medium model
    return {
      ...detectedModel,
      ...sizeBuckets['70B']
    };
  }

  /**
   * Monitor for model changes (for single-page applications)
   */
  startModelChangeDetection(callback) {
    let currentModel = this.detectModel();
    
    const checkInterval = setInterval(() => {
      const newModel = this.detectModel();
      
      if (JSON.stringify(currentModel) !== JSON.stringify(newModel)) {
        currentModel = newModel;
        callback(newModel);
      }
    }, 2000); // Check every 2 seconds
    
    // Return cleanup function
    return () => clearInterval(checkInterval);
  }

  /**
   * Get display name for model
   */
  getDisplayName(model) {
    if (!model) return 'Unknown Model';
    
    const displayNames = {
      'gpt-4o': 'GPT-4o',
      'gpt-4-turbo': 'GPT-4 Turbo',
      'gpt-3.5-turbo': 'GPT-3.5 Turbo',
      'claude-3.5-sonnet': 'Claude 3.5 Sonnet',
      'claude-3-opus': 'Claude 3 Opus',
      'claude-3-haiku': 'Claude 3 Haiku',
      'gemini-2.5': 'Gemini 2.5',
      'gemini-1.5-pro': 'Gemini 1.5 Pro',
      'gemini-1.5-flash': 'Gemini 1.5 Flash',
      'llama-3.1-405b': 'LLaMA 3.1 405B',
      'llama-3.1-70b': 'LLaMA 3.1 70B',
      'llama-3.1-8b': 'LLaMA 3.1 8B'
    };
    
    return displayNames[model.name] || model.name || 'Unknown Model';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModelDetectionService;
}