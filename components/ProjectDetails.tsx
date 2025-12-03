import React from 'react';
import { Project } from '../types';
import { GithubIcon, ExternalLinkIcon, CubeIcon } from './icons';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface ProjectDetailsProps {
    project: Project;
    onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
    const { playClick } = useSoundEffects();

    return (
        <div className="flex flex-col h-full -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-[-1.5rem] md:mb-[-2rem]">
             <div className="relative h-64 md:h-80 w-full shrink-0 overflow-hidden rounded-t-lg group">
                <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 drop-shadow-lg">{project.title}</h2>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="bg-accent/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto flex-grow custom-scrollbar">
                <div className="prose prose-invert max-w-none text-text-secondary mb-8 text-lg leading-relaxed">
                    <p className="whitespace-pre-line">{project.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 pt-6 border-t border-glass-border mt-auto">
                    {project.liveUrl && (
                        <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => playClick(e)}
                            className="flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 font-semibold shadow-lg shadow-accent/20"
                        >
                            <ExternalLinkIcon size={20} />
                            Live Demo
                        </a>
                    )}
                    {project.sourceUrl && (
                        <a 
                            href={project.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => playClick(e)}
                            className="flex items-center gap-2 px-5 py-3 bg-background-tertiary text-text-primary rounded-lg hover:bg-background-secondary transition-all transform hover:scale-105 font-semibold border border-glass-border"
                        >
                            <GithubIcon size={20} />
                            Source Code
                        </a>
                    )}
                    {project.modelUrl && (
                        <a 
                            href={project.modelUrl} 
                             target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => playClick(e)}
                            className="flex items-center gap-2 px-5 py-3 bg-background-tertiary text-text-primary rounded-lg hover:bg-background-secondary transition-all transform hover:scale-105 font-semibold border border-glass-border"
                        >
                            <CubeIcon size={20} />
                            View 3D Model
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;