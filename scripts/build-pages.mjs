import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const workspace = fileURLToPath(new URL('../', import.meta.url));
const repository = process.env.GITHUB_REPOSITORY || 'beltbunny05/Portfolio';
const [owner, name] = repository.split('/');
const defaultBase = name.toLowerCase() === `${owner}.github.io`.toLowerCase() ? '/' : `/${name}/`;
const base = process.env.PAGES_BASE_PATH || defaultBase;
if (!base.startsWith('/') || !base.endsWith('/') || base.includes('..')) {
  throw new Error('PAGES_BASE_PATH must be an absolute path ending in /.');
}
const siteUrl = process.env.SITE_URL || `https://${owner}.github.io${base}`;
if (!process.env.npm_execpath) throw new Error('Run this script with npm run build:pages.');

const build = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], {
  cwd: workspace,
  stdio: 'inherit',
  env: { ...process.env, PAGES_BASE_PATH: base, SITE_URL: siteUrl },
});
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

const output = join(workspace, 'dist', 'pages');
await mkdir(output, { recursive: true });
await cp(join(workspace, 'apps/shell/dist'), output, { recursive: true });
const manifest = {};
for (const remote of ['profile', 'projects', 'career', 'contact']) {
  await cp(join(workspace, `apps/${remote}/dist`), join(output, 'remotes', remote), {
    recursive: true,
  });
  manifest[remote] = `./remotes/${remote}/entry.js`;
}
await writeFile(join(output, 'microfrontends.json'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(join(output, '.nojekyll'), '');
const html = await readFile(join(output, 'index.html'), 'utf8');
if (!html.includes('Selected work.') || html.includes('127.0.0.1')) {
  throw new Error('Invalid Pages output: missing content or local URLs.');
}
console.log(`Pages artifact: dist/pages → ${siteUrl}`);
