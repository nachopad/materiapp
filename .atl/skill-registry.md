# Skill Registry: materiapp

Generated: 2026-04-30
Project: materiapp
Mode: engram

---

## Generic Skills (Any Project)

| Skill | Description | Location | Triggers |
|-------|-------------|----------|----------|
| import-sorter | Standard import ordering for ABConstrucciones: External -> Other Modules -> Same Module | `skills/import-sorter/SKILL.md` | Adding or refactoring imports in any TypeScript/JavaScript file |
| mongodb | Work with MongoDB databases using best practices | `skills/mongodb/SKILL.md` | When using MongoDB or Mongoose |
| nestjs-best-practices | NestJS best practices and architecture patterns for building production-ready applications | `skills/nestjs-best-practices/SKILL.md` | Writing NestJS code |
| react-19 | React 19 patterns with React Compiler | `skills/react-19/SKILL.md` | Writing React components |
| shadcn | Manages shadcn components and projects | `skills/shadcn/SKILL.md` | Creating shadcn components |
| tailwind-design-system | Build scalable design systems with Tailwind CSS v4, design tokens, component libraries, and responsive patterns | `skills/tailwind-design-system/SKILL.md` | Creating Tailwind design systems |
| typescript | Const types, flat interfaces, utility types | `skills/typescript/SKILL.md` | Writing TypeScript types/interfaces |
| zod-4 | Zod 4 schema validation patterns | `skills/zod-4/SKILL.md` | Creating Zod schemas |
| zustand-5 | Zustand 5 state management patterns | `skills/zustand-5/SKILL.md` | Using Zustand stores |

## Materiapp-Specific Skills

| Skill | Description | Location | Triggers |
|-------|-------------|----------|----------|
| materiapp-client | React + TypeScript patterns | `skills/materiapp-client/SKILL.md` | Creating or modifying React/TypeScript frontend features in `client/` |
| materiapp-server | NestJS modules, controllers, services, mappers | `skills/materiapp-server/SKILL.md` | Creating or modifying NestJS modules (Controllers, Services, Schemas, DTOs, Guards, Decorators) |
| skill-creator | Create new AI agent skills | `skills/skill-creator/SKILL.md` | Creating new AI skills |
| skill-sync | Sync skill metadata to AGENTS.md | `skills/skill-sync/SKILL.md` | Syncing skill metadata |

---

## Conventions

### Root Level
- `AGENTS.md` — Main project conventions and skill index

### Component Level
- `client/AGENTS.md` — Client-specific guidelines
- `server/AGENTS.md` — Server-specific guidelines

---

## Auto-Invoke Map

| Action | Skill |
|--------|-------|
| Adding or refactoring imports in any TypeScript/JavaScript file | import-sorter |
| Creating or modifying React/TypeScript frontend features in `client/` | materiapp-client |
| Creating shadcn components | shadcn |
| Creating Tailwind design systems | tailwind-design-system |
| Creating Zod schemas | zod-4 |
| Using Zustand stores | zustand-5 |
| Writing React components | react-19 |
| Writing TypeScript types/interfaces | typescript |
| Creating or modifying NestJS modules (Controllers, Services, Schemas, DTOs, Guards, Decorators) | materiapp-server |
| Using MongoDB or Mongoose | mongodb |
| Writing NestJS code | nestjs-best-practices |

---

## Skill Resolution Paths

```
skills/
├── import-sorter/SKILL.md
├── mongodb/SKILL.md
├── nestjs-best-practices/SKILL.md
├── react-19/SKILL.md
├── shadcn/SKILL.md
├── tailwind-design-system/SKILL.md
├── typescript/SKILL.md
├── zod-4/SKILL.md
├── zustand-5/SKILL.md
├── materiapp-client/SKILL.md
├── materiapp-server/SKILL.md
├── skill-creator/SKILL.md
└── skill-sync/SKILL.md
```
