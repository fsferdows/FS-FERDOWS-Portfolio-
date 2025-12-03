import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
    strength?: number; // How strong the pull is
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
    children, 
    className = "", 
    as = "button",
    strength = 30,
    ...props 
}) => {
    const ref = useRef<HTMLElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const Component = as as any;

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        if (!ref.current) return;
        
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        setPosition({ 
            x: deltaX / width * strength, 
            y: deltaY / height * strength 
        });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <Component
            ref={ref}
            className={`transition-transform duration-100 ease-linear ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px)` 
            }}
            {...props}
        >
            {children}
        </Component>
    );
};

export default MagneticButton;