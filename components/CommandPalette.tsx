import React, { useState, useEffect, useRef } from 'react';
import { 
    SearchIcon, 
    CommandIcon, 
    ArrowDownIcon, 
    SunIcon, 
    MoonIcon,
    BriefcaseIcon,
    CodeIcon,
    DownloadIcon,
    GithubIcon
} from './icons';
import { useTheme } from '../hooks/useTheme';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface Action {
    id: string;
    label: string;
    icon: React.ReactNode;
    shortcut?: string[];
    perform: () => void;
}

const CommandPalette: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { theme, setTheme } = useTheme();
    const { playClick, playOpen, playClose } = useSoundEffects();
    const smoothScroll = useSmoothScroll();
    const inputRef = useRef<HTMLInputElement>(null);

    const actions: Action[] = [
        {
            id: 'home',
            label: 'Go to Home',
            icon: <CommandIcon size={18} />,
            perform: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); }
        },
        {
            id: 'about',
            label: 'Go to About Me',
            icon: <CommandIcon size={18} />,
            perform: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            id: 'projects',
            label: 'View Projects',
            icon: <CodeIcon size={18} />,
            perform: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            id: 'experience',
            label: 'View Experience',
            icon: <BriefcaseIcon size={18} />,
            perform: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            id: 'theme',
            label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
            icon: theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />,
            shortcut: ['T'],
            perform: () => setTheme(theme === 'dark' ? 'light' : 'dark')
        },
        {
            id: 'resume',
            label: 'Download Resume',
            icon: <DownloadIcon size={18} />,
            perform: () => window.open('/resume.pdf', '_blank')
        },
        {
            id: 'github',
            label: 'Open GitHub',
            icon: <GithubIcon size={18} />,
            perform: () => window.open('https://github.com/fsferdows', '_blank')
        }
    ];

    const filteredActions = actions.filter(action => 
        action.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen) {
            playOpen();
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            playClose();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredActions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const action = filteredActions[selectedIndex];
            if (action) {
                playClick();
                action.perform();
                setIsOpen(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <div className="relative w-full max-w-2xl bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl shadow-2xl overflow-hidden animate-in">
                <div className="flex items-center px-4 border-b border-glass-border">
                    <SearchIcon size={20} className="text-text-secondary" />
                    <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Type a command or search..." 
                        className="w-full bg-transparent border-none py-4 px-4 text-lg text-text-primary focus:outline-none placeholder:text-text-secondary/50"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="hidden md:flex items-center gap-1 text-xs text-text-secondary bg-background-secondary px-2 py-1 rounded border border-glass-border">
                        <span className="text-[10px]">ESC</span>
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto py-2">
                    {filteredActions.length > 0 ? (
                        filteredActions.map((action, index) => (
                            <button
                                key={action.id}
                                onClick={() => {
                                    playClick();
                                    action.perform();
                                    setIsOpen(false);
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                                    index === selectedIndex 
                                        ? 'bg-accent/10 text-accent border-l-4 border-accent' 
                                        : 'text-text-secondary border-l-4 border-transparent hover:bg-background-tertiary'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={index === selectedIndex ? 'text-accent' : 'text-text-secondary'}>
                                        {action.icon}
                                    </span>
                                    <span className={`font-medium ${index === selectedIndex ? 'text-text-primary' : ''}`}>
                                        {action.label}
                                    </span>
                                </div>
                                {action.shortcut && (
                                    <div className="flex gap-1">
                                        {action.shortcut.map(key => (
                                            <kbd key={key} className="hidden md:inline-block px-2 py-0.5 bg-background-tertiary border border-glass-border rounded text-xs font-mono text-text-secondary">
                                                {key}
                                            </kbd>
                                        ))}
                                    </div>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-text-secondary">
                            <p>No results found.</p>
                        </div>
                    )}
                </div>
                
                <div className="bg-background-secondary/50 px-4 py-2 border-t border-glass-border flex justify-between items-center text-xs text-text-secondary">
                    <div className="flex gap-4">
                        <span><strong className="text-text-primary">↑↓</strong> to navigate</span>
                        <span><strong className="text-text-primary">↵</strong> to select</span>
                    </div>
                    <span>System Ready</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;