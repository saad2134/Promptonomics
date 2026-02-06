// Enhanced Prompt Optimizer with 2025 State-of-the-Art Metrics
class PromptOptimizer {
  constructor() {
    this.config = null;
    this.locationService = new LocationService();
    this.modelDetection = new ModelDetectionService();
    this.currentModel = null;
    this.carbonIntensity = null;
    this.waterIntensity = null;
    
    // Fallback constants (will be overridden by config)
    this.fallbackConfig = {
      energyPerToken: 0.0000005, // 0.5 Wh per 1000 tokens
      carbonIntensity: 475, // gCO₂e/kWh global average
      waterIntensity: 8.1, // L/kWh global average
      datacenterWUE: 0.30, // L/kWh default
      tokensPerChar: 0.25
    };
    
    this.initializeServices();
  }

  async initializeServices() {
    try {
      await this.loadConfig();
      this.currentModel = await this.modelDetection.getModelEnergyConstants();
      this.carbonIntensity = await this.locationService.getCarbonIntensity();
      this.waterIntensity = await this.locationService.getWaterIntensity();
    } catch (error) {
      console.warn('Failed to initialize services, using fallbacks:', error);
    }
  }

  async loadConfig() {
    try {
      const response = await fetch(chrome.runtime.getURL('model-config.json'));
      this.config = await response.json();
    } catch (error) {
      console.error('Failed to load model config:', error);
      throw error;
    }
  }

  async getEnergyPerToken() {
    if (this.currentModel && this.currentModel.energyPerToken) {
      return this.currentModel.energyPerToken;
    }
    return this.fallbackConfig.energyPerToken;
  }

  async getCarbonIntensity() {
    return this.carbonIntensity || this.fallbackConfig.carbonIntensity;
  }

  async getWaterIntensity() {
    return this.waterIntensity || this.fallbackConfig.waterIntensity;
  }

  async getDatacenterWUE() {
    if (this.currentModel && this.currentModel.provider) {
      return this.locationService.getDatacenterWUE(this.currentModel.provider);
    }
    return this.fallbackConfig.datacenterWUE;
  }

  /**
   * Estimate token count from character count using 2025 standards
   */
  estimateTokens(text) {
    const tokensPerChar = this.config?.conversionFactors?.tokensPerChar || 0.25;
    return Math.ceil(text.length * tokensPerChar);
  }

  /**
   * Calculate comprehensive environmental impact using three-layer metric stack
   * Layer 1: Energy per query (kWh)
   * Layer 2: CO₂ emissions (gCO₂e) = Energy × Carbon Intensity
   * Layer 3: Water usage (L) = Energy × (WUE + Grid Water Intensity)
   */
  async calculateImpact(characterCount, isInput = true) {
    // Ensure services are initialized
    if (!this.currentModel) {
      await this.initializeServices();
    }

    const tokens = this.estimateTokens(characterCount);
    const energyPerToken = await this.getEnergyPerToken();
    const carbonIntensity = await this.getCarbonIntensity();
    const waterIntensity = await this.getWaterIntensity();
    const datacenterWUE = await this.getDatacenterWUE();
    
    // Layer 1: Energy calculation
    // E_query = (tokens_in + tokens_out) × e_m (energy per token)
    const energyKwh = tokens * energyPerToken;
    const energyWh = energyKwh * 1000; // Convert to Wh for better readability
    
    // Layer 2: CO₂ emissions calculation
    // CO₂_query = E_query × CI (carbon intensity)
    const co2Grams = energyKwh * carbonIntensity;
    
    // Layer 3: Water usage calculation
    // Water_query = E_query × (WUE_DC + W_grid)
    const totalWaterIntensity = datacenterWUE + waterIntensity;
    const waterLiters = energyKwh * totalWaterIntensity;
    const waterMl = waterLiters * 1000; // Convert to ml for UI
    
    return {
      tokens: tokens,
      energy: {
        kWh: energyKwh,
        Wh: energyWh,
        mWh: energyWh * 1000 // milliWatt-hours for precision
      },
      co2: {
        grams: co2Grams,
        mg: co2Grams * 1000
      },
      water: {
        liters: waterLiters,
        ml: waterMl
      },
      metadata: {
        model: this.currentModel?.name || 'Unknown',
        provider: this.currentModel?.provider || 'Unknown',
        carbonIntensity: carbonIntensity,
        datacenterWUE: datacenterWUE,
        gridWaterIntensity: waterIntensity
      }
    };
  }

  /**
   * Calculate comprehensive savings between original and optimized prompts
   * Uses async to properly calculate environmental metrics
   */
  async calculateSavings(originalText, optimizedText) {
    // Calculate impacts for both versions
    const originalImpact = await this.calculateImpact(originalText.length, true);
    const optimizedImpact = await this.calculateImpact(optimizedText.length, true);
    
    // Calculate differences
    const energySavedKwh = originalImpact.energy.kWh - optimizedImpact.energy.kWh;
    const co2SavedGrams = originalImpact.co2.grams - optimizedImpact.co2.grams;
    const waterSavedLiters = originalImpact.water.liters - optimizedImpact.water.liters;
    
    return {
      original: {
        chars: originalText.length,
        tokens: originalImpact.tokens,
        energy: {
          kWh: originalImpact.energy.kWh,
          Wh: originalImpact.energy.Wh,
          display: `${originalImpact.energy.Wh.toFixed(3)} Wh`
        },
        co2: {
          grams: originalImpact.co2.grams,
          display: `${originalImpact.co2.grams.toFixed(3)} g`
        },
        water: {
          liters: originalImpact.water.liters,
          ml: originalImpact.water.ml,
          display: `${originalImpact.water.ml.toFixed(1)} ml`
        }
      },
      optimized: {
        chars: optimizedText.length,
        tokens: optimizedImpact.tokens,
        energy: {
          kWh: optimizedImpact.energy.kWh,
          Wh: optimizedImpact.energy.Wh,
          display: `${optimizedImpact.energy.Wh.toFixed(3)} Wh`
        },
        co2: {
          grams: optimizedImpact.co2.grams,
          display: `${optimizedImpact.co2.grams.toFixed(3)} g`
        },
        water: {
          liters: optimizedImpact.water.liters,
          ml: optimizedImpact.water.ml,
          display: `${optimizedImpact.water.ml.toFixed(1)} ml`
        }
      },
      saved: {
        chars: originalText.length - optimizedText.length,
        tokens: originalImpact.tokens - optimizedImpact.tokens,
        energy: {
          kWh: energySavedKwh,
          Wh: energySavedKwh * 1000,
          display: `${(energySavedKwh * 1000).toFixed(3)} Wh`,
          percentage: ((energySavedKwh / originalImpact.energy.kWh) * 100).toFixed(1)
        },
        co2: {
          grams: co2SavedGrams,
          display: `${co2SavedGrams.toFixed(3)} g`,
          percentage: ((co2SavedGrams / originalImpact.co2.grams) * 100).toFixed(1)
        },
        water: {
          liters: waterSavedLiters,
          ml: waterSavedLiters * 1000,
          display: `${(waterSavedLiters * 1000).toFixed(1)} ml`,
          percentage: ((waterSavedLiters / originalImpact.water.liters) * 100).toFixed(1)
        },
        percentage: (((originalText.length - optimizedText.length) / originalText.length) * 100).toFixed(1)
      },
      metadata: originalImpact.metadata
    };
  }

  /**
   * Optimize prompt by replacing inefffective words with better alternatives
   */
  optimizePrompt(text) {
    let optimized = text;

    // Remove excessive whitespace
    optimized = optimized.replace(/\s+/g, ' ').trim();

    // Replace politeness words with more direct alternatives
    const politenessReplacements = [
      { pattern: /\bplease\b/gi, replacement: "" },
      { pattern: /\bkindly\b/gi, replacement: "" },
      { pattern: /\bsorry\b/gi, replacement: "" },
      { pattern: /\bhello\b/gi, replacement: "" },
      { pattern: /\bhi\b/gi, replacement: "" },
      { pattern: /\bhey\b/gi, replacement: "" },
      { pattern: /\bthank you\b/gi, replacement: "" },
      { pattern: /\bthanks\b/gi, replacement: "" },
      { pattern: /\bI would like you to\b/gi, replacement: "" },
      { pattern: /\bcould you please\b/gi, replacement: "" },
      { pattern: /\bcould you\b/gi, replacement: "" },
      { pattern: /\bcan you\b/gi, replacement: "" },
      { pattern: /\bwould you mind\b/gi, replacement: "" },
      { pattern: /\bI was wondering if\b/gi, replacement: "" }
    ];

    politenessReplacements.forEach(({ pattern, replacement }) => {
      optimized = optimized.replace(pattern, replacement);
    });

    // Replace vague words with more precise alternatives
    const vagueReplacements = [
      { pattern: /\bgood\b/gi, replacement: "effective" },
      { pattern: /\bbad\b/gi, replacement: "ineffective" },
      { pattern: /\bthing\b/gi, replacement: "element" },
      { pattern: /\bstuff\b/gi, replacement: "components" },
      { pattern: /\bnice\b/gi, replacement: "appropriate" },
      { pattern: /\bhelp\b/gi, replacement: "assist" }
    ];

    vagueReplacements.forEach(({ pattern, replacement }) => {
      optimized = optimized.replace(pattern, replacement);
    });

    // Remove filler words while preserving meaning
    const fillerWords = [
      /\b(just|really|very|quite|rather|somewhat|actually|basically|literally)\s+/gi,
      /\b(kind of|sort of)\s+/gi
    ];

    fillerWords.forEach(pattern => {
      optimized = optimized.replace(pattern, '');
    });

    // Remove excessive punctuation
    optimized = optimized.replace(/\.{2,}/g, '.');
    optimized = optimized.replace(/!{2,}/g, '!');
    optimized = optimized.replace(/\?{2,}/g, '?');

    // Remove duplicate sentences (case-insensitive)
    const sentences = optimized.split(/[.!?]+/).filter(s => s.trim());
    const uniqueSentences = [];
    const seen = new Set();
    
    sentences.forEach(sentence => {
      const normalized = sentence.trim().toLowerCase();
      if (normalized && !seen.has(normalized)) {
        seen.add(normalized);
        uniqueSentences.push(sentence.trim());
      }
    });

    if (uniqueSentences.length > 0) {
      optimized = uniqueSentences.join('. ') + '.';
    }

    // Contract common phrases for brevity
    const contractions = [
      { pattern: /\bdo not\b/gi, replacement: "don't" },
      { pattern: /\bcannot\b/gi, replacement: "can't" },
      { pattern: /\bwill not\b/gi, replacement: "won't" },
      { pattern: /\bshould not\b/gi, replacement: "shouldn't" },
      { pattern: /\bis not\b/gi, replacement: "isn't" },
      { pattern: /\bare not\b/gi, replacement: "aren't" }
    ];

    contractions.forEach(({ pattern, replacement }) => {
      optimized = optimized.replace(pattern, replacement);
    });

    // Final cleanup
    optimized = optimized.replace(/\s+/g, ' ').trim();
    
    // Capitalize first letter
    if (optimized.length > 0) {
      optimized = optimized.charAt(0).toUpperCase() + optimized.slice(1);
    }

    return optimized;
  }

  /**
   * Generate optimization suggestions
   */
  generateSuggestions(originalText, optimizedText) {
    const suggestions = [];
    
    if (originalText.length === optimizedText.length) {
      suggestions.push("Your prompt is already well-optimized!");
      return suggestions;
    }

    // Politeness words suggestions
    if (/please|kindly/i.test(originalText)) {
      suggestions.push("Removed 'please/kindly' - AI assistants respond to direct commands");
    }
    
    if (/sorry|hello|hi|hey|thank you|thanks/i.test(originalText)) {
      suggestions.push("Removed greetings/apologies - Be direct and task-oriented");
    }

    if (/could you|can you|would you mind/i.test(originalText)) {
      suggestions.push("Replaced polite requests with direct instructions");
    }

    // Word replacement suggestions
    if (/good|bad|nice|thing|stuff|help/i.test(originalText)) {
      suggestions.push("Replaced vague words with more precise alternatives");
    }

    // Filler words suggestions
    if (/just|really|very|quite|rather|actually|basically|literally/i.test(originalText)) {
      suggestions.push("Removed filler words that weaken the prompt");
    }

    if (/\.{2,}|!{2,}|\?{2,}/.test(originalText)) {
      suggestions.push("Reduced excessive punctuation for clarity");
    }

    if (/\s{2,}/.test(originalText)) {
      suggestions.push("Removed extra whitespace");
    }

    const originalSentences = originalText.split(/[.!?]+/).filter(s => s.trim()).length;
    const optimizedSentences = optimizedText.split(/[.!?]+/).filter(s => s.trim()).length;
    
    if (originalSentences > optimizedSentences) {
      suggestions.push("Removed duplicate or redundant sentences");
    }

    // Add improvement suggestions based on content
    if (optimizedText.includes("effective") && originalText.includes("good")) {
      suggestions.push("Use 'effective' instead of 'good' for better clarity");
    }
    
    if (optimizedText.includes("assist") && originalText.includes("help")) {
      suggestions.push("Use 'assist' instead of 'help' for more formal tone");
    }

    return suggestions.length > 0 ? suggestions : ["Optimized for clarity and brevity"];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PromptOptimizer;
}
