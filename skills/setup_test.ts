import test from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { execSync } from 'node:child_process';

/**
 * Suite de pruebas para setup.ts
 * Valida la creación de enlaces simbólicos y sincronización de AGENTS.md.
 */

const SETUP_SCRIPT_PATH = path.resolve(__dirname, 'setup.ts');
let TEST_DIR: string;

function setupTestEnv() {
  TEST_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-test-'));

  // Estructura mock
  const folders = [
    'skills/typescript',
    'skills/react-19',
    'api',
    'ui',
    '.github',
  ];
  folders.forEach(f => fs.mkdirSync(path.join(TEST_DIR, f), { recursive: true }));

  // Skills
  fs.writeFileSync(path.join(TEST_DIR, 'skills/typescript/SKILL.md'), '# TS');
  fs.writeFileSync(path.join(TEST_DIR, 'skills/react-19/SKILL.md'), '# React');

  // AGENTS.md
  fs.writeFileSync(path.join(TEST_DIR, 'AGENTS.md'), 'Root AGENTS');
  fs.writeFileSync(path.join(TEST_DIR, 'api/AGENTS.md'), 'API AGENTS');
  fs.writeFileSync(path.join(TEST_DIR, 'ui/AGENTS.md'), 'UI AGENTS');
}

function teardownTestEnv() {
  if (TEST_DIR && fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

function runSetup(args: string[] = []): string {
  const cmd = `npx tsx ${SETUP_SCRIPT_PATH} ${args.join(' ')}`;
  const output = execSync(cmd, { 
    env: { ...process.env, TEST_REPO_ROOT: TEST_DIR },
    encoding: 'utf-8' 
  });
  return output;
}

// =============================================================================
// TESTS
// =============================================================================

test('Suite de Configuración de Skills (setup.ts)', async (t) => {

  await t.test('Setup Claude (Junction y Symlinks)', () => {
    setupTestEnv();
    runSetup(['--claude']);

    const skillsLink = path.join(TEST_DIR, '.claude/skills');
    assert.ok(fs.existsSync(skillsLink), 'El enlace de skills debería existir');
    const stat = fs.lstatSync(skillsLink);
    assert.ok(stat.isSymbolicLink() || (process.platform === 'win32' && stat.isDirectory()), 'Debería ser un enlace');

    // Verificar sincronización de AGENTS.md -> CLAUDE.md
    assert.ok(fs.existsSync(path.join(TEST_DIR, 'CLAUDE.md')), 'Root CLAUDE.md debería existir');
    assert.ok(fs.existsSync(path.join(TEST_DIR, 'api/CLAUDE.md')), 'API CLAUDE.md debería existir');

    // Validar que es un enlace (si se pudo crear) o copia, y que el contenido coincide
    const originalContent = fs.readFileSync(path.join(TEST_DIR, 'AGENTS.md'), 'utf-8');
    const linkedContent = fs.readFileSync(path.join(TEST_DIR, 'CLAUDE.md'), 'utf-8');
    assert.strictEqual(originalContent, linkedContent, 'El contenido debe coincidir');

    teardownTestEnv();
  });

  await t.test('Idempotencia', () => {
    setupTestEnv();
    runSetup(['--claude']);
    const output = runSetup(['--claude']); // Segunda vez
    assert.ok(!output.includes('📦 Backup creado'), 'No debería crear backups si ya son enlaces');
    teardownTestEnv();
  });

  await t.test('Sincronización en tiempo real (si es link)', () => {
    setupTestEnv();
    runSetup(['--gemini']);

    const agentsPath = path.join(TEST_DIR, 'AGENTS.md');
    const geminiPath = path.join(TEST_DIR, 'GEMINI.md');

    if (fs.lstatSync(geminiPath).isSymbolicLink()) {
      fs.writeFileSync(agentsPath, 'Contenido Modificado');
      const newGeminiContent = fs.readFileSync(geminiPath, 'utf-8');
      assert.strictEqual(newGeminiContent, 'Contenido Modificado', 'Los cambios en AGENTS.md deben verse en GEMINI.md');
    } else {
      console.log('  ⚠️ Saltando validación de link real (entorno sin permisos de symlink)');
    }
    
    teardownTestEnv();
  });

  await t.test('Copilot (AGENTS.md -> .github/copilot-instructions.md)', () => {
    setupTestEnv();
    runSetup(['--copilot']);
    assert.ok(fs.existsSync(path.join(TEST_DIR, '.github/copilot-instructions.md')), 'Debería existir instrucciones de copilot');
    teardownTestEnv();
  });
});
