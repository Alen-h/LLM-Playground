# LLM Playground

A modern, web-based playground for interacting with Large Language Models (LLMs) from multiple providers. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

## Features

- 🤖 **Multi-Provider Support**: Choose from OpenAI, Anthropic (Claude), and Deepseek models
- 🎛️ **Advanced Model Selection**: Intuitive cascading dropdown for easy provider and model selection
- 💾 **Smart API Key Management**: Store and manage multiple API keys with secure local storage and easy dropdown selection
- 🎨 **Modern UI**: Clean, responsive split-screen interface with real-time character counting
- ⚡ **Fast Performance**: Built with Next.js 15 and Turbopack for lightning-fast development
- 🔄 **Real-time Feedback**: Loading states, error handling, and visual feedback for better UX
- 📊 **Flexible Output**: Support for both text and JSON response formats (OpenAI/Deepseek only)
- 🎯 **Parameter Control**: Fine-tune temperature (0-2), max tokens (1-4096), and system prompts
- 🏗️ **Modern Architecture**: Built with Strategy Pattern for extensible provider support
- 🔒 **Secure API Handling**: Server-side API calls to protect your API keys from client exposure
- 🗑️ **Key Management**: Easy deletion of stored API keys with visual confirmation
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Interactive Tooltips**: Helpful security information and guidance throughout the interface

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

## Interface Overview

The playground features an intuitive split-screen interface designed for optimal user experience:

- **Left Panel**: Comprehensive input form with:
  - Smart API key management with dropdown selection and secure storage
  - Cascading model selection (Provider → Model)
  - System and user prompt editors with character counters
  - Temperature and max tokens sliders with real-time values
  - Response format selection (text/JSON)
  
- **Right Panel**: Real-time output display with:
  - Formatted response rendering
  - Loading indicators during API calls
  - Clear error messages with detailed information
  - Empty state guidance for new users

## Recent Updates

- ✨ **Enhanced API Key Management**: Multiple API key storage with dropdown selection
- 🎛️ **Improved Model Selection**: Cascading dropdown interface for better UX
- 🔒 **Security Tooltips**: Interactive tooltips explaining data security practices
- 📱 **Better Responsiveness**: Improved mobile and tablet experience
- 🎨 **Visual Polish**: Enhanced loading states and error handling
- 🧹 **Code Quality**: Better TypeScript types and component organization

## Getting Started

### Quick Start

Want to try it right now? The easiest way:

1. **Visit the Live Demo**: [https://llm-playground-alen-h.vercel.app](https://llm-playground-alen-h.vercel.app) (if deployed)
2. **Get an API Key**: Grab a free API key from [OpenAI](https://platform.openai.com/api-keys), [Anthropic](https://console.anthropic.com/), or [Deepseek](https://platform.deepseek.com/)
3. **Start Playing**: Enter your API key, select a model, and start chatting!

### Local Development

### Prerequisites

- Node.js 18+ installed on your machine
- API keys from your preferred providers:
  - [OpenAI Platform](https://platform.openai.com/api-keys)
  - [Anthropic Console](https://console.anthropic.com/)
  - [Deepseek Platform](https://platform.deepseek.com/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Alen-h/LLM-Playground.git
cd LLM-Playground
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

1. **Manage API Keys**: 
   - Enter your API key in the input field (supports OpenAI, Anthropic, or Deepseek)
   - Keys are automatically saved to local storage for future use
   - Use the dropdown to quickly select from previously saved keys
   - Delete unwanted keys with the trash icon

2. **Select Your Model**: 
   - Click the model selector to open the cascading dropdown
   - First select your provider (OpenAI, Anthropic, or Deepseek)
   - Then choose your specific model from the available options

3. **Configure Your Prompts**:
   - **System Prompt**: Define the AI's behavior, role, and context (up to 10000 characters)
   - **User Prompt**: Enter your question or request (up to 1000 characters)
   - Both fields include real-time character counters

4. **Fine-tune Parameters**:
   - **Temperature**: Control randomness (0 = focused, 2 = creative)
   - **Max Tokens**: Set response length limit (1-4096 tokens)
   - **Response Format**: Choose text or JSON output (OpenAI/Deepseek only)

5. **Submit & Review**:
   - Click Submit when all required fields are filled
   - View real-time loading indicators
   - Review formatted responses in the output panel
   - Handle any errors with clear, descriptive messages

## Project Structure

```
LLM-Playground/
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

- **Framework**: [Next.js 15.5.2](https://nextjs.org/) with App Router and React Server Components
- **React**: [React 19.1.0](https://react.dev/) with modern hooks and features
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) for type safety and better DX
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS for modern CSS
- **Build Tool**: [Turbopack](https://turbo.build/pack) for ultra-fast development builds
- **Linting**: [ESLint 9](https://eslint.org/) with Next.js configuration for code quality
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics) for performance monitoring
- **Architecture**: Strategy Pattern for extensible LLM provider support
- **Storage**: Browser localStorage for secure client-side API key management
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

1. Check the [Issues](https://github.com/Alen-h/LLM-Playground/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/api/), [Anthropic](https://www.anthropic.com/), and [Deepseek](https://www.deepseek.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
