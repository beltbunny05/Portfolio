import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { loadManifest } from './microfrontends/loadManifest.ts';
import '@portfolio/ui/styles.css';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('Missing application root.');
const root = createRoot(container);

async function startPortfolio() {
  // Keep build-time HTML visible while the remote manifest loads.
  if (!container?.hasChildNodes()) {
    root.render(
      <p className="container module-status" role="status">
        Loading portfolio…
      </p>,
    );
  }

  try {
    const entryUrls = await loadManifest();
    root.render(<App entryUrls={entryUrls} />);
  } catch (error) {
    console.error('Unable to start portfolio', error);
    root.render(
      <div className="container module-status" role="alert">
        Unable to load the portfolio.
        <button className="retry-button" type="button" onClick={startPortfolio}>
          Try again
        </button>
      </div>,
    );
  }
}

startPortfolio();
