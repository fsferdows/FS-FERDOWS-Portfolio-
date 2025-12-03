import React from 'react';
import AnimatedText from './AnimatedText';
import HyperText from './HyperText';
import MagneticButton from './MagneticButton';
import { ArrowDownIcon } from './icons';
import AuroraBackground from './AuroraBackground';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useTheme } from '../hooks/useTheme';
import LottieAnimation from './LottieAnimation';

const Hero: React.FC = () => {
    const smoothScroll = useSmoothScroll();
    const { accentColor } = useTheme();

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center text-center bg-transparent overflow-hidden">
            <AuroraBackground color={accentColor} />
            <div className="container mx-auto px-4 z-10">
                <div className="mb-4">
                     <MagneticButton as="div" strength={20} className="inline-block">
                        <HyperText 
                            text="Fs Ferdows" 
                            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-text-primary leading-tight hover:text-accent transition-colors duration-300"
                            as="h1"
                        />
                     </MagneticButton>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-accent mb-6 overflow-hidden flex items-center justify-center gap-3">
                    <AnimatedText 
                        as="span" 
                        className="block" 
                        text="AI Researcher & Developer" 
                        stagger={0.08} 
                        delay={0.5} 
                        animationClass="animate-in"
                    />
                    {/* Subtle AI Lottie Animation */}
                    <div className="w-8 h-8 md:w-10 md:h-10 opacity-80">
                        <LottieAnimation 
                            url="https://assets5.lottiefiles.com/packages/lf20_iv4dsx3q.json" 
                            className="w-full h-full"
                        />
                    </div>
                </h2>

                <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
                    <AnimatedText text="Crafting intelligent systems and elegant web experiences. Exploring the frontiers of machine learning, from foundation models to ethical AI frameworks." stagger={0.01} delay={1.5} />
                </p>
                
                <div style={{ '--animation-delay': '2.5s' } as React.CSSProperties} className="animate-fade-in-up">
                    <MagneticButton strength={40}>
                        <a 
                            href="#projects"
                            onClick={smoothScroll}
                            className="group inline-flex items-center gap-3 bg-accent text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-80 transition-all duration-300 ease-in-out shadow-lg hover:shadow-accent/50"
                        >
                            <span>Explore My Work</span>
                            <ArrowDownIcon size={20} className="opacity-60 group-hover:opacity-100 transition-all duration-300 ease-in-out transform group-hover:translate-y-1" />
                        </a>
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
};

export default Hero;