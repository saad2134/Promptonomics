// Enhanced Popup script with better environmental statistics display
document.addEventListener('DOMContentLoaded', function() {
  loadStatistics();
  loadRegionalSettings();
  
  // Reset statistics button
  document.getElementById('reset-stats').addEventListener('click', resetStatistics);
  
  // Model size selector
  document.getElementById('model-size').addEventListener('change', updateModelSize);
  
  // Region selector
  document.getElementById('region-selector').addEventListener('change', updateRegion);
});

/**
 * Load and display statistics from storage
 */
function loadStatistics() {
  chrome.storage.local.get(['totalSavings'], function(result) {
    const savings = result.totalSavings || {
      co2: 0,
      water: 0,
      energy: 0,
      chars: 0,
      optimizations: 0
    };
    
    // Update display with enhanced formatting
    document.getElementById('total-co2').textContent = formatCO2(savings.co2);
    document.getElementById('total-water').textContent = formatWater(savings.water);
    document.getElementById('total-energy').textContent = formatEnergy(savings.energy);
    document.getElementById('total-optimizations').textContent = savings.optimizations;
    
    // Calculate and display equivalents
    updateEquivalents(savings);
    
    // Show impact message based on savings
    updateImpactMessage(savings);
  });
}

/**
 * Load regional settings
 */
function loadRegionalSettings() {
  chrome.storage.local.get(['userSettings'], function(result) {
    const settings = result.userSettings || {
      region: 'GLOBAL',
      modelSize: 'medium'
    };
    
    document.getElementById('model-size').value = settings.modelSize;
    document.getElementById('region-selector').value = settings.region;
  });
}

/**
 * Update model size setting
 */
function updateModelSize() {
  const modelSize = document.getElementById('model-size').value;
  chrome.storage.local.get(['userSettings'], function(result) {
    const settings = result.userSettings || {};
    settings.modelSize = modelSize;
    chrome.storage.local.set({ userSettings: settings });
  });
}

/**
 * Update region setting
 */
function updateRegion() {
  const region = document.getElementById('region-selector').value;
  chrome.storage.local.get(['userSettings'], function(result) {
    const settings = result.userSettings || {};
    settings.region = region;
    chrome.storage.local.set({ userSettings: settings });
  });
}

/**
 * Update equivalent emissions display
 */
function updateEquivalents(savings) {
  const co2Grams = parseFloat(savings.co2);
  
  // Calculate equivalents using CodeCarbon methodology
  const carKmPerGram = 1 / 120; // 0.12 kgCO2 per km = 120g per km
  const carKm = co2Grams * carKmPerGram;
  
  const phoneCharges = co2Grams / 8; // ~8g CO2 per phone charge
  const tvHours = co2Grams / 21; // ~21g CO2 per hour of TV
  const treesPlanted = co2Grams / 21000; // ~21kg CO2 absorbed per tree per year
  
  document.getElementById('car-equivalent').textContent = `${carKm.toFixed(1)} km`;
  document.getElementById('phone-equivalent').textContent = `${phoneCharges.toFixed(1)} charges`;
  document.getElementById('tv-equivalent').textContent = `${tvHours.toFixed(1)} hours`;
  document.getElementById('trees-equivalent').textContent = `${treesPlanted.toFixed(3)} trees/year`;
}

/**
 * Update impact message based on savings
 */
function updateImpactMessage(savings) {
  const co2Kg = parseFloat(savings.co2) / 1000;
  const messageDiv = document.getElementById('impact-message');
  
  let message = '';
  let impactClass = '';
  
  if (co2Kg < 0.1) {
    message = '🌱 Just getting started! Every bit helps.';
    impactClass = 'impact-low';
  } else if (co2Kg < 1) {
    message = '🌿 Great progress! You\'re making a real difference.';
    impactClass = 'impact-medium';
  } else {
    message = '🌳 Amazing! You\'re significantly reducing your digital carbon footprint!';
    impactClass = 'impact-high';
  }
  
  messageDiv.textContent = message;
  messageDiv.className = `impact-message ${impactClass}`;
}

/**
 * Format CO2 with appropriate units
 */
function formatCO2(grams) {
  const g = parseFloat(grams);
  if (g >= 1000) {
    return `${(g / 1000).toFixed(2)} kg`;
  }
  return `${g.toFixed(1)} g`;
}

/**
 * Format water with appropriate units
 */
function formatWater(ml) {
  const ml_val = parseFloat(ml);
  if (ml_val >= 1000) {
    return `${(ml_val / 1000).toFixed(1)} L`;
  }
  return `${ml_val.toFixed(0)} ml`;
}

/**
 * Format energy with appropriate units
 */
function formatEnergy(kwh) {
  const n = parseFloat(kwh);
  if (n === 0) return '0';
  
  if (n >= 1) {
    return `${n.toFixed(3)} kWh`;
  } else if (n >= 0.001) {
    return `${(n * 1000).toFixed(1)} Wh`;
  } else {
    return `${(n * 1000000).toFixed(0)} mWh`;
  }
}

/**
 * Reset all statistics
 */
function resetStatistics() {
  if (confirm('Are you sure you want to reset all statistics? This will clear all your environmental impact data.')) {
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
 * Calculate daily/weekly impact projection
 */
function calculateProjections(savings) {
  // Simple projection based on current optimization patterns
  const dailyAvgCo2 = parseFloat(savings.co2) / Math.max(savings.optimizations, 1);
  const weeklyCo2 = dailyAvgCo2 * 7;
  const yearlyCo2 = dailyAvgCo2 * 365;
  
  return {
    daily: dailyAvgCo2.toFixed(2),
    weekly: weeklyCo2.toFixed(1),
    yearly: yearlyCo2.toFixed(0)
  };
}