// This file consolidates the QCOSSystemEvolutionInterface component into a single, runnable React file.
// CRITICAL UPDATE: The branch generation prompt is now synchronized with a simulated AGI Training Roadmap
// to ensure the proposed system evolution aligns with the cognitive core's current development phase.

import React, { useState, useEffect, useCallback, useRef } from 'react';

// Recharts components are assumed to be available in the React environment.
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ReferenceLine, CartesianGrid } from 'recharts';

// --- Icon Definitions (Replacing external './Icons' imports) ---
// The fix ensures that the closing tag for the functional component (e.g., GitBranchIcon) matches
// the component name, instead of closing the inner IconBase component prematurely.
const IconBase = ({ children, className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

const GitBranchIcon = (props) => (
    <IconBase {...props}><line x1="6" y1="3" x2="6" y2="15"></line><path d="M18 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path><path d="M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path><path d="M18 18h-1c-2 0-3-1-3-3v-3.88a2 2 0 1 0-4 0V15c0 2 1 3 3 3h1"></path></IconBase>
);
const CheckCircle2Icon = (props) => (
    <IconBase {...props}><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></IconBase>
);
const LoaderIcon = (props) => (
    <IconBase {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></IconBase>
);
const BrainCircuitIcon = (props) => (
    <IconBase {...props}><path d="M12 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2"></path><path d="M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"></path><path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"></path><path d="M8 12h8"></path><path d="M8 8h8"></path><path d="M8 16h8"></path></IconBase>
);
const AlertTriangleIcon = (props) => (
    <IconBase {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></IconBase>
);
const ArrowPathIcon = (props) => (
    <IconBase {...props}><path d="M21.5 2v6h-6"></path><path d="M2.5 22v-6h6"></path><path d="M2 13a10 10 0 0 0 18.28 4.4L22 17.5M22 11a10 10 0 0 0-18.28-4.4L2 6.5"></path></IconBase>
);
const SparklesIcon = (props) => (
    <IconBase {...props}><path d="M18.99 12.01l-1.02-1.01m-2.96-2.96l-1.01-1.01m-4 10l-1.01 1.01m-2.96-2.96l-1.02-1.01M12 2v2M22 12h-2M12 22v-2M4 12H2M18 4l-2 2M6 18l2-2M20 18l-2-2M4 6l2 2"></path></IconBase>
);
const ZapIcon = (props) => (
    <IconBase {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></IconBase>
);
const GaugeIcon = (props) => (
    <IconBase {...props}><path d="M12 14v10M12 2a10 10 0 1 0 0 20"></path><path d="M12 20a8 8 0 1 0 0-16"></path><path d="M12 12a4 4 0 1 0 0 8"></path><line x1="8" y1="12" x2="16" y2="12"></line></IconBase>
);
const ShieldCheckIcon = (props) => (
    <IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></IconBase>
);
const PlayIcon = (props) => (
    <IconBase {...props}><polygon points="5 3 19 12 5 21 5 3"></polygon></IconBase>
);
// FIXED: Ensure the closing tag matches the functional component name (CodeBracketIcon)
const CodeBracketIcon = (props) => (
    <IconBase {...props}><path d="M16 18l4-4-4-4"></path><path d="M8 6l-4 4 4 4"></path><path d="M14 4l-4 16"></path></IconBase>
);
// FIXED: Ensure the closing tag matches the functional component name (CubeTransparentIcon)
const CubeTransparentIcon = (props) => (
    <IconBase {...props}><path d="M2 3l10 7 10-7L12 1zm10 18L2 11V3l10 7 10-7v8l-10 7z"></path></IconBase>
);
// FIXED: Ensure the closing tag matches the functional component name (ArrowRightIcon)
const ArrowRightIcon = (props) => (
    <IconBase {...props}><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></IconBase>
);
const BeakerIcon = (props) => (
    <IconBase {...props}><path d="M4.5 2.5l5 7M14.5 2.5l-5 7M12 17.5v5M12 17.5l-5-10h10l-5 10z"></path></IconBase>
);


// --- Type Definitions ---
interface SystemHealth {
    currentVersion: string;
    cognitiveEfficiency: number; // 0 to 1
    systemStability: number; // 0 to 1
    processingSpeed: number; // TFLOPS
}

interface EvolutionaryBranch {
  id: string;
  name: string;
  description: string;
  predictedGains: {
    speed: number;
    stability: number;
    efficiency: number;
  };
  risk: 'Low' | 'Medium' | 'High';
}

interface Simulation {
  id: string;
  branch: EvolutionaryBranch;
  progress: number;
  elapsedTime: number;
}

interface LandscapePoint {
  name: string;
  speed: number;
  stability: number;
  efficiency: number;
  type: 'current' | 'candidate';
}

interface RoadmapPhase {
    phase: string;
    focus: string;
    milestone: string;
    targetEfficiency: number; // Target Cognitive Efficiency (0.0 to 1.0)
}

// --- AGI Training Roadmap Data ---
const AGI_ROADMAP: RoadmapPhase[] = [
    {
        phase: "Phase 1: Contextual Deep Learning",
        focus: "Q-Lang script generation & optimization",
        milestone: "95.0% accuracy in complex Q-Lang circuit prediction.",
        targetEfficiency: 0.85, // Need 85% efficiency to advance
    },
    {
        phase: "Phase 2: Entanglement Coherence Modeling",
        focus: "Predictive decoherence mitigation protocols",
        milestone: "Stable entanglement retention (≥ 99.99%) in high-load scenarios.",
        targetEfficiency: 0.92, // Need 92% efficiency to advance
    },
    {
        phase: "Phase 3: Multi-Domain Transfer Learning",
        focus: "Cross-system algorithm porting and self-adjustment",
        milestone: "Successful deployment of 5+ cross-domain QCOS applications.",
        targetEfficiency: 0.98, // Need 98% efficiency to complete
    },
];


const getSynchronizedPrompt = (focus: string): string => {
    return `Generate three diverse and highly innovative evolutionary branches for the Quantum Cognitive Operating System (QCOS). These branches must directly support and synchronize with the AGI's current training focus: "${focus}". Specifically, the branches should propose system enhancements that maximize performance in this area, while also maintaining overall system stability.`;
}

const SYSTEM_INSTRUCTION = "You are the QCOS architect AI. Your task is to generate a JSON array of three potential system upgrades based on the user's request. The predictedGains values must be realistic (0.0 to 1.0) and represent the incremental improvement.";

// --- Gemini API Setup ---
const MODEL_NAME = 'gemini-2.5-flash-preview-09-2025';

const callGemini = async (prompt: string, systemInstruction: string): Promise<EvolutionaryBranch[]> => {
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                description: "A list of potential quantum computing system evolutionary branches.",
                items: {
                    type: "OBJECT",
                    properties: {
                        "id": { "type": "STRING", "description": "A unique, short identifier for the branch." },
                        "name": { "type": "STRING", "description": "A catchy, technical name for the branch." },
                        "description": { "type": "STRING", "description": "A one-sentence technical explanation of the branch's focus." },
                        "predictedGains": {
                            "type": "OBJECT",
                            "properties": {
                                "speed": { "type": "NUMBER", "description": "Predicted gain (0.0 to 1.0) in processing speed." },
                                "stability": { "type": "NUMBER", "description": "Predicted gain (0.0 to 1.0) in system stability." },
                                "efficiency": { "type": "NUMBER", "description": "Predicted gain (0.0 to 1.0) in cognitive efficiency." },
                            }
                        },
                        "risk": { "type": "STRING", "enum": ["Low", "Medium", "High"], "description": "The assessed deployment risk." }
                    },
                    "propertyOrdering": ["id", "name", "description", "predictedGains", "risk"]
                }
            }
        },
    };

    try {
        const maxRetries = 3;
        let attempt = 0;
        let response: Response;

        while (attempt < maxRetries) {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                break;
            }

            attempt++;
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw new Error(`API call failed after ${maxRetries} attempts with status: ${response.status}`);
            }
        }

        if (!response!.ok) {
             throw new Error("Failed to fetch from Gemini API.");
        }

        const result = await response!.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (jsonText) {
            const parsedJson = JSON.parse(jsonText);
            if (Array.isArray(parsedJson)) {
                return parsedJson as EvolutionaryBranch[];
            }
        }
        return [];
    } catch (error) {
        console.error("Gemini API Error:", error);
        return [];
    }
};

// Fallback data is now based on the simulated AGI focus
const getFallbackBranches = (focus: string): EvolutionaryBranch[] => {
    if (focus.includes('Q-Lang script generation')) {
        return [
            { id: 'tqc', name: 'Compiler Optimization 7.1', description: 'Focuses on probabilistic context-free grammar (PCFG) parsing for Q-Lang script optimization.', predictedGains: { speed: 0.20, stability: 0.30, efficiency: 0.15 }, risk: 'Medium' },
            { id: 'aes', name: 'Adaptive Qubit Scheduler', description: 'Dynamically re-prioritizes QIPS packets based on script complexity to minimize queuing latency.', predictedGains: { speed: 0.45, stability: 0.10, efficiency: 0.20 }, risk: 'Low' },
            { id: 'nnf', name: 'Gate Error Mitigation Filter', description: 'Implements a feed-forward noise filter specifically targeting compiler-introduced gate errors.', predictedGains: { speed: 0.10, stability: 0.50, efficiency: 0.30 }, risk: 'Medium' },
        ];
    }
    if (focus.includes('Predictive decoherence mitigation')) {
         return [
            { id: 'crd', name: 'Coherence Resilience Driver 2.0', description: 'Advanced error-correction codes applied in hardware registers to counter high-frequency decoherence.', predictedGains: { speed: 0.15, stability: 0.65, efficiency: 0.10 }, risk: 'High' },
            { id: 'qft', name: 'Quantum Field Topology Mapper', description: 'Maps and stabilizes local quantum field perturbations to maintain qubit coherence across the array.', predictedGains: { speed: 0.05, stability: 0.40, efficiency: 0.25 }, risk: 'Medium' },
        ];
    }
    // Default Fallback (for Phase 3 or general)
    return [
        { id: 'f1', name: 'Cross-Domain Algorithm Bridge', description: 'Optimizes translation layers for algorithm portability across classical and quantum modules.', predictedGains: { speed: 0.20, stability: 0.20, efficiency: 0.50 }, risk: 'Medium' },
    ];
}


// --- Mock Data ---
const mockSystemHealth: SystemHealth = {
    currentVersion: 'v5.3.1',
    cognitiveEfficiency: 0.75, // 75% - Starting below P1 target (0.85)
    systemStability: 0.88, // 88%
    processingSpeed: 320, // TFLOPS
};

// --- Helper Functions ---
const getRiskColor = (risk: 'Low' | 'Medium' | 'High') => {
    switch (risk) {
        case 'Low': return 'text-green-400 border-green-700/50 bg-green-900/30';
        case 'Medium': return 'text-yellow-400 border-yellow-700/50 bg-yellow-900/30';
        case 'High': return 'text-red-400 border-red-700/50 bg-red-900/30';
    }
};

// --- Main Component ---
const QCOSSystemEvolutionInterface: React.FC = () => {
    const [systemHealth, setSystemHealth] = useState<SystemHealth>(mockSystemHealth);
    const [trainingPhaseIndex, setTrainingPhaseIndex] = useState(0);
    const [branches, setBranches] = useState<EvolutionaryBranch[]>(getFallbackBranches(AGI_ROADMAP[0].focus));
    const [currentSimulation, setCurrentSimulation] = useState<Simulation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [autoDeploy, setAutoDeploy] = useState(false);
    const [learningRate, setLearningRate] = useState(0.001);
    const [landscapeData, setLandscapeData] = useState<LandscapePoint[]>([]);
    const [systemMessage, setSystemMessage] = useState<{ type: 'success' | 'info', text: string } | null>(null);

    const isTrainingComplete = trainingPhaseIndex >= AGI_ROADMAP.length;
    const currentRoadmap = isTrainingComplete
        ? { focus: "AGI Core Operational", phase: "Training Complete", milestone: "AGI Core Stable", targetEfficiency: 1.0 }
        : AGI_ROADMAP[trainingPhaseIndex];
    const isFinalPhase = trainingPhaseIndex === AGI_ROADMAP.length - 1;


    const getStatusColor = (index: number) => {
        if (index < trainingPhaseIndex) return 'bg-green-500'; // Completed
        if (index === trainingPhaseIndex) return 'bg-amber-500 animate-pulse'; // Current
        return 'bg-slate-700'; // Pending
    }

    const advancePhase = useCallback(() => {
        if (trainingPhaseIndex < AGI_ROADMAP.length - 1) {
            setTrainingPhaseIndex(prev => prev + 1);
            setSystemMessage({ type: 'success', text: `Target Met! Advancing to ${AGI_ROADMAP[trainingPhaseIndex + 1].phase}. Generating new synchronized branches.` });
        } else if (trainingPhaseIndex === AGI_ROADMAP.length - 1) {
            setTrainingPhaseIndex(prev => prev + 1); // Set to complete state
            setSystemMessage({ type: 'success', text: "AGI Training Roadmap Complete. QCOS has achieved cognitive self-stability." });
        }
    }, [trainingPhaseIndex]);


    const fetchBranches = useCallback(async () => {
        if (isTrainingComplete) {
            setBranches([]);
            return;
        }

        setIsLoading(true);
        // Synchronized Prompt Generation using current phase's focus
        const prompt = getSynchronizedPrompt(currentRoadmap.focus);

        const fetchedBranches = await callGemini(prompt, SYSTEM_INSTRUCTION);
        if (fetchedBranches.length > 0) {
            // Ensure predictedGains are parsed as numbers and assign new IDs
            const validatedBranches = fetchedBranches.map(b => ({
                ...b,
                id: `gen-${Date.now() + Math.random()}`,
                predictedGains: {
                    speed: Number(b.predictedGains.speed),
                    stability: Number(b.predictedGains.stability),
                    efficiency: Number(b.predictedGains.efficiency),
                }
            }));
            setBranches(validatedBranches);
        } else {
             // Use synchronized fallback if API fails
            setBranches(getFallbackBranches(currentRoadmap.focus));
        }
        setIsLoading(false);
    }, [currentRoadmap.focus, isTrainingComplete]);

    // Initial load and phase change refresh
    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    // Landscape Data Generation
    useEffect(() => {
        const current: LandscapePoint = {
            name: `v${systemHealth.cognitiveEfficiency.toFixed(3)}`,
            speed: systemHealth.processingSpeed / 500, // Normalize speed for chart (assuming max 500 TFLOPS)
            stability: systemHealth.systemStability,
            efficiency: systemHealth.cognitiveEfficiency,
            type: 'current',
        };

        // Candidate points show the projected outcome if deployed (70% realization)
        const candidates: LandscapePoint[] = branches.map(b => ({
            name: b.name,
            speed: Math.min(1.0, current.speed + b.predictedGains.speed * (1.0 - current.speed) * 0.7),
            stability: Math.min(1.0, current.stability + b.predictedGains.stability * (1.0 - current.stability) * 0.7),
            efficiency: Math.min(1.0, current.efficiency + b.predictedGains.efficiency * (1.0 - current.efficiency) * 0.7),
            type: 'candidate',
        }));

        setLandscapeData([current, ...candidates]);
    }, [systemHealth, branches]);


    // Mock Simulation Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentSimulation && currentSimulation.progress < 100) {
            interval = setInterval(() => {
                setCurrentSimulation(sim => {
                    if (!sim) return null;
                    const riskFactor = sim.branch.risk === 'Low' ? 1.5 : sim.branch.risk === 'Medium' ? 1.0 : 0.6;
                    // Introduce slight randomness for simulation realism
                    const newProgress = Math.min(100, sim.progress + Math.random() * 3 * riskFactor);
                    return {
                        ...sim,
                        progress: newProgress,
                        elapsedTime: sim.elapsedTime + 1,
                    };
                });
            }, 500);
        } else if (currentSimulation && currentSimulation.progress >= 100) {
            // Simulation Complete
            clearInterval(interval);
            setTimeout(() => {
                const branch = currentSimulation.branch;
                // Calculate new system health based on gains (1/4 realization of potential gain)
                const newSpeed = systemHealth.processingSpeed * (1 + branch.predictedGains.speed / 4);
                const newStability = systemHealth.systemStability * (1 + branch.predictedGains.stability / 4);
                const newEfficiency = systemHealth.cognitiveEfficiency * (1 + branch.predictedGains.efficiency / 4);
                const efficiencyResult = Math.min(1.0, newEfficiency);

                setSystemHealth({
                    currentVersion: `v5.4.${Math.floor(Math.random() * 10)}`,
                    processingSpeed: newSpeed,
                    systemStability: Math.min(1.0, newStability),
                    cognitiveEfficiency: efficiencyResult
                });

                setCurrentSimulation(null);

                // Check for AGI Phase Advancement
                if (!isTrainingComplete && efficiencyResult >= currentRoadmap.targetEfficiency) {
                     // Only advance if a simulation was successful AND it hit the target
                     setTimeout(advancePhase, 3000); // Wait 3s then auto-advance phase
                } else if (!isTrainingComplete && efficiencyResult < currentRoadmap.targetEfficiency) {
                    setSystemMessage({ type: 'info', text: `Deployment Successful. New Efficiency: ${(efficiencyResult * 100).toFixed(1)}%. Target for Phase ${trainingPhaseIndex + 1} is ${(currentRoadmap.targetEfficiency * 100).toFixed(1)}%. Try another branch.` });
                }

            }, 2000); // 2 second pause before resetting for stability check
        }
        return () => clearInterval(interval);
    }, [currentSimulation, systemHealth, advancePhase, isTrainingComplete, currentRoadmap.targetEfficiency, trainingPhaseIndex]);

    const startSimulation = (branch: EvolutionaryBranch) => {
        if (currentSimulation) return;
        setSystemMessage({ type: 'info', text: `Initiating simulation for branch: ${branch.name}. Deployment will occur on completion.`});
        setCurrentSimulation({
            id: `sim-${Date.now()}`,
            branch: branch,
            progress: 0,
            elapsedTime: 0,
        });
    };

    return (
        <div className="bg-slate-900 text-cyan-50 min-h-screen p-4 md:p-8 font-inter antialiased">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                    .font-inter { font-family: 'Inter', sans-serif; }
                    .holographic-button {
                        background: linear-gradient(145deg, rgba(0, 220, 255, 0.1), rgba(0, 100, 200, 0.2));
                        border: 1px solid rgba(0, 220, 255, 0.3);
                        box-shadow: 0 0 10px rgba(0, 220, 255, 0.2), inset 0 0 5px rgba(255, 255, 255, 0.1);
                        transition: all 0.3s;
                        cursor: pointer;
                    }
                    .holographic-button:hover:not(:disabled) {
                        background: linear-gradient(145deg, rgba(0, 255, 255, 0.2), rgba(0, 150, 255, 0.3));
                        box-shadow: 0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.2);
                    }
                    .recharts-tooltip-wrapper {
                        background-color: rgba(15, 23, 42, 0.9) !important;
                        border: 1px solid #06B6D4 !important;
                        border-radius: 6px;
                        padding: 8px;
                        color: #E0F7FA !important;
                        font-size: 12px;
                        box-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
                    }
                `}
            </style>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-cyan-400 tracking-tight flex items-center">
                    <CubeTransparentIcon className="w-8 h-8 mr-3" />
                    QCOS Evolution Interface <span className="text-sm ml-4 text-cyan-600 font-normal">v{systemHealth.currentVersion}</span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">Real-time assessment and deployment of next-generation quantum system architectures.</p>
            </header>
            
            {/* System Message / Notification */}
            {systemMessage && (
                <div className={`p-3 mb-6 rounded-lg font-semibold ${systemMessage.type === 'success' ? 'bg-green-900/50 border border-green-700 text-green-300' : 'bg-blue-900/50 border border-blue-700 text-blue-300'}`}>
                    {systemMessage.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status and Landscape Section (Lg: Col 1-2) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* System Health Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/50 rounded-xl border border-cyan-800/50 shadow-lg shadow-cyan-900/20">
                        <div className="text-center p-3 border-r border-cyan-900/50">
                            <GaugeIcon className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
                            <p className="text-sm text-slate-300">Efficiency</p>
                            <p className="text-2xl font-mono font-bold text-cyan-200">{(systemHealth.cognitiveEfficiency * 100).toFixed(1)}%</p>
                            {isTrainingComplete || (
                                <p className="text-xs text-slate-500 mt-1">Target: {(currentRoadmap.targetEfficiency * 100).toFixed(1)}%</p>
                            )}
                        </div>
                        <div className="text-center p-3 border-r border-cyan-900/50">
                            <ShieldCheckIcon className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
                            <p className="text-sm text-slate-300">Stability</p>
                            <p className="text-2xl font-mono font-bold text-cyan-200">{(systemHealth.systemStability * 100).toFixed(1)}%</p>
                        </div>
                        <div className="text-center p-3">
                            <ZapIcon className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
                            <p className="text-sm text-slate-300">Speed</p>
                            <p className="text-2xl font-mono font-bold text-cyan-200">{systemHealth.processingSpeed.toFixed(0)} TFLOPS</p>
                        </div>
                    </div>

                    {/* Evolutionary Landscape Chart */}
                    <div className="bg-slate-800/70 p-4 rounded-xl border border-cyan-700 shadow-xl">
                        <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center"><BrainCircuitIcon className="w-5 h-5 mr-2" /> Evolutionary Landscape (Normalized)</h2>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart
                                    margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#083344" />
                                    <XAxis
                                        type="number"
                                        dataKey="speed"
                                        name="Speed"
                                        unit=""
                                        stroke="#94A3B8"
                                        domain={[0, 1.1]}
                                        tickFormatter={(t) => (t * 500).toFixed(0) + ' TFLOPs'}
                                        label={{ value: 'Processing Speed', position: 'bottom', fill: '#06B6D4' }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="stability"
                                        name="Stability"
                                        unit=""
                                        stroke="#94A3B8"
                                        domain={[0, 1.1]}
                                        tickFormatter={(t) => (t * 100).toFixed(0) + '%'}
                                        label={{ value: 'System Stability', angle: -90, position: 'left', fill: '#06B6D4' }}
                                    />
                                    <ZAxis type="number" dataKey="efficiency" range={[100, 600]} name="Cognitive Efficiency" unit="" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#06B6D4' }} content={({ payload }) => {
                                        if (payload && payload.length) {
                                            const data = payload[0].payload as LandscapePoint;
                                            return (
                                                <div className="recharts-tooltip-wrapper">
                                                    <p className="font-bold text-cyan-300">{data.name}</p>
                                                    <p className="text-xs">Speed: <span className="text-cyan-200">{(data.speed * 500).toFixed(0)} TFLOPS</span></p>
                                                    <p className="text-xs">Stability: <span className="text-cyan-200">{(data.stability * 100).toFixed(1)}%</span></p>
                                                    <p className="text-xs">Efficiency: <span className="text-cyan-200">{(data.efficiency * 100).toFixed(1)}%</span></p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }} />
                                    <Legend />

                                    {/* Current System Point */}
                                    <Scatter
                                        name="Current State"
                                        data={landscapeData.filter(d => d.type === 'current')}
                                        fill="#0891b2"
                                        shape="star"
                                        line={{ stroke: '#0891b2' }}
                                    />

                                    {/* Candidate Branch Points */}
                                    <Scatter
                                        name="Candidate Branches"
                                        data={landscapeData.filter(d => d.type === 'candidate')}
                                        fill="#06b6d4"
                                        shape="circle"
                                        line={{ stroke: '#06b6d4' }}
                                    />

                                    {/* Reference lines for current performance */}
                                    <ReferenceLine x={systemHealth.processingSpeed / 500} stroke="#4f46e5" strokeDasharray="3 3" />
                                    <ReferenceLine y={systemHealth.systemStability} stroke="#4f46e5" strokeDasharray="3 3" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-xs text-slate-400">
                            <p><span className="text-cyan-400 font-semibold">Z-Axis (Size)</span> represents Cognitive Efficiency.</p>
                        </div>
                    </div>
                </div>

                {/* AGI Training Hub and Control Section (Lg: Col 3) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* AGI Training Hub Panel */}
                    <div className="p-4 rounded-xl border border-purple-500/80 bg-slate-900/80 shadow-purple-900/30 space-y-4">
                        <h2 className="text-xl font-bold text-purple-300 flex items-center">
                            <BeakerIcon className="w-6 h-6 mr-2" />
                            AGI Training Hub
                        </h2>

                        {/* Roadmap Display */}
                        <div className="border-t border-b border-slate-700 py-3">
                            {AGI_ROADMAP.map((roadmap, index) => (
                                <div key={index} className="flex items-start mb-2">
                                    {/* Status Icon */}
                                    <div className={`w-4 h-4 rounded-full mt-1 mr-3 flex-shrink-0 ${getStatusColor(index)}`} />
                                    <div className='w-full'>
                                        <p className={`font-semibold text-sm ${index === trainingPhaseIndex ? 'text-amber-300' : 'text-slate-300'}`}>{roadmap.phase}</p>
                                        <p className="text-xs text-slate-400">Target Efficiency: {(roadmap.targetEfficiency * 100).toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isTrainingComplete ? (
                            <div className="text-center p-3 bg-green-900/50 rounded-lg border border-green-700 text-green-300 font-semibold">
                                <CheckCircle2Icon className="w-5 h-5 mx-auto mb-1" />
                                Roadmap Complete. AGI Core Operational.
                            </div>
                        ) : (
                            <>
                                {/* Current Focus Details */}
                                <div className="p-3 bg-black/30 rounded-md border border-purple-700">
                                    <p className="text-sm text-slate-400">Current Focus: <span className="font-semibold text-purple-400">{currentRoadmap.focus}</span></p>
                                    <p className="text-xs text-slate-500 mt-1">Milestone: {currentRoadmap.milestone}</p>
                                </div>

                                {/* Training Controls */}
                                <button
                                    onClick={advancePhase}
                                    disabled={systemHealth.cognitiveEfficiency < currentRoadmap.targetEfficiency || !!currentSimulation}
                                    className="holographic-button w-full px-4 py-2 text-sm font-semibold rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowRightIcon className="w-4 h-4 mr-2" />
                                    {systemHealth.cognitiveEfficiency < currentRoadmap.targetEfficiency ? (
                                        `NEED ${(currentRoadmap.targetEfficiency * 100).toFixed(1)}% EFFICIENCY`
                                    ) : (
                                        `ADVANCE TO ${AGI_ROADMAP[trainingPhaseIndex + 1]?.phase.toUpperCase() || 'FINAL PHASE'}`
                                    )}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Current Simulation Status */}
                    <div className={`p-4 rounded-xl border ${currentSimulation ? 'border-amber-500/80 bg-slate-900/80 shadow-amber-900/30' : 'border-slate-700 bg-slate-800/50'}`}>
                        <h2 className="text-lg font-semibold text-amber-300 mb-3 flex items-center">
                            {currentSimulation ? <LoaderIcon className="w-5 h-5 mr-2 animate-spin" /> : <PlayIcon className="w-5 h-5 mr-2" />}
                            SYSTEM SIMULATION
                        </h2>
                        {currentSimulation ? (
                            <div>
                                <p className="text-cyan-200 font-bold">{currentSimulation.branch.name}</p>
                                <p className="text-xs text-slate-400 mt-1">{currentSimulation.branch.description}</p>
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-300">Progress:</span>
                                        <span className={`font-mono font-bold ${currentSimulation.progress < 100 ? 'text-amber-400' : 'text-green-400'}`}>{currentSimulation.progress.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${currentSimulation.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Elapsed: {currentSimulation.elapsedTime}s</p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 flex items-center"><CheckCircle2Icon className="w-4 h-4 mr-2 text-green-500" /> System Awaiting New Evolution Test</p>
                        )}
                    </div>

                    {/* System Configuration */}
                    <div className="bg-slate-800/70 p-4 rounded-xl border border-cyan-800/50">
                        <h3 className="text-cyan-300 text-sm tracking-widest mb-3 flex items-center"><CodeBracketIcon className="w-4 h-4 mr-2" /> TRAINING CONFIG</h3>
                        <div className="space-y-3">
                            <div className="bg-black/30 p-3 rounded-md border border-cyan-900">
                                <h4 className="text-slate-300 text-xs tracking-widest mb-1">EPOCH CYCLES</h4>
                                <div className="flex items-center justify-between">
                                    <p className="text-xl font-mono text-cyan-400 font-bold">4.2K</p>
                                    <p className="text-xs text-cyan-400">LR: {learningRate.toExponential(1)}</p>
                                </div>
                            </div>
                             <div className="bg-black/30 p-3 rounded-md border border-cyan-900">
                                <h3 className="text-cyan-300 text-sm tracking-widest mb-2 flex items-center"><ZapIcon className="w-4 h-4 mr-2"/>AUTONOMOUS DEPLOYMENT</h3>
                                <div className="flex items-center justify-between">
                                    <div className={`flex items-center gap-2 text-sm font-bold ${autoDeploy ? 'text-green-400' : 'text-cyan-600'}`}>
                                        <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors cursor-pointer ${autoDeploy ? 'bg-cyan-500' : 'bg-slate-700'}`} onClick={() => setAutoDeploy(v => !v)}>
                                            <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform ${autoDeploy ? 'translate-x-5' : ''}`}/>
                                        </div>
                                        {autoDeploy ? "ENABLED" : "DISABLED"}
                                    </div>
                                    <button className="holographic-button px-3 py-1 text-xs font-semibold rounded-md">Rollback to v{systemHealth.cognitiveEfficiency.toFixed(3)}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Evolutionary Branch List */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-cyan-300 flex items-center"><GitBranchIcon className="w-5 h-5 mr-2" /> Evolutionary Branches ({branches.length})</h2>
                    <button
                        onClick={fetchBranches}
                        disabled={isLoading || !!currentSimulation || isTrainingComplete}
                        className={`holographic-button px-4 py-2 text-sm font-semibold rounded-lg flex items-center ${isLoading || !!currentSimulation || isTrainingComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? <LoaderIcon className="w-4 h-4 mr-2 animate-spin" /> : <ArrowPathIcon className="w-4 h-4 mr-2" />}
                        {isLoading ? 'GENERATING...' : 'GENERATE SYNCHRONIZED BRANCHES'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isTrainingComplete ? (
                        <div className="md:col-span-3 text-center p-6 bg-slate-800/50 rounded-xl border border-green-700/50">
                            <SparklesIcon className="w-8 h-8 mx-auto text-green-400 mb-2" />
                            <p className="text-lg text-green-300">AGI Core Stability Achieved.</p>
                            <p className="text-sm text-slate-400">No further evolutionary branches are required for the current roadmap.</p>
                        </div>
                    ) : branches.map((branch) => (
                        <div key={branch.id} className="bg-slate-800 p-4 rounded-xl border border-cyan-900/80 hover:border-cyan-500/50 transition-all duration-300">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-cyan-200">{branch.name}</h3>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getRiskColor(branch.risk)}`}>
                                    RISK: {branch.risk.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">{branch.description}</p>

                            <div className="space-y-1 mb-4 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300 flex items-center">
                                        <ZapIcon className="w-3 h-3 mr-1 text-cyan-400" /> Speed Gain:
                                    </span>
                                    <span className="font-mono font-semibold text-cyan-300">+{Math.round(branch.predictedGains.speed * 100)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300 flex items-center">
                                        <ShieldCheckIcon className="w-3 h-3 mr-1 text-cyan-400" /> Stability Gain:
                                    </span>
                                    <span className="font-mono font-semibold text-cyan-300">+{Math.round(branch.predictedGains.stability * 100)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300 flex items-center">
                                        <BrainCircuitIcon className="w-3 h-3 mr-1 text-cyan-400" /> Efficiency Gain:
                                    </span>
                                    <span className="font-mono font-semibold text-cyan-300">+{Math.round(branch.predictedGains.efficiency * 100)}%</span>
                                </div>
                            </div>
                            <button
                                onClick={() => startSimulation(branch)}
                                disabled={!!currentSimulation}
                                className={`holographic-button w-full px-3 py-2 text-sm font-semibold rounded-md flex items-center justify-center transition-opacity ${!!currentSimulation ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <ArrowRightIcon className="w-4 h-4 mr-2" />
                                Initiate Simulation
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QCOSSystemEvolutionInterface;