import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const viteExecutable = join(dirname(require.resolve('vite/package.json')), 'bin/vite.js');
const workspaceDirectory = fileURLToPath(new URL('../', import.meta.url));
const mode = process.argv[2];
const basePort = Number(process.env.PORTFOLIO_BASE_PORT ?? 5100);
if (!Number.isInteger(basePort) || basePort < 1024 || basePort > 65531)
  throw new Error('Invalid PORTFOLIO_BASE_PORT.');
const applications = [
  { name: 'shell', port: basePort },
  { name: 'profile', port: basePort + 1 },
  { name: 'projects', port: basePort + 2 },
  { name: 'career', port: basePort + 3 },
  { name: 'contact', port: basePort + 4 },
];
const remoteApplications = applications.filter((application) => application.name !== 'shell');
const runningProcesses = new Set();
let stopping = false;

if (!['dev', 'preview'].includes(mode)) {
  throw new Error('Usage: node scripts/serve.mjs <dev|preview>');
}

function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of runningProcesses) child.kill();
  process.exitCode = exitCode;
}

function startVite(application, argumentsList) {
  const child = spawn(process.execPath, [viteExecutable, ...argumentsList], {
    cwd: join(workspaceDirectory, 'apps', application.name),
    stdio: 'inherit',
  });
  runningProcesses.add(child);
  child.on('error', (error) => {
    console.error(`Could not start ${application.name}:`, error);
    stopAll(1);
  });
  child.on('exit', (code) => {
    runningProcesses.delete(child);
    if (code !== 0 && !stopping) stopAll(code ?? 1);
  });
  return child;
}

function buildRemote(application) {
  return new Promise((resolve, reject) => {
    const child = startVite(application, ['build']);
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Build failed: ${application.name}`));
    });
  });
}

process.on('SIGINT', () => stopAll());
process.on('SIGTERM', () => stopAll());

try {
  if (mode === 'dev') {
    await Promise.all(remoteApplications.map(buildRemote));
    if (!stopping) {
      // The shell consumes built modules in development, using the production mount contract.
      for (const application of remoteApplications) startVite(application, ['build', '--watch']);
    }
  }

  if (!stopping) {
    for (const application of applications) {
      const command = application.name === 'shell' && mode === 'dev' ? [] : ['preview'];
      startVite(application, [
        ...command,
        '--host',
        '127.0.0.1',
        '--port',
        String(application.port),
        '--strictPort',
      ]);
    }
  }
} catch (error) {
  console.error(error);
  stopAll(1);
}
