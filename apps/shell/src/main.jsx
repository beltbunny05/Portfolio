import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { loadManifest } from './microfrontends/loadManifest.js';
import '@portfolio/ui/styles.css';

const root = createRoot(document.getElementById('root'));

async function startPortfolio() {
  root.render(
    <p className="container module-status" role="status">
      Loading portfolio…
    </p>,
  );

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
