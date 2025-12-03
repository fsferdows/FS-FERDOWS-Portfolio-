import { useRef, useEffect, RefObject } from 'react';

// --- Configuration for the 3D effect ---
// You can easily customize the effect by changing these values.
const defaultConfig = {
  maxRotation: 5,      // Max rotation in degrees (reduced for a slighter, more subtle effect).
  perspective: 1000,   // The perspective value for the 3D space.
  scale: 1.02,         // The scale factor on hover (subtle zoom).
  glowOpacity: 0.8,      // Max opacity of the glow effect for a subtle appearance.
  transitionSpeed: '0.1s', // Speed for transform changes during interaction.
  resetTransitionSpeed: '0.8s', // Speed for resetting the transform on mouse/focus leave.
};

// Defines the structure for layered elements, allowing each to have a ref and a Z-translation value.
interface LayeredElements {
  [key: string]: {
    ref: RefObject<HTMLElement>;
    translateZ: number; // How much the element "pops out" in pixels.
  };
}

/**
 * A custom React hook to apply an advanced 3D hover effect to a card component.
 * @param cardRef - A React ref to the main card element.
 * @param layers - An optional object containing refs to inner elements for a layered parallax effect.
 * @param isEnabled - Whether the 3D effect is enabled. Defaults to true.
 * @param configOverrides - Optional configuration overrides.
 */
export const use3dCardEffect = (
  cardRef: RefObject<HTMLElement>,
  layers?: LayeredElements,
  isEnabled: boolean = true,
  configOverrides: Partial<typeof defaultConfig> = {}
) => {
  const isInteracting = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  const config = { ...defaultConfig, ...configOverrides };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // If disabled, reset transforms immediately and cleanup
    if (!isEnabled) {
        card.style.transform = 'none';
        card.style.transition = 'transform 0.5s ease';
        card.style.setProperty('--glow-opacity', '0');
        if (layers) {
            Object.values(layers).forEach(layer => {
                if (layer.ref.current) {
                    layer.ref.current.style.transform = 'none';
                }
            });
        }
        return;
    }

    // Set the perspective on the card's parent to create the 3D context.
    const parent = card.parentElement;
    if (parent) {
      parent.style.perspective = `${config.perspective}px`;
    }

    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      if (!isInteracting.current) return;

      const { left, top, width, height } = card.getBoundingClientRect();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const x = clientX - left;
      const y = clientY - top;

      const rotateX = config.maxRotation * ((y / height) - 0.5) * -1; // Invert for natural feel
      const rotateY = config.maxRotation * ((x / width) - 0.5);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        // Apply transformations to the main card.
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${config.scale}, ${config.scale}, ${config.scale})`;
        
        // Update glow position via CSS variables.
        card.style.setProperty('--glow-x', `${x}px`);
        card.style.setProperty('--glow-y', `${y}px`);
        
        // Apply layered animation to inner elements with parallax translation.
        if(layers) {
            Object.values(layers).forEach(layer => {
                if (layer.ref.current) {
                    // Parallax Calculation:
                    // Calculate offset based on mouse position relative to center and Z-depth.
                    // Elements further out (higher translateZ) move more in the opposite direction of movement.
                    const xOffset = ((x - width / 2) / width) * layer.translateZ * 0.5; 
                    const yOffset = ((y - height / 2) / height) * layer.translateZ * 0.5;

                    layer.ref.current.style.transform = `
                        translateZ(${layer.translateZ}px) 
                        translateX(${-xOffset}px) 
                        translateY(${-yOffset}px) 
                        rotateX(${-rotateX * 0.5}deg) 
                        rotateY(${-rotateY * 0.5}deg)
                    `;
                }
            });
        }
      });
    };
    
    const startInteraction = (e: MouseEvent | TouchEvent) => {
        isInteracting.current = true;
        card.style.transition = `transform ${config.transitionSpeed} ease-out`;
        card.style.setProperty('--glow-opacity', config.glowOpacity.toString());

        if (layers) {
            Object.values(layers).forEach(layer => {
                if (layer.ref.current) {
                    layer.ref.current.style.transition = `transform ${config.transitionSpeed} ease-out`;
                }
            });
        }
        // For touch start, we need to call handleInteraction immediately
        if (e.type === 'touchstart') {
          handleInteraction(e);
        }
    };
    
    const endInteraction = () => {
        isInteracting.current = false;
        
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        
        // Reset card with a smooth, elastic-like transition.
        card.style.transition = `transform ${config.resetTransitionSpeed} cubic-bezier(0.23, 1, 0.32, 1)`;
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.setProperty('--glow-opacity', '0');
        
        // Reset layers.
        if (layers) {
            Object.values(layers).forEach(layer => {
                if (layer.ref.current) {
                    layer.ref.current.style.transition = `transform ${config.resetTransitionSpeed} cubic-bezier(0.23, 1, 0.32, 1)`;
                    layer.ref.current.style.transform = 'translateZ(0px) translateX(0) translateY(0) rotateX(0) rotateY(0)';
                }
            });
        }
    };
    
    // --- Accessibility: Keyboard focus provides a static, tilted state. ---
    const handleFocus = () => {
        card.style.transition = `transform ${config.resetTransitionSpeed} cubic-bezier(0.23, 1, 0.32, 1)`;
        card.style.transform = `rotateX(5deg) rotateY(-5deg) scale3d(${config.scale}, ${config.scale}, ${config.scale})`;
        card.style.setProperty('--glow-opacity', (config.glowOpacity * 0.7).toString());
        card.style.setProperty('--glow-x', `0px`);
        card.style.setProperty('--glow-y', `0px`);
    };

    // Add all event listeners
    card.addEventListener('mouseenter', startInteraction);
    card.addEventListener('mousemove', handleInteraction);
    card.addEventListener('mouseleave', endInteraction);
    card.addEventListener('touchstart', startInteraction, { passive: true });
    card.addEventListener('touchmove', handleInteraction, { passive: true });
    card.addEventListener('touchend', endInteraction);
    card.addEventListener('focus', handleFocus);
    card.addEventListener('blur', endInteraction);

    // --- Cleanup function to remove listeners when the component unmounts. ---
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      card.removeEventListener('mouseenter', startInteraction);
      card.removeEventListener('mousemove', handleInteraction);
      card.removeEventListener('mouseleave', endInteraction);
      card.removeEventListener('touchstart', startInteraction);
      card.removeEventListener('touchmove', handleInteraction);
      card.removeEventListener('touchend', endInteraction);
      card.removeEventListener('focus', handleFocus);
      card.removeEventListener('blur', endInteraction);
      // Note: We do NOT remove parent.style.perspective here.
      // In a grid layout, multiple cards share the same parent. 
      // Removing it would break the 3D effect for siblings.
    };
  }, [cardRef, layers, isEnabled, config.maxRotation, config.scale, config.perspective, config.glowOpacity, config.transitionSpeed, config.resetTransitionSpeed]);
};