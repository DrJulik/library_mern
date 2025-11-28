# Client - React Frontend

React frontend for the Library Management System, built with Vite.

## Tech Stack

- **React 18.3** - UI library
- **TypeScript 5.7** - Type safety
- **Vite 6.0** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Zustand 5.0** - State management
- **React Router DOM 7.1** - Routing
- **Axios** - HTTP client
- **ESLint** - Code linting

## Getting Started

### Install Dependencies

From the root of the monorepo:
```bash
pnpm install
```

Or from this directory:
```bash
pnpm install
```

### Run Development Server

From the root:
```bash
pnpm dev:client
```

Or from this directory:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint

## Folder Structure

```
client/
├── public/        # Static assets
├── src/           # React components and logic
│   ├── App.jsx    # Main App component
│   ├── main.jsx   # Entry point
│   ├── App.css    # App styles
│   └── index.css  # Global styles
├── index.html     # HTML template
├── vite.config.js # Vite configuration
└── package.json   # Frontend dependencies
```

## Environment Variables

The Vite dev server is configured to proxy API requests to the backend:
- All requests to `/api/*` are proxied to `http://localhost:5000`

Create a `.env.local` file for additional environment variables:
```
VITE_API_URL=http://localhost:5000
```

## 📚 Documentation

Comprehensive guides available in the [`docs/`](docs/) folder:

- **[Quick Start](docs/QUICK_START.md)** - Get started quickly with examples
- **[Zustand Guide](docs/ZUSTAND_GUIDE.md)** - State management patterns
- **[Router Guide](docs/ROUTER_GUIDE.md)** - React Router usage
- **[Frontend Structure](docs/FRONTEND_STRUCTURE.md)** - Complete architecture
- **[Folder Structure](docs/FOLDER_STRUCTURE.md)** - Visual folder organization
- **[Setup Summary](docs/SETUP_SUMMARY.md)** - What's been configured

## Development Notes

- The dev server runs on port 3000
- API proxy is configured to forward `/api/*` to `http://localhost:5000`
- Hot Module Replacement (HMR) is enabled for fast refresh
- ESLint is configured with React + TypeScript rules
- Zustand DevTools integration available

