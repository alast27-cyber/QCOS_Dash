
import React from 'react';

interface CubeFaceProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  isFocused: boolean;
  isCubeFocused: boolean;
}

const CubeFace: React.FC<CubeFaceProps> = ({ 
  children, className = '', isFocused, isCubeFocused
}) => {
  
  let faceClasses = `
    w-full h-full border-2
    p-4 flex flex-col text-white transition-all duration-500 ease-in-out relative
    ${className}
  `;

  if (isFocused) {
    faceClasses += `
      border-cyan-200 shadow-[0_0_70px_theme(colors.cyan.300),inset_0_0_60px_theme(colors.cyan.400)] holographic-grid
    `;
  } else if (isCubeFocused) {
    faceClasses += `
      border-cyan-800/50 shadow-none opacity-40 bg-black/50 holographic-grid
    `;
  } else {
    faceClasses += `
      border-cyan-400 shadow-[0_0_35px_theme(colors.cyan.400),inset_0_0_30px_theme(colors.cyan.600)] holographic-grid
    `;
  }

  return (
    <div className={faceClasses}>
      {isFocused && <div className="absolute inset-0 scanline-effect overflow-hidden rounded-lg"></div>}
      <div className={`w-full h-full flex flex-col animate-fade-in`}>
        {children}
      </div>
    </div>
  );
};

export default CubeFace;