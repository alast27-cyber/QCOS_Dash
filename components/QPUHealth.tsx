
import React from 'react';
import { SystemHealth } from '../App';
import QubitStabilityChart from './QubitStabilityChart';
import QubitStateVisualizer from './QubitStateVisualizer';
import DecoherenceDriftMonitor from './DecoherenceDriftMonitor';
import QPUCoreTemps from './QPUCoreTemps';

interface QPUHealthProps {
    systemHealth: SystemHealth;
}

const QPUHealth: React.FC<QPUHealthProps> = ({ systemHealth }) => {
    return (
        <div className="h-full w-full grid grid-cols-1 grid-rows-4 lg:grid-cols-2 lg:grid-rows-2 gap-2">
            <div className="bg-black/20 p-2 rounded-lg border border-cyan-900/50"><QubitStabilityChart qubitStability={systemHealth.qubitStability} /></div>
            <div className="bg-black/20 p-2 rounded-lg border border-cyan-900/50"><DecoherenceDriftMonitor decoherenceFactor={systemHealth.decoherenceFactor} /></div>
            <div className="bg-black/20 rounded-lg border border-cyan-900/50"><QPUCoreTemps tempEfficiency={systemHealth.qpuTempEfficiency} /></div>
            <div className="bg-black/20 rounded-lg border border-cyan-900/50"><QubitStateVisualizer qubitStability={systemHealth.qubitStability} /></div>
        </div>
    );
};

export default QPUHealth;
