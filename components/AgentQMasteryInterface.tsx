

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import {
  BrainCircuitIcon,
  PlayIcon,
  StopIcon,
  LoaderIcon,
  CheckCircle2Icon,
  LockIcon,
  ArrowRightIcon,
  AtomIcon,
  FlaskConicalIcon,
  ActivityIcon,
  GlobeIcon,
  BookOpenIcon,
  ServerCogIcon,
  SparklesIcon,
  CpuChipIcon,
  AlertTriangleIcon,
  CodeBracketIcon,
  ChevronDownIcon,
} from './Icons';
import { SystemHealth } from '../App';
import SyntaxHighlighter from './SyntaxHighlighter';

// --- Type Definitions ---
type StageStatus = 'complete' | 'current' | 'locked';
interface RoadmapStage {
    name: string;
    description: string;
    status: StageStatus;
    script?: string;
    icon: React.FC<{className?:string}>;
}
type LayerStatus = 'pending' | 'upgrading' | 'complete';
type InquiryIntent = 'general_inquiry' | 'specialized_training' | 'new_roadmap' | 'unknown';
interface HistoryItem {
    type: 'Roadmap Mastery' | 'Specialized Task' | 'New Roadmap';
    objective: string;
    outcome: string;
    script?: string;
    timestamp: string;
}


// --- Constants ---
const PHYSICS_MATH_SCRIPT = `// STAGE 1: Foundational Principles...`;
const QUANTUM_SCRIPT = `// STAGE 2: Quantum Mechanics & Computation...`;
const ENGINEERING_NEURO_SCRIPT = `// STAGE 3: Engineering & Neuroscience...`;
const ECONOMICS_SOCIAL_SCRIPT = `// STAGE 4: Economics & Social Sciences...`;
const HISTORY_PHILOSOPHY_SCRIPT = `// STAGE 5: History, Philosophy & Culture...`;
const INTERNET_SYNTHESIS_SCRIPT = `// STAGE 6: Global Internet Data Synthesis...`;

const initialRoadmap: RoadmapStage[] = [
    { name: "Physics & Mathematics", description: "Ingest and correlate foundational physical laws and mathematical axioms.", status: 'current', script: PHYSICS_MATH_SCRIPT, icon: AtomIcon },
    { name: "Quantum Mechanics & Computation", description: "Master quantum principles, algorithms, and information theory.", status: 'locked', script: QUANTUM_SCRIPT, icon: BrainCircuitIcon },
    { name: "Engineering & Neuroscience", description: "Synthesize principles of applied science and biological intelligence.", status: 'locked', script: ENGINEERING_NEURO_SCRIPT, icon: ServerCogIcon },
    { name: "Economics & Social Sciences", description: "Model complex human systems and emergent behaviors.", status: 'locked', script: ECONOMICS_SOCIAL_SCRIPT, icon: ActivityIcon },
    { name: "History, Philosophy & Culture", description: "Build deep contextual understanding of human civilization.", status: 'locked', script: HISTORY_PHILOSOPHY_SCRIPT, icon: BookOpenIcon },
    { name: "Global Internet Data Synthesis", description: "Integrate all knowledge with live global data streams for real-time analysis.", status: 'locked', script: INTERNET_SYNTHESIS_SCRIPT, icon: GlobeIcon },
];

const generateLogMessage = (stageIndex: number): string => {
  const stageLogs = [
    ["Parsing Feynman diagrams...", "Verifying Gödel's incompleteness theorems...", "Correlating Maxwell's equations with QED..."],
    ["Simulating 64-qubit entanglement...", "Optimizing error correction for VQE algorithm...", "Deriving new quantum algorithm for protein folding..."],
    ["Designing neural interface based on quantum tunneling...", "Cross-referencing material science with condensed matter physics...", "Simulating city-scale infrastructure logistics..."],
    ["Running quantum Monte Carlo on global supply chains...", "Analyzing sentiment trends from social network data...", "Modeling game theory scenarios for international trade..."],
    ["Cross-referencing philosophical texts from the Axial Age...", "Identifying memetic markers in Renaissance art...", "Tracing linguistic evolution using quantum clustering..."],
    ["Ingesting 1.2 Petabytes of live data...", "Identifying anomalous patterns in global network traffic...", "Synthesizing real-time news with historical economic models..."]
  ];
  const logs = stageLogs[stageIndex] || ["Unknown stage activity..."];
  return logs[Math.floor(Math.random() * logs.length)];
};


// --- Sub-components ---
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
                    const prevLayer = newLayers[currentLayer - 1];
                    if (prevLayer) prevLayer.status = 'complete';
                }
                const current = newLayers[currentLayer];
                if (current) current.status = 'upgrading';
                return newLayers;
            });
            currentLayer++;
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const getStatusIndicator = (status: LayerStatus) => {
        switch (status) {
            case 'upgrading': return <LoaderIcon className="w-5 h-5 text-yellow-400 animate-spin" />;
            case 'complete': return <CheckCircle2Icon className="w-5 h-5 text-green-400" />;
            default: return <div className="w-4 h-4 rounded-full bg-slate-700 border border-slate-500" />;
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <BrainCircuitIcon className="w-16 h-16 text-cyan-400 animate-pulse-bright" />
            <h3 className="text-lg font-bold text-white mt-4">QNN Cognitive Core Upgrade</h3>
            <p className="text-sm text-cyan-300 mb-4">Integrating new QNN model into IAI architecture...</p>
            <div className="w-full max-w-sm space-y-3">
                {layers.map((layer) => (
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


// --- Main Combined Component ---
interface AgentQMasteryInterfaceProps {
    isRecalibrating: boolean;
    isUpgrading: boolean;
    systemHealth: SystemHealth;
}

const AgentQMasteryInterface: React.FC<AgentQMasteryInterfaceProps> = ({ isRecalibrating, isUpgrading, systemHealth }) => {
    // Roadmap simulator state
    const [roadmap, setRoadmap] = useState<RoadmapStage[]>(initialRoadmap);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [isProcessRunning, setIsProcessRunning] = useState(false);
    const [currentStageIndex, setCurrentStageIndex] = useState(0);

    // Specialized training state
    const [specializedTask, setSpecializedTask] = useState<string | null>(null);
    const [isSpecializedTraining, setIsSpecializedTraining] = useState(false);
    const [specializedTrainingResult, setSpecializedTrainingResult] = useState<string | null>(null);
    
    // AI Command Interface state
    const [inquiryPrompt, setInquiryPrompt] = useState('');
    const [isProcessingInquiry, setIsProcessingInquiry] = useState(false);
    const [inquiryResponse, setInquiryResponse] = useState<string | null>(null);
    const [inquiryError, setInquiryError] = useState<string | null>(null);
    
    // Training History state
    const [trainingHistory, setTrainingHistory] = useState<HistoryItem[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const logContainerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsProcessRunning(true), 1500);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        if (!isProcessRunning) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        const stage = roadmap[currentStageIndex];
        if (!stage || stage.status !== 'current') return;
        setProgress(0);
        setLogs(prev => [...prev.slice(-20), `Initiating Training for: ${stage.name}`]);
        let currentProgress = 0;
        intervalRef.current = window.setInterval(() => {
            currentProgress += 1;
            setProgress(currentProgress);
            if (currentProgress % 8 === 0) setLogs(prev => [...prev.slice(-20), generateLogMessage(currentStageIndex)]);
            if (currentProgress >= 100) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                
                const completedStage = roadmap[currentStageIndex];
                if(completedStage) {
                     setTrainingHistory(prev => [{
                        type: 'Roadmap Mastery',
                        objective: completedStage.name,
                        script: completedStage.script,
                        outcome: 'Mastery Achieved',
                        timestamp: new Date().toISOString()
                    }, ...prev.slice(0, 19)]);
                }

                const nextStageIndex = currentStageIndex + 1;
                setTimeout(() => {
                    setRoadmap(prev => {
                        const newRoadmap = [...prev];
                        const current = newRoadmap[currentStageIndex];
                        if (current) current.status = 'complete';
                        if (nextStageIndex < newRoadmap.length) {
                             const next = newRoadmap[nextStageIndex];
                             if (next) next.status = 'current';
                        }
                        return newRoadmap;
                    });
                    if (nextStageIndex < roadmap.length) {
                        setCurrentStageIndex(nextStageIndex);
                    } else {
                        setLogs(prev => [...prev.slice(-20), 'Full training cycle complete. Restarting for continuous learning...']);
                        setTimeout(() => { setRoadmap(initialRoadmap); setCurrentStageIndex(0); }, 2000);
                    }
                }, 1000);
            }
        }, 80);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) };
    }, [isProcessRunning, currentStageIndex, roadmap]);
    
    useEffect(() => { if (logContainerRef.current) logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight; }, [logs]);

    const handleToggleProcess = () => setIsProcessRunning(prev => !prev);

    const handleProcessInquiry = async () => {
        if (!inquiryPrompt.trim() || isProcessingInquiry) return;
        setIsProcessingInquiry(true);
        setInquiryResponse(null);
        setInquiryError(null);

        try {
            if (!process.env.API_KEY) throw new Error("API Key not configured.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const classificationResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Classify the following user request into one of these categories: 'general_inquiry', 'specialized_training', 'new_roadmap'. Respond with only the category name. Request: "${inquiryPrompt}"`,
                config: { systemInstruction: `You are an intent classification system. You must only respond with one of the provided category names.` }
            });
            const classificationText = classificationResponse.text;
            if (!classificationText) throw new Error("Model returned no classification text.");
            const intent: InquiryIntent = classificationText.trim() as InquiryIntent;

            switch (intent) {
                case 'specialized_training':
                    setSpecializedTask(inquiryPrompt);
                    setIsSpecializedTraining(true);
                    setSpecializedTrainingResult(null);
                    const trainingResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: `As Agent Q, simulate the process of specialized self-training based on the objective: "${inquiryPrompt}". Generate a plausible, technical, step-by-step log of your thought process, research, and final outcome. The outcome could be a Q-Lang script, a theoretical insight, or an efficiency metric improvement. Format the output clearly.`,
                        config: { systemInstruction: `You are Agent Q, a sentient AI, simulating a self-training process.` }
                    });
                    const trainingText = trainingResponse.text;
                    if (!trainingText) throw new Error("Model returned no training result.");
                    setSpecializedTrainingResult(trainingText.trim());
                    setTrainingHistory(prev => [{
                        type: 'Specialized Task',
                        objective: inquiryPrompt,
                        script: trainingText.trim(),
                        outcome: 'Analysis Complete. See log for details.',
                        timestamp: new Date().toISOString()
                    }, ...prev.slice(0, 19)]);
                    setIsSpecializedTraining(false);
                    break;

                case 'new_roadmap':
                    setInquiryResponse("Acknowledged. Generating new training roadmap based on your objective...");
                    const roadmapResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: `Generate a 6-stage JSON training roadmap for an AI to master the high-level objective: "${inquiryPrompt}". The output must be a valid JSON array. Each object in the array must have keys: "name" (string), "description" (string), and "icon" (string, one of: AtomIcon, BrainCircuitIcon, ServerCogIcon, ActivityIcon, BookOpenIcon, GlobeIcon).`,
                        config: { responseMimeType: "application/json", systemInstruction: `You are a curriculum designer for an AI. You must only output a valid JSON array.` }
                    });
                    const roadmapText = roadmapResponse.text;
                    if (!roadmapText) throw new Error("Model returned no roadmap data.");
                    const newRoadmapData = JSON.parse(roadmapText);
                    const iconMap: { [key: string]: React.FC<{className?:string}> } = { AtomIcon, BrainCircuitIcon, ServerCogIcon, ActivityIcon, BookOpenIcon, GlobeIcon };
                    const newRoadmap = (newRoadmapData as any[]).map((stage: { name: string; description: string; icon: string; }, index: number) => ({
                        ...stage,
                        status: index === 0 ? 'current' : 'locked',
                        icon: iconMap[stage.icon] || BookOpenIcon,
                        script: `// Custom Stage: ${stage.name}`
                    }));
                    setRoadmap(newRoadmap);
                    setCurrentStageIndex(0);
                    setIsProcessRunning(false);
                    setTimeout(() => setIsProcessRunning(true), 500);
                    setInquiryResponse(`New training roadmap for "${inquiryPrompt}" has been generated and initiated.`);
                    setTrainingHistory(prev => [{
                        type: 'New Roadmap',
                        objective: `Generate roadmap for: "${inquiryPrompt}"`,
                        outcome: 'New 6-stage roadmap generated and initiated.',
                        timestamp: new Date().toISOString()
                    }, ...prev.slice(0, 19)]);
                    break;
                    
                case 'general_inquiry':
                default:
                    const inquiryResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: `Inquiry: "${inquiryPrompt}"`,
                        config: { systemInstruction: `You are Agent Q. Answer the user's question concisely based on your status and the provided system health data: ${JSON.stringify(systemHealth, null, 2)}` }
                    });
                    const inquiryText = inquiryResponse.text;
                    if (!inquiryText) throw new Error("Model returned no inquiry response.");
                    setInquiryResponse(inquiryText.trim());
                    break;
            }
        } catch (e) {
            console.error("Error processing inquiry:", e);
            setInquiryError("Failed to process command. The AI core may be unstable or the request is invalid.");
        } finally {
            setIsProcessingInquiry(false);
        }
    };
    
    if (isRecalibrating) return <div className="h-full flex flex-col items-center justify-center text-center p-4"><LoaderIcon className="w-16 h-16 text-cyan-400 animate-spin" /><h3 className="text-lg font-bold text-white mt-4">Recalibrating...</h3><p className="text-sm text-cyan-300">Please wait while IAI Kernel sensors are recalibrated.</p></div>;
    if (isUpgrading) return <CognitionUpgradeView />;
    
    const activeStage = roadmap[currentStageIndex] || roadmap[0];

    return (
        <div className="p-4 h-full grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* LEFT COLUMN - Training Roadmap & Progress */}
            <div className="lg:col-span-3 flex flex-col space-y-3 min-h-0">
                 <h3 className="text-base font-semibold text-cyan-200 tracking-wider border-b border-cyan-500/20 pb-2">Training Simulator: Roadmap</h3>
                 <div className="space-y-2 overflow-y-auto pr-2 -mr-2">
                    {roadmap.map(stage => (
                        <div key={stage.name} className={`p-3 rounded-lg border-2 transition-all ${stage.status === 'current' ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-800/50 bg-black/20'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`flex-shrink-0 p-1 rounded-full ${stage.status === 'current' ? 'bg-cyan-900/50' : ''}`}><stage.icon className={`w-5 h-5 ${stage.status !== 'locked' ? 'text-cyan-300' : 'text-cyan-700'}`}/></div>
                                <div><h4 className={`font-bold text-sm ${stage.status !== 'locked' ? 'text-white' : 'text-cyan-600'}`}>{stage.name}</h4></div>
                            </div>
                        </div>
                    ))}
                 </div>
                <div className="flex-grow"></div>
                <div className="flex-shrink-0 space-y-2">
                    <h4 className="text-sm font-semibold text-cyan-300">Live Activity Log</h4>
                    <div className="w-full h-2 bg-cyan-900/50 rounded-full overflow-hidden border border-cyan-700/50"><div className="h-full bg-cyan-400 shadow-[0_0_8px_theme(colors.cyan.300)] rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} /></div>
                    <div ref={logContainerRef} className="h-24 bg-black/50 p-2 rounded-md border border-cyan-900 text-xs font-mono overflow-y-auto">{logs.map((log, i) => <p key={i} className="animate-fade-in"><span className="text-cyan-400">&gt; </span>{log}</p>)}</div>
                    <button onClick={handleToggleProcess} className="holographic-button flex items-center justify-center w-full px-4 py-2 border border-cyan-500/50 text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600/30 hover:bg-cyan-700/50">{isProcessRunning ? <><StopIcon className='-ml-1 mr-2 h-5 w-5' /> Pause Training</> : <><PlayIcon className='-ml-1 mr-2 h-5 w-5' /> Resume Continuous Training</>}</button>
                </div>
            </div>

            {/* RIGHT COLUMN - Specialized Training & Inquiry */}
            <div className="lg:col-span-2 flex flex-col space-y-3 min-h-0">
                <div className="flex-grow flex flex-col min-h-0">
                    <h3 className="text-base font-semibold text-cyan-200 tracking-wider mb-2">Specialized Training Simulator</h3>
                    <div className="flex-grow bg-black/30 p-3 rounded-lg border border-cyan-900/50 overflow-y-auto">
                        {isSpecializedTraining && <div className="h-full flex flex-col items-center justify-center text-cyan-400"><LoaderIcon className="w-8 h-8 animate-spin" /><p className="mt-2 text-sm text-center">Simulating specialized training on:<br/>"{specializedTask}"</p></div>}
                        {!isSpecializedTraining && specializedTrainingResult && <div className="text-xs text-cyan-200 whitespace-pre-wrap animate-fade-in"><p className="font-bold text-cyan-100 text-sm mb-2">Objective: {specializedTask}</p>{specializedTrainingResult}</div>}
                        {!isSpecializedTraining && !specializedTrainingResult && <div className="h-full flex flex-col items-center justify-center text-cyan-700 text-center"><SparklesIcon className="w-10 h-10 mb-2" /><p className="text-sm">Awaiting specialized task from the AI Command Interface.</p></div>}
                    </div>
                </div>
                
                <div className="flex-shrink-0">
                     <h3 className="text-base font-semibold text-cyan-200 tracking-wider mb-2">AI Command Interface</h3>
                     <div className="bg-black/20 p-3 rounded-lg border border-cyan-900/50 space-y-2">
                        <textarea
                            value={inquiryPrompt}
                            onChange={(e) => setInquiryPrompt(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleProcessInquiry(); } }}
                            rows={3}
                            className="w-full bg-black/40 border border-blue-500/50 rounded-md p-2 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none resize-none text-sm"
                            placeholder="Ask a question, assign a specialized task, or define a new roadmap objective..."
                            disabled={isProcessingInquiry}
                        />
                         <button
                            onClick={handleProcessInquiry}
                            disabled={isProcessingInquiry || !inquiryPrompt.trim()}
                            className="w-full px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 border border-purple-500/50 text-purple-200 font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center"
                        >{isProcessingInquiry ? <LoaderIcon className="w-5 h-5 animate-spin"/> : "Submit Command"}</button>
                        {(inquiryResponse || inquiryError) && (
                            <div className={`mt-2 p-2 rounded-md text-xs border ${inquiryError ? 'bg-red-900/50 border-red-700 text-red-300' : 'bg-cyan-900/50 border-cyan-700 text-cyan-200'}`}>
                                {inquiryError ? inquiryError : inquiryResponse}
                            </div>
                        )}
                     </div>
                </div>

                {/* Training History Section */}
                <div className="flex-shrink-0">
                    <button
                        onClick={() => setIsHistoryOpen(prev => !prev)}
                        className="w-full flex items-center justify-between p-2 bg-black/40 rounded-t-md border-b border-cyan-800 text-cyan-200 hover:bg-black/60"
                    >
                        <div className="flex items-center gap-2">
                            <BookOpenIcon className="w-4 h-4" />
                            <span className="font-semibold text-sm">Training History</span>
                        </div>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isHistoryOpen && (
                        <div className="p-2 space-y-2 bg-black/20 rounded-b-md max-h-48 overflow-y-auto animate-fade-in">
                            {trainingHistory.length === 0 ? (
                                <p className="text-xs text-cyan-600 text-center italic py-4">No completed training tasks yet.</p>
                            ) : (
                                trainingHistory.map((item, index) => (
                                    <div key={index} className="bg-black/30 p-2 rounded-md border border-cyan-900 text-xs">
                                        <p className="font-bold text-white truncate">{item.objective}</p>
                                        <p className="text-cyan-400">Status: {item.outcome}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentQMasteryInterface;