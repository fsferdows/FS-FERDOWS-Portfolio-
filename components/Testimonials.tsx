import React from 'react';
import Section from './Section';
import { QuoteIcon } from './icons';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    text: string;
}

const testimonials: Testimonial[] = [
    {
        id: 't1',
        name: 'Sarah Connor',
        role: 'CTO',
        company: 'Skynet Solutions',
        text: 'Fs Ferdows is a visionary developer. Their ability to integrate complex AI models into seamless web experiences is unmatched. A true asset to any team.'
    },
    {
        id: 't2',
        name: 'Dr. Alan Grant',
        role: 'Lead Researcher',
        company: 'InGen Tech',
        text: 'I was impressed by the depth of knowledge Fs brings to ethical AI. They don\'t just build models; they build responsible systems.'
    },
    {
        id: 't3',
        name: 'Elliot Alderson',
        role: 'Security Engineer',
        company: 'Allsafe Cybersecurity',
        text: 'Clean code, robust architecture, and a hacker\'s mindset for problem-solving. Working with Fs was an absolute pleasure.'
    },
     {
        id: 't4',
        name: 'Neo Anderson',
        role: 'Software Architect',
        company: 'Matrix Corp',
        text: 'He sees the code behind the world. An exceptional talent who pushes the boundaries of what is possible in web development.'
    }
];

const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => (
    <div className="bg-background-secondary/50 backdrop-blur-sm border border-glass-border p-6 rounded-xl w-[350px] md:w-[450px] flex-shrink-0 mx-4 relative overflow-hidden group hover:border-accent/50 transition-colors duration-300">
        <QuoteIcon size={48} className="absolute top-4 right-4 text-accent/10 group-hover:text-accent/20 transition-colors" />
        <p className="text-text-secondary text-base italic mb-6 relative z-10 leading-relaxed">"{item.text}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {item.name.charAt(0)}
            </div>
            <div>
                <h4 className="text-text-primary font-bold text-sm">{item.name}</h4>
                <p className="text-text-secondary text-xs">{item.role}, {item.company}</p>
            </div>
        </div>
    </div>
);

const Testimonials: React.FC = () => {
    return (
        <div className="py-20 overflow-hidden bg-background-primary relative">
             <div className="container mx-auto px-4 mb-12">
                <h2 className="text-3xl md:text-5xl font-black text-center text-text-primary">What People Say</h2>
            </div>
            
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background-primary to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background-primary to-transparent z-10"></div>

            <div className="flex animate-scroll hover:pause-animation">
                {/* Double the list for seamless loop */}
                {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                    <TestimonialCard key={`${t.id}-${i}`} item={t} />
                ))}
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); } /* Move 1/3 because we tripled the list */
                }
                .animate-scroll {
                    display: flex;
                    width: max-content;
                    animation: scroll 40s linear infinite;
                }
                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default Testimonials;