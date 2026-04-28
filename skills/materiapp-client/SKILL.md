---
name: materiapp-client
description: >
    Project-specific React client skill for materiapp.
    Trigger: When working in `client/` or any React/TypeScript frontend task.
    Coordinates all client-scoped generic skills for this project.
license: Apache-2.0
metadata:
    author: materiapp
    version: '1.0'
    scope: [client]
    auto_invoke: Creating or modifying React/TypeScript frontend features in `client/`
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## When to Use

Load this skill for ANY work in the `client/` directory or when building React/TypeScript frontend features:

- Creating or updating React components (`.tsx`)
- Implementing state management with Zustand
- Building forms with React Hook Form + Zod validation
- Adding or modifying shadcn/ui components
- Styling with Tailwind CSS v4
- Working with React Router (SPA navigation)
- TypeScript type definitions for client-side code

## Critical Rules

0. **Responsive by default** — All UI work must be responsive. Validate at 390px width (iPhone 14/15 viewport). No horizontal scroll ever.
   - Flex layouts: add `min-w-0` to child elements to prevent overflow
   - Text overflow: use `truncate` or `line-clamp-*` instead of fixed widths
   - Containers: use `overflow-hidden` on constrained parent elements
   - Test at 390px before considering done — DevTools device mode or `window.innerWidth === 390`

1. **Use specialized skills, don't duplicate** — This is a coordinator skill. Load the relevant generic skill for each concern:
    - React 19 patterns → `react-19`
    - UI components → `shadcn`
    - State management → `zustand-5`
    - Forms/validation → `zod-4`
    - TypeScript → `typescript`
    - Import ordering → `import-sorter`

2. **No manual memoization** — React 19 Compiler handles optimization. Never use `useMemo`, `useCallback`, or `forwardRef`.

3. **Named imports only** — Always use `import { useState } from 'react'`, never `import React` or default imports.

4. **Server components first** — Default to server components; add `"use client"` only when needed (useState, useEffect, event handlers, browser APIs).

5. **Semantic colors** — Use Tailwind tokens like `bg-primary`, `text-muted-foreground`, never raw values like `text-blue-500`.

6. **Import ordering** — Three groups: External → Other modules → Same module. See `import-sorter`.

## Architecture

```
client/
├── src/
│   ├── assets/              # Static assets (icons, images)
│   ├── core/                # App-wide infrastructure (api, router, providers, config, styles)
│   ├── modules/             # Feature modules (auth, profile, progress, etc.)
│   ├── shared/              # Cross-module reusable code (components, hooks, layout, lib)
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
└── vite.config.ts
```

Feature pages/components/schemas live inside each module (e.g. `src/modules/auth/pages`, `src/modules/auth/components`) instead of root-level `src/pages` or `src/components`.

### Tech Stack

| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Framework     | React 19 + Vite (SPA)             |
| Routing       | React Router 7                    |
| State         | Zustand 5 with persist middleware |
| Forms         | React Hook Form + Zod 4           |
| Styling       | Tailwind CSS v4 + shadcn/ui       |
| Data fetching | TanStack Query (react-query)      |
| HTTP client   | Axios                             |
| Icons         | Lucide React                      |

## Context → Skill Decision Table

| Context                      | Primary Skill                        | Secondary Skill               |
| ---------------------------- | ------------------------------------ | ----------------------------- |
| New React component          | `react-19`                           | `shadcn`                      |
| shadcn UI component          | `shadcn`                             | `tailwind-design-system`      |
| Form with validation         | `zod-4`                              | `react-19` (form integration) |
| Client state (non-persist)   | `zustand-5`                          | —                             |
| Zustand store + localStorage | `zustand-5` (persist middleware)     | —                             |
| TypeScript types/interfaces  | `typescript`                         | —                             |
| Adding imports to any file   | `import-sorter`                      | —                             |
| Tailwind styling             | `tailwind-design-system`             | `shadcn`                      |
| API call + caching           | `react-19` + TanStack Query patterns | —                             |

## Code Examples

### Zustand Store (with persist)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            clearToken: () => set({ token: null }),
        }),
        { name: 'auth-storage' },
    ),
);
```

### Form with Zod + React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup } from '@/components/ui/form';

const schema = z.object({
  email: z.email({ error: 'Invalid email' }),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <FieldGroup>
        <Field>
          <Input {...register('email')} aria-invalid={!!errors.email} />
        </Field>
      </FieldGroup>
      <Button type="submit">Login</Button>
    </form>
  );
}
```

### shadcn/ui Component (Button + Icons)

```typescript
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

function SearchButton() {
  return (
    <Button>
      <SearchIcon data-icon="inline-start" />
      Search
    </Button>
  );
}
```

## Commands

```bash
# Development
cd client && pnpm dev

# Build
cd client && pnpm build

# Lint
cd client && pnpm lint

# Type check
cd client && pnpm typecheck  # uses tsc -b

# Preview production build
cd client && pnpm preview
```

## Integrated Skills Reference

This skill coordinates the following client-scoped generic skills:

| Skill                    | Scope                | When to Load                                              |
| ------------------------ | -------------------- | --------------------------------------------------------- |
| `react-19`               | root, client         | React 19 components, hooks, Server/Client component rules |
| `shadcn`                 | root, client         | Adding/modifying shadcn/ui components                     |
| `tailwind-design-system` | root, client         | Tailwind v4 patterns, design tokens, CVA components       |
| `zustand-5`              | root, client         | Client state management, stores, persist                  |
| `zod-4`                  | root, client, server | Form validation, schema definitions                       |
| `typescript`             | root, client, server | TypeScript types, interfaces, strict patterns             |
| `import-sorter`          | client, server, root | Import organization in any TS/JS file                     |
