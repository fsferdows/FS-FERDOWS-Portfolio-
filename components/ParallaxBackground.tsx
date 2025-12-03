import React, { useEffect, useRef } from 'react';

const ParallaxBackground: React.FC = () => {
    const blob1Ref = useRef<HTMLDivElement>(null);
    const blob2Ref = useRef<HTMLDivElement>(null);
    const blob3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;

        const handleScroll = () => {
            animationFrameId = requestAnimationFrame(() => {
                const offset = window.scrollY;
                
                if (blob1Ref.current) {
                    blob1Ref.current.style.transform = `translate3d(0, ${offset * 0.1}px, 0)`;
                }
                if (blob2Ref.current) {
                    blob2Ref.current.style.transform = `translate3d(0, ${offset * -0.05}px, 0)`;
                }
                if (blob3Ref.current) {
                    blob3Ref.current.style.transform = `translate3d(0, ${offset * 0.08}px, 0)`;
                }
            });
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
            {/* Top Left Blob */}
            <div 
                ref={blob1Ref}
                className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-accent/5 rounded-full blur-[100px] will-change-transform"
            />
            
            {/* Middle Right Blob */}
            <div 
                ref={blob2Ref}
                className="absolute top-[40%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-purple-500/5 rounded-full blur-[80px] will-change-transform"
            />
            
            {/* Bottom Left Blob */}
            <div 
                ref={blob3Ref}
                className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-blue-500/5 rounded-full blur-[120px] will-change-transform"
            />
        </div>
    );
};

export default ParallaxBackground;