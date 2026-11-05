import { useEffect, useRef } from 'react';

export function Reveal({ as: Element = 'div', children, ...attributes }) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animation;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        animation = elementRef.current.animate(
          [
            { opacity: 0, transform: 'translateY(30px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 900, easing: 'ease-out' },
        );
        observer.disconnect();
      },
      { threshold: 0.05 },
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, []);

  return (
    <Element ref={elementRef} {...attributes}>
      {children}
    </Element>
  );
}
