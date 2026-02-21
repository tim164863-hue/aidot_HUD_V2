# AiDot HUD V2

A comprehensive AI operations dashboard and control center for managing AI agents, tasks, and workflows in real-time.

## Features

- **Real-time Dashboard** - Monitor AI agent status, performance metrics, and system health
- **Agent Management** - View and manage multiple AI agents (Ula, Kawa, 0xcat)
- **Task Queue** - Track ongoing tasks, cron jobs, and scheduled operations
- **Chat Center** - Unified communication interface for agent interactions
- **Knowledge Base** - Browse and manage knowledge graphs and brain networks
- **Content Management** - Draft, review, and publish content
- **Calendar Integration** - Schedule and track events and deadlines
- **Code Viewer** - Inspect and manage code repositories
- **Ecosystem Overview** - Visualize the entire AI system architecture

## Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS 4
- **State Management:** Zustand
- **Charts & Visualization:** Recharts, D3.js
- **Icons:** Lucide React
- **UI Components:** Custom glass-morphism design system

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tim164863-hue/aidot_HUD_V2.git
cd aidot_HUD_V2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
aidot_HUD_V2/
├── src/
│   ├── components/          # React components
│   │   ├── HUDView.tsx      # Main dashboard
│   │   ├── AgentsView.tsx   # Agent management
│   │   ├── ChatCenterView.tsx
│   │   ├── TaskQueue.tsx
│   │   ├── KnowledgeView.tsx
│   │   ├── CodeView.tsx
│   │   ├── CalendarView.tsx
│   │   ├── EcosystemView.tsx
│   │   └── ...
│   ├── stores/              # Zustand state management
│   │   ├── agents-store.ts
│   │   ├── chat-store.ts
│   │   ├── cron-store.ts
│   │   └── app-store.ts
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── api-proxy/               # Backend API proxy
├── package.json
├── vite.config.ts
├── tsconfig.json
└── vercel.json              # Vercel deployment config
```

## Pages & Views

| View | Description |
|------|-------------|
| HUD | Main dashboard with system overview and KPIs |
| Agents | AI agent status, performance, and management |
| Chat Center | Real-time communication with agents |
| Tasks | Task queue and cron job management |
| Knowledge | Knowledge graph and brain network visualization |
| Content | Content drafts and publishing workflow |
| Code | Code repository browser and inspector |
| Calendar | Event scheduling and deadline tracking |
| Ecosystem | System architecture and component overview |

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## API Integration

The dashboard connects to a backend API through the `api-proxy` directory. Update the API endpoints in your environment configuration.

## Design System

- **Glass Morphism** - Frosted glass effect cards with backdrop blur
- **Dark/Light Mode** - Theme support via CSS variables
- **Responsive** - Mobile-first design, works on all screen sizes
- **Accessibility** - WCAG AA compliant with semantic HTML

## Performance

- Code splitting with dynamic imports
- Optimized re-renders with Zustand
- Lazy loading for heavy components
- CSS-in-JS with TailwindCSS for minimal bundle size

## Deployment

### Vercel

The project includes `vercel.json` for easy deployment to Vercel:

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t aidot-hud-v2 .
docker run -p 5173:5173 aidot-hud-v2
```

## Contributing

This is an internal project. For contributions, please follow the existing code style and submit pull requests for review.

## License

MIT License - See LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Version:** 2.0.0  
**Last Updated:** 2026-02-21  
**Maintainer:** Tim (@tim164863-hue)
