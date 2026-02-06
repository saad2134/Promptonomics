// Popup script - Displays statistics and settings
document.addEventListener('DOMContentLoaded', function() {
  loadStatistics();
  
  // Reset statistics button
  document.getElementById('reset-stats').addEventListener('click', resetStatistics);
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
    
    // Update display
    document.getElementById('total-co2').textContent = formatNumber(savings.co2) + 'g';
    document.getElementById('total-water').textContent = formatNumber(savings.water) + 'ml';
    document.getElementById('total-energy').textContent = formatNumber(savings.energy, 6) + ' kWh';
    document.getElementById('total-optimizations').textContent = savings.optimizations;
  });
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
