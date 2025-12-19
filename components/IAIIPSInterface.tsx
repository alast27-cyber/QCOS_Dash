import React, { useState, useEffect } from 'react';

interface IAIIPSInterfaceProps {
    ipsThroughput: number;
}

const MetricDisplay = ({ label, value, unit }: { label: string, value: string, unit: string }) => (
    <div>
        <p className="text-xs text-cyan-400 tracking-wider">{label}</p>
        <p className="text-lg font-mono text-white">{value}<span className="text-xs text-cyan-500 ml-1">{unit}</span></p>
    </div>
);

const IAIIPSInterface: React.FC<IAIIPSInterfaceProps> = ({ ipsThroughput }) => {
    const [throughput, setThroughput] = useState(ipsThroughput);
    const [latency, setLatency] = useState(0.42);
    const [load, setLoad] = useState(67.3);

    useEffect(() => {
        const interval = setInterval(() => {
            // The baseline throughput is now driven by the prop
            setThroughput(t => ipsThroughput + (Math.random() - 0.5) * 0.05);
            setLatency(l => Math.max(0.3, l + (Math.random() - 0.5) * 0.02));
            setLoad(l => Math.min(95, Math.max(40, l + (Math.random() - 0.5) * 2)));
        }, 1500);
        return () => clearInterval(interval);
    }, [ipsThroughput]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2" style={{ perspective: '800px' }}>
            {/* 3D Container */}
            <div className="relative w-full h-4/5" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(50deg) rotateZ(-30deg)' }}>
                {/* Synapse Connections SVG */}
                <svg className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(-50px)' }}>
                    <defs>
                        <linearGradient id="synapseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(0,255,255,0)" />
                            <stop offset="50%" stopColor="rgba(0,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(0,255,255,0)" />
                        </linearGradient>
                        <marker id="synapse-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                            <circle cx="5" cy="5" r="5" fill="#00ffff" />
                        </marker>
                    </defs>
                    {/* Connections from Input to Processing */}
                    <path d="M 20 50 C 50 50, 50 20, 80 20" stroke="rgba(0,255,255,0.2)" strokeWidth="1" fill="none" />
                    <path d="M 20 50 C 50 50, 50 80, 80 80" stroke="rgba(0,255,255,0.2)" strokeWidth="1" fill="none" />
                    {/* Connections from Processing to Output */}
                    <path d="M 120 20 C 150 20, 150 50, 180 50" stroke="rgba(0,255,255,0.2)" strokeWidth="1" fill="none" />
                    <path d="M 120 80 C 150 80, 150 50, 180 50" stroke="rgba(0,255,255,0.2)" strokeWidth="1" fill="none" />
                    
                    {/* Animated Particles */}
                    <g>
                        <path d="M 20 50 C 50 50, 50 20, 80 20" fill="none" id="p1" />
                        <circle r="2" fill="cyan" filter="url(#node-glow)">
                            <animateMotion dur="2s" repeatCount="indefinite" path="M 20 50 C 50 50, 50 20, 80 20" />
                        </circle>
                        <path d="M 120 80 C 150 80, 150 50, 180 50" fill="none" id="p2" />
                        <circle r="2" fill="cyan" filter="url(#node-glow)">
                            <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s" path="M 120 80 C 150 80, 150 50, 180 50" />
                        </circle>
                    </g>
                </svg>

                {/* Layers */}
                <div className="absolute inset-0 flex justify-between items-center text-white">
                    {/* Input Layer */}
                    <div className="w-1/4 h-full bg-cyan-500/10 border border-cyan-400/50 rounded-lg flex flex-col items-center justify-center p-2" style={{ transform: 'translateZ(80px)' }}>
                        <p className="text-xs font-bold tracking-widest">INPUT</p>
                    </div>
                    {/* Processing Layer */}
                    <div className="w-1/4 h-full bg-purple-500/10 border border-purple-400/50 rounded-lg flex flex-col items-center justify-center p-2">
                        <p className="text-xs font-bold tracking-widest">PROCESSING</p>
                    </div>
                    {/* Output Layer */}
                    <div className="w-1/4 h-full bg-green-500/10 border border-green-400/50 rounded-lg flex flex-col items-center justify-center p-2" style={{ transform: 'translateZ(-80px)' }}>
                         <p className="text-xs font-bold tracking-widest">OUTPUT</p>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="w-full flex justify-around items-center pt-2 mt-2 border-t border-cyan-500/20">
                <MetricDisplay label="IPS Throughput" value={throughput.toFixed(3)} unit="TIPS" />
                <MetricDisplay label="Synaptic Latency" value={latency.toFixed(2)} unit="ms" />
                <MetricDisplay label="Cognitive Load" value={load.toFixed(1)} unit="%" />
            </div>
        </div>
    );
};

export default IAIIPSInterface;