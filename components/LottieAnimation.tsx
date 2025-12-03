import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
    url: string;
    className?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ url, className }) => {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (isMounted) setAnimationData(data);
            })
            .catch(err => console.error("Failed to load Lottie", err));
        
        return () => { isMounted = false; };
    }, [url]);

    if (!animationData) return null;

    return <Lottie animationData={animationData} className={className} loop={true} />;
};

export default LottieAnimation;