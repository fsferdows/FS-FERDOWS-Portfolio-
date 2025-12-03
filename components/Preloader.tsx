import React, { useEffect, useState } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface PreloaderProps {
    onComplete: () => void;
}

const bootLogs = [
    "INITIALIZING NEURAL KERNEL...",
    "LOADING MEMORY MODULES...",
    "ESTABLISHING SECURE UPLINK...",
    "CONFIGURING GENERATIVE ENGINE...",
    "OPTIMIZING WEBGL RENDERER...",
    "SYNCHRONIZING WITH SATELLITE...",
    "SYSTEM READY."
];

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [logIndex, setLogIndex] = useState(0);
    const { playHover } = useSoundEffects();
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Log Animation
        const logInterval = setInterval(() => {
            setLogIndex(prev => {
                if(prev < bootLogs.length - 1) return prev + 1;
                return prev;
            });
            playHover(); // Subtle tick sound
        }, 800);

        // Progress Animation
        const updateProgress = () => {
            setProgress(prev => {
                if (prev >= 100) {
                    setIsComplete(true);
                    return 100;
                }
                // Randomize speed for realism
                const diff = Math.random() * 10;
                return Math.min(prev + diff, 100);
            });
        };

        const progressInterval = setInterval(updateProgress, 150);

        return () => {
            clearInterval(logInterval);
            clearInterval(progressInterval);
        };
    }, []);

    useEffect(() => {
        if (isComplete) {
            setTimeout(onComplete, 800); // Slight delay after 100% before unmount
        }
    }, [isComplete, onComplete]);

    return (
        <div className={`fixed inset-0 z-[1000] bg-black flex items-center justify-center font-mono text-accent transition-opacity duration-1000 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="w-full max-w-md p-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xl font-bold tracking-widest">SYSTEM BOOT</span>
                    <span className="text-4xl font-black">{Math.floor(progress)}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-[#333] mb-8 relative overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full bg-accent transition-all duration-100 ease-out" 
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Logs */}
                <div className="h-32 overflow-hidden flex flex-col justify-end text-sm text-gray-500">
                    {bootLogs.map((log, i) => (
                        <div 
                            key={i} 
                            className={`transition-opacity duration-300 ${i === logIndex ? 'text-white font-bold' : i > logIndex ? 'opacity-0' : 'opacity-50'}`}
                        >
                            <span className="mr-2">[{i < 10 ? `0${i}` : i}]</span>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Preloader;