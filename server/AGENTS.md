# Server Guidelines

## Architecture Standards

Follow the patterns defined in:

- [materiapp-server](../skills/materiapp-server/SKILL.md) - NestJS modules, controllers, services, mappers

Zod schemas | `zod-4` |



### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Adding or refactoring imports in any TypeScript/JavaScript file | `import-sorter` |
| Creating or modifying NestJS modules (Controllers, Services, Schemas, DTOs, Guards, Decorators) | `materiapp-server` |
| Creating Zod schemas | `zod-4` |
| When using MongoDB or Mongoose | `mongodb` |
| Writing NestJS code | `nestjs-best-practices` |
| Writing TypeScript types/interfaces | `typescript` |Zod schemas | `zod-4` |
| When using MongoDB or Mongoose | `mongodb` |
| Writing NestJS code | `nestjs-best-practices` |
| Writing TypeScript types/interfaces | `typescript` |Zod schemas | `zod-4` |
| When using MongoDB or Mongoose | `mongodb` |
| Writing NestJS code | `nestjs-best-practices` |
| Writing TypeScript types/interfaces | `typescript` |
