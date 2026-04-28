---
name: react-19
description: >
    React 19 patterns with React Compiler.
    Trigger: When writing React 19 components/hooks in .tsx (React Compiler rules, hook patterns, refs as props). If using Next.js App Router/Server Actions, also use nextjs-15.
license: Apache-2.0
metadata:
    author: prowler-cloud
    version: '1.0'
    scope: [root, client]
    auto_invoke: 'Writing React components'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Responsive by Default (REQUIRED)

All UI components must be verified at mobile widths (390px). No horizontal scroll allowed.

```tsx
// ✅ Flex children need min-w-0 to prevent overflow
function Layout() {
  return (
    <div className="flex gap-4">
      <Sidebar />
      <main className="min-w-0 flex-1">Content</main>  {/* min-w-0 prevents overflow */}
    </div>
  );
}

// ✅ Text truncation for constrained spaces
function Title({ text }) {
  return <h2 className="truncate">{text}</h2>;  // handles long text gracefully
}

// ❌ NEVER: fixed widths that cause overflow on mobile
function Bad() {
  return <div className="w-80">...</div>;  // breaks at 390px viewport
}
```

Key rules:
- Flex children that can grow/shrink: always add `min-w-0`
- Text in limited space: `truncate`, `line-clamp-2`, or explicit `max-w-*`
- Containers with fixed-height children: `overflow-hidden`
- Mobile-first: design for 390px first, expand for larger screens

## No Manual Memoization (REQUIRED)

```typescript
// ✅ React Compiler handles optimization automatically
function Component({ items }) {
  const filtered = items.filter(x => x.active);
  const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));

  const handleClick = (id) => {
    console.log(id);
  };

  return <List items={sorted} onClick={handleClick} />;
}

// ❌ NEVER: Manual memoization
const filtered = useMemo(() => items.filter(x => x.active), [items]);
const handleClick = useCallback((id) => console.log(id), []);
```

## Imports (REQUIRED)

```typescript
// ✅ ALWAYS: Named imports
import { useState, useEffect, useRef } from 'react';

// ❌ NEVER
import React from 'react';
import * as React from 'react';
```

## Server Components First

```typescript
// ✅ Server Component (default) - no directive
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// ✅ Client Component - only when needed
"use client";
export function Interactive() {
  const [state, setState] = useState(false);
  return <button onClick={() => setState(!state)}>Toggle</button>;
}
```

## When to use "use client"

- useState, useEffect, useRef, useContext
- Event handlers (onClick, onChange)
- Browser APIs (window, localStorage)

## use() Hook

```typescript
import { use } from "react";

// Read promises (suspends until resolved)
function Comments({ promise }) {
  const comments = use(promise);
  return comments.map(c => <div key={c.id}>{c.text}</div>);
}

// Conditional context (not possible with useContext!)
function Theme({ showTheme }) {
  if (showTheme) {
    const theme = use(ThemeContext);
    return <div style={{ color: theme.primary }}>Themed</div>;
  }
  return <div>Plain</div>;
}
```

## Actions & useActionState

```typescript
"use server";
async function submitForm(formData: FormData) {
  await saveToDatabase(formData);
  revalidatePath("/");
}

// With pending state
import { useActionState } from "react";

function Form() {
  const [state, action, isPending] = useActionState(submitForm, null);
  return (
    <form action={action}>
      <button disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

## ref as Prop (No forwardRef)

```typescript
// ✅ React 19: ref is just a prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// ❌ Old way (unnecessary now)
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);
```
