import React from 'react';
import Section from './Section';
import { BriefcaseIcon, GraduationCapIcon } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ExperienceItem {
    id: string;
    type: 'work' | 'education';
    title: string;
    organization: string;
    date: string;
    description: string;
}

const experiences: ExperienceItem[] = [
    {
        id: 'exp-1',
        type: 'work',
        title: 'Senior AI Researcher',
        organization: 'DeepTech Innovations',
        date: '2022 - Present',
        description: 'Leading a team of 5 in developing novel transformer architectures for generative design. Published 2 papers in top-tier conferences.'
    },
    {
        id: 'exp-2',
        type: 'work',
        title: 'Machine Learning Engineer',
        organization: 'DataFlow Systems',
        date: '2020 - 2022',
        description: 'Engineered scalable ML pipelines for real-time fraud detection. Optimized model inference latency by 40% using quantization.'
    },
    {
        id: 'edu-1',
        type: 'education',
        title: 'M.Sc. in Computer Science',
        organization: 'Tech University',
        date: '2018 - 2020',
        description: 'Specialization in Artificial Intelligence. Thesis on "Ethical Implications of Reinforcement Learning in Autonomous Systems".'
    },
    {
        id: 'edu-2',
        type: 'education',
        title: 'B.Sc. in Software Engineering',
        organization: 'State College',
        date: '2014 - 2018',
        description: 'Graduated Summa Cum Laude. President of the ACM Student Chapter.'
    }
];

const ExperienceCard: React.FC<{ item: ExperienceItem; index: number }> = ({ item, index }) => {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });
    const isLeft = index % 2 === 0;

    return (
        <div 
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`flex items-center justify-between md:justify-normal w-full mb-8 ${isLeft ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Empty spacer for opposite side on desktop */}
            <div className="hidden md:block w-5/12"></div>
            
            {/* Center Line Dot */}
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background-primary border-4 border-accent z-10 flex items-center justify-center">
                 {item.type === 'work' ? <BriefcaseIcon size={14} className="text-accent"/> : <GraduationCapIcon size={14} className="text-accent"/>}
            </div>

            {/* Content Card */}
            <div 
                className={`w-full md:w-5/12 pl-12 md:pl-0 ${isLeft ? 'md:pr-8' : 'md:pl-8'} transition-all duration-700 transform ${
                    isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : isLeft ? 'opacity-0 translate-x-10' : 'opacity-0 -translate-x-10'
                }`}
            >
                <div className="bg-glass-bg backdrop-blur-md border border-glass-border p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider mb-1 block">{item.date}</span>
                    <h3 className="text-xl font-bold text-text-primary">{item.title}</h3>
                    <h4 className="text-base font-medium text-text-secondary mb-3">{item.organization}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
                </div>
            </div>
        </div>
    );
};

const Experience: React.FC = () => {
    return (
        <Section id="experience" title="My Journey">
            <div className="relative max-w-5xl mx-auto py-10">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 bg-glass-border -translate-x-1/2"></div>
                
                {experiences.map((item, index) => (
                    <ExperienceCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </Section>
    );
};

export default Experience;