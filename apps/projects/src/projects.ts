export interface Project {
  id: string;
  year: string;
  title: string;
  description: string;
  technologies: string[];
  problem: string;
  decision: string;
  outcome: string;
  sourceUrl?: string;
  demoUrl?: string;
  flow: string[];
}

export const projects: Project[] = [
  {
    id: 'habit-tracker',
    year: '2026',
    title: 'Habit Tracker',
    description:
      'A Java CLI for recording daily habits and calculating streaks, with layered architecture and JSON persistence.',
    technologies: ['Java', 'Maven', 'Gson', 'Strategy pattern'],
    problem: 'Keep habit tracking simple while making streak rules extensible.',
    decision:
      'Separate CLI, services, repositories and models. Use Strategy to add new streak calculations without rewriting the tracker.',
    outcome:
      'The public implementation provides the CLI and daily streak strategy. SQLite, a Spring Boot API and a React interface are planned next steps.',
    sourceUrl: 'https://github.com/beltbunny05/Java-CRUD-Simple',
    flow: ['CLI', 'Service + Strategy', 'Repository', 'JSON'],
  },
  {
    id: 'personal-finance',
    year: '2026',
    title: 'Personal Finance App',
    description:
      'A full-stack finance project with bank statement imports and a database schema using row-level security.',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'SQL'],
    problem: 'Bring bank statement data into a single personal finance workflow.',
    decision: 'Parse OFX and CSV statements and use row-level security in the database schema.',
    outcome: 'The project focuses on statement imports and data access boundaries.',
    flow: ['OFX / CSV', 'Parser', 'Application', 'Database + RLS'],
  },
  {
    id: 'portfolio',
    year: '2026',
    title: 'This portfolio',
    description:
      'A React portfolio composed from independently built microfrontends, with a shared visual language.',
    technologies: ['React', 'TypeScript', 'Vite', 'Playwright'],
    problem: 'Keep portfolio sections independent while presenting a coherent page.',
    decision:
      'Use a shell, URL-based ES modules, a typed mount contract and Shadow DOM style boundaries.',
    outcome:
      'Each remote can be built and deployed independently. The trade-off is extra runtime downloads and deployment coordination.',
    sourceUrl: 'https://github.com/beltbunny05/Portfolio',
    flow: ['Shell', 'URL manifest', 'Remote mount', 'Shadow DOM'],
  },
  {
    id: 'decorium',
    year: '2025 —',
    title: 'Decorium',
    description:
      'Creative direction for a themed-decoration studio in Franca, from concept to execution.',
    technologies: ['Visual direction', 'Design', '3D'],
    problem: 'Translate a decoration concept into a consistent visual experience.',
    decision: 'Connect visual direction, design and 3D work across the project.',
    outcome: 'Creative leadership spanning concept development and execution.',
    flow: ['Concept', 'Visual direction', 'Design + 3D', 'Execution'],
  },
];
