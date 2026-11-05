import type { AnchorHTMLAttributes } from 'react';
export function ExternalLink({
  href,
  children,
  ...attributes
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...attributes}>
      {children}
    </a>
  );
}
