import { useEffect, useRef, type HTMLAttributes } from 'react';

type RevealProps = HTMLAttributes<HTMLElement> & { as?: 'div' | 'h2' };

export function Reveal({ as: Element = 'div', children, ...attributes }: RevealProps) {
  const elementRef = useRef<HTMLDivElement & HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || !elementRef.current) return;

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

    if (elementRef.current) observer.observe(elementRef.current);

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
