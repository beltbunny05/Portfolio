export const contactEmail = 'VitorCCdesign@outlook.com';

export const navigationLinks = [
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
];

export type MicrofrontendName = 'profile' | 'projects' | 'career' | 'contact';
export type EntryUrls = Record<MicrofrontendName, string>;

export const microfrontends: { name: MicrofrontendName; label: string }[] = [
  { name: 'profile', label: 'Profile' },
  { name: 'projects', label: 'Projects' },
  { name: 'career', label: 'Career' },
  { name: 'contact', label: 'Contact' },
];
