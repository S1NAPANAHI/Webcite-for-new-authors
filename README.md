# Zoroasterverse

This is the official monorepo for the Zoroasterverse project, a platform for new authors. The project is built using a modern web stack, including React, Vite, and Supabase.

## Architecture

This project uses a **direct-to-Supabase** architecture. The frontend application, located in `apps/frontend`, communicates directly with the Supabase backend for database queries, authentication, and other services.

For a more detailed explanation of the architecture, please see the [ARCHITECTURE.md](ARCHITECTURE.md) file.

## Development Setup

This project uses pnpm as the package manager. Please follow these steps to set up the development environment:

### Prerequisites
- Node.js 18.0.0 or higher (`nvm use` is recommended)
- pnpm 8.15.0 or higher

### Installation

1. **Install pnpm** if you haven't already:
   ```bash
   npm install -g pnpm@8.15.0
   ```

2. **Install dependencies** from the root of the repository:
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   - Copy the example environment file for the frontend: `cp apps/frontend/env.example apps/frontend/.env`
   - Populate `apps/frontend/.env` with your Supabase project URL and anon key.

### Running the Development Server

To start the frontend development server, run the following command from the root directory:

```bash
pnpm dev
```

This will start the Vite development server for the frontend application, which is the main entry point for this project.

## Available Scripts

- `pnpm dev`: Starts the frontend development server.
- `pnpm build`: Builds all packages (`shared`, `ui`, `frontend`) for production.
- `pnpm start`: Starts the production server for the frontend.
- `pnpm lint`: Lints the frontend codebase.
- `pnpm generate-types`: Generates TypeScript types from your Supabase schema.
- `pnpm script:<script-name>`: Runs a maintenance or utility script from the `scripts/` directory.

## Project Structure

- `apps/frontend`: The main React/Vite frontend application.
- `packages/shared`: Shared code, types, and Supabase logic used across the monorepo.
- `packages/ui`: A shared component library for the frontend.
- `scripts/`: Maintenance and utility scripts.
- `supabase/`: Supabase database migrations and configuration.
