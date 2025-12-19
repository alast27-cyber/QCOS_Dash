import React from 'react';

interface GlassPanelProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ title, children, className = '', style }) => {
  return (
    <div 
      className={`
        border rounded-lg 
        shadow-[0_0_30px_theme(colors.cyan.400),inset_0_0_20px_theme(colors.cyan.600)/50] 
        flex flex-col h-full overflow-hidden transition-all duration-300
        group-hover:border-cyan-300 group-hover:shadow-[0_0_45px_theme(colors.cyan.300),inset_0_0_25px_theme(colors.cyan.500)/50]
        animate-border-shimmer
        ${className}
      `}
      style={{
          ...style,
          background: 'radial-gradient(ellipse at center, rgba(0, 25, 30, 0.5) 0%, rgba(0, 10, 15, 0.8) 100%)'
      }}
    >
      <h2 className="text-sm sm:text-base font-bold text-cyan-200 tracking-wider border-b border-cyan-400/50 p-3 flex-shrink-0 bg-black/40 backdrop-blur-sm">
        {title}
      </h2>
      <div className="p-3 flex-grow overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default GlassPanel;