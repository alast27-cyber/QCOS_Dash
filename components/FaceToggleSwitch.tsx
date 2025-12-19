import React from 'react';

interface FaceToggleSwitchProps {
  showBack: boolean;
  onToggle: () => void;
}

const FaceToggleSwitch: React.FC<FaceToggleSwitchProps> = ({ showBack, onToggle }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-fade-in-up">
      <div className="flex items-center bg-black/50 border border-cyan-400/50 rounded-lg p-1 backdrop-blur-sm shadow-[0_0_20px_theme(colors.cyan.400)]">
        <button
          onClick={!showBack ? undefined : onToggle}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${
            !showBack ? 'bg-cyan-400/80 text-slate-900 shadow-[0_0_10px_theme(colors.cyan.300)]' : 'text-cyan-300 hover:bg-white/10'
          }`}
        >
          Front Face
        </button>
        <button
          onClick={showBack ? undefined : onToggle}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${
            showBack ? 'bg-cyan-400/80 text-slate-900 shadow-[0_0_10px_theme(colors.cyan.300)]' : 'text-cyan-300 hover:bg-white/10'
          }`}
        >
          Back Face
        </button>
      </div>
    </div>
  );
};

export default FaceToggleSwitch;
