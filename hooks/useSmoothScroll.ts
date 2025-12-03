import React from 'react';
import { useSoundEffects } from './useSoundEffects';

export const useSmoothScroll = () => {
    const { playClick } = useSoundEffects();

    const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        playClick(e);

        const targetId = e.currentTarget.getAttribute('href')?.substring(1);
        if (targetId === null) return;
        
        // Special case for scrolling to top
        if (targetId === 'hero' || targetId === '') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerElement = document.querySelector('header');
            const headerOffset = headerElement ? headerElement.offsetHeight : 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return smoothScroll;
};
