import { ExternalLink, Reveal, Section } from '@portfolio/ui';
import { contactEmail, socialLinks } from './contact.ts';

export default function ContactApp() {
  return (
    <Section
      id="contact"
      number="05"
      label="Contact"
      title={
        <>
          Let’s talk about
          <br />
          your team.
        </>
      }
    >
      <Reveal className="two-columns">
        <a className="contact-email" href={`mailto:${contactEmail}`}>
          {contactEmail}
        </a>
        <div className="entry-list">
          {socialLinks.map((link) => (
            <ExternalLink
              className="timeline-entry timeline-entry--stacked"
              href={link.href}
              key={link.label}
            >
              <span className="detail-label">{link.label}</span>
              <span className="detail-value">
                {link.text} <span aria-hidden="true">↗</span>
              </span>
            </ExternalLink>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
