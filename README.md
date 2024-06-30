# Chrome AI

[![Stargazers][stars-shield]][stars-url]
[![Follow Twitter][twitter-image]][twitter-url]

[stars-shield]: https://img.shields.io/github/stars/lightning-joyce/chromeai.svg?style=for-the-badge
[stars-url]: https://github.com/lightning-joyce/chromeai/stargazers
[twitter-image]: https://img.shields.io/twitter/follow/lightning_joyce?style=for-the-badge&logo=x
[twitter-url]: https://twitter.com/lightning_joyce

## Overview

Chrome AI is a demo project that runs large language models locally within the browser. It showcases the capabilities of modern web technologies to leverage advanced AI functionalities directly in the browser environment without needing server-side processing.

## Features

- **Local Execution**: Runs large language models directly in the browser.
- **Real-time Processing**: Provides instant responses and interactions.
- **Privacy-focused**: Processes data locally, ensuring user privacy and data security.

## Getting Started

### Prerequisites

- Latest version of Google Chrome (127+) or any compatible Chromium-based browser.

### How to Set Up Built-in Gemini Nano in Chrome

1. **Install Chrome Canary**: Ensure you have version 127. [Download Chrome Canary](https://google.com/chrome/canary/).
2. **Enable Prompt API**: Open `chrome://flags/#prompt-api-for-gemini-nano`, set it to "Enabled".
3. **Enable Optimization Guide**: Open `chrome://flags/#optimization-guide-on-device-model`, set it to "Enabled BypassPerfRequirement". Restart the browser.
4. **Download Model**: Go to `chrome://components/`, find "Optimization Guide On Device Model", ensure it’s fully downloaded. If the version is "0.0.0.0", click "Check for update".
5. **Troubleshoot**: If the "Optimization Guide On Device Model" is not displayed, disable the settings in steps 2 and 3, restart your browser and re-enable it.
6. **Verify Setup**: Open a webpage, press F12, and check `window.ai` in the console.

**Test Code**:

```javascript
const model = await window.ai.createTextSession();
await model.prompt("Who are you?");
```

### Usage

Clone the repository:

```bash
git clone https://github.com/yourusername/chromeai.git
cd chromeai
pnpm i
pnpm dev
```

Open `localhost:3000` in your browser to start using the AI.

## Contributing

We welcome contributions! Please fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact Lightning Joyce on [Twitter](https://twitter.com/LightningJoyce).
