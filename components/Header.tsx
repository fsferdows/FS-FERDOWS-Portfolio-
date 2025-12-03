import React, { useState, useEffect, useRef } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import MagneticButton from './MagneticButton';
import { use3dCardEffect } from '../hooks/use3dCardEffect';
import HyperText from './HyperText';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#publications', label: 'Publications' },
    { href: '#insights', label: 'Insights' },
    { href: '#news', label: 'News' },
    { href: '#contact', label: 'Contact' },
];

const NavLink = ({ href, label, onClick }: { href: string, label: string, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const [isClicked, setIsClicked] = useState(false);
    
    // Charming 3D effect on hover
    use3dCardEffect(ref, undefined, true, { 
        maxRotation: 15, 
        scale: 1.1, 
        perspective: 1000 
    });

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setIsClicked(true);
        onClick(e);
        setTimeout(() => setIsClicked(false), 200);
    };

    return (
        <MagneticButton strength={20} as="div">
            <a 
                ref={ref}
                href={href} 
                onClick={handleClick} 
                className={`relative px-3 py-2 font-medium transition-all duration-300 group ${
                    isClicked 
                    ? 'text-accent scale-95' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
            >
                <span className="relative z-10">{label}</span>
                {/* Subtle glow effect on hover */}
                <span className="absolute inset-0 bg-accent/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out -z-0"></span>
            </a>
        </MagneticButton>
    );
};

const LogoLink = ({ onClick }: { onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    
    // Stronger 3D effect for the logo
    use3dCardEffect(ref, undefined, true, { 
        maxRotation: 20, 
        scale: 1.05,
        perspective: 800
    });

    return (
        <MagneticButton strength={40} as="div">
            <a 
                ref={ref}
                href="#hero" 
                onClick={onClick} 
                className="block px-2 py-1 relative group"
                aria-label="Fs Ferdows Home"
            >
                 <HyperText 
                    text="Fs Ferdows" 
                    className="text-xl md:text-2xl font-black tracking-tighter text-text-primary group-hover:text-accent transition-colors duration-300"
                />
            </a>
        </MagneticButton>
    );
};

const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const smoothScroll = useSmoothScroll();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        smoothScroll(e);
        if (menuOpen) {
            setMenuOpen(false);
        }
    };

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
                scrolled 
                ? 'bg-glass-bg/80 backdrop-blur-xl border-glass-border shadow-lg py-2' 
                : 'bg-transparent border-transparent py-4'
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <LogoLink onClick={handleNavClick} />
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <NavLink 
                                key={link.href}
                                href={link.href}
                                label={link.label}
                                onClick={handleNavClick}
                            />
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden z-50 p-2 text-text-primary hover:text-accent transition-colors relative group"
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 flex flex-col items-end gap-1.5">
                            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
                            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'w-6 opacity-0' : 'w-4 group-hover:w-6'}`}></span>
                            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-3 group-hover:w-6'}`}></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div className={`md:hidden fixed inset-0 bg-background-primary/95 backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <nav className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map((link, i) => (
                        <a 
                            key={link.href} 
                            href={link.href} 
                            className={`text-3xl font-bold text-text-primary hover:text-accent transition-all duration-300 transform ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            style={{ transitionDelay: `${i * 0.1}s` }}
                            onClick={handleNavClick}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;