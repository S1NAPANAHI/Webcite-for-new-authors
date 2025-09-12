# Architecture Overview

This document outlines the architecture of the Zoroasterverse project.

## Core Philosophy: Supabase-First

The primary architectural pattern for this project is **"Supabase-First"**. The frontend application, built with React and Vite, communicates directly with the Supabase backend for the majority of its needs. This approach was chosen to leverage the power of Supabase's integrated services and to simplify the overall technology stack.

An earlier version of this project used a separate Node.js/Express backend, but this has been decommissioned in favor of the direct-to-Supabase model.

## Technology Stack

- **Frontend:** [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Backend-as-a-Service (BaaS):** [Supabase](https://supabase.com/)
- **UI Components:** [Tailwind CSS](https://tailwindcss.com/) + a custom component library in `packages/ui`.
- **Package Manager:** [pnpm](https://pnpm.io/) (in a monorepo configuration)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Key Components & Data Flow

### 1. `apps/frontend`
This is the main, user-facing application. It is a single-page application (SPA) built with React. It is responsible for rendering the UI and managing client-side state.

### 2. `packages/ui`
This is a shared UI component library. It contains all the reusable React components, from basic buttons and inputs to complex page layouts. This ensures a consistent look and feel across the application.

### 3. `packages/shared`
This package contains code that is shared across the monorepo. Its most important role is to house the **Supabase client** and all data-access logic. All database queries, calls to Supabase RPC functions, and type definitions for the database schema live here. This creates a clear data layer that can be used by any part of the application.

### 4. `supabase/`
This directory contains all the configuration for the Supabase backend.
- **`migrations/`**: Contains the full database schema, including table definitions, row-level security (RLS) policies, and database functions (RPC). This is the source of truth for the database structure.
- **`functions/`**: Contains Supabase Edge Functions. These are Deno-based serverless functions used for tasks that require a secure server-side environment, such as handling Stripe webhooks.

### Data Flow Example: Fetching a User Profile
1. A user navigates to the Account page in the **frontend** application.
2. The `AccountPage.tsx` component (from the **ui** package) calls a hook like `useAuth()` (from the **shared** package).
3. The `useAuth()` hook uses the Supabase client to query the `profiles` table in the **Supabase** database.
4. The Row Level Security policy on the `profiles` table ensures the user can only fetch their own data.
5. The data is returned to the frontend and displayed to the user.

### Serverless Functions (`apps/frontend/api/`)
The project also uses Vercel-style serverless functions located in `apps/frontend/api/`. These are used for specific, sensitive backend operations that are not suitable for direct client-side calls, such as:
- Creating a Stripe checkout session.
- Handling incoming Stripe webhooks.

These functions are deployed as part of the frontend application and provide a secure way to interact with third-party services that require secret keys.
