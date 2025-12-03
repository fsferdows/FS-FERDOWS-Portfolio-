import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './icons';
import { useSoundEffects } from '../hooks/useSoundEffects';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { playClick } = useSoundEffects();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick(e);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 right-4 z-40 w-12 h-12 flex items-center justify-center bg-accent text-white rounded-full shadow-lg hover:bg-opacity-80 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background-primary ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUpIcon size={24} />
    </button>
  );
};

export default ScrollToTop;