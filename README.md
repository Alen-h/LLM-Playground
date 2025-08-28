# LLM Playground

A modern, web-based playground for interacting with Large Language Models (LLMs) through the OpenAI API. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🤖 **Multiple Model Support**: Choose from gpt-4.1, gpt-4.1-mini, and gpt-4.1-nano
- 🎛️ **Customizable Parameters**: Adjust temperature, system prompts, and response formats
- 💾 **Persistent API Key Storage**: Your API key is securely stored in local storage
- 🎨 **Modern UI**: Clean, responsive interface with real-time character counting
- ⚡ **Fast Performance**: Built with Next.js 15 and Turbopack for lightning-fast development
- 🔄 **Real-time Feedback**: Loading states and error handling for better UX

## Screenshots

The playground features a split-screen interface:
- **Left Panel**: Input form with API key, model selection, prompts, and parameters
- **Right Panel**: Real-time output display with formatted responses

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- An OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/api-keys))

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

1. **Add Your API Key**: Enter your OpenAI API key in the API Key field (it will be saved locally)
2. **Select a Model**: Choose from the available GPT models
3. **Set System Prompt**: Define the AI's behavior and context
4. **Enter User Prompt**: Type your query or request
5. **Adjust Temperature**: Control the randomness of responses (0-2)
6. **Choose Response Format**: Select between text or JSON object output
7. **Submit**: Click the submit button to get your response

## Project Structure

```
llm-playground/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # OpenAI API integration
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main playground interface
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
└── tailwind.config.js          # Tailwind CSS configuration
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Turbopack](https://turbo.build/pack)
- **API**: [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat)

## Configuration

The application supports the following OpenAI models:
- `gpt-4.1` - Most capable model
- `gpt-4.1-mini` - Faster, more cost-effective
- `gpt-4.1-nano` - Lightweight option

Response formats:
- `text` - Plain text responses
- `json_object` - Structured JSON output

## Security Notes

- API keys are stored only in your browser's local storage
- API calls are made server-side to protect your API key from client exposure
- No API keys or conversation data are stored on our servers

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code linting

### Building for Production

```bash
npm run build
npm start
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
- Powered by [OpenAI API](https://openai.com/api/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
