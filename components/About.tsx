import React, { useState } from 'react';
import Section from './Section';
import FeatureCard from './FeatureCard';
import { BrainCircuitIcon, CodeIcon, ShieldCheckIcon, DownloadIcon, SearchIcon, XIcon } from './icons';
import ImageGenerator from './ImageGenerator';
import ToolkitModal from './ToolkitModal';
import TagCloud from './TagCloud';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Stats from './Stats';

const skillCategories = [
    {
        title: "AI & Machine Learning",
        skills: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'LangChain', 'Hugging Face']
    },
    {
        title: "Frontend Development",
        skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML5 & CSS3', 'Tailwind CSS']
    },
    {
        title: "Backend & Database",
        skills: ['Node.js', 'Express.js', 'Flask', 'PostgreSQL', 'MongoDB', 'Firebase']
    },
    {
        title: "Tools & DevOps",
        skills: ['Docker', 'Git & GitHub', 'CI/CD']
    }
];

const About: React.FC = () => {
    const { playClick, playHover } = useSoundEffects();
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSkillClick = (e: React.MouseEvent, skill: string) => {
        playClick(e);
        setSelectedSkill(skill);
    };
    
    const handleClearSearch = (e: React.MouseEvent) => {
        playClick(e);
        setSearchQuery('');
    };

    // Filter logic for skills
    const filteredCategories = skillCategories.map(category => ({
        ...category,
        skills: category.skills.filter(skill => 
            skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.skills.length > 0);

    return (
        <Section id="about" title="About Me">
            <div className="max-w-4xl mx-auto text-center text-text-secondary text-lg leading-relaxed mb-12">
                <p className="mb-8">
                    Hello! I'm Fs Ferdows, a passionate AI Researcher and Developer with a knack for turning complex problems into elegant, user-centric solutions. My journey in technology is driven by a relentless curiosity about the inner workings of intelligence, both artificial and natural.
                </p>

                <a 
                    href="/resume.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => playClick(e)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-background-secondary text-text-primary border border-glass-border rounded-full hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 group shadow-sm hover:shadow-lg transform hover:-translate-y-1"
                >
                    <DownloadIcon size={20} className="group-hover:animate-bounce" />
                    <span className="font-semibold text-base">Download Resume</span>
                </a>
            </div>

            <Stats />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                <FeatureCard 
                    icon={<BrainCircuitIcon size={32} />} 
                    title="AI Research & Development" 
                    description="Specializing in large language models, computer vision, and generative AI to push the boundaries of what's possible." 
                />
                <FeatureCard 
                    icon={<CodeIcon size={32} />} 
                    title="Full-Stack Web Expertise" 
                    description="Building responsive, high-performance web applications with modern frameworks like React, Node.js, and TypeScript." 
                />
                <FeatureCard 
                    icon={<ShieldCheckIcon size={32} />} 
                    title="Ethical & Responsible AI" 
                    description="Advocating for and implementing AI systems that are fair, transparent, and accountable to society." 
                />
            </div>
            
            <div className="w-full h-[500px] mb-20 relative flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--accent-hsl)_/_0.1),_transparent_70%)] pointer-events-none" />
                 <TagCloud onTagClick={(tag) => setSelectedSkill(tag)} />
            </div>

             <div className="max-w-4xl mx-auto text-center text-text-secondary text-lg leading-relaxed mb-16">
                <p>
                    My expertise lies in developing and fine-tuning large language models, building robust machine learning pipelines, and creating interactive applications that bring AI to life. I'm a strong advocate for responsible AI development, focusing on fairness, transparency, and ethical considerations in every project. When I'm not deep in code or research papers, I enjoy exploring the intersection of technology and art, contributing to open-source projects, and mentoring aspiring developers.
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                <h3 className="text-3xl font-bold text-center text-text-primary mb-6">My Toolkit</h3>
                <p className="text-center text-text-secondary mb-8">Click on any skill to access curated resources, an AI mentor, and an interactive practice playground.</p>
                
                {/* Search Bar */}
                <div className="relative max-w-md mx-auto mb-12 group">
                    <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search skills or technologies..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-glass-bg border border-glass-border rounded-full py-3 pl-12 pr-10 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 shadow-lg"
                        />
                        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                        {searchQuery && (
                            <button 
                                onClick={handleClearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent transition-colors"
                            >
                                <XIcon size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category, idx) => (
                            <div key={idx} className="bg-glass-bg backdrop-blur-sm border border-glass-border rounded-xl p-6 shadow-sm animate-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <h4 className="text-xl font-bold text-text-primary mb-6 border-b border-glass-border pb-2">{category.title}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {category.skills.map(skill => (
                                        <button 
                                            key={skill}
                                            onClick={(e) => handleSkillClick(e, skill)}
                                            onMouseEnter={(e) => playHover(e)}
                                            className="group relative flex items-center justify-center h-20 bg-background-secondary rounded-lg cursor-pointer transition-all duration-300 hover:bg-accent hover:shadow-lg hover:-translate-y-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            <span className="text-text-primary font-bold text-center px-2 group-hover:text-white z-10 transition-colors duration-300 text-sm sm:text-base">
                                                {skill}
                                            </span>
                                            
                                            {/* Decorative corner accent for W3Schools vibe */}
                                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-accent/20 group-hover:border-r-white/30 transition-all duration-300"></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="col-span-full text-center py-12 text-text-secondary animate-in">
                            <SearchIcon size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg">No skills found matching "{searchQuery}".</p>
                            <p className="text-sm mt-2">Try searching for a language like "Python" or "React".</p>
                        </div>
                    )}
                </div>
            </div>
            
            <ImageGenerator />

            {/* Toolkit Modal for Learning and Practice */}
            <ToolkitModal 
                isOpen={!!selectedSkill} 
                onClose={() => setSelectedSkill(null)} 
                skill={selectedSkill || ''} 
            />
        </Section>
    );
};

export default About;