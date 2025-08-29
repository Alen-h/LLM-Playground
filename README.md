# LLM Playground

A modern, web-based playground for interacting with Large Language Models (LLMs) from multiple providers. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

## Features

- 🤖 **Multi-Provider Support**: Choose from OpenAI, Anthropic (Claude), and Deepseek models
- 🎛️ **Advanced Model Selection**: Cascading dropdown for easy provider and model selection
- 💾 **API Key Management**: Store and manage multiple API keys with secure local storage
- 🎨 **Modern UI**: Clean, responsive interface with real-time character counting
- ⚡ **Fast Performance**: Built with Next.js 15 and Turbopack for lightning-fast development
- 🔄 **Real-time Feedback**: Loading states and error handling for better UX
- 📊 **Flexible Output**: Support for both text and JSON response formats
- 🎯 **Parameter Control**: Adjust temperature, max tokens, and system prompts
- 🏗️ **Modern Architecture**: Built with Strategy Pattern for extensible provider support
- 🔒 **Secure API Handling**: Server-side API calls to protect your API keys

## Supported Models

### OpenAI

- `gpt-4.1` - Most capable model
- `gpt-4.1-mini` - Faster, more cost-effective
- `gpt-4.1-nano` - Lightweight option

### Anthropic (Claude)

- `claude-opus-4-1-20250805` - Latest Opus model
- `claude-opus-4-20250514` - Previous Opus version
- `claude-sonnet-4-20250514` - Sonnet model
- `claude-3-7-sonnet-latest` - Latest Sonnet

### Deepseek

- `deepseek-chat` - General purpose chat model
- `deepseek-reasoner` - Specialized reasoning model

## Screenshots

The playground features a split-screen interface:

- **Left Panel**: Input form with API key management, model selection, prompts, and parameters
- **Right Panel**: Real-time output display with formatted responses

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- API keys from your preferred providers:
  - [OpenAI Platform](https://platform.openai.com/api-keys)
  - [Anthropic Console](https://console.anthropic.com/)
  - [Deepseek Platform](https://platform.deepseek.com/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/llm-playground.git
cd llm-playground
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Add Your API Keys**: Enter API keys for your preferred providers (they will be saved locally)
2. **Select Provider & Model**: Use the cascading dropdown to choose your provider and model
3. **Set System Prompt**: Define the AI's behavior and context
4. **Enter User Prompt**: Type your query or request
5. **Adjust Parameters**: Control temperature, max tokens, and response format
6. **Submit**: Click the submit button to get your response

## Project Structure

```
llm-playground/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Multi-provider API with Strategy Pattern
│   ├── globals.css               # Global styles with Tailwind v4
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Main playground interface
│   └── favicon.ico              # App favicon
├── public/                      # Static assets (SVG icons)
├── node_modules/                # Dependencies
├── package.json                 # Dependencies and scripts
├── package-lock.json           # Dependency lock file
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── next-env.d.ts               # Next.js TypeScript definitions
├── postcss.config.mjs          # PostCSS configuration
├── eslint.config.mjs           # ESLint configuration
├── vercel.json                 # Vercel deployment configuration
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

## Tech Stack

- **Framework**: [Next.js 15.5.2](https://nextjs.org/) with App Router
- **React**: [React 19.1.0](https://react.dev/) with modern features
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
- **Build Tool**: [Turbopack](https://turbo.build/pack) (via Next.js dev)
- **Linting**: [ESLint 9](https://eslint.org/) with Next.js configuration
- **Architecture**: Strategy Pattern for extensible LLM provider support
- **APIs**:
  - [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat)
  - [Anthropic Messages API](https://docs.anthropic.com/en/api/messages)
  - [Deepseek Chat API](https://platform.deepseek.com/api-docs)

## Architecture

This project uses the **Strategy Pattern** to handle multiple LLM providers:

- **LLMProvider**: Abstract base class defining the provider interface
- **ClaudeProvider**: Handles Anthropic Claude models
- **DeepseekProvider**: Handles Deepseek models
- **OpenAIProvider**: Handles OpenAI models (also serves as fallback)
- **LLMProviderFactory**: Factory class that selects the appropriate provider

This design makes it easy to add new LLM providers without modifying existing code.

## Configuration

### Response Formats

- `text` - Plain text responses
- `json_object` - Structured JSON output (OpenAI and Deepseek only)

### Parameters

- **Temperature**: Controls randomness (0-2, default: 1)
- **Max Tokens**: Maximum response length (default: 2048)
- **System Prompt**: Defines AI behavior and context

## Security Notes

- API keys are stored only in your browser's local storage
- API calls are made server-side to protect your API keys from client exposure
- No API keys or conversation data are stored on our servers
- Each provider's API key is stored separately and securely

## Development

### Available Scripts

- `npm run dev` - Start development server with Next.js and Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code linting

### Building for Production

```bash
npm run build
npm start
```

### Environment Variables

No environment variables are required for local development. All API keys are managed through the UI.

## Deployment

The project is configured for deployment on Vercel with the included `vercel.json` configuration.

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/YOUR_USERNAME/llm-playground/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/api/), [Anthropic](https://www.anthropic.com/), and [Deepseek](https://www.deepseek.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
