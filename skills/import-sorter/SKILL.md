---
name: import-sorter
description: >
    Standard import ordering for ABConstrucciones: External -> Other Modules -> Same Module.
    Trigger: When writing, refactoring, or adding imports to any TypeScript/JavaScript file.
license: Apache-2.0
metadata:
    author: abconstrucciones
    version: 1.0.0
    scope: [client, server, root]
    auto_invoke: Adding or refactoring imports in any TypeScript/JavaScript file
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

## When to Use

Use this skill whenever you are adding new imports or cleaning up an existing file. This ensures consistency across the entire codebase (Client and Server).

## Critical Patterns

Imports MUST be organized into three distinct groups, separated by a single blank line.

| #   | Group                                                                                            | Examples                                                  |
| --- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| 1   | **External libraries**                                                                           | `@nestjs/common`, `typeorm`, `date-fns`, `react`, `zod`   |
| 2   | **Other modules** (cross-module paths, path aliases that are NOT from the same module)           | `@core/...`, `@modules/common/...`, `@modules/sector/...` |
| 3   | **Same module** (relative imports `../`, `./`, or alias paths that belong to the current module) | `../../interfaces`, `./licenses-request.mapper`           |

### Rules

- Each group must be separated by exactly one blank line.
- Within each group, try to maintain alphabetical order if possible.
- Avoid mixing relative paths with aliases if an alias is available for "Other modules".

## Code Example

```typescript
// 1. External libraries
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 2. Other modules
import { AuditModelType } from '@modules/shared/types/audit-model.type';
import { GrupoLocacionModel } from '@modules/grupo-locacion/models/grupo-locacion.model';

// 3. Same module
import { CreateActivoDto, UpdateActivoDto } from '../dtos';
import { ActivoMapper } from '../mappers';
import { ActivoModel } from './activo.model';
```

## Commands

```bash
# No specific command, this is a coding standard to apply during execution.
```
