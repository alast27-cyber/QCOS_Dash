import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GaugeIcon, UploadCloudIcon, DownloadCloudIcon, FastForwardIcon, ServerCogIcon } from './Icons';

type SimulationStatus = 'idle' | 'running' | 'optimizing' | 'hiving';

interface QuantumSpeedometerProps {
    processingSpeed: number;
}

const QuantumSpeedometer: React.FC<QuantumSpeedometerProps> = ({ processingSpeed }) => {
    const [status, setStatus] = useState<SimulationStatus>('idle');
    const [speed, setSpeed] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const MAX_SPEED = 1000 * processingSpeed; // Base speed scaled by the efficiency multiplier
    const valueToAngle = (value: number) => {
        const percentage = Math.min(Math.max(value / MAX_SPEED, 0), 1);
        return -90 + percentage * 180;
    };
    
    const handleSimAction = useCallback((newStatus: SimulationStatus) => {
        setStatus(currentStatus => {
            if (currentStatus === newStatus) return 'idle';
            if (newStatus === 'optimizing') {
                setTimeout(() => setStatus('running'), 3000);
            }
            return newStatus;
        });
    }, []);

    useEffect(() => {
        // Automatically start the simulation when the component mounts
        handleSimAction('running');
    }, [handleSimAction]);

    useEffect(() => {
        if (status !== 'idle') {
            intervalRef.current = window.setInterval(() => {
                let targetSpeed = 0;
                let baseUpload = 0;
                let baseDownload = 0;

                switch (status) {
                    case 'running':
                        targetSpeed = MAX_SPEED * (0.6 + Math.random() * 0.15); // 60-75%
                        baseUpload = 40 * processingSpeed;
                        baseDownload = 80 * processingSpeed;
                        break;
                    case 'optimizing':
                        targetSpeed = MAX_SPEED * (0.9 + Math.random() * 0.1); // 90-100%
                        baseUpload = 90 * processingSpeed;
                        baseDownload = 180 * processingSpeed;
                        break;
                    case 'hiving':
                        targetSpeed = MAX_SPEED * (0.75 + Math.random() * 0.1); // 75-85%
                        baseUpload = 150 * processingSpeed;
                        baseDownload = 300 * processingSpeed;
                        break;
                }
                
                setSpeed(prev => prev + (targetSpeed - prev) * 0.2);
                setUploadSpeed(baseUpload + (Math.random() - 0.5) * 10);
                setDownloadSpeed(baseDownload + (Math.random() - 0.5) * 20);

            }, 500);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setSpeed(0);
            setUploadSpeed(0);
            setDownloadSpeed(0);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [status, MAX_SPEED, processingSpeed]);

    const statusTextMap: Record<SimulationStatus, string> = {
        idle: "Idle",
        running: "Running Simulation",
        optimizing: "Optimizing Speed...",
        hiving: "Hiving Simulation Active"
    };

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="flex items-center text-cyan-300 mb-4 flex-shrink-0">
                <GaugeIcon className="w-6 h-6 mr-2" />
                <h3 className="text-base font-bold tracking-widest">QUANTUM SPEEDOMETER</h3>
            </div>

            <div className="flex-grow w-full flex flex-col items-center justify-center relative">
                <svg viewBox="0 0 200 120" className="w-full max-w-[300px]">
                    <defs>
                        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0891b2" />
                            <stop offset="50%" stopColor="#00FFFF" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                         <filter id="needle-glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <path d="M 10 100 A 90 90 0 0 1 190 100" stroke="url(#gauge-grad)" strokeWidth="10" fill="none" strokeLinecap="round" />
                    <g transform={`rotate(${valueToAngle(speed)} 100 100)`} style={{ transition: 'transform 0.5s ease-out' }}>
                        <path d="M 100 100 L 100 20" stroke="white" strokeWidth="2" strokeLinecap="round" filter="url(#needle-glow)" />
                        <circle cx="100" cy="100" r="4" fill="white" />
                    </g>
                    <text x="100" y="75" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">{speed.toFixed(0)}</text>
                    <text x="100" y="90" textAnchor="middle" fill="cyan" fontSize="8">PETA Q-FLOPS</text>
                </svg>

                <p className="text-lg text-cyan-300 mt-2">{statusTextMap[status]}</p>

                <div className="w-full grid grid-cols-2 gap-4 mt-6 text-center">
                    <div className="bg-black/20 p-3 rounded-lg border border-cyan-900">
                        <p className="text-sm text-cyan-400 flex items-center justify-center"><UploadCloudIcon className="w-4 h-4 mr-2"/> UPLOAD</p>
                        <p className="text-2xl font-bold text-white">{uploadSpeed.toFixed(1)} <span className="text-base text-cyan-500">Tb/s</span></p>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-cyan-900">
                        <p className="text-sm text-cyan-400 flex items-center justify-center"><DownloadCloudIcon className="w-4 h-4 mr-2"/> DOWNLOAD</p>
                        <p className="text-2xl font-bold text-white">{downloadSpeed.toFixed(1)} <span className="text-base text-cyan-500">Tb/s</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 flex-shrink-0">
                <button onClick={() => handleSimAction('running')} className={`p-2 rounded-md border text-xs font-bold transition-colors ${status === 'running' ? 'bg-cyan-500/40 border-cyan-400 text-white' : 'bg-cyan-500/10 border-cyan-800 text-cyan-300 hover:bg-cyan-500/20'}`}>
                    START SIM
                </button>
                 <button onClick={() => handleSimAction('optimizing')} className={`p-2 rounded-md border text-xs font-bold transition-colors flex items-center justify-center ${status === 'optimizing' ? 'bg-purple-500/40 border-purple-400 text-white' : 'bg-purple-500/10 border-purple-800 text-purple-300 hover:bg-purple-500/20'}`}>
                    <FastForwardIcon className="w-4 h-4 mr-1"/> OPTIMIZE
                </button>
                 <button onClick={() => handleSimAction('hiving')} className={`p-2 rounded-md border text-xs font-bold transition-colors flex items-center justify-center ${status === 'hiving' ? 'bg-yellow-500/40 border-yellow-400 text-white' : 'bg-yellow-500/10 border-yellow-800 text-yellow-300 hover:bg-yellow-500/20'}`}>
                    <ServerCogIcon className="w-4 h-4 mr-1"/> HIVING SIM
                </button>
            </div>
        </div>
    );
};

export default QuantumSpeedometer;