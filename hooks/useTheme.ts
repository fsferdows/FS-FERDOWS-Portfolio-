import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const hexToHsl = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [accentColor, setAccentColorState] = useState('#3b82f6'); // default blue

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const storedAccent = localStorage.getItem('accent-color');
    
    // Safe check for matchMedia
    let prefersDark = false;
    if (typeof window !== 'undefined' && window.matchMedia) {
        prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      setThemeState(prefersDark ? 'dark' : 'light');
    }
    
    if (storedAccent) {
      setAccentColorState(storedAccent);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    setThemeState(newTheme);
  };

  const setAccentColor = (color: string) => {
    localStorage.setItem('accent-color', color);
    const [h, s, l] = hexToHsl(color);
    document.documentElement.style.setProperty('--accent-hsl', `${h} ${s}% ${l}%`);
    setAccentColorState(color);
  };

  useEffect(() => {
    if (theme) setTheme(theme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
  
  useEffect(() => {
    if (accentColor) setAccentColor(accentColor);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accentColor]);

  return React.createElement(ThemeContext.Provider, { value: { theme, setTheme, accentColor, setAccentColor } }, children);
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};