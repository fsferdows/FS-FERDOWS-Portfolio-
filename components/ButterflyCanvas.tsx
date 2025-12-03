import React, { useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

const ButterflyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Lorenz System Parameters
    const sigma = 10;
    const rho = 28;
    const beta = 8 / 3;

    let x = 0.1;
    let y = 0;
    let z = 0;

    // Trail storage
    const points: {x: number, y: number, z: number}[] = [];
    const maxPoints = 1800; 

    let angle = 0; 

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        const w = canvas.parentElement.clientWidth;
        const h = canvas.parentElement.clientHeight;
        // Only update if dimensions are valid to prevent errors
        if (w > 0 && h > 0) {
            canvas.width = w;
            canvas.height = h;
            width = w;
            height = h;
        }
      }
    };

    // Projection helper
    const project = (px: number, py: number, pz: number) => {
      // Rotate around Z axis (visual rotation in 2D)
      const rad = angle;
      
      // Rotation
      const xRot = px * Math.cos(rad) - py * Math.sin(rad);
      // const yRot = px * Math.sin(rad) + py * Math.cos(rad); // Unused in this projection
      const zRot = pz;

      // Scale - prevent division by zero or negative
      const minDim = Math.min(width, height);
      const drawScale = (minDim > 0 ? minDim : 500) / 55;
      
      const xFinal = xRot;
      const yFinal = zRot - 25; // Center vertically

      return {
        x: width / 2 + xFinal * drawScale,
        y: height / 2 - yFinal * drawScale 
      };
    };

    const draw = () => {
        // Safety check
        if (width <= 0 || height <= 0) {
            animationFrameId = requestAnimationFrame(draw);
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Calculate next points
        const dt = 0.007;
        const steps = 5;

        for(let s=0; s<steps; s++) {
            const dx = sigma * (y - x) * dt;
            const dy = (x * (rho - z) - y) * dt;
            const dz = (x * y - beta * z) * dt;

            x += dx;
            y += dy;
            z += dz;
            
            // Prevent infinity/NaN issues if simulation explodes
            if(!isFinite(x) || !isFinite(y) || !isFinite(z)) {
                x = 0.1; y = 0; z = 0;
                points.length = 0;
            }

            points.push({ x, y, z });
            if (points.length > maxPoints) {
                points.shift();
            }
        }

        // Rotate slowly
        angle += 0.004;

        // Draw trail
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 1.5;

        if (points.length > 1) {
            ctx.beginPath();
            let p1 = project(points[0].x, points[0].y, points[0].z);
            ctx.moveTo(p1.x, p1.y);
            
            for (let i = 1; i < points.length; i++) {
                const p2 = project(points[i].x, points[i].y, points[i].z);
                ctx.lineTo(p2.x, p2.y);
            }
            
            // Dynamic gradient based on theme accent
            // Ensure valid finite coords for gradient
            try {
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, `hsla(var(--accent-hsl) / 0.2)`);
                gradient.addColorStop(0.5, `hsla(var(--accent-hsl) / 0.8)`);
                gradient.addColorStop(1, `hsla(var(--accent-hsl) / 0.2)`);
                
                ctx.strokeStyle = gradient;
                ctx.stroke();
            } catch (e) {
                // Fallback for gradient errors
                ctx.strokeStyle = 'rgba(100,100,255,0.5)';
                ctx.stroke();
            }
        }
        
        // Draw head (current position)
        if(points.length > 0) {
            const last = points[points.length-1];
            const pos = project(last.x, last.y, last.z);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 3, 0, Math.PI*2);
            ctx.fillStyle = `hsl(var(--accent-hsl))`;
            ctx.fill();
            
            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsl(var(--accent-hsl))`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    // Initial resize
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-60" />;
};

export default ButterflyCanvas;