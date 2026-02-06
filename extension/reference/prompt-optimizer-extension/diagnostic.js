/* DIAGNOSTIC SCRIPT - AI Prompt Optimizer Extension
 * 
 * HOW TO USE:
 * 1. Visit a supported AI chat site (ChatGPT, Claude, Gemini, etc.)
 * 2. Press F12 to open Developer Tools
 * 3. Click the "Console" tab
 * 4. Copy and paste this entire script
 * 5. Press Enter
 * 6. Read the diagnostic results
 */

(function() {
    console.log('='.repeat(60));
    console.log('AI PROMPT OPTIMIZER - DIAGNOSTIC TEST');
    console.log('='.repeat(60));
    console.log('');
    
    let hasIssues = false;
    
    // Test 1: Check if optimizer logic is loaded
    console.log('Test 1: Checking if optimizer logic is loaded...');
    if (typeof PromptOptimizer !== 'undefined') {
        console.log('✅ PASS: PromptOptimizer class found');
        
        // Test the optimizer
        try {
            const optimizer = new PromptOptimizer();
            const testPrompt = "Please help me";
            const optimized = optimizer.optimizePrompt(testPrompt);
            console.log('✅ PASS: Optimizer can process prompts');
            console.log('   Test input: "' + testPrompt + '"');
            console.log('   Test output: "' + optimized + '"');
        } catch (e) {
            console.log('❌ FAIL: Optimizer exists but threw error:', e.message);
            hasIssues = true;
        }
    } else {
        console.log('❌ FAIL: PromptOptimizer class not found');
        console.log('   → Extension may not be loaded on this page');
        hasIssues = true;
    }
    console.log('');
    
    // Test 2: Check if optimize button exists
    console.log('Test 2: Checking if optimize button exists...');
    const button = document.querySelector('#prompt-optimizer-btn');
    if (button) {
        console.log('✅ PASS: Optimize button found in DOM');
        
        // Check if visible
        const styles = window.getComputedStyle(button);
        const isVisible = styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0';
        
        if (isVisible) {
            console.log('✅ PASS: Button is visible');
            console.log('   Position:', styles.position);
            console.log('   Bottom:', styles.bottom);
            console.log('   Right:', styles.right);
            console.log('   Z-Index:', styles.zIndex);
        } else {
            console.log('⚠️  WARNING: Button exists but is hidden');
            console.log('   Display:', styles.display);
            console.log('   Visibility:', styles.visibility);
            console.log('   Opacity:', styles.opacity);
            hasIssues = true;
        }
    } else {
        console.log('❌ FAIL: Optimize button not found in DOM');
        console.log('   → Extension content script may not have injected');
        hasIssues = true;
    }
    console.log('');
    
    // Test 3: Check if panel exists
    console.log('Test 3: Checking if optimizer panel exists...');
    const panel = document.querySelector('#prompt-optimizer-panel');
    if (panel) {
        console.log('✅ PASS: Optimizer panel found');
    } else {
        console.log('❌ FAIL: Optimizer panel not found');
        hasIssues = true;
    }
    console.log('');
    
    // Test 4: Check if textarea can be found
    console.log('Test 4: Checking if chat input can be detected...');
    const selectors = [
        'textarea[placeholder*="Message"]',
        'textarea[placeholder*="Ask"]',
        'textarea[placeholder*="Chat"]',
        'textarea#prompt-textarea',
        'textarea[data-id="root"]',
        '.ProseMirror',
        '[contenteditable="true"]'
    ];
    
    let foundTextarea = null;
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            foundTextarea = element;
            console.log('✅ PASS: Found input element with selector:', selector);
            console.log('   Tag:', element.tagName);
            console.log('   Type:', element.type || 'contenteditable');
            break;
        }
    }
    
    if (!foundTextarea) {
        console.log('⚠️  WARNING: Could not find chat input element');
        console.log('   → Extension may not work on this page');
        hasIssues = true;
    }
    console.log('');
    
    // Test 5: Check current URL
    console.log('Test 5: Checking if current URL is supported...');
    const supportedDomains = [
        'chat.openai.com',
        'claude.ai',
        'gemini.google.com',
        'copilot.microsoft.com',
        'bing.com'
    ];
    
    const currentDomain = window.location.hostname;
    const isSupported = supportedDomains.some(domain => currentDomain.includes(domain));
    
    if (isSupported) {
        console.log('✅ PASS: Current site is supported');
        console.log('   URL:', window.location.href);
    } else {
        console.log('❌ FAIL: Current site is NOT supported');
        console.log('   Current URL:', window.location.href);
        console.log('   Supported sites:');
        supportedDomains.forEach(domain => console.log('   - ' + domain));
        hasIssues = true;
    }
    console.log('');
    
    // Test 6: Check Chrome extension API
    console.log('Test 6: Checking Chrome extension API access...');
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        console.log('✅ PASS: Chrome extension API accessible');
        console.log('   Extension ID:', chrome.runtime.id);
    } else {
        console.log('⚠️  WARNING: Chrome extension API not accessible');
        console.log('   → This is normal for content scripts in some contexts');
    }
    console.log('');
    
    // Summary
    console.log('='.repeat(60));
    console.log('DIAGNOSTIC SUMMARY');
    console.log('='.repeat(60));
    
    if (!hasIssues) {
        console.log('✅ ALL TESTS PASSED!');
        console.log('');
        console.log('The extension should be working correctly.');
        console.log('If you still don\'t see the button:');
        console.log('1. Try refreshing the page (F5)');
        console.log('2. Check if the button is hidden behind other elements');
        console.log('3. Try scrolling to the bottom of the page');
        console.log('');
        console.log('To manually show the button, run this command:');
        console.log('document.querySelector("#prompt-optimizer-btn").style.display = "flex";');
    } else {
        console.log('⚠️  ISSUES DETECTED');
        console.log('');
        console.log('Recommended actions:');
        console.log('1. Make sure you\'re on a supported site (ChatGPT, Claude, Gemini, Copilot)');
        console.log('2. Go to chrome://extensions/ and verify extension is enabled');
        console.log('3. Click the refresh icon (↻) on the extension card');
        console.log('4. Refresh this page (F5)');
        console.log('5. Run this diagnostic again');
        console.log('');
        console.log('If issues persist:');
        console.log('- Disable and re-enable the extension');
        console.log('- Remove and reload the extension');
        console.log('- Check that all extension files are present');
    }
    
    console.log('='.repeat(60));
    console.log('');
    
    // Offer to show button if it exists but is hidden
    if (button) {
        const styles = window.getComputedStyle(button);
        const isHidden = styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0';
        
        if (isHidden) {
            console.log('💡 TIP: The button exists but is hidden.');
            console.log('Run this to make it visible:');
            console.log('');
            console.log('document.querySelector("#prompt-optimizer-btn").style.display = "flex";');
            console.log('');
        }
    }
    
})();
