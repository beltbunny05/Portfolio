import { Section } from '@portfolio/ui';
import { education, experience, skills } from './career.ts';

function ExperienceSection() {
  return (
    <Section
      id="experience"
      number="03"
      label="Experience"
      title={
        <>
          Design and creative
          <br />
          background.
        </>
      }
    >
      <div className="entry-list">
        {experience.map((job) => (
          <article className="timeline-entry" key={`${job.company}-${job.role}`}>
            <div className="entry-period monospace">{job.period}</div>
            <div>
              <h3>{job.role}</h3>
              <p>{job.company}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function EducationSection() {
  return (
    <Section id="education" number="04" label="Education" title="Education & skills.">
      <div className="two-columns">
        <div className="entry-list">
          {education.map((course) => (
            <article className="timeline-entry timeline-entry--stacked" key={course.degree}>
              <div className="entry-period monospace">{course.period}</div>
              <h3>{course.degree}</h3>
              <p>{course.institution}</p>
            </article>
          ))}
        </div>
        <div className="entry-list">
          <div className="timeline-entry timeline-entry--stacked">
            <div className="entry-period monospace">Top skills</div>
            <p>{skills.join(' · ')}</p>
          </div>
          <div className="timeline-entry timeline-entry--stacked">
            <div className="entry-period monospace">Languages</div>
            <p>English, B2</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function CareerApp() {
  return (
    <>
      <ExperienceSection />
      <EducationSection />
    </>
  );
}
