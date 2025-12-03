// Fix: Provided full implementation for the PublicationCard component.
import React from 'react';
import { Publication } from '../types';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface PublicationCardProps {
  publication: Publication;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  const { playClick, playHover } = useSoundEffects();
  return (
    <div 
        className="relative group p-[2px] rounded-lg"
        onMouseEnter={(e) => playHover(e)}
    >
       <div className="absolute inset-0 rounded-lg bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--accent-hsl)_/_0.5),hsl(var(--accent-hsl)_/_0.2),hsl(var(--accent-hsl)_/_0.5))] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin [animation-duration:3s]"></div>
        <div className="relative bg-background-secondary p-6 rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.01]">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">{publication.title}</h3>
                  <p className="text-text-secondary text-sm mb-2">
                      {publication.authors.join(', ')}
                  </p>
                  <p className="text-text-secondary font-medium italic">
                      {publication.journal}, {publication.year}
                  </p>
              </div>
              <a
                href={publication.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => playClick(e)}
                className="flex-shrink-0 mt-4 md:mt-0 bg-accent text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-opacity-80 transition-colors whitespace-nowrap"
              >
                View PDF
              </a>
          </div>
          <p className="text-text-secondary mt-4 text-base border-t border-background-tertiary pt-4">{publication.summary}</p>
        </div>
    </div>
  );
};

export default PublicationCard;