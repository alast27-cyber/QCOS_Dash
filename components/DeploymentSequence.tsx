import React, { useState, useEffect } from 'react';
import { LoaderIcon, CheckCircle2Icon, CpuChipIcon } from './Icons';

interface DeploymentSequenceProps {
  onComplete: () => void;
}

const CHECKS = [
  'Initializing QCOS Core...',
  'Establishing Quantum Network Link...',
  'Verifying IAI Kernel Integrity...',
  'Calibrating Holographic Display...',
  'Deploying v3.11 to Q-Net...',
  'System Online. Welcome, Operator.',
];

const DeploymentSequence: React.FC<DeploymentSequenceProps> = ({ onComplete }) => {
  const [activeCheck, setActiveCheck] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCheck(prev => {
        const next = prev + 1;
        if (next >= CHECKS.length) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 1000); // Wait for fade out animation
          }, 1000); // Hold on final message
          return prev;
        }
        return next;
      });
    }, 700); // Time per check

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ pointerEvents: isFadingOut ? 'none' : 'auto' }}
    >
      <CpuChipIcon className="w-16 h-16 text-cyan-400 animate-pulse-bright mb-8" />
      <div className="w-full max-w-md space-y-3 font-mono text-cyan-200">
        {CHECKS.map((text, index) => (
          <div 
            key={index}
            className={`flex items-center space-x-4 transition-all duration-300 ${activeCheck >= index ? 'opacity-100' : 'opacity-30'}`}
          >
            <div className="w-6 flex-shrink-0 flex items-center justify-center">
              {activeCheck > index ? (
                <CheckCircle2Icon className="w-5 h-5 text-green-400 animate-fade-in" />
              ) : activeCheck === index ? (
                <LoaderIcon className="w-5 h-5 text-cyan-300 animate-spin" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-cyan-800" />
              )}
            </div>
            <span className={activeCheck === index ? 'text-white' : ''}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentSequence;