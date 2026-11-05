import { useEffect, useRef, useState } from 'react';

export function MicrofrontendSlot({ name, label, entryUrl, onReady }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    let disposed = false;
    let unmount;
    let timeout;
    setStatus('loading');

    function reportFailure(error) {
      if (disposed) return;
      clearTimeout(timeout);
      console.error(`Unable to load microfrontend: ${name}`, error);
      setStatus('error');
    }

    async function loadRemote() {
      try {
        const url = new URL(entryUrl);
        // Browsers cache failed module imports; a new URL permits a fresh attempt.
        if (attempt > 0) url.searchParams.set('retry', String(attempt));
        const remote = await import(/* @vite-ignore */ url.href);
        if (disposed) return;
        if (typeof remote.mount !== 'function') {
          throw new Error(`${name} must export a mount function.`);
        }

        unmount = remote.mount(host, {
          onReady() {
            if (disposed) return;
            clearTimeout(timeout);
            setStatus('ready');
            onReady();
          },
          onError: reportFailure,
        });
        if (typeof unmount !== 'function')
          throw new Error(`${name}.mount must return an unmount function.`);
      } catch (error) {
        reportFailure(error);
      }
    }

    timeout = setTimeout(() => reportFailure(new Error('Loading timed out.')), 15000);
    loadRemote();

    return () => {
      disposed = true;
      clearTimeout(timeout);
      unmount?.();
    };
  }, [name, entryUrl, attempt, onReady]);

  return (
    <div aria-busy={status === 'loading'}>
      <div ref={hostRef} data-microfrontend={name} />
      {status === 'loading' && (
        <p className="container module-status" role="status">
          Loading {label.toLowerCase()}…
        </p>
      )}
      {status === 'error' && (
        <div className="container module-status" role="alert">
          Unable to load this section ({label.toLowerCase()}).
          <button
            className="retry-button"
            type="button"
            onClick={() => setAttempt((previous) => previous + 1)}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
