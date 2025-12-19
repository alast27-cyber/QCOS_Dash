import React, { useState, useEffect } from 'react';
import { ThermometerIcon } from './Icons';

interface QPUCoreTempsProps {
    tempEfficiency: number;
}

const TempBar = ({ label, temp, maxTemp }: { label: string; temp: number; maxTemp: number }) => {
    const [displayPercentage, setDisplayPercentage] = useState(0);
    
    useEffect(() => {
        const targetPercentage = (temp / maxTemp) * 100;
        const timer = setTimeout(() => setDisplayPercentage(targetPercentage), 100);
        return () => clearTimeout(timer);
    }, [temp, maxTemp]);

    const isCritical = displayPercentage > 85;

    return (
        <div className="w-full text-xs mb-3">
            <div className="flex justify-between mb-1">
                <span className="text-cyan-300">{label}</span>
                <span className={`font-bold ${isCritical ? 'text-red-400' : 'text-white'}`}>{temp.toFixed(2)} mK</span>
            </div>
            <div className="w-full h-2 bg-cyan-900/50 rounded-full overflow-hidden border border-cyan-500/20">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isCritical ? 'bg-red-500 heat-shimmer-effect' : 'bg-cyan-400'}`}
                    style={{ width: `${displayPercentage}%` }}
                >
                </div>
            </div>
        </div>
    );
};


const QPUCoreTemps: React.FC<QPUCoreTempsProps> = ({ tempEfficiency }) => {
  const [coreTemps, setCoreTemps] = useState([10.53, 11.12, 13.98, 10.77]);

  useEffect(() => {
    const interval = setInterval(() => {
        setCoreTemps(prevTemps => 
            prevTemps.map(temp => {
                const fluctuation = (Math.random() - 0.5) * 0.2;
                // The baseline temperature is now affected by the efficiency factor
                const baseTemp = temp * tempEfficiency;
                const newTemp = baseTemp + fluctuation;
                // Clamp the temperature between a realistic min and max
                return Math.max(8.0, Math.min(14.5, newTemp));
            })
        );
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, [tempEfficiency]);

  return (
    <div className="w-full h-full flex flex-col p-4">
        <div className="flex items-center text-cyan-300 mb-4 flex-shrink-0">
            <ThermometerIcon className="w-6 h-6 mr-2"/>
            <h3 className="text-base font-bold tracking-widest">QPU CORE TEMPS</h3>
        </div>
        <div className="flex-grow w-full flex flex-col justify-around">
            <TempBar label="Core 0 (A7)" temp={coreTemps[0]} maxTemp={15} />
            <TempBar label="Core 1 (B2)" temp={coreTemps[1]} maxTemp={15} />
            <TempBar label="Core 2 (C9)" temp={coreTemps[2]} maxTemp={15} />
            <TempBar label="Core 3 (D4)" temp={coreTemps[3]} maxTemp={15} />
        </div>
    </div>
  );
};

export default QPUCoreTemps;