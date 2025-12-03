import React, { useEffect, useRef } from 'react';

const ScrollProgress: React.FC = () => {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;

        const handleScroll = () => {
            animationFrameId = requestAnimationFrame(() => {
                if (!barRef.current) return;
                
                const totalScroll = document.documentElement.scrollTop;
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
                
                // Direct DOM update avoids React re-renders for buttery smooth performance
                barRef.current.style.transform = `scaleX(${scroll})`;
            });
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
            <div 
                ref={barRef}
                className="h-full bg-accent origin-left transition-transform duration-75 ease-out will-change-transform"
                style={{ transform: 'scaleX(0)' }}
            />
        </div>
    );
};

export default ScrollProgress;