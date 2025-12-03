import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, as: Component = 'h2', className = '' }) => {
  return (
    <div className="relative group inline-block">
      <Component 
        className={`glitch-text relative z-10 ${className}`} 
        data-text={text}
      >
        {text}
      </Component>
      
      {/* Additional Decoration Lines */}
      <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      <div className="absolute -bottom-2 left-0 w-1/3 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100 origin-left"></div>
    </div>
  );
};

export default GlitchText;