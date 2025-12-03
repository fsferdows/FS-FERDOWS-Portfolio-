import React, { ReactNode, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScroll3dTextEffect } from '../hooks/useScroll3dTextEffect';
import { PlusIcon } from './icons';
import { useSoundEffects } from '../hooks/useSoundEffects';
import GlitchText from './GlitchText';

interface SectionProps {
  id: string;
  title: string;
  onAdd?: () => void;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, onAdd, children }) => {
    const [ref, isVisible] = useScrollAnimation({ triggerOnce: true, threshold: 0.15 });
    const titleRef = useRef<HTMLDivElement>(null);
    const { playClick } = useSoundEffects();
    // Use type assertion to satisfy the hook expecting HTMLElement
    useScroll3dTextEffect(titleRef as unknown as React.RefObject<HTMLElement>);

    const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playClick(e);
        if (onAdd) {
            onAdd();
        }
    };

    return (
        <section 
            id={id} 
            ref={ref as React.RefObject<HTMLElement>} 
            className={`py-20 md:py-32 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isVisible 
                ? 'opacity-100 translate-y-0 rotate-x-0' 
                : 'opacity-0 translate-y-24 rotate-x-12'
            }`}
            style={{ perspective: '1000px' }}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-16">
                    <div ref={titleRef} className={`${isVisible ? 'animate-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                        <GlitchText text={title} className="text-3xl md:text-5xl font-black text-text-primary tracking-tight" />
                    </div>
                    
                    {onAdd && (
                         <button
                            onClick={handleAddClick}
                            className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg hover:bg-accent hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent transform hover:scale-105"
                            aria-label={`Add new ${title.slice(0, -1)}`}
                         >
                            <PlusIcon size={20} />
                            <span className="hidden sm:inline font-semibold">Add New</span>
                        </button>
                    )}
                </div>
                {children}
            </div>
        </section>
    );
}

export default Section;