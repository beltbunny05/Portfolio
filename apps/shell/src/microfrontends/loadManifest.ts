import { microfrontends, type EntryUrls } from '../site.ts';

export async function loadManifest() {
  const response = await fetch(`${import.meta.env.BASE_URL}microfrontends.json`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Manifest request failed: HTTP ${response.status}`);

  const manifest: Record<string, unknown> = await response.json();
  const entryUrls = {} as EntryUrls;

  for (const { name } of microfrontends) {
    const entry = manifest[name];
    if (typeof entry !== 'string' || entry.trim() === '') {
      throw new Error(`Missing microfrontend URL: ${name}`);
    }

    const url = new URL(entry, window.location.href);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error(`Unsupported microfrontend URL: ${name}`);
    }
    entryUrls[name] = url.href;
  }

  return entryUrls;
}
