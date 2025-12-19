
import React, { useEffect, useState } from 'react';

const CELL_COUNT = 50; // 10x5 grid

interface MemoryMatrixProps {
    lastActivity: number;
    memorySummary: string | null;
}

const MemoryMatrix: React.FC<MemoryMatrixProps> = ({ lastActivity, memorySummary }) => {
    const [activeCells, setActiveCells] = useState<Set<number>>(new Set());
    const [memoryIntegrity, setMemoryIntegrity] = useState(98.3);

    // Effect for the random background activity
    useEffect(() => {
        const interval = setInterval(() => {
            const newActiveCells = new Set<number>();
            const numActive = Math.floor(Math.random() * 3) + 1; // Less background noise
            for (let i = 0; i < numActive; i++) {
                newActiveCells.add(Math.floor(Math.random() * CELL_COUNT));
            }
            setActiveCells(newActiveCells);
            setMemoryIntegrity(integrity => Math.max(90, Math.min(99.9, integrity + (Math.random() - 0.5) * 0.5)));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Effect for flashing on new activity
    useEffect(() => {
        if (lastActivity > 0) {
            const burstCells = new Set<number>();
            const numActive = Math.floor(Math.random() * 10) + 5;
            for (let i = 0; i < numActive; i++) {
                burstCells.add(Math.floor(Math.random() * CELL_COUNT));
            }
            setActiveCells(current => new Set([...current, ...burstCells]));

            const timer = setTimeout(() => {
                setActiveCells(current => {
                    const next = new Set(current);
                    burstCells.forEach(cell => next.delete(cell));
                    return next;
                });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [lastActivity]);

    return (
        <div className="w-full flex-shrink-0 p-2">
            <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: CELL_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-full h-2 rounded-sm transition-all duration-500 ${activeCells.has(i) ? 'bg-cyan-400 shadow-[0_0_4px_theme(colors.cyan.300)]' : 'bg-slate-800/50'}`}
                    />
                ))}
            </div>
            <div className="text-center mt-2">
                <p className="text-xs text-cyan-300 tracking-widest">COGNITIVE BUFFER</p>
                
                <div className={`flex items-center justify-center space-x-2`}>
                    <span className="text-xs text-cyan-500">Memory Integrity:</span>
                    <div className="w-24 h-1 bg-cyan-900/50 rounded-full overflow-hidden border border-cyan-700/50">
                        <div className="h-full bg-cyan-400" style={{ width: `${memoryIntegrity}%` }}></div>
                    </div>
                    <span className="text-xs font-mono text-white">{memoryIntegrity.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
};

export default MemoryMatrix;
