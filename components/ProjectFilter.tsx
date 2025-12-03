import React from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface ProjectFilterProps {
  tags: string[];
  activeTag: string;
  onSelectTag: (tag: string) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ tags, activeTag, onSelectTag }) => {
    const { playClick } = useSoundEffects();

    const handleClick = (tag: string, e: React.MouseEvent) => {
        playClick(e);
        onSelectTag(tag);
    };

    return (
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-in" style={{ animationDelay: '0.1s' }}>
            <button
                onClick={(e) => handleClick('All', e)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTag === 'All'
                        ? 'bg-accent text-white shadow-lg shadow-accent/30'
                        : 'bg-glass-bg border border-glass-border text-text-secondary hover:border-accent hover:text-accent hover:bg-accent/5'
                }`}
            >
                All
            </button>
            {tags.map(tag => (
                <button
                    key={tag}
                    onClick={(e) => handleClick(tag, e)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                        activeTag === tag
                            ? 'bg-accent text-white shadow-lg shadow-accent/30'
                            : 'bg-glass-bg border border-glass-border text-text-secondary hover:border-accent hover:text-accent hover:bg-accent/5'
                    }`}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
};

export default ProjectFilter;