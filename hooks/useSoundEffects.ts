import { audioManager } from '../utils/audioManager';

export const useSoundEffects = () => {
    return {
        playClick: audioManager.playClick,
        playOpen: audioManager.playOpen,
        playClose: audioManager.playClose,
        playHover: audioManager.playHover,
    };
};
