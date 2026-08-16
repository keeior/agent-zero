# Agent Zero

Agent Zero is a voice-first agentic AI assistant interface built with Next.js and WebRTC. It features real-time voice interaction, web search integration, dynamic image & video rendering, interactive audio visualizers, and chat transcripts.

<picture>
  <source srcset="./.github/assets/readme-hero-dark.webp" media="(prefers-color-scheme: dark)">
  <source srcset="./.github/assets/readme-hero-light.webp" media="(prefers-color-scheme: light)">
  <img src="./.github/assets/readme-hero-light.webp" alt="Agent Zero Interface">
</picture>

## Features

- **Voice AI Agent**: Real-time voice interaction powered by deep speech-to-speech models and agentic tools.
- **Dynamic Display Window**: Displays web search results, full web pages, images (Wikipedia/Bing), and YouTube videos directly in the frontend interface.
- **Agentic Tools**: Integrated web search (`search_web`), web scraper (`read_webpage`), weather (`get_weather`), math (`calculate`), and Wikipedia lookup (`lookup_wikipedia`).
- **Interactive UI Controls**: Multiple audio visualizer styles (`bar`, `grid`, `radial`, `wave`, `aura`), light/dark theme switching, and live chat transcript.
- **Custom Branding**: Configurable through `app-config.ts`.

## Project Structure

```
agent-zero/
├── app/               - Next.js App Router pages and API routes
├── components/
│   ├── agents-ui/     - Audio visualizer, controls, and transcript components
│   ├── app/           - Main application view controllers and layout
│   └── ui/            - Base UI components
├── fonts/             - Custom typography
├── hooks/             - Custom React hooks
├── lib/               - Utilities and helper functions
├── public/            - Static assets
└── app-config.ts      - Application branding and feature configuration
```

## Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file in the root directory:

   ```env
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret
   LIVEKIT_URL=https://your-livekit-server-url
   ```

3. **Start the development server**:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Customize branding, features, and UI controls in [`app-config.ts`](./app-config.ts):

```ts
export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'Agent Zero',
  pageTitle: 'Agent Zero - Voice AI Assistant',
  pageDescription: 'A voice-first agentic AI assistant interface',
  // ...
};
```
