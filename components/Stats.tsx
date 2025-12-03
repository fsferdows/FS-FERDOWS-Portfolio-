import React, { useEffect, useState, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const stats = [
    { label: 'Years Experience', value: 5, suffix: '+' },
    { label: 'Projects Completed', value: 30, suffix: '+' },
    { label: 'Research Papers', value: 4, suffix: '' },
    { label: 'Contributions', value: 500, suffix: '+' }
];

const Counter: React.FC<{ target: number; suffix: string; duration?: number }> = ({ target, suffix, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [ref, isVisible] = useScrollAnimation({ triggerOnce: true });
    
    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease out quart
            const ease = 1 - Math.pow(1 - percentage, 4);
            
            setCount(Math.floor(target * ease));

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };
        
        requestAnimationFrame(animate);
    }, [isVisible, target, duration]);

    return (
        <span ref={ref as React.RefObject<HTMLSpanElement>} className="font-mono">
            {count}{suffix}
        </span>
    );
};

const Stats: React.FC = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-12 py-8 border-y border-glass-border bg-background-secondary/20">
            {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                    <div className="text-4xl md:text-5xl font-black text-accent mb-2">
                        <Counter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-text-secondary uppercase tracking-widest font-semibold">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Stats;