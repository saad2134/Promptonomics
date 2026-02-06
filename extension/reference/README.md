# AI Prompt Optimizer - Chrome Extension

A Chrome extension that helps you optimize AI prompts to save energy, reduce CO₂ emissions, and conserve water by removing unnecessary characters while maintaining the prompt's meaning.

## 🌱 Features

- **Smart Prompt Optimization**: Automatically removes redundant phrases, filler words, and excessive whitespace
- **Environmental Impact Tracking**: Shows how much CO₂, water, and energy you've saved
- **Real-time Calculations**: Displays savings for each optimization
- **Multi-Platform Support**: Works on ChatGPT, Claude, Gemini, Copilot, and more
- **Non-intrusive UI**: Clean, floating button that doesn't interfere with your workflow
- **Cumulative Statistics**: Track your total environmental impact over time

## 📊 How It Calculates Savings

The extension uses research-based estimates for AI model energy consumption:
- **Energy**: ~0.0004 kWh per 1000 tokens
- **CO₂**: ~0.0002 kg per 1000 tokens
- **Water**: ~0.5 ml per 1000 tokens

*Note: These are approximate values based on industry research. Actual values may vary by model and infrastructure.*

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. Download or clone this repository to your computer
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked"
5. Select the `prompt-optimizer-extension` folder
6. The extension icon should appear in your Chrome toolbar

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon.

## 📖 Usage

1. **Navigate to an AI Chat Platform**: Go to ChatGPT, Claude, Gemini, or any supported platform
2. **Type Your Prompt**: Enter your prompt in the chat input field
3. **Click Optimize**: Click the green "Optimize" button that appears in the bottom-right corner
4. **Review Results**: See the optimized version and environmental savings
5. **Use or Keep**: Choose to use the optimized prompt or keep your original

## 🎯 Supported Platforms

- ChatGPT (chat.openai.com)
- Claude (claude.ai)
- Google Gemini (gemini.google.com)
- Microsoft Copilot (copilot.microsoft.com)
- Bing Chat (bing.com/chat)

## 🔧 Technical Details

### File Structure

```
prompt-optimizer-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for background tasks
├── content.js            # Main script injected into AI chat pages
├── content.css           # Styles for injected UI elements
├── optimizer.js          # Core optimization logic
├── popup.html            # Extension popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── icons/                # Extension icons (16x16, 48x48, 128x128)
└── README.md             # This file
```

### Optimization Techniques

The extension applies several optimization strategies:

1. **Whitespace Normalization**: Removes excessive spaces and line breaks
2. **Redundancy Removal**: Eliminates polite but unnecessary phrases like "please", "could you"
3. **Filler Word Elimination**: Removes words like "just", "really", "actually"
4. **Punctuation Cleanup**: Reduces excessive punctuation marks
5. **Duplicate Detection**: Identifies and removes duplicate sentences
6. **Contraction Usage**: Converts phrases like "do not" to "don't" for brevity
7. **Sentence Deduplication**: Removes repeated sentences (case-insensitive)

## 🔒 Privacy

This extension:
- ✅ Works entirely locally in your browser
- ✅ Does not send your prompts to any external servers
- ✅ Only stores optimization statistics locally
- ✅ Does not collect or share any personal data
- ✅ Open source - you can review all the code

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - Feel free to use and modify as needed.

## 🌍 Environmental Impact

Every character saved reduces:
- Server processing time
- Energy consumption
- CO₂ emissions
- Water usage for cooling data centers

By optimizing your prompts, you're contributing to a more sustainable use of AI technology!

## ⚠️ Known Limitations

- Token estimation is approximate (using ~4 characters per token)
- Environmental impact calculations are based on averages and may vary
- Very short prompts (<20 characters) are not optimized
- Some nuanced phrasing may be simplified

## 📞 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include your Chrome version and the AI platform you're using

## 🎉 Acknowledgments

Built with love for a greener future! Thanks to all researchers studying AI energy consumption and environmental impact.

---

**Remember**: Every optimized prompt makes a difference! 🌱
