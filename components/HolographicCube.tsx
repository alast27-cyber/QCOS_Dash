import React from 'react';

interface HolographicCubeProps {
  children: React.ReactNode;
  size?: number;
}

const HolographicCube: React.FC<HolographicCubeProps> = ({ children, size = 300 }) => {
  const HALF_SIZE = size / 2;
  const faceStyles: React.CSSProperties[] = [
    // Front
    { transform: `rotateY(0deg) translateZ(${HALF_SIZE}px)` },
    // Right
    { transform: `rotateY(90deg) translateZ(${HALF_SIZE}px)` },
    // Back
    { transform: `rotateY(180deg) translateZ(${HALF_SIZE}px)` },
    // Left
    { transform: `rotateY(-90deg) translateZ(${HALF_SIZE}px)` },
    // Top
    { transform: `rotateX(90deg) translateZ(${HALF_SIZE}px)` },
    // Bottom
    { transform: `rotateX(-90deg) translateZ(${HALF_SIZE}px)` },
  ];

  return (
    <div className="absolute w-full h-full transform-style-preserve-3d">
      {React.Children.map(children, (child, index) => (
        <div
          className="absolute w-full h-full"
          style={faceStyles[index]}
        >
          {React.isValidElement(child) ? React.cloneElement(child, { index } as any) : child}
        </div>
      ))}
    </div>
  );
};

export default HolographicCube;
