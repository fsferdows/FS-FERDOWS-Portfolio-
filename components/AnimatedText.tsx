import React from 'react';

interface AnimatedTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
  animationClass?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  as = 'div',
  className,
  stagger = 0.05,
  delay = 0,
  animationClass = 'animate-fade-in-up'
}) => {
  const Component = as as any;

  // Prepare data with linear delay calculation for a true typing effect
  let runningIndex = 0;
  const words = text.split(' ').map((word) => {
    const chars = word.split('').map((char) => {
       const charDelay = delay + (runningIndex * stagger);
       runningIndex++;
       return { char, delay: charDelay };
    });
    // Increment for the space between words
    runningIndex++;
    return chars;
  });

  return (
    <Component className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((wordChars, i) => (
          <span key={i} className="inline-block whitespace-nowrap">
            {wordChars.map((item, j) => (
              <span
                key={j}
                className={`inline-block ${animationClass}`}
                style={{ animationDelay: `${item.delay}s` }}
              >
                {item.char}
              </span>
            ))}
            {/* Add space back in */}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </span>
    </Component>
  );
};

export default AnimatedText;