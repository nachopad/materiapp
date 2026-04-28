import * as fs from 'fs';
import * as path from 'path';

// Interfaces
interface SkillMetadata {
    name: string;
    scope: string[];
    autoInvoke: string[];
}

interface ScopeMap {
    [scope: string]: {
        action: string;
        skill: string;
    }[];
}

// Configuración
const REPO_ROOT = process.env.TEST_REPO_ROOT || path.resolve(__dirname, '../../..');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');

const AGENTS_PATHS: Record<string, string> = {
    root: path.join(REPO_ROOT, 'AGENTS.md'),
    client: path.join(REPO_ROOT, 'client/AGENTS.md'),
    server: path.join(REPO_ROOT, 'server/AGENTS.md'),
};

// Argumentos CLI
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const filterScopeArg = args.find((arg, i) => args[i - 1] === '--scope');

/**
 * Descubre recursivamente todos los archivos SKILL.md en el directorio de skills.
 */
function discoverSkills(dir: string): string[] {
    const results: string[] = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            const skillFile = path.join(filePath, 'SKILL.md');
            if (fs.existsSync(skillFile)) {
                results.push(skillFile);
            }
        }
    }
    return results;
}

/**
 * Extrae metadatos del frontmatter de un archivo SKILL.md usando Regex.
 */
function extractMetadata(filePath: string): SkillMetadata | null {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---([\s\S]*?)---/);

    if (!frontmatterMatch) return null;

    const frontmatter = frontmatterMatch[1];

    // Extraer name
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    const name = nameMatch ? nameMatch[1].trim() : path.basename(path.dirname(filePath));

    // Extraer scope (soporta [a, b] o línea simple)
    const scopeMatch = frontmatter.match(/scope:\s*\[?([^\]\n]+)\]?/);
    const scope = scopeMatch ? scopeMatch[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')) : [];

    // Extraer auto_invoke (soporta string simple o lista con guiones)
    let autoInvoke: string[] = [];
    const autoInvokeBlockMatch = frontmatter.match(/auto_invoke:\s*([\s\S]*?)(?=\n[a-z]|---|$)/);

    if (autoInvokeBlockMatch) {
        const block = autoInvokeBlockMatch[1].trim();
        if (block.startsWith('-')) {
            // Es una lista
            autoInvoke = block
                .split('\n')
                .map((line) =>
                    line
                        .replace(/^\s*-\s*/, '')
                        .trim()
                        .replace(/^["']|["']$/g, ''),
                )
                .filter((line) => line !== '');
        } else {
            // Es un string simple
            autoInvoke = [block.replace(/^["']|["']$/g, '')];
        }
    }

    return { name, scope, autoInvoke };
}

/**
 * Genera la tabla Markdown de Auto-invoke.
 */
function generateTable(entries: { action: string; skill: string }[]): string {
    if (entries.length === 0) return '';

    const sortedEntries = [...entries].sort((a, b) => a.action.localeCompare(b.action));

    let table = '### Auto-invoke Skills\n\n';
    table += 'When performing these actions, ALWAYS invoke the corresponding skill FIRST:\n\n';
    table += '| Action | Skill |\n';
    table += '|--------|-------|\n';

    for (const entry of sortedEntries) {
        table += `| ${entry.action} | \`${entry.skill}\` |\n`;
    }

    return table;
}

/**
 * Normaliza headers legacy (## Auto-invoke Skills -> ### Auto-invoke Skills).
 * Elimina duplicados históricos de secciones Auto-invoke.
 */
function normalizeLegacyHeaders(content: string): string {
    // Elimina bloques legacy de Auto-invoke (h2 o h3 duplicados)
    // hasta el próximo heading de cualquier nivel, separador o EOF.
    const legacySectionPattern = /^##?\s+Auto-invoke Skills[\s\S]*?(?=^#{1,6}\s|^---\s*$|\Z)/gim;
    return content.replace(legacySectionPattern, '');
}

function cleanupMarkdownArtifacts(content: string): string {
    return (
        content
            .replace(/^\s*#\s*$/gm, '') // elimina líneas con solo "#"
            .replace(/([^\n])\n(### Auto-invoke Skills\b)/g, '$1\n\n$2') // <-- NUEVA
            .replace(/\n{3,}/g, '\n\n') // compacta saltos múltiples
            .trimEnd() + '\n'
    );
}

/**
 * Actualiza o inserta la sección en el archivo AGENTS.md.
 */
function updateAgentsFile(filePath: string, tableContent: string) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Archivo no encontrado: ${filePath}`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf-8');
    // Normalizar headers legacy primero
    content = normalizeLegacyHeaders(content);
    const sectionHeader = '### Auto-invoke Skills';
    let newContent: string;
    if (content.includes(sectionHeader)) {
        // Reemplazar sección existente hasta próximo heading (cualquier nivel), separador o EOF
        const sectionRegex = /^### Auto-invoke Skills[\s\S]*?(?=^#{1,6}\s|^---\s*$|\Z)/m;
        newContent = content.replace(sectionRegex, tableContent.trim());
    } else {
        // Insertar después de la descripción o al final
        if (content.includes('> [SKILL.md]')) {
            newContent = content.replace(/(> \[SKILL\.md\].*?\n)/, `$1\n${tableContent.trim()}\n`);
        } else {
            newContent = content.trim() + '\n\n' + tableContent.trim() + '\n';
        }
    }
    // Limpieza final para evitar artefactos tipo "#"
    newContent = cleanupMarkdownArtifacts(newContent);
    if (isDryRun) {
        console.log(`\n[DRY RUN] Cambios para ${path.relative(REPO_ROOT, filePath)}:`);
        console.log(tableContent);
    } else {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`✅ Actualizado: ${path.relative(REPO_ROOT, filePath)}`);
    }
}

// Lógica Principal
function main() {
    console.log(`🚀 Iniciando sincronización de skills (Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'})...`);

    const skillFiles = discoverSkills(SKILLS_DIR);
    const scopeMap: ScopeMap = {};

    for (const file of skillFiles) {
        const metadata = extractMetadata(file);
        if (!metadata || metadata.scope.length === 0 || metadata.autoInvoke.length === 0) continue;

        for (const scope of metadata.scope) {
            if (filterScopeArg && scope !== filterScopeArg) continue;

            if (!scopeMap[scope]) scopeMap[scope] = [];

            for (const action of metadata.autoInvoke) {
                scopeMap[scope].push({ action, skill: metadata.name });
            }
        }
    }

    for (const [scope, entries] of Object.entries(scopeMap)) {
        const agentsPath = AGENTS_PATHS[scope];
        if (agentsPath) {
            const table = generateTable(entries);
            updateAgentsFile(agentsPath, table);
        } else {
            console.warn(`⚠️ Scope desconocido: ${scope}`);
        }
    }

    console.log('\n✨ Sincronización completada.');
}

main();
