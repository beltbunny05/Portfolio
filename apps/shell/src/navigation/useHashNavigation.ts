import { useCallback, useEffect, useRef } from 'react';

function findHashTarget() {
  let id;
  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return null;
  }
  if (!id) return null;

  const pageTarget = document.getElementById(id);
  if (pageTarget) return pageTarget;

  for (const host of document.querySelectorAll('[data-microfrontend]')) {
    const target = host.shadowRoot?.getElementById(id);
    if (target) return target;
  }
  return null;
}

export function useHashNavigation() {
  const frameRef = useRef<number | undefined>(undefined);

  const scrollToHash = useCallback(() => {
    if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      findHashTarget()?.scrollIntoView();
    });
  }, []);

  useEffect(() => {
    function handleAnchorClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      // composedPath includes links rendered inside a remote's Shadow DOM.
      const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
      const href = link?.getAttribute('href');
      if (!href?.startsWith('#')) return;

      // Repeated clicks on the current hash do not emit hashchange.
      if (href === window.location.hash) {
        event.preventDefault();
        scrollToHash();
      }
    }

    window.addEventListener('hashchange', scrollToHash);
    document.addEventListener('click', handleAnchorClick);
    scrollToHash();

    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('hashchange', scrollToHash);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [scrollToHash]);

  return scrollToHash;
}
