// Popup script - Displays statistics and settings
document.addEventListener('DOMContentLoaded', function() {
  loadStatistics();
  
  // Reset statistics button
  document.getElementById('reset-stats').addEventListener('click', resetStatistics);
  
  // Test data button
  document.getElementById('test-data').addEventListener('click', addTestData);
});

/**
 * Load and display enhanced statistics from storage
 */
function loadStatistics() {
  chrome.storage.local.get(['totalSavings'], function(result) {
    console.log('Loading stats from storage:', result);
    const savings = result.totalSavings || {
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
    
    console.log('Savings to display:', savings);
    
    // Update display with enhanced formatting
    const co2Element = document.getElementById('total-co2');
    const waterElement = document.getElementById('total-water');
    const energyElement = document.getElementById('total-energy');
    const optimizationsElement = document.getElementById('total-optimizations');
    
    if (co2Element) co2Element.textContent = formatCO2(savings.co2);
    if (waterElement) waterElement.textContent = formatWater(savings.water);
    if (energyElement) energyElement.textContent = formatEnergy(savings.energy);
    if (optimizationsElement) optimizationsElement.textContent = savings.optimizations;
    
    // Display model usage information
    displayModelInfo(savings.metadata);
    
    // Make the numbers visible with animation
    animateStats();
  });
}

/**
 * Display model usage information
 */
function displayModelInfo(metadata) {
  if (!metadata) return;
  
  const modelContainer = document.getElementById('model-usage');
  if (modelContainer) {
    // Clear existing content
    modelContainer.innerHTML = '';
    
    if (metadata.lastModel && metadata.lastProvider) {
      const lastUsedInfo = document.createElement('div');
      lastUsedInfo.className = 'last-used-info';
      lastUsedInfo.innerHTML = `
        <strong>Last Used:</strong> ${metadata.lastModel} (${metadata.lastProvider})
      `;
      modelContainer.appendChild(lastUsedInfo);
    }
    
    if (metadata.totalQueriesByModel && Object.keys(metadata.totalQueriesByModel).length > 0) {
      const usageBreakdown = document.createElement('div');
      usageBreakdown.className = 'usage-breakdown';
      usageBreakdown.innerHTML = '<strong>Usage by Model:</strong>';
      
      const usageList = document.createElement('div');
      usageList.className = 'usage-list';
      
      for (const [model, count] of Object.entries(metadata.totalQueriesByModel)) {
        const usageItem = document.createElement('div');
        usageItem.className = 'usage-item';
        usageItem.innerHTML = `${model}: ${count} queries`;
        usageList.appendChild(usageItem);
      }
      
      usageBreakdown.appendChild(usageList);
      modelContainer.appendChild(usageBreakdown);
    }
  }
}

/**
 * Format CO₂ with appropriate units
 */
function formatCO2(grams) {
  if (grams >= 1000) {
    return formatNumber(grams / 1000) + ' kg';
  }
  return formatNumber(grams) + 'g';
}

/**
 * Format water with appropriate units
 */
function formatWater(liters) {
  if (liters >= 1000) {
    return formatNumber(liters / 1000) + ' m³';
  }
  return formatNumber(liters) + ' L';
}

/**
 * Format energy with appropriate units
 */
function formatEnergy(kwh) {
  if (kwh >= 1) {
    return formatNumber(kwh) + ' kWh';
  }
  return formatNumber(kwh * 1000) + ' Wh';
}

/**
 * Reset all statistics
 */
function resetStatistics() {
  if (confirm('Are you sure you want to reset all statistics?')) {
    const emptyStats = {
      co2: 0,
      water: 0,
      energy: 0,
      chars: 0,
      optimizations: 0
    };
    
    chrome.storage.local.set({ totalSavings: emptyStats }, function() {
      loadStatistics();
      showTemporaryMessage('Statistics reset successfully!');
    });
  }
}

/**
 * Format number for display
 */
function formatNumber(num, decimals = 2) {
  const n = parseFloat(num);
  if (isNaN(n)) return '0';
  
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'k';
  }
  
  return n.toFixed(decimals);
}

/**
 * Show temporary success message
 */
function showTemporaryMessage(message) {
  const msgDiv = document.createElement('div');
  msgDiv.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  `;
  msgDiv.textContent = message;
  document.body.appendChild(msgDiv);
  
  setTimeout(() => {
    msgDiv.remove();
  }, 2000);
}

/**
 * Animate statistics for better visibility
 */
function animateStats() {
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = 'scale(1.05)';
      card.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
      
      setTimeout(() => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }, 200);
    }, index * 100);
  });
}

/**
 * Test function to add sample data (for debugging)
 */
function addTestData() {
  chrome.storage.local.get(['totalSavings'], function(result) {
    const current = result.totalSavings || {
      co2: 0,
      water: 0,
      energy: 0,
      chars: 0,
      optimizations: 0
    };
    
    const testSavings = {
      co2: current.co2 + 5.2,
      water: current.water + 120,
      energy: current.energy + 0.001,
      chars: current.chars + 150,
      optimizations: current.optimizations + 3
    };
    
    chrome.storage.local.set({ totalSavings: testSavings }, function() {
      loadStatistics();
      showTemporaryMessage('Test data added! Check your dashboard.');
    });
  });
}
