import React, { useState } from 'react';
import Section from './Section';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { CopyIcon, CheckIcon } from './icons';

const Contact: React.FC = () => {
    const { playClick } = useSoundEffects();
    const [copied, setCopied] = useState(false);
    const email = "hello@fsferdow.com";

    const handleCopy = (e: React.MouseEvent) => {
        playClick(e);
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Section id="contact" title="Get In Touch">
            <div className="max-w-2xl mx-auto text-center">
                <p className="text-lg text-text-secondary mb-8">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision. Feel free to reach out.
                </p>
                
                <div className="flex flex-col items-center gap-6">
                    <a 
                        href={`mailto:${email}`}
                        onClick={(e) => playClick(e)}
                        className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-80 transition-transform transform hover:scale-105 shadow-lg hover:shadow-accent/50"
                    >
                        Say Hello
                    </a>

                    <div className="flex items-center gap-3 p-2 pl-4 pr-2 bg-glass-bg border border-glass-border rounded-full backdrop-blur-sm transition-all hover:border-accent/50">
                        <span className="text-text-secondary font-medium select-all">{email}</span>
                        <button
                            onClick={handleCopy}
                            className={`p-2 rounded-full transition-all duration-300 ${
                                copied 
                                ? 'bg-green-500 text-white' 
                                : 'bg-background-tertiary text-text-primary hover:bg-accent hover:text-white'
                            }`}
                            aria-label="Copy email address"
                            title="Copy to clipboard"
                        >
                            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Contact;