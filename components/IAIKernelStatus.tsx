import React, { useState, useEffect } from 'react';
import { CpuChipIcon, LoaderIcon } from './Icons';

interface IAIKernelStatusProps {
    isRecalibrating: boolean;
}

const IAIKernelStatus: React.FC<IAIKernelStatusProps> = ({ isRecalibrating }) => {
    const [status, setStatus] = useState({
        ips: 3.2,
        load: 37,
    });

    useEffect(() => {
        // Don't run the simulation if recalibrating
        if (isRecalibrating) return;

        const interval = setInterval(() => {
            setStatus(prevStatus => {
                const ipsFluctuation = (Math.random() - 0.5) * 0.2;
                const newIps = prevStatus.ips + ipsFluctuation;

                const loadFluctuation = (Math.random() - 0.5) * 4;
                const newLoad = prevStatus.load + loadFluctuation;

                return {
                    ips: Math.max(2.8, Math.min(3.6, newIps)),
                    load: Math.max(30, Math.min(50, newLoad)),
                };
            });
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, [isRecalibrating]); // Rerun effect if recalibration state changes

    if (isRecalibrating) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center">
                <LoaderIcon className="w-16 h-16 text-cyan-400 animate-spin" />
                <h3 className="text-lg font-bold text-white mt-4">Recalibrating...</h3>
                <p className="text-sm text-cyan-300">Please wait while sensors are recalibrated.</p>
            </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col items-center justify-center text-center animate-phase-shift">
            <CpuChipIcon className="w-16 h-16 text-cyan-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white mt-4">IAI Kernel: <span className="text-green-400">ACTIVE</span></h3>
            <p className="text-sm text-cyan-300">Instinctive AI Processing Core</p>
            <div className="mt-4 w-full text-xs space-y-1 text-left max-w-xs">
                <div className="flex justify-between border-b border-cyan-500/20 py-1"><span>Threads:</span> <span className="text-white font-mono">1024</span></div>
                <div className="flex justify-between border-b border-cyan-500/20 py-1"><span>IPS:</span> <span className="text-white font-mono">~{status.ips.toFixed(2)} TFLOPs</span></div>
                <div className="flex justify-between py-1"><span>Load:</span> <span className="text-white font-mono">{status.load.toFixed(1)}%</span></div>
            </div>
        </div>
    );
};

export default IAIKernelStatus;