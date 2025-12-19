import React from 'react';
import { Share2Icon, PowerIcon, SearchIcon, CpuChipIcon } from './Icons';

interface PlaceholderContentProps {
  title: string;
  icon: 'network' | 'power' | 'search' | 'cpu';
}

const icons = {
    network: Share2Icon,
    power: PowerIcon,
    search: SearchIcon,
    cpu: CpuChipIcon,
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ title, icon }) => {
  const Icon = icons[icon];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center text-cyan-400/70">
        <Icon className="w-12 h-12 mx-auto text-cyan-600/70" />
        <h3 className="text-base tracking-widest mt-3">{title}</h3>
        <p className="text-xs">Data view unavailable</p>
      </div>
    </div>
  );
};

export default PlaceholderContent;