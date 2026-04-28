---
name: skill-sync
description: >
    Syncs skill metadata to AGENTS.md Auto-invoke sections.
    Trigger: When updating skill metadata (metadata.scope/metadata.auto_invoke), regenerating Auto-invoke tables, or running npx tsx skills/skill-sync/assets/sync.ts (including --dry-run/--scope).
license: Apache-2.0
metadata:
    author: materiapp
    version: '1.0.0'
    scope: [root]
    auto_invoke:
        - 'After creating/modifying a skill'
        - 'Regenerate AGENTS.md Auto-invoke tables (sync.sh)'
        - 'Troubleshoot why a skill is missing from AGENTS.md auto-invoke'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

## Purpose

Keeps AGENTS.md Auto-invoke sections in sync with skill metadata. When you create or modify a skill, run the sync script to automatically update all affected AGENTS.md files.

## Required Skill Metadata

Each skill that should appear in Auto-invoke sections needs these fields in `metadata`.

`auto_invoke` can be either a single string **or** a list of actions:

```yaml
metadata:
    author: materiapp
    version: '1.0.0'
    scope: [client] # Which AGENTS.md: client, server, root

    # Option A: single action
    auto_invoke: 'Creating/modifying components'

    # Option B: multiple actions
    # auto_invoke:
    #   - "Creating/modifying components"
    #   - "Refactoring component folder placement"
```

### Scope Values

| Scope    | Updates                 |
| -------- | ----------------------- |
| `root`   | `AGENTS.md` (repo root) |
| `client` | `client/AGENTS.md`      |
| `server` | `server/AGENTS.md`      |

Skills can have multiple scopes: `scope: [client, server]`

---

## Usage

### After Creating/Modifying a Skill

```bash
npx tsx skills/skill-sync/assets/sync.ts
```

### What It Does

1. Reads all `skills/*/SKILL.md` files
2. Extracts `metadata.scope` and `metadata.auto_invoke`
3. Generates Auto-invoke tables for each AGENTS.md
4. Updates the `### Auto-invoke Skills` section in each file

---

## Example

Given this skill metadata:

```yaml
# skills/materiapp-client/SKILL.md
metadata:
    author: materiapp
    version: '1.0.0'
    scope: [client]
    auto_invoke: 'Creating/modifying React components'
```

The sync script generates in `client/AGENTS.md`:

```markdown
### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                              | Skill              |
| ----------------------------------- | ------------------ |
| Creating/modifying React components | `materiapp-client` |
```

---

## Commands

```bash
# Sync all AGENTS.md files
npx tsx skills/skill-sync/assets/sync.ts

# Dry run (show what would change)
npx tsx skills/skill-sync/assets/sync.ts --dry-run

# Sync specific scope only
npx tsx skills/skill-sync/assets/sync.ts --scope client
```

---

## Checklist After Modifying Skills

- [ ] Added `metadata.scope` to new/modified skill
- [ ] Added `metadata.auto_invoke` with action description
- [ ] Ran `npx tsx skills/skill-sync/assets/sync.ts`
- [ ] Verified AGENTS.md files updated correctly
      correctly
