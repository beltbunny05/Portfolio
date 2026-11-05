import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { ScrollProgress } from './components/ScrollProgress.jsx';
import { MicrofrontendSlot } from './microfrontends/MicrofrontendSlot.jsx';
import { useHashNavigation } from './navigation/useHashNavigation.js';
import { microfrontends } from './site.js';

export default function ShellApp({ entryUrls }) {
  const scrollToHash = useHashNavigation();

  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <ScrollProgress />
      <Header />
      <main id="top" tabIndex={-1}>
        {microfrontends.map(({ name, label }) => (
          <MicrofrontendSlot
            key={name}
            name={name}
            label={label}
            entryUrl={entryUrls[name]}
            onReady={scrollToHash}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}
