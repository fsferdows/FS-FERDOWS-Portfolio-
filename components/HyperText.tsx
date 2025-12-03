import React, { useEffect, useState } from 'react';

interface HyperTextProps {
  text: string;
  className?: string;
  duration?: number;
  as?: React.ElementType;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

const HyperText: React.FC<HyperTextProps> = ({ text, className, duration = 800, as = 'span' }) => {
  const [displayText, setDisplayText] = useState(text);
  const [iterations, setIterations] = useState(0);
  const Component = as as any;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const animate = () => {
        interval = setInterval(() => {
            setDisplayText((current) => 
                text.split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return text[index];
                    }
                    return alphabets[Math.floor(Math.random() * alphabets.length)];
                })
                .join("")
            );

            if (iterations >= text.length) {
                clearInterval(interval);
            }

            setIterations(prev => prev + 1 / 3); // Controls speed relative to frame
        }, duration / (text.length * 2));
    };

    // Trigger animation on mount and hover
    animate();

    return () => clearInterval(interval);
  }, [text, duration, iterations]);

  return (
    <Component 
        className={`${className} cursor-default font-mono`}
        onMouseEnter={() => setIterations(0)}
    >
      {displayText}
    </Component>
  );
};

export default HyperText;