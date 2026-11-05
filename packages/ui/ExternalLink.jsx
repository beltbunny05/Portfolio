export function ExternalLink({ href, children, ...attributes }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...attributes}>
      {children}
    </a>
  );
}
