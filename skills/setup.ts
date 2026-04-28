import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Setup AI Skills for development
 * Configures AI assistants with symbolic links for skills and agents.
 */

// Configuración
const REPO_ROOT = process.env.TEST_REPO_ROOT || path.resolve(__dirname, '..');
const SKILLS_SOURCE = path.join(REPO_ROOT, 'skills');

const ASSISTANTS_CONFIG = {
    claude: { dir: '.claude', file: 'CLAUDE.md' },
    gemini: { dir: '.gemini', file: 'GEMINI.md' },
    codex: { dir: '.codex', file: null }, // Codex uses AGENTS.md natively
    copilot: { dir: '.github', file: 'copilot-instructions.md' },
};

// Argumentos CLI
const args = process.argv.slice(2);
const assistantsToSetup: string[] = [];

if (args.includes('--all')) {
    assistantsToSetup.push(...Object.keys(ASSISTANTS_CONFIG));
} else {
    if (args.includes('--claude')) assistantsToSetup.push('claude');
    if (args.includes('--gemini')) assistantsToSetup.push('gemini');
    if (args.includes('--codex')) assistantsToSetup.push('codex');
    if (args.includes('--copilot')) assistantsToSetup.push('copilot');
}

/**
 * Helper para crear enlaces simbólicos (Junctions para directorios en Windows).
 */
function createLink(source: string, target: string, isDirectory: boolean) {
    if (fs.existsSync(target)) {
        const stat = fs.lstatSync(target);
        const isSymlink = stat.isSymbolicLink();
        const isWinJunction = process.platform === 'win32' && stat.isDirectory() && !isSymlink; // Aproximación simple para junctions

        if (isSymlink || isWinJunction) {
            fs.rmSync(target, { recursive: true, force: true });
        } else if (!isDirectory) {
            // Si es un archivo regular, comparar contenido para evitar backups innecesarios
            const sourceContent = fs.readFileSync(source);
            const targetContent = fs.readFileSync(target);
            if (sourceContent.equals(targetContent)) {
                return; // Ya es igual, no hacer nada
            }
            const backup = `${target}.backup.${Date.now()}`;
            fs.renameSync(target, backup);
            console.log(`📦 Backup creado: ${path.relative(REPO_ROOT, backup)}`);
        } else {
            const backup = `${target}.backup.${Date.now()}`;
            fs.renameSync(target, backup);
            console.log(`📦 Backup creado: ${path.relative(REPO_ROOT, backup)}`);
        }
    }

    const parentDir = path.dirname(target);
    if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
    }

    if (isDirectory) {
        // En Windows usamos 'junction' para no requerir privilegios de admin
        const type = process.platform === 'win32' ? 'junction' : 'dir';
        fs.symlinkSync(source, target, type);
    } else {
        try {
            fs.symlinkSync(source, target, 'file');
        } catch (error: any) {
            if (process.platform === 'win32' && error.code === 'EPERM') {
                console.warn(
                    `⚠️ No se pudo crear symlink para archivo (se requiere modo desarrollador). Copiando en su lugar: ${path.relative(REPO_ROOT, target)}`,
                );
                fs.copyFileSync(source, target);
            } else {
                throw error;
            }
        }
    }
}

/**
 * Busca todos los archivos AGENTS.md en el repo (excluyendo node_modules y .git).
 */
function findAgentsMd(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
        if (file === 'node_modules' || file === '.git') continue;

        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(findAgentsMd(filePath));
        } else if (file === 'AGENTS.md') {
            results.push(filePath);
        }
    }
    return results;
}

function main() {
    console.log('🤖 AI Skills Setup');
    console.log('==================================\n');

    if (assistantsToSetup.length === 0) {
        console.log('❌ No se especificaron asistentes. Usa --all, --claude, --gemini, --codex o --copilot.');
        process.exit(1);
    }

    const agentsFiles = findAgentsMd(REPO_ROOT);
    console.log(`🔍 Encontrados ${agentsFiles.length} archivos AGENTS.md para sincronizar.\n`);

    for (const assistantKey of assistantsToSetup) {
        const config = ASSISTANTS_CONFIG[assistantKey as keyof typeof ASSISTANTS_CONFIG];
        console.log(`🚀 Configurando ${assistantKey.toUpperCase()}...`);

        // 1. Enlazar directorio de skills (si no es copilot, que no usa skills dir nativo)
        if (assistantKey !== 'copilot') {
            const assistantBaseDir = path.join(REPO_ROOT, config.dir);
            const skillsTarget = path.join(assistantBaseDir, 'skills');
            createLink(SKILLS_SOURCE, skillsTarget, true);
            console.log(`  ✅ ${config.dir}/skills -> skills/`);
        }

        // 2. Enlazar archivos de configuración (si aplica)
        if (config.file) {
            if (assistantKey === 'copilot') {
                const rootAgents = path.join(REPO_ROOT, 'AGENTS.md');
                if (fs.existsSync(rootAgents)) {
                    const targetPath = path.join(REPO_ROOT, '.github', config.file);
                    createLink(rootAgents, targetPath, false);
                    console.log(`  ✅ AGENTS.md -> .github/${config.file}`);
                }
            } else {
                let count = 0;
                for (const agentsFile of agentsFiles) {
                    const targetPath = path.join(path.dirname(agentsFile), config.file);
                    createLink(agentsFile, targetPath, false);
                    count++;
                }
                console.log(`  ✅ ${count} enlaces creados para ${config.file}`);
            }
        }
    }

    console.log('\n✨ Configuración finalizada exitosamente.');
}

main();
