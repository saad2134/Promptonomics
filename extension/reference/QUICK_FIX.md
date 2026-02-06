# QUICK FIX - Extension Not Loading

## The Issue
The diagnostic shows:
- ❌ PromptOptimizer class not found
- ❌ Button not in DOM
- ✅ You're on a supported site (claude.ai)
- ✅ Chat input detected

This means the content scripts aren't being injected.

## Immediate Solution

### Method 1: Force Reload (Try This First)

1. **Close all Claude.ai tabs completely**
2. **Go to chrome://extensions/**
3. **Find "AI Prompt Optimizer"**
4. **Toggle it OFF, then ON again**
5. **Open a NEW claude.ai tab**
6. **Wait 5 seconds**
7. **Look for the green button**

### Method 2: Reinstall from Scratch

1. **Go to chrome://extensions/**
2. **Remove the extension completely**
3. **Extract the NEW ZIP file to a fresh folder**
4. **Click "Load unpacked"**
5. **Select the NEW folder**
6. **Open claude.ai in a NEW tab**
7. **Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)**

### Method 3: Manual Verification

Check these files exist in your extension folder:

```
✓ manifest.json
✓ optimizer.js
✓ content.js
✓ content.css
✓ background.js
✓ popup.html
✓ popup.js
✓ popup.css
✓ icons/icon16.png
✓ icons/icon48.png
✓ icons/icon128.png
```

### Method 4: Check Manifest Content

Open `manifest.json` and verify line 27 says:

```json
"js": ["optimizer.js", "content.js"],
```

NOT just:
```json
"js": ["content.js"],
```

If it's wrong, download the latest ZIP again.

## After Fixing

Once the button appears, here's how to use it:

1. **Type a prompt** (at least 20 characters)
   Example: "Could you please help me write a professional email to my manager requesting time off?"

2. **Click the green "⚡ Optimize" button** in bottom-right corner

3. **Review the popup** showing:
   - Your original prompt
   - Optimized version
   - CO₂, water, energy savings

4. **Click "Use Optimized ✨"** to replace your text

5. **Send** your optimized prompt!

## Still Not Working?

Run this in Console (F12) on claude.ai:

```javascript
// Check if files are being loaded
console.log('Checking extension...');
console.log('PromptOptimizer:', typeof PromptOptimizer);
console.log('Button:', document.querySelector('#prompt-optimizer-btn'));
console.log('Manifest scripts:', chrome.runtime.getManifest?.()?.content_scripts?.[0]?.js);
```

This will show you what's actually loaded.

## Common Causes

1. **Wrong folder loaded** - Make sure you loaded the folder containing manifest.json
2. **Old cached version** - Need to reload extension after updating files
3. **Chrome needs restart** - Sometimes Chrome needs a full restart
4. **File permissions** - Make sure Chrome can read the files

## Nuclear Option (If All Else Fails)

1. Completely close Chrome (all windows)
2. Delete the old extension folder
3. Extract the ZIP to a NEW location
4. Restart Chrome
5. Go to chrome://extensions/
6. Enable Developer mode
7. Load unpacked from NEW location
8. Open claude.ai in a NEW tab
9. Wait 5 seconds

The button WILL appear if:
- ✓ Files are correct
- ✓ Extension is enabled
- ✓ You're on a supported site
- ✓ Page has fully loaded

## Success Indicators

You'll know it's working when:
- 🟢 Green button appears in bottom-right
- 🟢 Clicking it opens a popup panel
- 🟢 Extension icon shows in toolbar
- 🟢 No errors in chrome://extensions/

## Contact

If none of this works:
1. Check Chrome version (need 88+)
2. Try in Incognito mode (to rule out conflicts)
3. Disable other extensions temporarily
4. Check antivirus isn't blocking it
