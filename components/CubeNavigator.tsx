import React from 'react';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

type Direction = 'up' | 'down' | 'left' | 'right';

interface CubeNavigatorProps {
  onNavigate: (direction: Direction) => void;
}

const CubeNavigator: React.FC<CubeNavigatorProps> = ({ onNavigate }) => {
  const buttonBaseClasses = `
    absolute w-10 h-10 flex items-center justify-center
    bg-cyan-900/50 border border-cyan-400/50 rounded-md
    text-cyan-300 backdrop-blur-sm
    shadow-[0_0_10px_theme(colors.cyan.500)]
    holographic-button
  `;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-fade-in-up">
      <div className="relative w-32 h-32">
        <button
          onClick={() => onNavigate('up')}
          aria-label="Rotate Up"
          className={`${buttonBaseClasses} top-0 left-1/2 -translate-x-1/2`}
        >
          <ChevronUpIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => onNavigate('down')}
          aria-label="Rotate Down"
          className={`${buttonBaseClasses} bottom-0 left-1/2 -translate-x-1/2`}
        >
          <ChevronDownIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => onNavigate('left')}
          aria-label="Rotate Left"
          className={`${buttonBaseClasses} left-0 top-1/2 -translate-y-1/2`}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => onNavigate('right')}
          aria-label="Rotate Right"
          className={`${buttonBaseClasses} right-0 top-1/2 -translate-y-1/2`}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CubeNavigator;