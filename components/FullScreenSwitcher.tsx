import React from 'react';
import { LayoutGridIcon, XIcon } from './Icons';

export interface SwitcherPanel {
  id: string;
  title: string;
  icon: React.FC<{ className?: string }>;
}

interface FullScreenSwitcherProps {
  isOpen: boolean;
  onToggle: () => void;
  corePanels: SwitcherPanel[];
  appPanels: SwitcherPanel[];
  onPanelSelect: (id: string) => void;
}

const FullScreenSwitcher: React.FC<FullScreenSwitcherProps> = ({ isOpen, onToggle, corePanels, appPanels, onPanelSelect }) => {
  const renderRing = (panels: SwitcherPanel[], radius: number, totalArc: number, startAngle: number) => {
    const angleStep = panels.length > 1 ? totalArc / (panels.length - 1) : 0;
    return panels.map((panel, index) => {
      const angle = startAngle - (index * angleStep);
      const x = radius * Math.cos(angle * Math.PI / 180);
      const y = radius * Math.sin(angle * Math.PI / 180);

      return (
        <div 
          key={panel.id} 
          className="absolute transition-all duration-300 ease-in-out group"
          style={{
            transform: isOpen ? `translate(${x}px, ${y}px) scale(1)` : 'translate(0, 0) scale(0)',
            opacity: isOpen ? 1 : 0,
            transitionDelay: `${isOpen ? index * 30 : (panels.length - index - 1) * 30}ms`
          }}
        >
          <button
            onClick={() => onPanelSelect(panel.id)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-700/80 border border-cyan-500/80 shadow-lg backdrop-blur-sm holographic-button"
            aria-label={`Focus ${panel.title}`}
          >
            <panel.icon className="w-6 h-6 text-cyan-200" />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {panel.title}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="fixed bottom-40 right-16 z-50 pointer-events-auto">
      <div className="relative flex items-center justify-center">
        {/* Rings */}
        {renderRing(corePanels, 130, 140, -110)}
        {renderRing(appPanels, 80, 100, -95)}

        {/* Main Toggle Button */}
        <button
          onClick={onToggle}
          className="w-14 h-14 rounded-full flex items-center justify-center relative
                     bg-cyan-500/30 border border-cyan-500/50 shadow-[0_0_15px_theme(colors.cyan.400)]
                     transition-all duration-300 holographic-button"
          aria-label="Toggle Full Screen Panel Selector"
          aria-expanded={isOpen}
        >
          <div className={`absolute transition-transform duration-300 ${isOpen ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}`}>
            <LayoutGridIcon className="w-7 h-7 text-cyan-200" />
          </div>
          <div className={`absolute transition-transform duration-300 ${isOpen ? 'rotate-0 scale-100' : '-rotate-180 scale-0'}`}>
            <XIcon className="w-7 h-7 text-cyan-200" />
          </div>
          {!isOpen && <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-30"></div>}
        </button>
      </div>
    </div>
  );
};

export default FullScreenSwitcher;