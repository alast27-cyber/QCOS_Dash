import React, { useState, useEffect } from 'react';

const QUBIT_COUNT = 32;

type QubitState = 'zero' | 'one' | 'superposition';

interface QubitStateVisualizerProps {
    qubitStability: number;
}

const Qubit = React.memo(({ state, isSelected }: { state: QubitState; isSelected: boolean }) => {
    const baseClasses = "w-5 h-5 rounded-full transition-all duration-500";
    const stateClasses = {
        zero: 'bg-blue-500 border-2 border-blue-300 shadow-[0_0_8px_theme(colors.blue.400)]',
        one: 'bg-purple-500 border-2 border-purple-300 shadow-[0_0_8px_theme(colors.purple.400)]',
        superposition: 'bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-cyan-300 animate-pulse',
    };
    const selectionRing = isSelected ? <div className="absolute -inset-1.5 rounded-full border-2 border-yellow-400 animate-bloom-pulse ring-2 ring-yellow-300/50"></div> : null;

    return (
        <div className="relative w-8 h-8 flex items-center justify-center">
            {selectionRing}
            <div className={`${baseClasses} ${stateClasses[state]}`} />
        </div>
    );
});

const QubitStateVisualizer: React.FC<QubitStateVisualizerProps> = ({ qubitStability }) => {
    const [qubitStates, setQubitStates] = useState<QubitState[]>(() => 
        Array.from({ length: QUBIT_COUNT }, () => 'zero')
    );
    const [selectedQubit, setSelectedQubit] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            // Pause automatic updates if a qubit is selected for manual control
            if (selectedQubit !== null) return;

            setQubitStates(states => {
                const newStates = [...states];
                const indexToChange = Math.floor(Math.random() * QUBIT_COUNT);
                const randomState = Math.random();
                if (randomState < 0.45) newStates[indexToChange] = 'zero';
                else if (randomState < 0.9) newStates[indexToChange] = 'one';
                else newStates[indexToChange] = 'superposition';
                return newStates;
            });
        }, qubitStability);

        return () => clearInterval(interval);
    }, [qubitStability, selectedQubit]); // Re-run effect if selection changes

    const handleQubitClick = (index: number) => {
        setSelectedQubit(prev => (prev === index ? null : index));
    };

    const handleSetState = (newState: QubitState) => {
        if (selectedQubit === null) return;
        setQubitStates(states => {
            const newStates = [...states];
            newStates[selectedQubit] = newState;
            return newStates;
        });
    };

    return (
        <div className="w-full h-full flex flex-col p-2 relative">
            <h3 className="text-base font-bold tracking-widest text-cyan-300 mb-4 text-center">QUBIT REGISTER STATE</h3>
            <div className="grid grid-cols-8 gap-x-3 gap-y-1 justify-center items-center">
                {qubitStates.map((state, i) => (
                    <div key={i} className="flex flex-col items-center">
                         <button 
                            onClick={() => handleQubitClick(i)} 
                            className="rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                            aria-label={`Select qubit ${i}. Current state: ${state}`}
                         >
                            <Qubit state={state} isSelected={selectedQubit === i} />
                        </button>
                        <span className="text-xs text-cyan-600 mt-1">{`q${i}`}</span>
                    </div>
                ))}
            </div>

            {selectedQubit !== null && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-3 animate-fade-in-up text-center z-10">
                    <h4 className="text-sm font-bold text-white mb-2">Controls for Qubit <span className="text-yellow-300 font-mono">q{selectedQubit}</span></h4>
                    <div className="flex justify-center gap-2">
                        <button onClick={() => handleSetState('zero')} className="holographic-button px-3 py-1 text-xs font-semibold rounded-md">Set to |0⟩</button>
                        <button onClick={() => handleSetState('one')} className="holographic-button px-3 py-1 text-xs font-semibold rounded-md">Set to |1⟩</button>
                        <button onClick={() => handleSetState('superposition')} className="holographic-button px-3 py-1 text-xs font-semibold rounded-md">Set Superposition</button>
                    </div>
                    <p className="text-xs text-cyan-600 mt-2">Automatic state updates are paused.</p>
                </div>
            )}
        </div>
    );
};

export default QubitStateVisualizer;