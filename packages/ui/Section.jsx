import { Reveal } from './Reveal.jsx';

export function Section({ id, number, label, title, children }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-heading`}>
      <div className="container section-grid">
        <p className="section-index">
          <b>{number}</b> / {label}
        </p>
        <div className="section-content">
          <Reveal as="h2" id={`${id}-heading`}>
            {title}
          </Reveal>
          {children}
        </div>
      </div>
    </section>
  );
}
