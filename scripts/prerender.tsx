import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import Profile from '../apps/profile/src/App.tsx';
import Projects from '../apps/projects/src/App.tsx';
import Career from '../apps/career/src/App.tsx';
import Contact from '../apps/contact/src/App.tsx';
import { Header } from '../apps/shell/src/components/Header.tsx';
import { Footer } from '../apps/shell/src/components/Footer.tsx';
import { education, experience, skills } from '../apps/career/src/career.ts';
import { contactEmail, socialLinks } from '../apps/contact/src/contact.ts';
import { projects } from '../apps/projects/src/projects.ts';

const workspace = fileURLToPath(new URL('../', import.meta.url));
const path = (relative: string) => `${workspace}${relative}`;
const resumeOnly = process.argv.includes('--resume-only');
const siteUrl = process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined;
if (siteUrl && !['http:', 'https:'].includes(siteUrl.protocol))
  throw new Error('SITE_URL must be an HTTP(S) URL.');

function Resume() {
  return (
    <>
      <header>
        <p>Vitor Coelho</p>
        <h1>Software Engineer</h1>
        <p>Java · JavaScript · React · Franca, Brazil</p>
        <p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
        <nav>
          {socialLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.text}
            </a>
          ))}
        </nav>
      </header>
      <main>
        <section>
          <h2>Profile</h2>
          <p>
            I build software with layered architecture and a focus on usability. My graphic design
            background informs how I connect structure, visual hierarchy and implementation. Open to
            roles in Europe.
          </p>
        </section>
        <section>
          <h2>Selected projects</h2>
          {projects
            .filter((project) => project.id !== 'decorium')
            .map((project) => (
              <article key={project.id}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p>{project.technologies.join(' · ')}</p>
                {project.sourceUrl && <a href={project.sourceUrl}>{project.sourceUrl}</a>}
              </article>
            ))}
        </section>
        <section>
          <h2>Experience</h2>
          {experience.map((job) => (
            <article key={job.company}>
              <h3>{job.role}</h3>
              <p>
                {job.company} · {job.period}
              </p>
            </article>
          ))}
        </section>
        <section>
          <h2>Education</h2>
          {education.map((course) => (
            <article key={course.degree}>
              <h3>{course.degree}</h3>
              <p>
                {course.institution} · {course.period}
              </p>
            </article>
          ))}
        </section>
        <section>
          <h2>Skills & languages</h2>
          <p>{skills.join(' · ')}</p>
          <p>English: B2</p>
        </section>
      </main>
      <button type="button" id="print-resume">
        Print / Save as PDF
      </button>
    </>
  );
}

const resumeCss = `*{box-sizing:border-box}body{max-width:840px;margin:40px auto;padding:0 24px;font:15px/1.6 system-ui,sans-serif;color:#15222a;background:#fff}h1{font-size:34px;margin:0}h2{font-size:19px;border-bottom:1px solid #ccd2d5;padding-bottom:6px;margin-top:28px}h3{font-size:16px;margin:14px 0 4px}p{margin:4px 0 10px}a{color:#153c59;overflow-wrap:anywhere}nav{display:flex;flex-wrap:wrap;gap:6px 24px}article{break-inside:avoid}button{margin:24px 0;padding:12px 20px;border:1px solid #15222a;background:white;cursor:pointer;font:inherit}@media print{body{margin:0;max-width:none;font-size:11px}h1{font-size:25px}h2{margin-top:14px}button{display:none}@page{size:A4;margin:14mm}}`;
const resume =
  '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vitor Coelho — Résumé</title><style>' +
  resumeCss +
  '</style></head><body>' +
  renderToStaticMarkup(<Resume />) +
  '<script src="./resume.js"></script></body></html>';
const printScript =
  "document.getElementById('print-resume').addEventListener('click', () => window.print());";

if (!resumeOnly) {
  // Build-time content is a snapshot; browser composition still loads independent URLs.
  const remoteStyles = await Promise.all(
    ['profile', 'projects', 'contact'].map((name) =>
      readFile(path(`apps/${name}/src/styles.css`), 'utf8'),
    ),
  );
  const initialContent = renderToStaticMarkup(
    <>
      <style>{remoteStyles.join('\n')}</style>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <Header />
      <main id="top" tabIndex={-1}>
        <Profile />
        <Projects />
        <Career />
        <Contact />
      </main>
      <Footer />
    </>,
  );
  const indexPath = path('apps/shell/dist/index.html');
  let html = await readFile(indexPath, 'utf8');
  const emptyRoot = '<div id="root"></div>';
  if (!html.includes(emptyRoot))
    throw new Error('Expected an empty shell root. Run the Vite build before prerendering.');
  html = html.replace(emptyRoot, () => `<div id="root">${initialContent}</div>`);
  if (siteUrl) {
    const canonical = siteUrl.href.endsWith('/') ? siteUrl.href : siteUrl.href + '/';
    html = html.replaceAll(
      'content="/social-card.png"',
      `content="${new URL('social-card.png', canonical).href}"`,
    );
    html = html.replace(
      '</head>',
      `<link rel="canonical" href="${canonical}" /><meta property="og:url" content="${canonical}" /></head>`,
    );
  }
  await writeFile(indexPath, html);
}
for (const directory of resumeOnly
  ? ['apps/shell/public']
  : ['apps/shell/public', 'apps/shell/dist']) {
  await mkdir(path(directory), { recursive: true });
  await writeFile(path(`${directory}/resume.html`), resume);
  await writeFile(path(`${directory}/resume.js`), printScript);
}
console.log('Generated printable résumé' + (resumeOnly ? '.' : ' and initial portfolio HTML.'));
