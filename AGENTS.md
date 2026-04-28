# Repository Guidelines

## How to Use This Guide

- Start here for cross-project norms. materiapp is a monorepo with several components.
- Each component has an `AGENTS.md` file with specific guidelines (e.g., `client/AGENTS.md`, `server/AGENTS.md`).
- Component docs override this file when guidance conflicts.

## Available Skills

Use these skills for detailed patterns on-demand:

### Generic Skills (Any Project)

| Skill                    | Description                                                                                                     | URL                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `import-sorter`          | Standard import ordering standard                                                                               | [SKILL.md](skills/import-sorter/SKILL.md)          |
| `mongodb`                | Work with MongoDB databases using best practices                                                                | [SKILL.md](skills/mongodb/SKILL.md)                |
| `nestjs-best-practices`  | NestJS best practices and architecture patterns for building production-ready applications                      | [SKILL.md](skills/nestjs-best-practices/SKILL.md)  |
| `react-19`               | React 19 patterns with React Compiler                                                                           | [SKILL.md](skills/react-19/SKILL.md)               |
| `shadcn`                 | Manages shadcn components and projects                                                                          | [SKILL.md](skills/shadcn/SKILL.md)                 |
| `tailwind-design-system` | Build scalable design systems with Tailwind CSS v4, design tokens, component libraries, and responsive patterns | [SKILL.md](skills/tailwind-design-system/SKILL.md) |
| `typescript`             | Const types, flat interfaces, utility types                                                                     | [SKILL.md](skills/typescript/SKILL.md)             |
| `zod-4`                  | Zod 4 schema validation patterns                                                                                | [SKILL.md](skills/zod-4/SKILL.md)                  |
| `zustand-5`              | Zustand 5 state management patterns                                                                             | [SKILL.md](skills/zustand-5/SKILL.md)              |

### Materiapp Skills

| Skill              | Description                                    | URL                                          |
| ------------------ | ---------------------------------------------- | -------------------------------------------- |
| `materiapp-client` | React + TypeScript patterns                    | [SKILL.md](skills/materiapp-client/SKILL.md) |
| `materiapp-server` | NestJS modules, controllers, services, mappers | [SKILL.md](skills/materiapp-server/SKILL.md) |
| `skill-creator`    | Create new AI agent skills                     | [SKILL.md](skills/skill-creator/SKILL.md)    |
| `skill-sync`       | Sync skill metadata to AGENTS.md               | [SKILL.md](skills/skill-sync/SKILL.md)       |



### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
| ------ | ----- |
