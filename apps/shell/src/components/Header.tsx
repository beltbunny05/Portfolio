import { contactEmail, navigationLinks } from '../site.ts';

export function Header() {
  return (
    <header className="container site-header">
      <a className="site-brand" href="#top">
        Vitor Coelho
      </a>
      <nav className="navigation-links" aria-label="Main">
        {navigationLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="contact-link" href={`mailto:${contactEmail}`}>
        Get in touch <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
