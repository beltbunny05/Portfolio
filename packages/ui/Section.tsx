import type { ReactNode } from 'react';
import { Reveal } from './Reveal.tsx';

interface SectionProps {
  id: string;
  number: string;
  label: string;
  title: ReactNode;
  children: ReactNode;
}

export function Section({ id, number, label, title, children }: SectionProps) {
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
