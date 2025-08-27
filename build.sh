#!/bin/bash

# Install pnpm if not already installed
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm@9.15.9
fi

# Install dependencies
pnpm install --no-frozen-lockfile

# Build the project
cd apps/frontend
pnpm run build
