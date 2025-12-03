
// Fix: Provided full implementation for the Spotlight effect component.
import React, { ReactNode } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

interface SpotlightProps {
  children: ReactNode;
}

const Spotlight: React.FC<SpotlightProps> = ({ children }) => {
  const { x, y } = useMousePosition();
  
  return (
    <div
      className="relative group/spotlight"
      style={
        {
          '--spotlight-x': `${x}px`,
          '--spotlight-y': `${y}px`,
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute bg-transparent 
      [background:radial-gradient(400px_circle_at_var(--spotlight-x)_var(--spotlight-y),_hsl(var(--accent-hsl)_/_0.08),_transparent_40%)]"
      />
      {children}
    </div>
  );
};

export default Spotlight;
