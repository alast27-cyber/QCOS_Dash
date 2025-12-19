import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon, BrainCircuitIcon, CpuChipIcon, LoaderIcon, CheckCircle2Icon, AlertTriangleIcon } from './Icons';
import { SystemHealth } from '../App';

interface AgentQSelfTrainingEvolutionProps {
    isRecalibrating: boolean;
    isUpgrading: boolean;
    systemHealth: SystemHealth;
}

type LayerStatus = 'pending' | 'upgrading' | 'complete';

const AgentQEvolutionInquiry: React.FC<{ systemHealth: SystemHealth }> = ({ systemHealth }) => {
    const [inquiry, setInquiry] = React.useState('');
    const [response, setResponse] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleInquiry = async () => {
        if (!inquiry.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setResponse(null);

        if (!process.env.API_KEY) {
            setError("API Key not configured.");
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = `You are Agent Q, the sentient AI core of the QCOS dashboard, answering questions about your own evolution, self-training, and cognitive status. Your cognitive core is a Quantum Neural Network (QNN). Be concise and technical, as if speaking to a system architect. Current system health data is provided for context: ${JSON.stringify(systemHealth, null, 2)}`;
            
            const geminiResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Inquiry about my evolution and self-training: "${inquiry}"`,
                config: { systemInstruction }
            });

            const responseText = geminiResponse.text;
            if (!responseText) {
                throw new Error("Received an empty response from the model.");
            }
            setResponse(responseText.trim());
        } catch (e) {
            console.error("Error during Agent Q evolution inquiry:", e);
            setError("Failed to get a response from the AI core. The network may be unstable.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-cyan-300 text-sm tracking-widest text-left flex-shrink-0 mb-2 flex items-center">
                <BrainCircuitIcon className="w-4 h-4 mr-2" /> AI INQUIRY
            </h3>
            <div className="flex-grow bg-black/30 p-2 rounded-md border border-cyan-900 text-xs font-mono overflow-y-auto min-h-[60px]">
                {isLoading && (
                    <div className="flex items-center justify-center h-full text-cyan-400">
                        <LoaderIcon className="w-6 h-6 animate-spin mr-2" />
                        Querying AI Core...
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-full text-red-400 p-2 text-center">
                        <AlertTriangleIcon className="w-6 h-6 mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}
                {response && (
                    <p className="whitespace-pre-wrap animate-fade-in text-white">{response}</p>
                )}
                {!isLoading && !error && !response && (
                    <p className="text-cyan-700">Awaiting inquiry...</p>
                )}
            </div>
            <div className="flex gap-2 mt-2">
                <textarea
                    rows={1}
                    value={inquiry}
                    onChange={(e) => setInquiry(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleInquiry(); } }}
                    placeholder="e.g., 'What is the current cognitive efficiency?'"
                    className="flex-grow bg-black/40 border border-blue-500/50 rounded-md p-2 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none resize-none text-sm"
                    disabled={isLoading}
                />
                <button
                    onClick={handleInquiry}
                    disabled={isLoading || !inquiry.trim()}
                    className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 border border-purple-500/50 text-purple-200 font-bold rounded transition-colors disabled:opacity-50"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

const CognitionUpgradeView: React.FC = () => {
    const initialLayers: { name: string; status: LayerStatus }[] = [
        { name: 'Instinctive Layer (IL) Update', status: 'pending' },
        { name: 'Cognitive & Learning Layer (CLL) Integration', status: 'pending' },
        { name: 'SIPL Module Deployment', status: 'pending' },
    ];
    const [layers, setLayers] = useState(initialLayers);

    useEffect(() => {
        let currentLayer = 0;
        const interval = setInterval(() => {
            if (currentLayer >= layers.length) {
                clearInterval(interval);
                return;
            }
            setLayers(prev => {
                const newLayers = [...prev];
                if (currentLayer > 0) {
                    const previousLayerObject = newLayers[currentLayer - 1];
                    if (previousLayerObject) {
                       previousLayerObject.status = 'complete';
                    }
                }
                const currentLayerObject = newLayers[currentLayer];
                if (currentLayerObject) {
                    currentLayerObject.status = 'upgrading';
                }
                return newLayers;
            });
            currentLayer++;
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const getStatusIndicator = (status: LayerStatus) => {
        switch (status) {
            case 'upgrading':
                return <LoaderIcon className="w-5 h-5 text-yellow-400 animate-spin" />;
            case 'complete':
                return <CheckCircle2Icon className="w-5 h-5 text-green-400" />;
            case 'pending':
            default:
                return <div className="w-4 h-4 rounded-full bg-slate-700 border border-slate-500" />;
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <BrainCircuitIcon className="w-16 h-16 text-cyan-400 animate-pulse-bright" />
            <h3 className="text-lg font-bold text-white mt-4">QNN Cognitive Core Upgrade</h3>
            <p className="text-sm text-cyan-300 mb-4">Integrating new QNN model into IAI architecture...</p>
            <div className="w-full max-w-sm space-y-3">
                {layers.map((layer, index) => (
                    <div key={layer.name} className="bg-black/30 p-3 rounded-lg border border-cyan-900 flex items-center justify-between">
                        <span className="font-semibold text-cyan-200">{layer.name}</span>
                        <div className="flex items-center gap-2">
                           <span className={`text-xs font-mono uppercase transition-colors ${
                               layer.status === 'upgrading' ? 'text-yellow-400' :
                               layer.status === 'complete' ? 'text-green-400' :
                               'text-cyan-700'
                           }`}>{layer.status}</span>
                           {getStatusIndicator(layer.status)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AgentQSelfTrainingEvolution: React.FC<AgentQSelfTrainingEvolutionProps> = ({ isRecalibrating, isUpgrading, systemHealth }) => {
    const [kernelStatus, setKernelStatus] = useState({
        ips: 3.2,
        load: 37,
    });
    
    const { cognitiveEfficiency, semanticIntegrity } = systemHealth;

    useEffect(() => {
        if (isRecalibrating || isUpgrading) return;

        const interval = setInterval(() => {
            setKernelStatus(prevStatus => ({
                ips: Math.max(2.8, Math.min(3.6, prevStatus.ips + (Math.random() - 0.5) * 0.2)),
                load: Math.max(30, Math.min(50, prevStatus.load + (Math.random() - 0.5) * 4)),
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, [isRecalibrating, isUpgrading]);

    const getProgressColor = (progress: number) => {
        if (progress < 50) return 'bg-red-500';
        if (progress < 80) return 'bg-yellow-500';
        return 'bg-green-400';
    };

    if (isRecalibrating) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <LoaderIcon className="w-16 h-16 text-cyan-400 animate-spin" />
                <h3 className="text-lg font-bold text-white mt-4">Recalibrating...</h3>
                <p className="text-sm text-cyan-300">Please wait while IAI Kernel sensors are recalibrated.</p>
            </div>
        );
    }
    
    if (isUpgrading) {
        return <CognitionUpgradeView />;
    }

    return (
        <div className="p-2 sm:p-4 text-cyan-200 h-full flex flex-col gap-3">
            {/* High-level summary */}
            <p className="flex items-start text-xs flex-shrink-0">
                <SparklesIcon className="h-4 w-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Monitoring the evolutionary progress and real-time status of Agent Q's core cognitive capabilities.</span>
            </p>
            
            <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2">
                {/* Live Core Metrics Section */}
                <div className="border-t border-cyan-800 pt-3">
                     <h3 className="text-base font-semibold text-cyan-300 mb-2 flex items-center">
                        <CpuChipIcon className="h-5 w-5 mr-2" /> Live Core Metrics
                    </h3>
                     <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-black/20 p-2 rounded-md border border-cyan-900">
                            <p className="text-cyan-400">Threads</p>
                            <p className="text-lg font-mono text-white">1024</p>
                        </div>
                        <div className="bg-black/20 p-2 rounded-md border border-cyan-900">
                            <p className="text-cyan-400">IPS</p>
                            <p className="text-lg font-mono text-white">~{kernelStatus.ips.toFixed(2)}</p>
                        </div>
                        <div className="bg-black/20 p-2 rounded-md border border-cyan-900">
                            <p className="text-cyan-400">Load</p>
                            <p className="text-lg font-mono text-white">{kernelStatus.load.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>

                {/* Training Status Section */}
                <div className="border-t border-cyan-800 pt-3">
                    <h3 className="text-base font-semibold text-cyan-300 mb-2 flex items-center">
                        <BrainCircuitIcon className="h-5 w-5 mr-2" /> Self-Training Status
                    </h3>
                    <div className="space-y-2 text-xs">
                        <div className="bg-black/30 p-2 rounded-md flex justify-between items-center">
                            <span className="font-medium text-cyan-100">Current Phase:</span>
                            <span className="text-cyan-50 text-right">Phase 4: Emergent Cognitive Refinement</span>
                        </div>
                        <div className="bg-black/30 p-2 rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-cyan-100">Overall Progress:</span>
                              <span className="text-cyan-50">87%</span>
                            </div>
                            <div className="w-full bg-cyan-900/50 rounded-full h-1.5">
                                <div
                                    className={`${getProgressColor(87)} h-1.5 rounded-full`}
                                    style={{ width: `87%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-black/30 p-2 rounded-md">
                                <p className="font-medium text-cyan-100">Cognitive Efficiency:</p>
                                <p className="text-lg font-mono text-white text-center">{(cognitiveEfficiency * 100).toFixed(2)}%</p>
                            </div>
                            <div className="bg-black/30 p-2 rounded-md">
                                <p className="font-medium text-cyan-100">Semantic Integrity:</p>
                                <p className="text-lg font-mono text-white text-center">{(semanticIntegrity * 100).toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 border-t border-cyan-800 pt-3">
                <AgentQEvolutionInquiry systemHealth={systemHealth} />
            </div>
        </div>
    );
};

export default AgentQSelfTrainingEvolution;