// Enhanced Prompt Optimizer Logic with CodeCarbon-inspired calculations
class PromptOptimizer {
  constructor() {
    // Enhanced environmental impact constants based on CodeCarbon methodology
    // Source: https://mlco2.github.io/codecarbon/methodology.html
    
    // Energy consumption per 1000 tokens for different model sizes
    this.ENERGY_PER_1000_TOKENS_SMALL = 0.0002; // Small models (GPT-3.5, Claude Haiku)
    this.ENERGY_PER_1000_TOKENS_MEDIUM = 0.0008; // Medium models (GPT-4, Claude Sonnet)
    this.ENERGY_PER_1000_TOKENS_LARGE = 0.003; // Large models (GPT-4 Turbo, Claude Opus)
    
    // Default to medium model
    this.ENERGY_PER_1000_TOKENS = this.ENERGY_PER_1000_TOKENS_MEDIUM;
    
    // Regional carbon intensity (gCO2/kWh) - CodeCarbon data
    this.CARBON_INTENSITY = {
      'US': 385,      // United States (mixed grid)
      'EU': 275,      // European Union average
      'CN': 581,      // China (coal-heavy)
      'IN': 730,      // India (coal-heavy)
      'GLOBAL': 475,   // Global average
      'RENEWABLE': 50  // Renewable-heavy regions
    };
    
    // Water usage per kWh in data centers (liters/kWh)
    this.WATER_PER_KWH = 1.8; // Average data center water usage
    
    // Approximate tokens per character (rough estimate: 1 token ≈ 4 chars)
    this.CHARS_PER_TOKEN = 4;
    
    // Detect user region (default to global average)
    this.userRegion = this.detectRegion() || 'GLOBAL';
  }

  /**
   * Detect user region based on browser locale
   */
  detectRegion() {
    const locale = navigator.language || navigator.userLanguage || 'en-US';
    
    if (locale.startsWith('en-US') || locale.includes('US')) return 'US';
    if (locale.includes('EU') || locale.includes('DE') || locale.includes('FR') || 
        locale.includes('GB') || locale.includes('IT') || locale.includes('ES')) return 'EU';
    if (locale.includes('CN') || locale.includes('ZH')) return 'CN';
    if (locale.includes('IN') || locale.includes('HI')) return 'IN';
    
    return 'GLOBAL';
  }

  /**
   * Set model size for more accurate calculations
   */
  setModelSize(modelSize = 'medium') {
    switch(modelSize.toLowerCase()) {
      case 'small':
        this.ENERGY_PER_1000_TOKENS = this.ENERGY_PER_1000_TOKENS_SMALL;
        break;
      case 'large':
        this.ENERGY_PER_1000_TOKENS = this.ENERGY_PER_1000_TOKENS_LARGE;
        break;
      default:
        this.ENERGY_PER_1000_TOKENS = this.ENERGY_PER_1000_TOKENS_MEDIUM;
    }
  }

  /**
   * Estimate token count from character count
   */
  estimateTokens(text) {
    return Math.ceil(text.length / this.CHARS_PER_TOKEN);
  }

  /**
   * Calculate environmental impact with enhanced methodology
   */
  calculateImpact(characterCount) {
    const tokens = this.estimateTokens(characterCount);
    const tokenUnits = tokens / 1000;
    
    // Energy consumption in kWh
    const energyKwh = tokenUnits * this.ENERGY_PER_1000_TOKENS;
    
    // CO2 emissions in grams
    const carbonIntensity = this.CARBON_INTENSITY[this.userRegion] || this.CARBON_INTENSITY['GLOBAL'];
    const co2Grams = energyKwh * carbonIntensity;
    
    // Water consumption in ml (convert from liters)
    const waterMl = energyKwh * this.WATER_PER_KWH * 1000;
    
    return {
      tokens: tokens,
      energy: energyKwh.toFixed(6), // kWh
      co2: co2Grams.toFixed(2), // grams
      water: waterMl.toFixed(2), // ml
      carbonIntensity: carbonIntensity,
      region: this.userRegion,
      modelSize: this.getModelSizeLabel()
    };
  }

  /**
   * Get current model size label
   */
  getModelSizeLabel() {
    if (this.ENERGY_PER_1000_TOKENS === this.ENERGY_PER_1000_TOKENS_SMALL) return 'small';
    if (this.ENERGY_PER_1000_TOKENS === this.ENERGY_PER_1000_TOKENS_LARGE) return 'large';
    return 'medium';
  }

  /**
   * Calculate savings between original and optimized prompts
   */
  calculateSavings(originalText, optimizedText) {
    const originalImpact = this.calculateImpact(originalText.length);
    const optimizedImpact = this.calculateImpact(optimizedText.length);
    
    return {
      original: {
        chars: originalText.length,
        tokens: originalImpact.tokens,
        energy: originalImpact.energy,
        co2: originalImpact.co2,
        water: originalImpact.water,
        region: originalImpact.region,
        modelSize: originalImpact.modelSize
      },
      optimized: {
        chars: optimizedText.length,
        tokens: optimizedImpact.tokens,
        energy: optimizedImpact.energy,
        co2: optimizedImpact.co2,
        water: optimizedImpact.water,
        region: optimizedImpact.region,
        modelSize: optimizedImpact.modelSize
      },
      saved: {
        chars: originalText.length - optimizedText.length,
        tokens: originalImpact.tokens - optimizedImpact.tokens,
        energy: (parseFloat(originalImpact.energy) - parseFloat(optimizedImpact.energy)).toFixed(6),
        co2: (parseFloat(originalImpact.co2) - parseFloat(optimizedImpact.co2)).toFixed(2),
        water: (parseFloat(originalImpact.water) - parseFloat(optimizedImpact.water)).toFixed(2),
        percentage: (((originalText.length - optimizedText.length) / originalText.length) * 100).toFixed(1),
        equivalent: this.calculateEquivalents(
          parseFloat(originalImpact.co2) - parseFloat(optimizedImpact.co2)
        )
      }
    };
  }

  /**
   * Calculate equivalent emissions for context
   */
  calculateEquivalents(co2Grams) {
    // Based on CodeCarbon equivalents
    const carKmPerGram = 1 / 120; // 0.12 kgCO2 per km = 120g per km
    const carKm = co2Grams * carKmPerGram;
    
    const phoneCharges = co2Grams / 8; // ~8g CO2 per phone charge
    const tvHours = co2Grams / 21; // ~21g CO2 per hour of TV
    
    return {
      carKm: carKm.toFixed(1),
      phoneCharges: phoneCharges.toFixed(1),
      tvHours: tvHours.toFixed(1)
    };
  }

  /**
   * Optimize prompt by replacing ineffective words with better alternatives
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

  /**
   * Get regional information for display
   */
  getRegionalInfo() {
    return {
      region: this.userRegion,
      carbonIntensity: this.CARBON_INTENSITY[this.userRegion] || this.CARBON_INTENSITY['GLOBAL'],
      modelSize: this.getModelSizeLabel(),
      note: `Calculations use ${this.CARBON_INTENSITY[this.userRegion] || this.CARBON_INTENSITY['GLOBAL']} gCO₂/kWh for ${this.userRegion} region`
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PromptOptimizer;
}