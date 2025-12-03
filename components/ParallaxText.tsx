import React, { useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ParallaxTextProps {
  children: string;
  baseVelocity?: number;
}

const ParallaxText: React.FC<ParallaxTextProps> = ({ children, baseVelocity = 5 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // State for animation
  const x = useRef(0);
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;
      
      // Calculate velocity based on scroll speed with damping
      scrollVelocity.current = scrollVelocity.current * 0.9 + delta * 0.5;
      
      // Apply direction
      let direction = baseVelocity > 0 ? 1 : -1;
      let velocity = Math.abs(baseVelocity) + Math.abs(scrollVelocity.current);
      
      // Move x
      x.current += velocity * direction * -0.5; // Adjust speed factor here

      // Wrap around logic
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.offsetWidth / 2; // Assuming duplicated content
        if (x.current <= -textWidth) {
            x.current = 0;
        } else if (x.current > 0) {
            x.current = -textWidth;
        }
        
        containerRef.current.style.transform = `translateX(${x.current}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [baseVelocity]);

  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-4 opacity-10 pointer-events-none select-none">
      <div ref={containerRef} className="inline-flex will-change-transform">
        <div ref={textRef} className="flex gap-8">
            <span className="text-6xl md:text-8xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}>{children}</span>
            <span className="text-6xl md:text-8xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}>{children}</span>
            <span className="text-6xl md:text-8xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}>{children}</span>
            <span className="text-6xl md:text-8xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}>{children}</span>
        </div>
      </div>
    </div>
  );
};

export default ParallaxText;