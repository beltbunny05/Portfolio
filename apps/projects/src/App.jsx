import { ExternalLink, Section } from '@portfolio/ui';
import { projects } from './projects.js';

function ProjectCard({ project }) {
  return (
    <article className="timeline-entry">
      <div className="entry-period monospace">{project.year}</div>
      <div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="technology-tags monospace">{project.technologies.join(' · ')}</div>
      </div>
    </article>
  );
}

export default function ProjectsApp() {
  return (
    <Section id="projects" number="02" label="Projects" title="Selected work.">
      <div className="entry-list">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
      <p className="section-action monospace">
        <ExternalLink className="text-link" href="https://github.com/beltbunny05">
          More on GitHub <span aria-hidden="true">↗</span>
        </ExternalLink>
      </p>
    </Section>
  );
}
