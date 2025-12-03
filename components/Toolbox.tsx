import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { MoonIcon, PaletteIcon, SunIcon } from './icons';
import ColorPicker from './ColorPicker';
import { useSoundEffects } from '../hooks/useSoundEffects';

const Toolbox: React.FC = () => {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const [pickerOpen, setPickerOpen] = useState(false);
  const { playClick } = useSoundEffects();

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick(e);
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const handlePickerToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick(e);
    setPickerOpen(!pickerOpen);
  };


  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      <div className="relative">
        <button
          onClick={handlePickerToggle}
          className="w-12 h-12 flex items-center justify-center bg-background-secondary rounded-full shadow-lg text-text-primary hover:bg-background-tertiary transition-colors"
          aria-label="Change accent color"
        >
          <PaletteIcon size={24} />
        </button>
        {pickerOpen && (
          <div className="absolute bottom-14 right-0">
            <ColorPicker currentColor={accentColor} onColorChange={setAccentColor} />
          </div>
        )}
      </div>

      <button
        onClick={handleThemeToggle}
        className="w-12 h-12 flex items-center justify-center bg-background-secondary rounded-full shadow-lg text-text-primary hover:bg-background-tertiary transition-colors"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <SunIcon size={24} /> : <MoonIcon size={24} />}
      </button>
    </div>
  );
};

export default Toolbox;