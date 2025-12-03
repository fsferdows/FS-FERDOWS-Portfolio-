// Fix: Import MouseEvent type from 'react' to resolve "Cannot find namespace 'React'" error and update its usage.
import type { MouseEvent } from 'react';

let audioContext: AudioContext | null = null;
let mainGain: GainNode | null = null;

const getAudioContext = (): AudioContext | null => {
    if (typeof window !== 'undefined' && !audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            mainGain = audioContext.createGain();
            mainGain.gain.value = 0.5; // Global volume
            mainGain.connect(audioContext.destination);
        } catch (e) {
            console.error("Web Audio API is not supported in this browser");
            return null;
        }
    }
    return audioContext;
};

export const initAudio = () => {
    const context = getAudioContext();
    if (context && context.state === 'suspended') {
        context.resume();
    }
};

// Updated event type to accept any MouseEvent to prevent strict type mismatches with Element vs HTMLElement
const playSound = (type: 'click' | 'open' | 'close' | 'hover', event?: MouseEvent<any>) => {
    const context = getAudioContext();
    if (!context || !mainGain) return;

    if (context.state === 'suspended') {
        context.resume().catch(console.error);
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const panner = context.createStereoPanner();
    
    gainNode.connect(panner);
    panner.connect(mainGain);
    oscillator.connect(gainNode);

    const now = context.currentTime;
    
    if (event && typeof event.clientX === 'number') {
        const panValue = (event.clientX / window.innerWidth) * 2 - 1;
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panValue)), now);
    } else {
        panner.pan.setValueAtTime(0, now); // Center pan if no event
    }


    switch (type) {
        case 'click':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, now);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
        case 'open':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(220, now);
            oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.2);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
        case 'close':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, now);
            oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.2);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
        case 'hover':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(900, now);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            oscillator.start(now);
            oscillator.stop(now + 0.08);
            break;
    }
};

export const audioManager = {
    init: initAudio,
    playClick: (event?: MouseEvent<any>) => playSound('click', event),
    playOpen: () => playSound('open'),
    playClose: () => playSound('close'),
    playHover: (event?: MouseEvent<any>) => playSound('hover', event),
    getContext: getAudioContext,
};