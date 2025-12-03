
// Fix: Provided full implementation for the ColorPicker component.
import React from 'react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const presetColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#22c55e', // green
  '#a855f7', // purple
  '#f97316', // orange
  '#ec4899', // pink
];

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange }) => {
  return (
    <div className="p-3 bg-background-tertiary rounded-lg shadow-lg border border-background-tertiary">
      <div className="grid grid-cols-3 gap-2">
        {presetColors.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 rounded-full cursor-pointer transition-transform transform hover:scale-110 ${currentColor === color ? 'ring-2 ring-offset-2 ring-offset-background-tertiary ring-white' : ''}`}
            style={{ backgroundColor: color }}
            aria-label={`Set accent color to ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
