// Content script - Integrates with AI chat interfaces
(function() {
  'use strict';

  // Load the optimizer
  const optimizer = new PromptOptimizer();
  
  let optimizerButton = null;
  let optimizerPanel = null;
  let currentTextarea = null;

  /**
   * Find the main input textarea on the page
   */
  function findTextarea() {
    // Common selectors for various AI platforms
    const selectors = [
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="Ask"]',
      'textarea[placeholder*="Chat"]',
      'textarea#prompt-textarea',
      'textarea[data-id="root"]',
      '.ProseMirror',
      '[contenteditable="true"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
    }

    return null;
  }

  /**
   * Get text from textarea or contenteditable
   */
  function getTextFromElement(element) {
    if (!element) return '';
    
    if (element.tagName === 'TEXTAREA') {
      return element.value;
    } else if (element.hasAttribute('contenteditable')) {
      return element.innerText || element.textContent;
    }
    
    return '';
  }

  /**
   * Set text to textarea or contenteditable
   */
  function setTextToElement(element, text) {
    if (!element) return;
    
    if (element.tagName === 'TEXTAREA') {
      element.value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (element.hasAttribute('contenteditable')) {
      element.innerText = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  /**
   * Create the optimizer button
   */
  function createOptimizerButton() {
    const button = document.createElement('button');
    button.id = 'prompt-optimizer-btn';
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      <span>Optimize</span>
    `;
    button.title = 'Optimize your prompt to save energy';
    
    button.addEventListener('click', handleOptimizeClick);
    
    return button;
  }

  /**
   * Create the optimizer panel
   */
  function createOptimizerPanel() {
    const panel = document.createElement('div');
    panel.id = 'prompt-optimizer-panel';
    panel.innerHTML = `
      <div class="optimizer-header">
        <h3>🌱 Prompt Optimization</h3>
        <button class="close-btn" id="optimizer-close">×</button>
      </div>
      <div class="optimizer-content">
        <div class="optimizer-section">
          <h4>Original Prompt</h4>
          <div class="text-display" id="original-text"></div>
          <div class="stats" id="original-stats"></div>
        </div>
        
        <div class="optimizer-section optimized">
          <h4>Optimized Prompt</h4>
          <div class="text-display" id="optimized-text"></div>
          <div class="stats" id="optimized-stats"></div>
        </div>

        <div class="optimizer-section savings">
          <h4>💚 Environmental Savings</h4>
          <div class="savings-grid">
            <div class="saving-item">
              <span class="label">CO₂ Saved:</span>
              <span class="value" id="co2-saved">0g</span>
            </div>
            <div class="saving-item">
              <span class="label">Water Saved:</span>
              <span class="value" id="water-saved">0ml</span>
            </div>
            <div class="saving-item">
              <span class="label">Energy Saved:</span>
              <span class="value" id="energy-saved">0 kWh</span>
            </div>
            <div class="saving-item">
              <span class="label">Characters Saved:</span>
              <span class="value" id="chars-saved">0</span>
            </div>
          </div>
          <div class="reduction-percentage" id="reduction-pct"></div>
        </div>

        <div class="optimizer-section suggestions">
          <h4>Optimization Details</h4>
          <ul id="suggestions-list"></ul>
        </div>

        <div class="optimizer-actions">
          <button class="btn-secondary" id="btn-keep-original">Keep Original</button>
          <button class="btn-primary" id="btn-use-optimized">Use Optimized ✨</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    panel.querySelector('#optimizer-close').addEventListener('click', () => {
      panel.style.display = 'none';
    });
    
    panel.querySelector('#btn-keep-original').addEventListener('click', () => {
      panel.style.display = 'none';
    });
    
    panel.querySelector('#btn-use-optimized').addEventListener('click', handleUseOptimized);
    
    return panel;
  }

  /**
   * Handle optimize button click
   */
  async function handleOptimizeClick() {
    currentTextarea = findTextarea();
    
    if (!currentTextarea) {
      alert('Could not find the input field. Please try again.');
      return;
    }

    const originalText = getTextFromElement(currentTextarea);
    
    if (!originalText || originalText.trim().length === 0) {
      alert('Please enter a prompt first!');
      return;
    }

    if (originalText.trim().length < 20) {
      alert('Your prompt is already very short. No optimization needed!');
      return;
    }

    try {
      // Optimize the prompt
      const optimizedText = optimizer.optimizePrompt(originalText);
      const savings = await optimizer.calculateSavings(originalText, optimizedText);
      const suggestions = optimizer.generateSuggestions(originalText, optimizedText);

      // Update panel
      updateOptimizerPanel(originalText, optimizedText, savings, suggestions);
      
      // Show panel
      optimizerPanel.style.display = 'block';
      
      // Save to storage for statistics
      saveSavingsData(savings);
    } catch (error) {
      console.error('Error during optimization:', error);
      alert('An error occurred during optimization. Please try again.');
    }
  }

  /**
   * Update the optimizer panel with enhanced metrics display
   */
  function updateOptimizerPanel(original, optimized, savings, suggestions) {
    document.getElementById('original-text').textContent = original;
    document.getElementById('optimized-text').textContent = optimized;
    
    document.getElementById('original-stats').innerHTML = `
      ${savings.original.chars} chars · ${savings.original.tokens} tokens · ${savings.original.energy.display}
    `;
    
    document.getElementById('optimized-stats').innerHTML = `
      ${savings.optimized.chars} chars · ${savings.optimized.tokens} tokens · ${savings.optimized.energy.display}
    `;
    
    // Enhanced metrics display with proper units
    document.getElementById('co2-saved').textContent = savings.saved.co2.display;
    document.getElementById('water-saved').textContent = savings.saved.water.display;
    document.getElementById('energy-saved').textContent = savings.saved.energy.display;
    document.getElementById('chars-saved').textContent = savings.saved.chars;
    
    // Enhanced reduction display with multiple metrics
    const reductionHtml = `
      <strong>${savings.saved.percentage}%</strong> reduction in prompt size<br>
      <small>Energy: ${savings.saved.energy.percentage}% | CO₂: ${savings.saved.co2.percentage}% | Water: ${savings.saved.water.percentage}%</small>
    `;
    document.getElementById('reduction-pct').innerHTML = reductionHtml;
    
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
    
    // Store optimized text for later use
    optimizerPanel.dataset.optimizedText = optimized;
    
    // Add model information if available
    if (savings.metadata) {
      const modelInfo = document.createElement('div');
      modelInfo.className = 'model-info';
      modelInfo.innerHTML = `
        <small>🤖 ${savings.metadata.model} (${savings.metadata.provider})</small><br>
        <small>📍 Carbon Intensity: ${savings.metadata.carbonIntensity} gCO₂e/kWh</small>
      `;
      
      // Insert after reduction percentage
      const reductionElement = document.getElementById('reduction-pct');
      if (reductionElement && !reductionElement.nextElementSibling?.classList?.contains('model-info')) {
        reductionElement.insertAdjacentHTML('afterend', modelInfo.outerHTML);
      }
    }
  }

  /**
   * Handle use optimized button click
   */
  function handleUseOptimized() {
    const optimizedText = optimizerPanel.dataset.optimizedText;
    
    if (currentTextarea && optimizedText) {
      setTextToElement(currentTextarea, optimizedText);
      optimizerPanel.style.display = 'none';
      
      // Show success notification
      showNotification('Optimized prompt applied! 🌱');
    }
  }

  /**
   * Save savings data to Chrome storage with enhanced metrics
   */
  function saveSavingsData(savings) {
    console.log('Saving savings data:', savings);
    
    chrome.storage.local.get(['totalSavings'], (result) => {
      const totalSavings = result.totalSavings || {
        co2: 0,
        water: 0,
        energy: 0,
        chars: 0,
        optimizations: 0,
        metadata: {
          lastModel: null,
          lastProvider: null,
          totalQueriesByModel: {}
        }
      };
      
      // Update totals with enhanced metrics
      totalSavings.co2 += savings.saved.co2.grams;
      totalSavings.water += savings.saved.water.liters;
      totalSavings.energy += savings.saved.energy.kWh;
      totalSavings.chars += parseInt(savings.saved.chars);
      totalSavings.optimizations += 1;
      
      // Update metadata
      if (savings.metadata) {
        totalSavings.metadata.lastModel = savings.metadata.model;
        totalSavings.metadata.lastProvider = savings.metadata.provider;
        
        // Track usage by model
        const modelKey = savings.metadata.model || 'unknown';
        if (!totalSavings.metadata.totalQueriesByModel[modelKey]) {
          totalSavings.metadata.totalQueriesByModel[modelKey] = 0;
        }
        totalSavings.metadata.totalQueriesByModel[modelKey] += 1;
      }
      
      console.log('Updated total savings:', totalSavings);
      
      chrome.storage.local.set({ totalSavings }, () => {
        console.log('Enhanced savings saved to storage successfully');
      });
    });
  }

  /**
   * Show temporary notification
   */
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'optimizer-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Position the optimizer button near the textarea
   */
  function positionOptimizerButton() {
    const textarea = findTextarea();
    
    if (!textarea || !optimizerButton) return;
    
    // Try to find the parent container
    const container = textarea.closest('form') || textarea.parentElement;
    
    if (container && !container.contains(optimizerButton)) {
      container.style.position = 'relative';
      container.appendChild(optimizerButton);
    }
  }

  /**
   * Initialize the extension
   */
  function init() {
    // Create and add button
    optimizerButton = createOptimizerButton();
    document.body.appendChild(optimizerButton);
    
    // Create and add panel
    optimizerPanel = createOptimizerPanel();
    document.body.appendChild(optimizerPanel);
    
    // Try to position button near textarea
    positionOptimizerButton();
    
    // Re-position if DOM changes
    const observer = new MutationObserver(() => {
      if (!document.body.contains(optimizerButton)) {
        document.body.appendChild(optimizerButton);
        positionOptimizerButton();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
