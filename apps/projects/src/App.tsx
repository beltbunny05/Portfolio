import { ExternalLink, Section } from '@portfolio/ui';
import { projects, type Project } from './projects.ts';

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="timeline-entry project-card">
      <div className="entry-period monospace">{project.year}</div>
      <div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="technology-tags monospace">{project.technologies.join(' · ')}</div>
        <figure className="project-flow">
          <ol>
            {project.flow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <figcaption>Workflow overview</figcaption>
        </figure>
        <details className="project-details">
          <summary>
            Read the case study <span className="visually-hidden">for {project.title}</span>
          </summary>
          <dl>
            <dt>Problem</dt>
            <dd>{project.problem}</dd>
            <dt>Decision</dt>
            <dd>{project.decision}</dd>
            <dt>Current scope</dt>
            <dd>{project.outcome}</dd>
          </dl>
        </details>
        {(project.sourceUrl || project.demoUrl) && (
          <div className="project-links">
            {project.sourceUrl && (
              <ExternalLink className="text-link" href={project.sourceUrl}>
                Source code <span className="visually-hidden">for {project.title}</span>
                <span aria-hidden="true">↗</span>
              </ExternalLink>
            )}
            {project.demoUrl && (
              <ExternalLink className="text-link" href={project.demoUrl}>
                Live demo <span className="visually-hidden">of {project.title}</span>
                <span aria-hidden="true">↗</span>
              </ExternalLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ProjectsApp() {
  return (
    <Section id="projects" number="02" label="Projects" title="Selected work.">
      <div className="entry-list">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
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
