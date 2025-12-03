import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface TagCloudProps {
    onTagClick?: (tag: string) => void;
}

const skills = [
    'Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'LangChain', 'Hugging Face',
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind',
    'Node.js', 'Express', 'Flask', 'PostgreSQL', 'MongoDB', 'Firebase',
    'Docker', 'Git', 'CI/CD', 'Ethical AI', 'Generative AI'
];

const TagCloud: React.FC<TagCloudProps> = ({ onTagClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const { playHover, playClick } = useSoundEffects();
    const [tags, setTags] = useState<{ x: number, y: number, z: number, opacity: number, scale: number, text: string }[]>([]);
    
    // Configuration
    const radius = 180; // Adjusted for container size
    
    // Mouse interaction state
    const mouseX = useRef(0);
    const mouseY = useRef(0);
    const isHovering = useRef(false);

    useEffect(() => {
        // Initialize tag positions on a sphere using Fibonacci sphere algorithm
        const tempTags: any[] = [];
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        for (let i = 0; i < skills.length; i++) {
            const y = 1 - (i / (skills.length - 1)) * 2; // y goes from 1 to -1
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            tempTags.push({
                x: x * radius,
                y: y * radius,
                z: z * radius,
                text: skills[i]
            });
        }
        setTags(tempTags.map(t => ({...t, opacity: 1, scale: 1})));
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            // Base rotation
            let targetRotationX = 0.001;
            let targetRotationY = 0.002;

            // Interactive rotation
            if (isHovering.current && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation based on mouse distance from center
                targetRotationY = (mouseX.current - centerX) * 0.00005;
                targetRotationX = -(mouseY.current - centerY) * 0.00005;
            }

            setTags(prevTags => {
                const cosY = Math.cos(targetRotationY);
                const sinY = Math.sin(targetRotationY);
                const cosX = Math.cos(targetRotationX);
                const sinX = Math.sin(targetRotationX);

                return prevTags.map(tag => {
                    // Rotation around Y axis
                    let x1 = tag.x * cosY - tag.z * sinY;
                    let z1 = tag.z * cosY + tag.x * sinY;

                    // Rotation around X axis
                    let y1 = tag.y * cosX - z1 * sinX;
                    let z2 = z1 * cosX + tag.y * sinX;

                    // Calculate scale and opacity based on Z depth (perspective)
                    const depth = 400; // Perspective depth
                    const scale = depth / (depth - z2); 
                    const alpha = (z2 + radius) / (2 * radius); // Normalize z to 0-1 for opacity

                    return {
                        ...tag,
                        x: x1,
                        y: y1,
                        z: z2,
                        scale: scale,
                        opacity: Math.max(0.1, Math.min(1, alpha + 0.2)) // Keep meaningful minimum opacity
                    };
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e: MouseEvent) => {
            if(containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                mouseX.current = e.clientX - rect.left;
                mouseY.current = e.clientY - rect.top;
            }
        };

        const handleMouseEnter = () => { isHovering.current = true; };
        const handleMouseLeave = () => { isHovering.current = false; };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseenter', handleMouseEnter);
            container.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none">
            {tags.map((tag, index) => (
                <button
                    key={index}
                    onClick={(e) => { playClick(e); onTagClick?.(tag.text); }}
                    onMouseEnter={(e) => playHover(e)}
                    className="absolute transform-gpu transition-colors duration-200 cursor-pointer font-bold hover:text-accent focus:outline-none focus:text-accent whitespace-nowrap"
                    style={{
                        transform: `translate3d(${tag.x}px, ${tag.y}px, 0) scale(${tag.scale})`,
                        opacity: tag.opacity,
                        zIndex: Math.floor(tag.scale * 100),
                        color: theme === 'dark' 
                            ? `rgba(255,255,255,${tag.opacity})` 
                            : `rgba(0,0,0,${tag.opacity})`,
                        fontSize: '16px',
                        textShadow: tag.scale > 1 ? '0 0 10px rgba(59,130,246,0.5)' : 'none'
                    }}
                    aria-label={`View resources for ${tag.text}`}
                >
                    {tag.text}
                </button>
            ))}
        </div>
    );
};

export default TagCloud;