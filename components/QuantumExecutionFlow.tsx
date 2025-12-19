import React, { useState, useEffect } from 'react';
import { BrainCircuitIcon, FileCodeIcon, ShieldCheckIcon, CpuChipIcon, ArrowPathIcon, CheckCircle2Icon, LoaderIcon } from './Icons';

type Stage = 'iai' | 'qsc' | 'eks' | 'dqn' | 'feedback';

const STAGES: { id: Stage, name: string, description: string, icon: React.FC<{className?: string}> }[] = [
    { id: 'iai', name: 'IAI/IPS Classification', icon: BrainCircuitIcon, description: 'Task analyzed for quantum necessity.' },
    { id: 'qsc', name: 'Q-Lang Generation', icon: FileCodeIcon, description: 'Quantum Semantic Compiler generates script.' },
    { id: 'eks', name: 'CHIPS Packet Formation', icon: ShieldCheckIcon, description: 'Payload secured with Entangled Key State.' },
    { id: 'dqn', name: 'DQN Execution', icon: CpuChipIcon, description: 'Script executed on target Quantum Node.' },
    { id: 'feedback', name: 'IKM Synthesis', icon: ArrowPathIcon, description: 'Results integrated, refining Instinct Kernel.' },
];

const StageItem: React.FC<{
    Icon: React.FC<{className?: string}>;
    name: string;
    description: string;
    isActive: boolean;
    isComplete: boolean;
}> = ({ Icon, name, description, isActive, isComplete }) => {
    const getStatusIndicator = () => {
        if (isActive) return <LoaderIcon className="w-4 h-4 text-cyan-300 animate-spin" />;
        if (isComplete) return <CheckCircle2Icon className="w-4 h-4 text-green-400" />;
        return <div className="w-3 h-3 rounded-full bg-slate-700 border border-slate-500" />;
    };

    return (
        <div className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-cyan-500/20' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${isActive ? 'bg-cyan-500/30 border-cyan-400 animate-pulse' : isComplete ? 'bg-green-500/30 border-green-500' : 'bg-slate-800/50 border-cyan-800'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-300' : isComplete ? 'text-green-300' : 'text-cyan-600'}`} />
            </div>
            <div className="flex-grow">
                <h4 className={`font-bold text-sm ${isComplete || isActive ? 'text-white' : 'text-cyan-700'}`}>{name}</h4>
                <p className={`text-xs ${isActive ? 'text-cyan-300' : 'text-cyan-600'}`}>{description}</p>
            </div>
            <div className="flex-shrink-0 w-6 flex items-center justify-center">
                {getStatusIndicator()}
            </div>
        </div>
    );
};

const Connector: React.FC<{ isComplete: boolean }> = ({ isComplete }) => (
    <div className="h-4 w-0.5 mx-auto bg-cyan-800 relative overflow-hidden">
        <div 
            className="absolute top-0 left-0 w-full h-full bg-green-500 transition-transform duration-1000 ease-linear"
            style={{ transform: isComplete ? 'translateY(0%)' : 'translateY(-100%)' }}
        />
    </div>
);

const QuantumExecutionFlow: React.FC = () => {
    const [currentStageIndex, setCurrentStageIndex] = useState(-1);

    useEffect(() => {
        const cycle = () => {
            setCurrentStageIndex(prev => {
                const nextIndex = prev + 1;
                if (nextIndex >= STAGES.length) {
                    // After completion, pause and then reset
                    setTimeout(() => setCurrentStageIndex(-1), 2000);
                    return nextIndex;
                }
                return nextIndex;
            });
        };
        
        const interval = setInterval(cycle, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full flex flex-col p-2 space-y-1 justify-center">
            {STAGES.map((stage, index) => (
                <React.Fragment key={stage.id}>
                    <StageItem 
                        Icon={stage.icon}
                        name={stage.name}
                        description={stage.description}
                        isActive={currentStageIndex === index}
                        isComplete={currentStageIndex > index}
                    />
                    {index < STAGES.length - 1 && (
                        <Connector isComplete={currentStageIndex > index} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default QuantumExecutionFlow;
