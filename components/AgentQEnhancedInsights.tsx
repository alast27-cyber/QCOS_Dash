
import React, { useState, useEffect } from 'react';
import GlassPanel from './GlassPanel';
import { ChartBarIcon, RocketLaunchIcon, UploadCloudIcon, CpuChipIcon } from './Icons';
import { SystemHealth } from '../App';

interface AgentQEnhancedInsightsProps {
    systemHealth: SystemHealth;
}

const AgentQEnhancedInsights: React.FC<AgentQEnhancedInsightsProps> = ({ systemHealth }) => {
    const [trainingProgress, setTrainingProgress] = useState(98.7);
    const [qpuUtilization, setQpuUtilization] = useState(85.2);
    const [cumulativeData, setCumulativeData] = useState(78.4);
    
    // Base efficiency gain plus dynamic gain from system health improvements
    const qAipsEfficiencyGain = 17.3 + (systemHealth.ipsThroughput - 1.337) / 1.337 * 100;
    const webGatewayLatencyReduction = 12.5;

    useEffect(() => {
        const interval = setInterval(() => {
            setTrainingProgress(p => Math.min(100, p + 0.005));
            setQpuUtilization(u => Math.max(80, Math.min(95, u + (Math.random() - 0.5) * 2)));
            setCumulativeData(d => d + 0.01);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <GlassPanel title="Agent Q Core: Enhanced QNN Insights">
            <div className="flex flex-col space-y-4 p-4 text-cyan-300 h-full">
                {/* Dynamic Training Progression */}
                <div className="flex items-center space-x-3">
                    <RocketLaunchIcon className="h-6 w-6 text-cyan-400" />
                    <div className="flex-1">
                        <h3 className="text-base font-semibold">Project Chimera Training</h3>
                        <div className="w-full bg-cyan-900 rounded-full h-2.5 mt-1">
                            <div
                                className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                                style={{ width: `${trainingProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm mt-1">{trainingProgress.toFixed(1)}% Complete</p>
                    </div>
                </div>

                {/* Interactive Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-start p-3 bg-cyan-900/30 rounded-lg">
                        <ChartBarIcon className="h-5 w-5 text-cyan-400 mb-1" />
                        <span className="text-sm text-gray-300">Q-AIPS Efficiency Gain:</span>
                        <span className="text-lg font-bold text-cyan-300">+{qAipsEfficiencyGain.toFixed(1)}%</span>
                        <p className="text-xs text-gray-400">vs. baseline</p>
                    </div>
                    <div className="flex flex-col items-start p-3 bg-cyan-900/30 rounded-lg">
                        <CpuChipIcon className="h-5 w-5 text-cyan-400 mb-1" />
                        <span className="text-sm text-gray-300">QPU Utilization:</span>
                        <span className="text-lg font-bold text-cyan-300">{qpuUtilization.toFixed(1)}%</span>
                        <p className="text-xs text-gray-400">QNN ops avg</p>
                    </div>
                </div>

                {/* Real-time Data Stream */}
                <div className="flex items-center space-x-3 mt-2">
                    <UploadCloudIcon className="h-6 w-6 text-cyan-400" />
                    <div>
                        <h3 className="text-base font-semibold">Cumulative Data Processed</h3>
                        <p className="text-xl font-bold text-cyan-300">{cumulativeData.toFixed(2)} PB</p>
                    </div>
                </div>
                
                <div className="flex-grow"></div>

                {/* Quantum-to-Web Gateway Integration Insight */}
                <div className="mt-4 p-3 bg-gradient-to-r from-cyan-900/50 to-transparent border-l-4 border-cyan-500 rounded-r-lg flex-shrink-0">
                    <h4 className="font-semibold text-cyan-200">Quantum-to-Web Gateway</h4>
                    <p className="text-sm text-gray-300">
                        Self-optimization protocols resulted in a <span className="font-bold text-cyan-100">{webGatewayLatencyReduction.toFixed(1)}%</span> reduction in average latency for public-facing CHIPS applications.
                    </p>
                </div>
            </div>
        </GlassPanel>
    );
};

export default AgentQEnhancedInsights;
