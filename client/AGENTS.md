# Client Guidelines

## Architecture Standards

Follow the patterns defined in:

- [materiapp-client](../skills/materiapp-client/SKILL.md) - React + TypeScript patterns

Zod schemas | `zod-4` |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Adding or refactoring imports in any TypeScript/JavaScript file | `import-sorter` |
| Creating or modifying React/TypeScript frontend features in `client/` | `materiapp-client` |
| Creating shadcn components | `shadcn` |
| Creating Tailwind design systems | `tailwind-design-system` |
| Creating Zod schemas | `zod-4` |
| Using Zustand stores | `zustand-5` |
| Writing React components | `react-19` |
| Writing TypeScript types/interfaces | `typescript` |
