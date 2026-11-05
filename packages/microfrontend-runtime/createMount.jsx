import { Component, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

class RenderBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function MountedApplication({ Application, onReady }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return <Application />;
}

/**
 * Runtime contract: mount(host, { onReady?, onError? }) returns unmount().
 * Remotes own their React root; no React objects cross the app boundary.
 */
export function createMount(Application, styles) {
  return function mount(host, { onReady, onError } = {}) {
    const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    if (shadowRoot.childNodes.length > 0) {
      throw new Error('Unmount the existing microfrontend before mounting again.');
    }

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    const container = document.createElement('div');
    shadowRoot.append(styleElement, container);

    const root = createRoot(container);
    root.render(
      <RenderBoundary onError={onError}>
        <MountedApplication Application={Application} onReady={onReady} />
      </RenderBoundary>,
    );

    return function unmount() {
      root.unmount();
      shadowRoot.replaceChildren();
    };
  };
}
