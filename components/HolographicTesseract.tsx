import React, { useState, useEffect } from 'react';
import HolographicCube from './HolographicCube';

interface HolographicTesseractProps {
  children: React.ReactNode;
  size?: number;
}

const Edge: React.FC<{ p1: number[], p2: number[] }> = ({ p1, p2 }) => {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];

  const length = Math.sqrt(dx*dx + dy*dy + dz*dz);
  const midX = (p1[0] + p2[0]) / 2;
  const midY = (p1[1] + p2[1]) / 2;
  const midZ = (p1[2] + p2[2]) / 2;

  const rotY = Math.atan2(dx, dz) * (180 / Math.PI);
  const distXZ = Math.sqrt(dx*dx + dz*dz);
  const rotX = -Math.atan2(dy, distXZ) * (180 / Math.PI);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    transformStyle: 'preserve-3d',
    transform: `
      translateX(${midX}px)
      translateY(${midY}px)
      translateZ(${midZ}px)
      rotateY(${rotY}deg)
      rotateX(${rotX}deg)
    `,
  };

  const svgContainerStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${length}px`,
    height: '2px',
    transform: 'translateX(-50%) translateY(-50%)',
    overflow: 'visible',
  };

  return (
    <div style={containerStyle}>
        <svg style={svgContainerStyle}>
            <line
                x1="0" y1="1" x2={length} y2="1"
                stroke="rgba(0, 255, 255, 0.7)"
                strokeWidth="2"
                className="animate-flow"
            />
        </svg>
    </div>
  );
};

const Vertex: React.FC<{ position: number[] }> = ({ position }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,255,255,1) 0%, rgba(0,255,255,1) 60%)',
    boxShadow: '0 0 10px 2px rgba(0, 255, 255, 0.7)',
    transform: `translateX(-50%) translateY(-50%) translate3d(${position[0]}px, ${position[1]}px, ${position[2]}px) scale3d(1, 1, 1)`,
  };

  return <div style={style} className="animate-vertex-pulse" />;
};

const Rings: React.FC<{ size: number }> = ({ size }) => {
    const ringBaseStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        border: '2px solid rgba(0, 255, 255, 0.4)',
        borderRadius: '50%',
        transformStyle: 'preserve-3d',
        boxShadow: '0 0 10px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.2)',
    };
    
    return (
        <div className="absolute w-full h-full transform-style-preserve-3d">
             <div style={{...ringBaseStyle, width: size * 1.3, height: size * 1.3, margin: `-${size*0.65}px 0 0 -${size*0.65}px`}} className="animate-ring-1" />
             <div style={{...ringBaseStyle, width: size * 1.5, height: size * 1.5, margin: `-${size*0.75}px 0 0 -${size*0.75}px`}} className="animate-ring-2" />
             <div style={{...ringBaseStyle, width: size * 1.7, height: size * 1.7, margin: `-${size*0.85}px 0 0 -${size*0.85}px`}} className="animate-ring-3" />
        </div>
    )
}

const HolographicTesseract: React.FC<HolographicTesseractProps> = ({ children, size = 300 }) => {
  const [mainInnerRotation, setMainInnerRotation] = useState({x: 0, y: 0, z: 0});
  const [crystalRotation, setCrystalRotation] = useState({x: 0, y: 0, z: 0});

  useEffect(() => {
    let animationFrameId: number;
    const rotate = () => {
        const time = Date.now() * 0.0001;
        setMainInnerRotation({
            x: Math.sin(time * 1.1) * 180,
            y: Math.cos(time * 1.3) * 180,
            z: Math.sin(time * 1.5) * 180
        });
        setCrystalRotation({
            x: Math.cos(time * 1.7) * 180,
            y: Math.sin(time * 1.9) * 180,
            z: Math.cos(time * 2.1) * 180
        });
        animationFrameId = requestAnimationFrame(rotate);
    };
    animationFrameId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const outerSize = size;
  const innerSize = size * 0.5;
  const crystalSize = innerSize * 0.5;

  const innerFaces = [...Array(6)].map((_, i) => (
    <div key={`inner-face-${i}`} className="w-full h-full border border-cyan-700/50 bg-cyan-900/10 backdrop-blur-[2px]" />
  ));
  
  const crystalFaces = [...Array(6)].map((_, i) => (
    <div key={`crystal-face-${i}`} className="w-full h-full border border-cyan-600/60 bg-cyan-800/30" />
  ));

  const halfOuter = outerSize / 2;
  const halfInner = innerSize / 2;
  
  const vertices: { outer: number[]; inner: number[] }[] = [];
  [-1, 1].forEach(sx => {
    [-1, 1].forEach(sy => {
      [-1, 1].forEach(sz => {
        vertices.push({
          outer: [sx * halfOuter, sy * halfOuter, sz * halfOuter],
          inner: [sx * halfInner, sy * halfInner, sz * halfInner],
        });
      });
    });
  });

  return (
    <div className="absolute w-full h-full transform-style-preserve-3d">
      {/* Outer Gyroscopic Rings */}
      <Rings size={size} />

      {/* Outer Cube with Content */}
      <HolographicCube size={outerSize}>
        {children}
      </HolographicCube>

      {/* Inner Tesseract structure */}
      <div 
        className="absolute w-full h-full transform-style-preserve-3d animate-phase-shift" 
        style={{ transform: `rotateX(${mainInnerRotation.x}deg) rotateY(${mainInnerRotation.y}deg) rotateZ(${mainInnerRotation.z}deg)` }}
      >
        {/* Inner Cube */}
        <HolographicCube size={innerSize}>
          {innerFaces}
        </HolographicCube>
        
        {/* Crystal Core */}
        <div
            className="absolute w-full h-full transform-style-preserve-3d"
            style={{ transform: `rotateX(${crystalRotation.x}deg) rotateY(${crystalRotation.y}deg) rotateZ(${crystalRotation.z}deg)` }}
        >
             <div className="absolute w-full h-full transform-style-preserve-3d" style={{ transform: 'rotateX(45deg) rotateY(45deg)'}}>
                <HolographicCube size={crystalSize}>
                    {crystalFaces}
                </HolographicCube>
            </div>
        </div>
      </div>

      {/* Connecting Edges */}
      {vertices.map((v, i) => (
        <Edge key={`edge-${i}`} p1={v.inner} p2={v.outer} />
      ))}
      
      {/* Vertex Nodes */}
      {vertices.map((v, i) => (
        <React.Fragment key={`vertex-group-${i}`}>
          <Vertex position={v.outer} />
          <Vertex position={v.inner} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default HolographicTesseract;
