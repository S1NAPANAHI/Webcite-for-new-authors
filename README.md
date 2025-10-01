# Zoroastervers

## Development Setup

This project uses pnpm as the package manager. Please follow these steps to set up the development environment:

### Prerequisites
- Node.js 18.0.0 or higher
- pnpm 8.15.0 or higher

### Installation

1. Install pnpm if you haven't already:
   ```bash
   npm install -g pnpm@8.15.0
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter
- `pnpm generate-types` - Generate TypeScript types from database schema

### Using nvm (optional but recommended)

If you use nvm, run this to use the correct Node.js version:
```bash
nvm use
```

## Project Structure

- `apps/frontend` - Frontend application
- `apps/backend` - Backend services
- `packages/` - Shared packages and libraries

## Contributing

1. Make sure all tests pass before submitting a PR
2. Follow the existing code style
3. Update documentation as needed
