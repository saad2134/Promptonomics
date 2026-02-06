// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Prompt Optimizer Extension installed');
  
  // Initialize storage
  chrome.storage.local.get(['totalSavings'], (result) => {
    if (!result.totalSavings) {
      chrome.storage.local.set({
        totalSavings: {
          co2: 0,
          water: 0,
          energy: 0,
          chars: 0,
          optimizations: 0
        }
      });
    }
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSavings') {
    chrome.storage.local.get(['totalSavings'], (result) => {
      sendResponse({ savings: result.totalSavings });
    });
    return true; // Will respond asynchronously
  }
});

// Update badge with optimization count
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.totalSavings) {
    const optimizations = changes.totalSavings.newValue?.optimizations || 0;
    
    if (optimizations > 0) {
      chrome.action.setBadgeText({ text: optimizations.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }
});
