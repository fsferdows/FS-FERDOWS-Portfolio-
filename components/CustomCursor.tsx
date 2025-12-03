import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null); // The dot
  const followerRef = useRef<HTMLDivElement>(null); // The ring
  const canvasRef = useRef<HTMLCanvasElement>(null); // The trail
  
  const { accentColor } = useTheme();
  
  // Physics State
  const mouse = useRef({ x: -100, y: -100 }); // Initialize off-screen
  const follower = useRef({ x: -100, y: -100, vx: 0, vy: 0 });
  const [hoverState, setHoverState] = useState<'default' | 'pointer' | 'text'>('default');
  
  // Particles for trail
  const particles = useRef<{x: number, y: number, vx: number, vy: number, life: number, color: string}[]>([]);

  useEffect(() => {
    let animationFrame: number;
    
    // Physics Configuration
    const spring = 0.15; // Strength of pull towards mouse
    const friction = 0.8; // Damping (0-1)
    
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      // Instant update for the dot
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Spawn particles on movement
      const speed = Math.hypot(e.movementX, e.movementY);
      if (speed > 2) {
          particles.current.push({
              x: e.clientX,
              y: e.clientY,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 1,
              life: 1.0,
              color: accentColor
          });
      }
    };

    const onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const computedStyle = window.getComputedStyle(target);
        
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || computedStyle.cursor === 'pointer') {
            setHoverState('pointer');
        } else if (target.tagName === 'P' || target.tagName === 'SPAN' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            setHoverState('text');
        } else {
            setHoverState('default');
        }
    };
    
    const onMouseDown = () => {
        if (followerRef.current) {
            followerRef.current.style.transform = `translate3d(${follower.current.x}px, ${follower.current.y}px, 0) scale(0.8)`;
        }
    };

    const onMouseUp = () => {
         if (followerRef.current) {
            followerRef.current.style.transform = `translate3d(${follower.current.x}px, ${follower.current.y}px, 0) scale(1)`;
        }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    const loop = () => {
        // Spring Physics for Follower
        const dx = mouse.current.x - follower.current.x;
        const dy = mouse.current.y - follower.current.y;
        
        follower.current.vx += dx * spring;
        follower.current.vy += dy * spring;
        
        follower.current.vx *= friction;
        follower.current.vy *= friction;
        
        follower.current.x += follower.current.vx;
        follower.current.y += follower.current.vy;
        
        if (followerRef.current) {
            // Magnetic effect logic could go here, for now simpler physics is cleaner
            followerRef.current.style.left = `${follower.current.x}px`;
            followerRef.current.style.top = `${follower.current.y}px`;
        }

        // Particle System
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.04; // Fade speed

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, Math.max(0, 2 * p.life), 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }
        }

        animationFrame = requestAnimationFrame(loop);
    };
    
    // Canvas Resize
    const handleResize = () => {
        if(canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    loop();

    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseover', onMouseOver);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrame);
    };
  }, [accentColor]);

  return (
    <>
        <style>{`
            .cursor-dot {
                position: fixed;
                top: 0;
                left: 0;
                width: 8px;
                height: 8px;
                background-color: hsl(var(--accent-hsl));
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                margin-top: -4px;
                margin-left: -4px;
                will-change: transform;
            }
            .cursor-follower {
                position: fixed;
                top: 0;
                left: 0;
                width: 40px;
                height: 40px;
                border: 1px solid hsl(var(--accent-hsl) / 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                margin-top: -20px;
                margin-left: -20px;
                will-change: left, top, transform, width, height, border-radius;
                transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-radius 0.3s ease;
                mix-blend-mode: difference;
            }
            .cursor-follower.pointer {
                width: 60px;
                height: 60px;
                margin-top: -30px;
                margin-left: -30px;
                background-color: hsl(var(--accent-hsl) / 0.15);
                border-color: transparent;
            }
            .cursor-follower.text {
                width: 4px;
                height: 24px;
                border-radius: 2px;
                margin-top: -12px;
                margin-left: -2px;
                background-color: hsl(var(--accent-hsl));
                border: none;
            }
            @media (hover: none) {
                .cursor-dot, .cursor-follower, .cursor-canvas { display: none; }
            }
        `}</style>
        <canvas ref={canvasRef} className="cursor-canvas fixed inset-0 pointer-events-none z-[9998]" />
        <div ref={cursorRef} className="cursor-dot hidden md:block" />
        <div ref={followerRef} className={`cursor-follower hidden md:block ${hoverState}`} />
    </>
  );
};

export default CustomCursor;