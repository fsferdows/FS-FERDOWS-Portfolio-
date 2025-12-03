import React, { useState, useEffect } from 'react';

const TimeDisplay: React.FC = () => {
    const [time, setTime] = useState<Date | null>(null);
    const [mounted, setMounted] = useState(false);
    const [locationName, setLocationName] = useState<string>('');

    useEffect(() => {
        setMounted(true);
        setTime(new Date());
        
        // Get user's IANA Timezone (e.g., "America/New_York")
        try {
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const city = userTimeZone.split('/').pop()?.replace(/_/g, ' ') || '';
            setLocationName(city.toUpperCase());
        } catch (e) {
            setLocationName('LOCAL');
        }

        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted || !time) return null;

    const formattedTime = time.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const formattedDate = time.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    const fullDate = time.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Extract full timezone name safely
    const fullTimeZone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'long' })
        .formatToParts(time)
        .find(p => p.type === 'timeZoneName')?.value || '';

    const timeZoneAbbr = time.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop();

    return (
        <>
            <style>{`
                .time-widget-container {
                    perspective: 1500px;
                }
                
                .time-widget-card {
                    transform-style: preserve-3d;
                    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Elastic bounce */
                    /* Default State: Deep down, recessed, tilted away */
                    transform: rotateX(25deg) rotateY(15deg) rotateZ(-5deg) translateZ(-60px) scale(0.85);
                    opacity: 0.6;
                    filter: grayscale(0.8) blur(1px);
                    box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
                    background: rgba(20, 20, 25, 0.6); /* Darker base for "deep" feel */
                }

                /* Hover State: Visual, popped out, aligned */
                .time-widget-container:hover .time-widget-card {
                    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px) scale(1);
                    opacity: 1;
                    filter: grayscale(0) blur(0px);
                    box-shadow: 
                        0 0 0 1px hsla(var(--accent-hsl) / 0.5),
                        0 20px 50px -20px hsla(var(--accent-hsl) / 0.4),
                        inset 0 0 20px hsla(var(--accent-hsl) / 0.1);
                    background: hsla(var(--glass-bg));
                }

                /* Time Text Layering */
                .time-text {
                    transition: transform 0.5s ease;
                    transform: translateZ(10px);
                }
                .time-widget-container:hover .time-text {
                    transform: translateZ(40px);
                    text-shadow: 0 10px 20px rgba(0,0,0,0.4);
                }

                /* Detail Info (Date/Zone) - Hidden deep down by default */
                .detail-info {
                    transition: all 0.5s ease;
                    opacity: 0;
                    transform: translateY(20px) translateZ(-50px);
                    filter: blur(4px);
                }
                .time-widget-container:hover .detail-info {
                    opacity: 1;
                    transform: translateY(0) translateZ(60px); /* Pops out further than time */
                    filter: blur(0px);
                }

                /* Animated Border Gradient */
                .animated-border {
                    position: absolute;
                    inset: 0;
                    border-radius: 1rem;
                    padding: 2px;
                    background: linear-gradient(45deg, transparent, hsla(var(--accent-hsl)), transparent);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0;
                    transition: opacity 0.5s;
                }
                .time-widget-container:hover .animated-border {
                    opacity: 1;
                    animation: borderRotate 4s linear infinite;
                }

                @keyframes borderRotate {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
            `}</style>

            <div className="fixed bottom-6 left-6 z-50 hidden md:block time-widget-container">
                <div className="time-widget-card relative backdrop-blur-xl rounded-2xl p-6 w-64 group cursor-pointer">
                    
                    {/* Animated Glowing Border */}
                    <div className="animated-border"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Main Time Display */}
                        <div className="time-text text-5xl font-black text-text-primary tracking-widest font-mono bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-text-primary group-hover:to-accent transition-all duration-300">
                            {formattedTime}
                        </div>
                        
                        {/* Hidden Details that pop out */}
                        <div className="detail-info flex flex-col items-center mt-4 space-y-1">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 mb-2"></div>
                            <div className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em]">
                                {formattedDate}
                            </div>
                            <div className="relative group/pill flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mt-1 cursor-help transition-colors hover:bg-accent/20">
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-background-secondary/95 backdrop-blur-md text-center border border-glass-border rounded-lg shadow-xl opacity-0 group-hover/pill:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover/pill:translate-y-0 z-50">
                                    <p className="text-xs font-bold text-accent mb-1">{fullTimeZone}</p>
                                    <p className="text-[10px] text-text-secondary leading-tight">{fullDate}</p>
                                    {/* Tooltip Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-background-secondary/95"></div>
                                </div>

                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                                <span className="text-xs font-black text-accent font-mono">
                                    {locationName} {timeZoneAbbr}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reflection Gradient */}
                     <div 
                        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ transform: 'translateZ(1px)' }}
                    />
                </div>
            </div>
        </>
    );
};

export default TimeDisplay;