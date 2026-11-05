import { Footer } from './components/Footer.tsx';
import { Header } from './components/Header.tsx';
import { ScrollProgress } from './components/ScrollProgress.tsx';
import { MicrofrontendSlot } from './microfrontends/MicrofrontendSlot.tsx';
import { useHashNavigation } from './navigation/useHashNavigation.ts';
import { microfrontends, type EntryUrls } from './site.ts';

export default function ShellApp({ entryUrls }: { entryUrls: EntryUrls }) {
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
