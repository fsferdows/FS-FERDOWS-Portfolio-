import React, { useRef, useState } from 'react';
import { Project } from '../types';
import { use3dCardEffect } from '../hooks/use3dCardEffect';
import { GithubIcon, ExternalLinkIcon, CubeIcon, PlayIcon, XIcon } from './icons';
import { useStore } from '../store/useStore';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface ProjectCardProps {
  project: Project;
  staggerIndex?: number;
  onViewDetails?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, staggerIndex = 0, onViewDetails }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const openModelViewer = useStore((state) => state.openModelViewer);
  const { playClick, playHover } = useSoundEffects();
  const [isDemoActive, setIsDemoActive] = useState(false);


  use3dCardEffect(cardRef, {
    image: { ref: imageRef, translateZ: 20 },
    title: { ref: titleRef, translateZ: 60 },
    description: { ref: descriptionRef, translateZ: 40 },
    tags: { ref: tagsRef, translateZ: 50 },
  }, !isDemoActive);
  
  const handleView3D = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    playClick(e);
    if(project.modelUrl) {
      openModelViewer(project.modelUrl);
    }
  };

  const handleToggleDemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    playClick(e);
    setIsDemoActive(!isDemoActive);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isDemoActive && onViewDetails) {
        playClick(e);
        onViewDetails(project);
    }
  };
  
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick(e);
  };

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      onClick={handleCardClick}
      onMouseEnter={(e) => !isDemoActive && playHover(e)}
      className={`project-card group relative bg-glass-bg backdrop-blur-lg border border-glass-border rounded-xl p-6 shadow-lg transform-style-3d transition-all duration-500 will-change-transform staggered-child hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 focus:outline-none ${isDemoActive ? 'z-20' : 'cursor-pointer'}`}
      style={{ transformStyle: 'preserve-3d', '--stagger-index': staggerIndex } as React.CSSProperties}
      role="button"
      aria-label={`View details for project ${project.title}`}
    >
      <div
        className="absolute inset-0 bg-accent rounded-xl transition-opacity duration-500 pointer-events-none"
        style={{ opacity: isDemoActive ? 0 : 'var(--glow-opacity, 0)', background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), hsl(var(--accent-hsl) / 0.3), transparent 40%)' }}
      ></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className={`mb-4 overflow-hidden rounded-lg relative transition-all duration-500 ${isDemoActive ? 'aspect-video w-full h-auto' : 'h-48'}`} style={{ transform: 'translateZ(0)' }}>
          {isDemoActive && project.liveUrl ? (
              <div className="w-full h-full relative bg-white">
                  <iframe 
                    src={project.liveUrl} 
                    className="w-full h-full border-0" 
                    title={`${project.title} Demo`}
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                  />
                  <button 
                    onClick={handleToggleDemo}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors z-20 shadow-sm backdrop-blur-sm"
                    aria-label="Close Preview"
                  >
                    <XIcon size={16} />
                  </button>
              </div>
          ) : (
            <>
                <img
                    ref={imageRef}
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {project.liveUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors duration-300 group/overlay">
                        <button
                            onClick={handleToggleDemo}
                            className="opacity-0 group-hover/overlay:opacity-100 transform scale-90 group-hover/overlay:scale-100 transition-all duration-300 bg-accent/90 hover:bg-accent text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg font-semibold backdrop-blur-sm"
                        >
                            <PlayIcon size={16} />
                            <span>Interactive Preview</span>
                        </button>
                    </div>
                )}
            </>
          )}
        </div>

        <h3 ref={titleRef} className="text-xl font-bold text-text-primary mb-2">{project.title}</h3>
        <p ref={descriptionRef} className="text-text-secondary flex-grow mb-4 line-clamp-3">{project.description}</p>
        
        <div ref={tagsRef} className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="bg-accent/10 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex justify-between items-center">
            <div className="flex gap-4">
                {project.sourceUrl && (
                    <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors" aria-label="Source Code" onClick={handleLinkClick}>
                        <GithubIcon size={24} />
                    </a>
                )}
                {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors" aria-label="Live Demo" onClick={handleLinkClick}>
                        <ExternalLinkIcon size={24} />
                    </a>
                )}
            </div>
            {project.modelUrl && (
                <button
                    onClick={handleView3D}
                    className="text-text-secondary hover:text-accent transition-colors"
                    aria-label="View 3D Model"
                >
                    <CubeIcon size={24} />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;