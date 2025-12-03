import React, { useState, useEffect, useRef } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import MagneticButton from './MagneticButton';
import { use3dCardEffect } from '../hooks/use3dCardEffect';

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
    // Increased tilt (maxRotation) and added scale for more pronounced effect
    use3dCardEffect(ref, undefined, true, { maxRotation: 25, scale: 1.1 });

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setIsClicked(true);
        onClick(e);
        setTimeout(() => setIsClicked(false), 200);
    };

    return (
        <MagneticButton strength={25} as="div">
            <a 
                ref={ref}
                href={href} 
                onClick={handleClick} 
                className={`px-4 py-2 font-medium block transition-all duration-200 ${
                    isClicked 
                    ? 'text-accent scale-95 brightness-125' 
                    : 'text-text-secondary hover:text-accent'
                }`}
            >
                {label}
            </a>
        </MagneticButton>
    );
};

const LogoLink = ({ onClick }: { onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const [isClicked, setIsClicked] = useState(false);
    // Increased tilt and scale for logo
    use3dCardEffect(ref, undefined, true, { maxRotation: 25, scale: 1.1 });

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setIsClicked(true);
        onClick(e);
        setTimeout(() => setIsClicked(false), 200);
    };

    return (
        <MagneticButton strength={25} as="div">
            <a 
                ref={ref}
                href="#hero" 
                onClick={handleClick} 
                className={`text-xl font-bold block px-2 transition-all duration-200 ${
                    isClicked 
                    ? 'text-white scale-95' 
                    : 'text-accent'
                }`}
            >
                FsF
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
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        smoothScroll(e);
        if (menuOpen) {
            setMenuOpen(false);
        }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-glass-bg backdrop-blur-lg border-b border-glass-border shadow-md' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <LogoLink onClick={handleNavClick} />
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4">
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
                        className="md:hidden z-50 text-text-primary p-2"
                        aria-label="Toggle menu"
                    >
                        <div className="space-y-2">
                            <span className={`block w-8 h-0.5 bg-current transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                            <span className={`block w-8 h-0.5 bg-current transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-8 h-0.5 bg-current transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden fixed top-0 left-0 w-full h-screen bg-glass-bg/95 backdrop-blur-xl transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <nav className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map(link => (
                        <a 
                            key={link.href} 
                            href={link.href} 
                            className="text-2xl text-text-primary hover:text-accent transition-colors font-semibold"
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