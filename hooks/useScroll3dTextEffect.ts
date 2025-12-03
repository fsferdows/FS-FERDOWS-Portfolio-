
import { useEffect, useRef, RefObject } from 'react';

// Configuration for the 3D text effect
const config = {
  maxShadowLayers: 8,
  maxShadowOffset: 8, // The maximum offset for the shadow in pixels
};

/**
 * A custom React hook to apply a dynamic, scroll-responsive 3D effect to a text element.
 * It works by layering `text-shadow`s and adjusting their offset based on the element's
 * position in the viewport, creating an illusion of tilting.
 * @param textRef - A React ref to the text element.
 */
export const useScroll3dTextEffect = (textRef: RefObject<HTMLElement>) => {
  const isVisible = useRef(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    let animationFrameId: number | null = null;

    const updateShadow = () => {
      // Only run the effect if the element is visible
      if (!isVisible.current || !element) return;

      // Use requestAnimationFrame to avoid layout thrashing and ensure smooth animations
      animationFrameId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate the element's center relative to the viewport's center.
        // The value ranges from -1 (top of viewport) to 1 (bottom of viewport), with 0 being the exact center.
        const elementCenter = rect.top + rect.height / 2;
        const scrollFactor = (elementCenter - viewportHeight / 2) / (viewportHeight / 2);
        const clampedFactor = Math.max(-1, Math.min(1, scrollFactor));
        
        // Generate a series of layered text-shadows to create the 3D effect
        let shadow = '';
        for (let i = 1; i <= config.maxShadowLayers; i++) {
          // The vertical offset of each shadow layer is determined by the scroll factor.
          const yOffset = clampedFactor * (i / config.maxShadowLayers) * config.maxShadowOffset;
          // The opacity decreases for layers that are further "behind".
          const opacity = 0.5 - (i / config.maxShadowLayers) * 0.4;
          
          shadow += `0px ${yOffset.toFixed(2)}px 0 hsla(var(--text-secondary-hsl), ${opacity.toFixed(2)})`;
          if (i < config.maxShadowLayers) {
            shadow += ', ';
          }
        }
        
        element.style.textShadow = shadow;
      });
    };

    // Use IntersectionObserver for performance: only listen to scroll when the element is in view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (isVisible.current) {
          window.addEventListener('scroll', updateShadow, { passive: true });
          updateShadow(); // Perform initial calculation when it becomes visible
        } else {
          window.removeEventListener('scroll', updateShadow);
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          // Reset the style when the element is off-screen for a clean fade-out.
          element.style.textShadow = 'none';
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    observer.observe(element);

    // Cleanup function to remove listeners and observer when the component unmounts.
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateShadow);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [textRef]);
};
