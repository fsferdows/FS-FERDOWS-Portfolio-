import React from 'react';
import { GithubIcon } from './icons';
import { useSoundEffects } from '../hooks/useSoundEffects';
import ParallaxText from './ParallaxText';

const Footer: React.FC = () => {
    const { playClick } = useSoundEffects();

    return (
        <footer className="bg-transparent text-text-secondary mt-24 relative overflow-hidden">
            <div className="mb-12">
                <ParallaxText baseVelocity={-2}>Build Create Innovate</ParallaxText>
            </div>
            
            <div className="container mx-auto px-4 py-8 border-t border-glass-border">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm">&copy; {new Date().getFullYear()} Fs Ferdows. All Rights Reserved.</p>
                         <p className="text-sm mt-1 text-accent font-mono" dir="rtl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <a 
                            href="https://github.com/fsferdows" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-accent transition-colors transform hover:scale-110 duration-300" 
                            aria-label="GitHub Profile"
                            onClick={(e) => playClick(e)}
                        >
                            <GithubIcon size={24} />
                        </a>
                        {/* Add other social links here */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;