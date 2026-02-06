# Installation Guide - AI Prompt Optimizer Extension

## Quick Start Guide

Follow these simple steps to install and start using the AI Prompt Optimizer extension:

### Step 1: Prepare the Extension Files

1. Download all the extension files to a folder on your computer
2. Make sure all these files are in the same folder:
   - manifest.json
   - background.js
   - content.js
   - content.css
   - optimizer.js
   - popup.html
   - popup.css
   - popup.js
   - README.md
   - icons/ (folder with icon16.png, icon48.png, icon128.png)

### Step 2: Load the Extension in Chrome

1. **Open Chrome** and type `chrome://extensions/` in the address bar
   - Or click the three dots (⋮) → More Tools → Extensions

2. **Enable Developer Mode**
   - Look for the toggle switch in the top-right corner
   - Click it to turn it ON (it should turn blue)

3. **Load the Extension**
   - Click the "Load unpacked" button (top-left area)
   - Navigate to the folder containing the extension files
   - Select the folder and click "Select Folder" or "Open"

4. **Verify Installation**
   - You should see the "AI Prompt Optimizer - Save Energy" card appear
   - The extension icon (green lightning bolt) should appear in your toolbar
   - If you don't see the icon, click the puzzle piece icon and pin the extension

### Step 3: Start Using the Extension

1. **Visit an AI Chat Platform**
   - Go to ChatGPT (chat.openai.com)
   - Or Claude (claude.ai)
   - Or Gemini (gemini.google.com)
   - Or any other supported platform

2. **Type Your Prompt**
   - Enter your prompt in the chat input field
   - Make sure it's at least 20 characters long

3. **Click the Optimize Button**
   - Look for the green "Optimize" button in the bottom-right corner
   - Click it to analyze your prompt

4. **Review the Results**
   - See your original vs. optimized prompt
   - Check how much CO₂, water, and energy you'll save
   - Review the optimization suggestions

5. **Apply or Keep**
   - Click "Use Optimized ✨" to replace your prompt with the optimized version
   - Or click "Keep Original" if you prefer your original prompt

### Step 4: Check Your Statistics

1. Click the extension icon in your Chrome toolbar
2. View your total savings:
   - CO₂ saved
   - Water saved
   - Energy saved
   - Total number of optimizations

## Troubleshooting

### Extension Not Showing Up

**Problem**: The extension icon doesn't appear in the toolbar
**Solution**: 
- Click the puzzle piece icon (Extensions) in Chrome toolbar
- Find "AI Prompt Optimizer - Save Energy"
- Click the pin icon to pin it to your toolbar

### Optimize Button Not Appearing

**Problem**: The green "Optimize" button doesn't show on AI chat pages
**Solution**:
1. Refresh the page (F5 or Ctrl+R / Cmd+R)
2. Make sure the extension is enabled in chrome://extensions/
3. Check if the website is in the supported list:
   - chat.openai.com
   - claude.ai
   - gemini.google.com
   - copilot.microsoft.com
   - bing.com/chat

### Extension Not Working

**Problem**: The extension loads but doesn't optimize prompts
**Solution**:
1. Open Chrome DevTools (F12)
2. Check the Console for any errors
3. Try disabling and re-enabling the extension
4. Reload the extension in chrome://extensions/

### Icons Not Loading

**Problem**: Extension shows without proper icons
**Solution**:
1. Make sure the icons folder exists with all three PNG files
2. Re-run the icon generation script if needed:
   ```bash
   cd icons
   python3 generate_icons.py
   ```

## Permissions Explained

The extension requests these permissions:

- **storage**: To save your optimization statistics locally
- **activeTab**: To interact with the current AI chat page

We do NOT:
- ❌ Send your data to external servers
- ❌ Track your prompts
- ❌ Share any information
- ❌ Access other websites

## Updating the Extension

If you make changes to the extension:

1. Go to chrome://extensions/
2. Find the extension card
3. Click the refresh icon (circular arrow)
4. Or toggle the extension off and on

## Uninstalling

To remove the extension:

1. Go to chrome://extensions/
2. Find "AI Prompt Optimizer - Save Energy"
3. Click "Remove"
4. Confirm the removal

Your statistics will be deleted when you uninstall.

## Getting Help

If you encounter issues:

1. Check this guide first
2. Review the README.md file
3. Check browser console for errors (F12)
4. Make sure you're using Chrome version 88 or higher

## Tips for Best Results

✅ **Do**:
- Use the extension on prompts longer than 20 characters
- Review the optimized version before using it
- Check your statistics regularly

❌ **Don't**:
- Use on very short prompts (they won't be optimized)
- Expect 100% accuracy (review the optimization)
- Worry about privacy (everything is local)

## Advanced: For Developers

If you want to modify the extension:

1. **Edit the files** in your local folder
2. **Test your changes**:
   - Go to chrome://extensions/
   - Click the refresh icon on the extension card
3. **Check console** for debugging:
   - Open DevTools (F12) on the AI chat page
   - Look for console messages from the extension
4. **Inspect popup**:
   - Right-click the extension icon
   - Select "Inspect popup"

## Next Steps

- Start optimizing prompts to save energy! 🌱
- Share the extension with friends
- Track your environmental impact
- Contribute improvements to the code

---

**Happy Optimizing! Every character saved makes a difference!** 🌍⚡
