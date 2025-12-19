import React from 'react';

interface HolographicContainerProps {
  children: React.ReactNode;
  targetRotation: { x: number; y: number };
  isDragging: boolean;
  size: number;
  scale: number;
}

const HolographicContainer: React.FC<HolographicContainerProps> = ({ children, targetRotation, isDragging, size, scale }) => {
  const transitionClass = isDragging ? '' : 'transition-holographic';
  
  const style: React.CSSProperties = {
      transform: `scale(${scale}) rotateX(${targetRotation.x}deg) rotateY(${targetRotation.y}deg)`,
      width: `${size}px`,
      height: `${size}px`,
  };

  return (
    <div
      className={`relative transform-style-preserve-3d ${transitionClass}`}
      style={style}
    >
      {React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child, { size } as any) : child
      )}
    </div>
  );
};

export default HolographicContainer;
