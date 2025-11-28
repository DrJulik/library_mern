# Client - React Frontend

React frontend for the Library Management System, built with Vite.

## Tech Stack

- **React 18.3** - UI library
- **TypeScript 5.7** - Type safety
- **Vite 6.0** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router DOM** - Routing
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

## Development Notes

- The dev server runs on port 3000
- API proxy is configured in `vite.config.js`
- Hot Module Replacement (HMR) is enabled for fast refresh
- ESLint is configured with React-specific rules

