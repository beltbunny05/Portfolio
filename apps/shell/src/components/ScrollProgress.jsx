import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    let animationFrame;
    const documentRoot = document.documentElement;
    const previousGlow = documentRoot.style.getPropertyValue('--glow');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function updateProgress() {
      const scrollableHeight = documentRoot.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      progressRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;

      if (!reducedMotion.matches) {
        const glow = Math.max(0.04, 0.6 - window.scrollY / window.innerHeight);
        documentRoot.style.setProperty('--glow', String(glow));
      }
    }

    function scheduleUpdate() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateProgress);
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.body);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateProgress();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (previousGlow) documentRoot.style.setProperty('--glow', previousGlow);
      else documentRoot.style.removeProperty('--glow');
    };
  }, []);

  return <div ref={progressRef} id="scroll-progress" aria-hidden="true" />;
}
