
// Fix: Provided full implementation for the FeatureCard component.
import React, { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-background-secondary p-6 rounded-lg text-center">
      <div className="inline-block p-4 bg-accent/10 text-accent rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};

export default FeatureCard;
