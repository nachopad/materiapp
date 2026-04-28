---
name: materiapp-server
description: >
  NestJS backend patterns for Materiapp: MongoDB/Mongoose, JWT + Google OIDC auth, role-based guards,
  DTOs with class-validator, Swagger decorators, and module architecture.
  Trigger: When creating or modifying modules in server/src/module/ involving Controllers, Services,
  Schemas, DTOs, Guards, or Decorators.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
  scope: [server]
  auto_invoke: Creating or modifying NestJS modules (Controllers, Services, Schemas, DTOs, Guards, Decorators)
---

## When to Use

Use this skill for all **Server-side** development in Materiapp:
- Implementing new CRUD modules (user, subject, career, college, enrollment)
- Adding business logic to Services
- Creating MongoDB schemas with Mongoose
- Managing API documentation via Swagger decorators
- Implementing authentication/authorization (JWT, Google OIDC, Local)
- Defining NestJS modules and dependency injection
- Working with DTOs, validation pipes, or custom decorators

**Also load these skills automatically based on context:**

| Context | Skill to load |
|---------|--------------|
| Writing or reviewing TypeScript types, interfaces, generics | `skills/typescript/SKILL.md` |
| Designing MongoDB schemas, writing Mongoose queries or aggregations | `skills/mongodb/SKILL.md` |
| NestJS architecture, DI patterns, modules, guards, pipes | `skills/nestjs-best-practices/SKILL.md` |
| Complex cross-field validation or external payload parsing (non-NestJS DTOs) | `skills/zod-4/SKILL.md` |

---

## Critical Rules

### TypeScript Strictness (load `skills/typescript/SKILL.md`)
- **Never use `any`** — use `unknown` for truly unknown types; use generics for flexibility.
- **Const maps for enums/choices** — define a `as const` object, then extract the union type via `typeof X[keyof typeof X]`. Never write bare union strings for domain values.
- **Flat interfaces** — one level of depth; nested objects get their own interface. No inline `{ street: string; city: string }` inside another interface.
- **Coupled optional props** — if two or more props are only meaningful together, use a discriminated union, not independent optionals.

### Input Validation & Transformation
- **class-validator first, Zod second** — NestJS DTOs use `class-validator` decorators (`@IsEmail`, `@IsString`, `@MinLength`, etc.). This is the project standard for HTTP request/response DTOs.
- **Zod boundary** — only reach for Zod when: (a) validating payloads from external services that bypass the NestJS pipe layer, (b) complex cross-field rules that are painful to express with class-validator, or (c) you need runtime type inference for downstream logic (e.g., form adapters, feature flags).
- **No Zod in DTOs** — DTOs in `dtos/` must use class-validator decorators, not Zod schemas. Keep Zod for pure utility validation at the service or infrastructure layer.
- Use `plainToInstance(DTO, data, { excludeExtraneousValues: true })` to transform Mongoose documents to DTOs.
- Use `@IsXssSafeString()` decorator from `@/module/common/decorators` to prevent XSS in string fields.
- Use custom pipes like `EmailValidationPipe` and `IdValidationPipe` for parametric validation.

### MongoDB / Mongoose (load `skills/mongodb/SKILL.md`)
- Define schemas with `@nestjs/mongoose` decorators (`@Prop()`, `@Schema()`), `timestamps: true`, and `HydratedDocument` typing.
- Define explicit indexes on frequently queried fields (compound indexes for common query patterns).
- Use `lean()` for read-only queries that don't need Mongoose hooks or document transformation.
- Schema `toJSON` transform must delete `password` and `__v`.
- Use `$lookup` aggregations for joins; avoid deep populate chains.
- Prefer `findOne`, `findById`, `countDocuments` over `find` + length checks.

### Authentication & Authorization
- ALWAYS use the `@Auth()` decorator on endpoints that need protection.
- `@Auth()` accepts optional roles: `@Auth(ROLE_ADMIN)` restricts to specific roles.
- `JwtAccessAuthGuard` validates JWT tokens; `RoleAuthGuard` checks roles from `@SetMetadata('roles', roles)`.
- CSRF protection is enabled via `@ApiSecurity('csrf-token')` on controllers.
- JWT payload contains `{ email, sub (userId) }` — access from `request.user` via `@User()` decorator.

### Swagger Documentation
- ALWAYS use `@ApiVersionHeader('1')` on controllers.
- Use `@ApiStandardResponse({ summary, type, status, isArray })` instead of raw `@ApiResponse`.
- Response DTOs should be in `dtos/index.ts` and imported cleanly.
- Example: `@ApiStandardResponse({ summary: 'Get user', type: UserResponseDTO, status: 200 })`.

### Module Structure & Dependencies
- Use `forwardRef()` ONLY when there's a true circular dependency between modules.
- Export tokens (interfaces) rather than full provider syntax in module `exports`.
- Each module follows: `controllers/`, `services/`, `schemas/`, `dtos/`, `pipes/`, `utils/`.
- Shared utilities go in `module/common/` (decorators, enums, pipes, constants).

### Response Transformation
- Controllers return DTO instances, not raw Mongoose documents.
- Use `plainToInstance` in controllers to serialize responses:
  ```typescript
  return plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
  ```

---

## Architecture

| Layer | Responsibility | Key Pattern |
|-------|---------------|-------------|
| **Controller** | Routing, @Auth guards, Swagger docs, DTO validation | `*.controller.ts` |
| **Service** | Business logic, DB operations, email/jwt handling | `*.service.ts` |
| **Schema** | MongoDB document definition with Mongoose | `*.schema.ts` |
| **DTO** | Request validation with class-validator | `*.dto.ts` |
| **Guard** | Auth strategy + role checking | `guards/*.ts` |
| **Decorator** | Custom HTTP or validation helpers | `module/common/decorators/` |
| **Pipe** | Parametric validation (email, id format) | `module/common/pipes/` |

### Module Structure
```
module/
├── user/
│   ├── controllers/user.controller.ts
│   ├── services/user.service.ts
│   ├── schemas/user.schema.ts
│   ├── dtos/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── user-response.dto.ts
│   └── user.module.ts
├── common/
│   ├── decorators/     (api-response, api-version, auth, cookies, xss-safe, unique-array, uuid-transform)
│   ├── enums/          (role.enum.ts)
│   ├── pipes/          (email-validation, id-validation)
│   └── constants/
├── auth/
│   ├── decorators/
│   ├── guards/
│   └── strategies/
└── [feature modules]/  (subject, career, college, enrollment, mail, security)
```

---

## Skill Integration Notes

When working on server code, these project skills are loaded alongside this one:

### `skills/typescript/SKILL.md` — apply when:
- Defining interfaces or types for module-scoped DTOs, events, or config objects
- Writing generic utility functions or type guards
- Refactoring `any` usage — reach for `unknown` + type guards
- Extracting union types from const maps

**Key rule:** All domain value unions (status, role, enum choices) must use the `as const` + `typeof X[keyof typeof X]` pattern — no bare string unions.

### `skills/mongodb/SKILL.md` — apply when:
- Defining or reviewing Mongoose schemas
- Writing aggregation pipelines (`$match`, `$group`, `$lookup`, `$facet`)
- Adding indexes or optimizing queries
- Using transactions for multi-document operations
- Deciding between embedded vs. referenced documents

**Key rule:** Lean queries for read-only paths; always project only needed fields; never return raw Mongoose documents from controllers.

### `skills/nestjs-best-practices/SKILL.md` — apply when:
- Resolving circular module dependencies or designing module boundaries
- Choosing between services (business logic) vs. repositories (data access)
- Configuring guards, interceptors, exception filters, or pipes globally
- Implementing authentication strategies (JWT, OAuth)
- Reviewing for architectural compliance

**Key rule:** Services own business logic; controllers are thin. Never put DB queries or business rules directly in controllers.

### `skills/zod-4/SKILL.md` — apply when:
- Validating external webhook payloads or third-party API responses that bypass the NestJS pipe layer
- Complex cross-field validation that is cumbersome with class-validator (e.g., conditional required, interdependent fields)
- Generating runtime types for feature flags, environment configs, or dynamic form schemas
- Migrating existing Zod v3 code to v4 syntax (`z.email()` not `z.string().email()`)

**Key rule:** Zod does NOT replace class-validator in DTOs. If it lives in `dtos/`, it uses decorators.

---

## Code Examples

### Controller Pattern
```typescript
@ApiVersionHeader('1')
@ApiSecurity('csrf-token')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiStandardResponse({ summary: 'Create user', type: UserResponseDTO, status: 201 })
  @Auth(ROLE_ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    return this.userService.create(createUserDto);
  }

  @Get(':email')
  @ApiStandardResponse({ summary: 'Find user', type: UserResponseDTO })
  @Auth()
  async findUserByEmail(
    @Param('email', new EmailValidationPipe()) email: string,
  ): Promise<UserResponseDTO> {
    const user = await this.userService.findUserByEmail(email);
    return plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
  }
}
```

### Service Pattern
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDTO> {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = new this.userModel({ ...dto, password: hashedPassword });
    const saved = await user.save();
    return plainToInstance(UserResponseDTO, saved, { excludeExtraneousValues: true });
  }
}
```

### Module Pattern (with circular dep)
```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Career.name, schema: CareerSchema }]),
    forwardRef(() => CollegeModule),
    SubjectModule,
  ],
  controllers: [CareerController],
  providers: [CareerService],
  exports: [CareerService],
})
export class CareerModule {}
```

### DTO Pattern
```typescript
export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @IsXssSafeString('Name contains invalid characters')
  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({ description: 'Email', example: 'john@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @ApiProperty({ description: 'Password', example: 'password123' })
  password: string;
}
```

### Auth Decorator Usage
```typescript
// Public endpoint
@Auth()  // Requires valid JWT but no role restriction

// Role-restricted
@Auth(ROLE_ADMIN)  // Requires JWT + admin role

// Guard layers: JwtAccessAuthGuard (token) → RoleAuthGuard (role check via SetMetadata)
```

---

## Decision Trees

### Where to put logic?
```
HTTP concerns (routing, params)          → Controller
Business rules (password, state)        → Service
Cross-field validation                 → Custom validator or Service
DB existence/uniqueness                 → Service (Mongoose query)
Parametric format (email, ID)           → Pipe (@UsePipes)
Input sanitization (XSS)                → @IsXssSafeString() on DTO
```

### Module dependency resolution
```
Need Module A in Module B?
  └── Real circular dependency (A needs B AND B needs A)?
      └── YES → use forwardRef(() => A) in BOTH modules
      └── NO  → direct import only
```

### What to export?
```
Only Service needed externally         → exports: [IService]
Repository also needed                 → exports: [IService, IRepository]
No controller (utility module)         → exports: [{ provide: IRepository, useClass: Repository }]
```

---

## Commands

```bash
# Run server in dev mode
cd server && pnpm run start:dev

# Run tests
cd server && pnpm run test

# Run lint (check only)
cd server && pnpm run lint
```

---

## Resources

- **NestJS Docs**: https://docs.nestjs.com
- **Mongoose Schemas**: `server/src/module/*/schemas/*.schema.ts`
- **Auth Guards**: `server/src/module/auth/guards/`
- **Custom Decorators**: `server/src/module/common/decorators/`
- **Validation Pipes**: `server/src/module/common/pipes/`
- **TypeScript Skill**: `skills/typescript/SKILL.md` — const maps, flat interfaces, no `any`
- **MongoDB Skill**: `skills/mongodb/SKILL.md` — schema design, aggregation, indexing
- **NestJS Best Practices Skill**: `skills/nestjs-best-practices/SKILL.md` — architecture, DI, security
- **Zod 4 Skill**: `skills/zod-4/SKILL.md` — external validation, complex cross-field rules