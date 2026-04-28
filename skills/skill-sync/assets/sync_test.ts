import test from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { execSync } from 'node:child_process';

/**
 * Suite de pruebas para sync.ts
 * Valida el descubrimiento de skills, extracción de metadatos y actualización de AGENTS.md.
 */

const SYNC_SCRIPT_PATH = path.resolve(__dirname, 'sync.ts');
let TEST_DIR: string;

/**
 * Setup: Crea un entorno de repositorio mock en una carpeta temporal.
 */
function setupTestEnv() {
  TEST_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-sync-test-'));

  // Estructura de carpetas
  const folders = [
    'skills/mock-ui-skill',
    'skills/mock-api-skill',
    'skills/mock-sdk-skill',
    'skills/mock-root-skill',
    'skills/mock-no-metadata',
    'skills/skill-sync/assets',
    'client',
    'server',
  ];

  folders.forEach(f => fs.mkdirSync(path.join(TEST_DIR, f), { recursive: true }));

  // Crear SKILL.md mocks
  const writeSkill = (name: string, scope: string, autoInvoke: string | string[]) => {
    const ai = Array.isArray(autoInvoke) 
      ? `\n    - ${autoInvoke.join('\n    - ')}`
      : ` ${autoInvoke}`;

    const content = `---
name: ${name}
description: Mock skill for testing.
metadata:
  author: test
  version: 1.0
  scope: [${scope}]
  auto_invoke:${ai}
---
# ${name} Content`;
    fs.writeFileSync(path.join(TEST_DIR, 'skills', name, 'SKILL.md'), content);
  };

  writeSkill('mock-ui-skill', 'client', 'Testing client components');
  writeSkill('mock-api-skill', 'server', 'Testing server endpoints');
  writeSkill('mock-sdk-skill', 'server', 'Testing server checks');
  writeSkill('mock-root-skill', 'root', 'Testing root actions');

  // Skill sin metadatos
  fs.writeFileSync(
    path.join(TEST_DIR, 'skills/mock-no-metadata/SKILL.md'),
    '---\nname: mock-no-metadata\n---\nNo meta'
  );

  // Crear AGENTS.md mocks
  const writeAgents = (relPath: string, title: string) => {
    const content = `# ${title}\n\n> [SKILL.md](some-path)\n\n## Section\nExisting content.`;
    fs.writeFileSync(path.join(TEST_DIR, relPath), content);
  };

  writeAgents('AGENTS.md', 'Root AGENTS');
  writeAgents('client/AGENTS.md', 'Client AGENTS');
  writeAgents('server/AGENTS.md', 'Server AGENTS');

  // Copiar el script real al entorno mock (o usar npx tsx directo contra el original)
  // Para los tests, ejecutaremos el script original pasándole el REPO_ROOT del mock vía env var o argumentos
  // Pero como sync.ts calcula REPO_ROOT relativo a su ubicación, es mejor inyectar el path.
}

/**
 * Teardown: Limpia el directorio temporal.
 */
function teardownTestEnv() {
  if (TEST_DIR && fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

/**
 * Ejecuta sync.ts contra el entorno mock.
 */
function runSync(args: string[] = []): string {
  // Hack: Usamos una variable de entorno para que sync.ts use nuestro TEST_DIR como REPO_ROOT
  // Modificamos ligeramente sync.ts para soportar esto si es necesario, o creamos un symlink.
  // Pero la forma más limpia es ejecutarlo y que él mismo descubra las cosas.
  
  // Como sync.ts usa path.resolve(__dirname, '../../..'), si lo corremos desde su ubicación
  // original, REPO_ROOT será el real. 
  // Vamos a modificar sync.ts para que acepte una variable de entorno override para los tests.
  const cmd = `npx tsx ${SYNC_SCRIPT_PATH} ${args.join(' ')}`;
  const output = execSync(cmd, { 
    env: { ...process.env, TEST_REPO_ROOT: TEST_DIR },
    encoding: 'utf-8' 
  });
  return output;
}

// Helpers de aserción
function assertFileContains(relPath: string, needle: string) {
  const content = fs.readFileSync(path.join(TEST_DIR, relPath), 'utf-8');
  assert.ok(content.includes(needle), `El archivo ${relPath} debería contener "${needle}"`);
}

function assertFileNotContains(relPath: string, needle: string) {
  const content = fs.readFileSync(path.join(TEST_DIR, relPath), 'utf-8');
  assert.ok(!content.includes(needle), `El archivo ${relPath} NO debería contener "${needle}"`);
}

// Actualizamos sync.ts para soportar TEST_REPO_ROOT
// (Esto lo haré en el siguiente turno de sdd-apply si es necesario, 
// por ahora asumimos que podemos inyectarlo o que el diseño permite override)

// =============================================================================
// TESTS
// =============================================================================

test('Suite de Sincronización de Skills', async (t) => {
  
  await t.test('Setup y Descubrimiento', () => {
    setupTestEnv();
    const output = runSync(['--dry-run']);
    assert.ok(output.includes('client\\AGENTS.md') || output.includes('client/AGENTS.md'));
    assert.ok(output.includes('server\\AGENTS.md') || output.includes('server/AGENTS.md'));
    teardownTestEnv();
  });

  await t.test('Filtro por --scope', () => {
    setupTestEnv();
    const output = runSync(['--scope', 'client', '--dry-run']);
    assert.ok(output.includes('client'), 'Debería mencionar el scope client');
    assert.ok(!output.includes('server'), 'NO debería procesar el server');
    teardownTestEnv();
  });

  await t.test('Extracción de Metadatos (Lista vs String)', () => {
    setupTestEnv();
    // Modificar una skill para tener lista
    const content = fs.readFileSync(path.join(TEST_DIR, 'skills/mock-ui-skill/SKILL.md'), 'utf-8');
    const newContent = content.replace('auto_invoke: Testing client components', 'auto_invoke:\n    - Action A\n    - Action B');
    fs.writeFileSync(path.join(TEST_DIR, 'skills/mock-ui-skill/SKILL.md'), newContent);

    runSync();

    assertFileContains('client/AGENTS.md', '| Action A | `mock-ui-skill` |');
    assertFileContains('client/AGENTS.md', '| Action B | `mock-ui-skill` |');
    teardownTestEnv();
  });

  await t.test('Preservación de contenido existente', () => {
    setupTestEnv();
    runSync();
    assertFileContains('client/AGENTS.md', '# Client AGENTS');
    assertFileContains('client/AGENTS.md', '## Section');
    assertFileContains('client/AGENTS.md', 'Existing content.');
    teardownTestEnv();
  });

  await t.test('Idempotencia', () => {
    setupTestEnv();
    runSync();
    const firstRun = fs.readFileSync(path.join(TEST_DIR, 'client/AGENTS.md'), 'utf-8');
    runSync();
    const secondRun = fs.readFileSync(path.join(TEST_DIR, 'client/AGENTS.md'), 'utf-8');
    assert.strictEqual(firstRun, secondRun, 'Múltiples ejecuciones deben producir el mismo resultado');
    teardownTestEnv();
  });

  await t.test('Actualización de sección existente', () => {
    setupTestEnv();
    runSync();
    
    // Cambiar la skill
    const skillPath = path.join(TEST_DIR, 'skills/mock-ui-skill/SKILL.md');
    fs.writeFileSync(skillPath, fs.readFileSync(skillPath, 'utf-8').replace('Testing client components', 'New Action'));
    
    runSync();
    assertFileContains('client/AGENTS.md', '| New Action | `mock-ui-skill` |');
    assertFileNotContains('client/AGENTS.md', 'Testing client components');
    teardownTestEnv();
  });
});
