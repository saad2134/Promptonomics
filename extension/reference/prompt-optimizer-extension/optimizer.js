// Prompt Optimizer Logic
class PromptOptimizer {
  constructor() {
    // Environmental impact constants (based on research estimates)
    // Per 1000 tokens: ~0.0004 kWh energy, ~0.0002 kg CO2, ~0.5 ml water
    this.ENERGY_PER_1000_TOKENS = 0.0004; // kWh
    this.CO2_PER_1000_TOKENS = 0.0002; // kg
    this.WATER_PER_1000_TOKENS = 0.5; // ml
    
    // Approximate tokens per character (rough estimate: 1 token ≈ 4 chars)
    this.CHARS_PER_TOKEN = 4;
  }

  /**
   * Estimate token count from character count
   */
  estimateTokens(text) {
    return Math.ceil(text.length / this.CHARS_PER_TOKEN);
  }

  /**
   * Calculate environmental impact
   */
  calculateImpact(characterCount) {
    const tokens = this.estimateTokens(characterCount);
    const tokenUnits = tokens / 1000;
    
    return {
      tokens: tokens,
      energy: (tokenUnits * this.ENERGY_PER_1000_TOKENS).toFixed(6), // kWh
      co2: (tokenUnits * this.CO2_PER_1000_TOKENS * 1000).toFixed(2), // grams
      water: (tokenUnits * this.WATER_PER_1000_TOKENS).toFixed(2) // ml
    };
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
        water: originalImpact.water
      },
      optimized: {
        chars: optimizedText.length,
        tokens: optimizedImpact.tokens,
        energy: optimizedImpact.energy,
        co2: optimizedImpact.co2,
        water: optimizedImpact.water
      },
      saved: {
        chars: originalText.length - optimizedText.length,
        tokens: originalImpact.tokens - optimizedImpact.tokens,
        energy: (originalImpact.energy - optimizedImpact.energy).toFixed(6),
        co2: (originalImpact.co2 - optimizedImpact.co2).toFixed(2),
        water: (originalImpact.water - optimizedImpact.water).toFixed(2),
        percentage: (((originalText.length - optimizedText.length) / originalText.length) * 100).toFixed(1)
      }
    };
  }

  /**
   * Optimize prompt by removing redundancies and unnecessary words
   */
  optimizePrompt(text) {
    let optimized = text;

    // Remove excessive whitespace
    optimized = optimized.replace(/\s+/g, ' ').trim();

    // Remove redundant phrases
    const redundantPhrases = [
      /please\s+/gi,
      /kindly\s+/gi,
      /I would like you to\s+/gi,
      /could you\s+/gi,
      /can you\s+/gi,
      /I want you to\s+/gi,
      /I need you to\s+/gi,
      /if you (could|can)\s+/gi,
      /would you mind\s+/gi
    ];

    redundantPhrases.forEach(pattern => {
      optimized = optimized.replace(pattern, '');
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

    if (/please|kindly|could you|can you/i.test(originalText)) {
      suggestions.push("Removed polite but unnecessary phrases - AI assistants don't need pleasantries");
    }

    if (/just|really|very|quite|rather|actually|basically|literally/i.test(originalText)) {
      suggestions.push("Removed filler words that don't add meaning");
    }

    if (/\.{2,}|!{2,}|\?{2,}/.test(originalText)) {
      suggestions.push("Reduced excessive punctuation");
    }

    if (/\s{2,}/.test(originalText)) {
      suggestions.push("Removed extra whitespace");
    }

    const originalSentences = originalText.split(/[.!?]+/).filter(s => s.trim()).length;
    const optimizedSentences = optimizedText.split(/[.!?]+/).filter(s => s.trim()).length;
    
    if (originalSentences > optimizedSentences) {
      suggestions.push("Removed duplicate or redundant sentences");
    }

    return suggestions.length > 0 ? suggestions : ["Optimized for clarity and brevity"];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PromptOptimizer;
}
