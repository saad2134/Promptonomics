# How to Actually Use the AI Prompt Optimizer

## Step-by-Step Usage Guide

### Step 1: Verify Installation

1. Go to `chrome://extensions/` in your browser
2. Find "AI Prompt Optimizer - Save Energy"
3. Make sure the toggle switch is **ON** (blue)
4. You should see:
   - ✅ Extension is enabled
   - ✅ Green checkmark or status showing it's active

### Step 2: Visit a Supported AI Platform

The extension works on these sites:
- **ChatGPT**: https://chat.openai.com
- **Claude**: https://claude.ai
- **Gemini**: https://gemini.google.com
- **Copilot**: https://copilot.microsoft.com
- **Bing Chat**: https://www.bing.com/chat

**Important**: You must be on one of these exact URLs for the extension to work!

### Step 3: Look for the Optimize Button

Once you're on a supported site, you should see:

**A green button in the bottom-right corner** that says:
```
⚡ Optimize
```

**Where to look:**
- Bottom-right corner of your browser window
- It's a floating green button with a lightning bolt icon
- It should appear within 1-2 seconds of page load

### Step 4: Type Your Prompt

1. Click in the chat input box (where you normally type messages)
2. Type your prompt - make it at least 20 characters long
3. **Don't send it yet!**

Example prompt:
```
Could you please help me write a professional email to my manager? 
I would really appreciate it if you could make it polite and formal. 
I just need to ask for a day off. Thank you so much!
```

### Step 5: Click the Optimize Button

1. Click the green **"⚡ Optimize"** button
2. A panel will pop up in the center of your screen showing:
   - Your original prompt
   - The optimized version
   - Environmental savings (CO₂, water, energy)
   - Optimization suggestions

### Step 6: Review and Apply

In the popup panel, you'll see two buttons:

1. **"Keep Original"** - Closes the panel, keeps your original prompt
2. **"Use Optimized ✨"** - Replaces your text with the optimized version

Click **"Use Optimized ✨"** to apply the optimized prompt to the input field!

### Step 7: Send Your Optimized Prompt

Now your chat input will contain the optimized prompt. Just:
1. Review it one more time
2. Click Send/Submit as you normally would
3. Your optimized prompt is sent to the AI!

---

## Troubleshooting: "I Don't See the Optimize Button!"

If the green optimize button isn't appearing, try these solutions:

### Solution 1: Check You're on the Right Website

The extension ONLY works on:
- ✅ chat.openai.com (ChatGPT)
- ✅ claude.ai (Claude)
- ✅ gemini.google.com (Gemini)
- ✅ copilot.microsoft.com (Copilot)
- ✅ bing.com/chat (Bing)

❌ It will NOT work on:
- Other websites
- Google Docs
- Email clients
- Regular Google search

### Solution 2: Refresh the Page

1. Press **F5** or **Ctrl+R** (Windows) / **Cmd+R** (Mac)
2. Wait 2-3 seconds for the page to fully load
3. Look for the button again

### Solution 3: Check Extension is Active

1. Go to `chrome://extensions/`
2. Find "AI Prompt Optimizer"
3. Make sure the toggle is **ON** (blue/enabled)
4. Click the refresh icon (↻) on the extension card
5. Go back to the AI chat site and refresh

### Solution 4: Check Console for Errors

1. On the AI chat page, press **F12** to open Developer Tools
2. Click the **Console** tab
3. Look for any red error messages
4. Common issues:
   - "Cannot read property..." → Extension needs to be reloaded
   - "Content script not loaded" → Refresh the page
   - No messages → Button might be hidden behind something

### Solution 5: Clear Cache and Reload Extension

1. Go to `chrome://extensions/`
2. Click "Remove" on the AI Prompt Optimizer
3. Confirm removal
4. Re-load the extension:
   - Click "Load unpacked"
   - Select the extension folder again
5. Refresh your AI chat page

### Solution 6: Check if Button is Hidden

The button might be behind other elements. Try:

1. Scroll to the bottom of the page
2. Check if other chat buttons or elements are blocking it
3. Try resizing your browser window
4. Look in different corners if position seems off

### Solution 7: Manual CSS Override (Advanced)

If the button exists but is invisible, open Developer Tools (F12) and paste this in the Console:

```javascript
// Force show the button
const btn = document.querySelector('#prompt-optimizer-btn');
if (btn) {
    btn.style.display = 'flex';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '999999';
    console.log('Button found and repositioned!');
} else {
    console.log('Button not found - extension may not be loaded');
}
```

---

## Alternative Method: Testing in Console

If the button still doesn't appear, you can test the optimization directly:

1. Visit a supported AI chat site
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Paste this code:

```javascript
// Test the optimizer directly
const optimizer = new PromptOptimizer();
const testPrompt = "Could you please help me write a professional email to my boss? I would really appreciate it if you could make it very polite and formal.";
const optimized = optimizer.optimizePrompt(testPrompt);
const savings = optimizer.calculateSavings(testPrompt, optimized);

console.log('Original:', testPrompt);
console.log('Optimized:', optimized);
console.log('Savings:', savings);
```

If you see results, the extension logic works - it's just a UI issue.

---

## Common Issues and Fixes

### Issue: "Button appears but nothing happens when clicked"

**Fix:**
1. Check if there's text in the chat input
2. Make sure text is at least 20 characters
3. Open Console (F12) and look for error messages
4. Try a simple prompt like: "Please help me write an email to request time off from work"

### Issue: "Panel opens but shows empty/no data"

**Fix:**
1. The chat input field might not be detected
2. Try typing directly in the visible input box
3. Look for errors in Console (F12)
4. Refresh the page and try again

### Issue: "Optimized prompt doesn't replace my original"

**Fix:**
1. Click "Use Optimized ✨" button
2. Check that the text in the input field changed
3. If not, manually copy the optimized text from the panel
4. Some sites use complex editors - manual copy may be needed

### Issue: "Stats in popup show 0 for everything"

**Fix:**
This is normal if you haven't optimized anything yet!
1. Use the extension to optimize at least one prompt
2. Click the extension icon again
3. Stats should now show your savings

---

## Video Walkthrough (Text Description)

**Minute 0:00 - 0:30: Installation**
1. Extract the ZIP file
2. Open chrome://extensions/
3. Enable Developer mode
4. Load unpacked extension
5. Verify green checkmark appears

**Minute 0:30 - 1:00: Finding the Button**
1. Go to chat.openai.com
2. Look for green floating button (bottom-right)
3. If not visible, refresh page (F5)

**Minute 1:00 - 1:30: Optimizing**
1. Type a long prompt in chat input
2. Click the green "Optimize" button
3. Panel appears showing results

**Minute 1:30 - 2:00: Applying**
1. Review optimized prompt
2. Click "Use Optimized ✨"
3. Original text is replaced
4. Send message normally

**Minute 2:00 - 2:30: Checking Stats**
1. Click extension icon in toolbar
2. View total savings
3. See cumulative impact

---

## Quick Checklist

Before asking for help, verify:

- [ ] Extension is installed and enabled in chrome://extensions/
- [ ] You're on a supported site (ChatGPT, Claude, Gemini, Copilot, Bing)
- [ ] Page has fully loaded (wait 3 seconds after opening)
- [ ] You've refreshed the page at least once (F5)
- [ ] Your prompt is at least 20 characters long
- [ ] You checked Console (F12) for error messages
- [ ] You tried clicking the extension icon to see if popup works

---

## Still Not Working?

### Check Extension Files

Make sure these files exist in your extension folder:
```
prompt-optimizer-extension/
├── manifest.json          ✓ Required
├── content.js            ✓ Required (button logic)
├── content.css           ✓ Required (button styling)
├── optimizer.js          ✓ Required (optimization logic)
├── background.js         ✓ Required
├── popup.html            ✓ Required
├── popup.js              ✓ Required
├── popup.css             ✓ Required
└── icons/
    ├── icon16.png        ✓ Required
    ├── icon48.png        ✓ Required
    └── icon128.png       ✓ Required
```

### Verify manifest.json

Open `manifest.json` and verify this section exists:

```json
"content_scripts": [
  {
    "matches": [
      "https://chat.openai.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*",
      "https://www.bing.com/chat*",
      "https://copilot.microsoft.com/*"
    ],
    "js": ["content.js"],
    "css": ["content.css"]
  }
]
```

---

## Success! What Next?

Once it's working:

1. ✨ Start optimizing prompts regularly
2. 📊 Check your stats weekly
3. 🌍 Track your environmental impact
4. 🤝 Share with friends to multiply the effect
5. 💚 Feel good about saving energy!

---

**Remember**: Every optimization counts, even small ones! 🌱

If you're still having issues after trying all these solutions, please provide:
1. Which AI platform you're trying to use it on
2. Screenshot of chrome://extensions/ showing the extension
3. Any error messages from Console (F12)
