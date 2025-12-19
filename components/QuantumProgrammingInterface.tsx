

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import GlassPanel from './GlassPanel';
import SyntaxHighlighter from './SyntaxHighlighter';
import { LoaderIcon, AlertTriangleIcon, BeakerIcon, ArrowPathIcon, StopIcon, CheckCircle2Icon, XIcon, FileCodeIcon, BookOpenIcon, ChevronDownIcon, ShieldCheckIcon, Share2Icon, GitBranchIcon, ActivityIcon, BoxIcon, SparklesIcon } from './Icons';

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const CATEGORIES = ['Security', 'Communication', 'Entanglement', 'Command', 'Optimization', 'Simulation', 'General'] as const;
type ProtocolCategory = typeof CATEGORIES[number];

const categoryIcons: Record<ProtocolCategory, React.FC<{className?: string}>> = {
    Security: ShieldCheckIcon,
    Communication: Share2Icon,
    Entanglement: GitBranchIcon,
    Command: FileCodeIcon,
    Optimization: ActivityIcon,
    Simulation: BeakerIcon,
    General: BoxIcon,
};

interface SavedProtocol {
  name: string;
  code: string;
  category: ProtocolCategory;
}

const automationPrompts = [
    'Demonstrate quantum teleportation between 3 qubits',
    'Create a 4-qubit GHZ state',
    'Simulate Grover\'s search for a 3-qubit system to find state |101>',
    'Show the effect of a Hadamard gate on a |1> state followed by a Z gate',
    'Create a Bell pair (phi plus state) and measure in different bases',
    'Simulate the Deutsch-Jozsa algorithm for a 2-qubit function',
    'Apply a quantum Fourier transform to the state |010>',
];

const redundancyExample: SavedProtocol = {
    name: "Redundant Gate Example",
    code: `QREG q[2];
CREG c[2];

ALLOC q;
ALLOC c;

EXECUTE {
    // Initial Bell state preparation
    OP::H q[0];
    OP::CNOT q[0], q[1];

    // Introduce a pair of redundant X gates
    OP::X q[0]; // First X gate
    OP::RZ(PI/2) q[1]; // Some intermediate operation
    OP::X q[0]; // Second X gate, cancels the first X on q[0]

    // Another operation
    OP::H q[1];

    MEASURE q[0] -> c[0];
    MEASURE q[1] -> c[1];
}`,
    category: 'General'
};


const QuantumProgrammingInterface: React.FC = () => {
    const [phenomenonPrompt, setPhenomenonPrompt] = useState('');
    const [simulationResult, setSimulationResult] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationError, setSimulationError] = useState<string | null>(null);
    
    // Optimization State
    const [optimizedScript, setOptimizedScript] = useState<string | null>(null);
    const [optimizationAnalysis, setOptimizationAnalysis] = useState<string | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    
    const [library, setLibrary] = useState<{ [category: string]: SavedProtocol[] }>(() => {
        try {
            const savedLibrary = localStorage.getItem('quantumProtocolLibrary');
            return savedLibrary ? JSON.parse(savedLibrary) : {};
        } catch (error) {
            console.error("Could not load protocol library from local storage", error);
            return {};
        }
    });

    const [isAutomationRunning, setIsAutomationRunning] = useState(false);
    const automationIntervalRef = useRef<number | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
    
    const [translation, setTranslation] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);

    useEffect(() => {
        try {
            localStorage.setItem('quantumProtocolLibrary', JSON.stringify(library));
        } catch (error) {
            console.error("Could not save protocol library to local storage", error);
        }
    }, [library]);

    const handleTranslateScript = async (script: string) => {
        if (!ai || !script) return;
        setIsTranslating(true);
        setTranslation(null);
        setSimulationError(null);

        try {
            const systemInstruction = `You are a quantum computing expert with a talent for explaining complex topics simply. Your task is to translate a Q-Lang script into a plain English, step-by-step explanation. Focus on the 'what' and 'why' of each major step, avoiding overly technical jargon where possible. The target audience is an intelligent but non-expert user.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Please translate the following Q-Lang script into a simple, step-by-step explanation:\n\n\`\`\`q-lang\n${script}\n\`\`\``,
                config: { systemInstruction }
            });

            const responseText = response.text;
            if (!responseText) { throw new Error("Received an empty response from the translation model."); }
            setTranslation(responseText.trim());
        } catch (error) {
            console.error("Error during translation:", error);
            setTranslation("Failed to generate a translation for this protocol.");
        } finally {
            setIsTranslating(false);
        }
    };
    
    useEffect(() => {
        const scriptToTranslate = optimizedScript || simulationResult;
        if (scriptToTranslate && !isAutomationRunning) {
            handleTranslateScript(scriptToTranslate);
        } else {
            setTranslation(null);
        }
    }, [simulationResult, optimizedScript, isAutomationRunning]);
    
    const getProtocolCategory = async (script: string): Promise<ProtocolCategory> => {
        if (!ai) return 'General';
        try {
            const systemInstruction = `You are a quantum computing expert. Your task is to classify a Q-Lang script into one of the following categories: ${CATEGORIES.join(', ')}. You MUST respond with only a single word, which is the most appropriate category name. Do not add any other text or punctuation.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Classify this Q-Lang script:\n\n\`\`\`q-lang\n${script}\n\`\`\``,
                config: { systemInstruction }
            });
            const categoryText = response.text?.trim() as ProtocolCategory;
            return (categoryText && CATEGORIES.includes(categoryText)) ? categoryText : 'General';
        } catch (error) {
            console.error("Error categorizing script:", error);
            return 'General';
        }
    };

    const generateAndProcessScript = async (promptToSimulate: string): Promise<{ name: string; code: string } | null> => {
        if (!ai) {
            setSimulationError("Gemini API key not configured.");
            return null;
        }

        setIsSimulating(true);
        setSimulationResult(null); setSimulationError(null); setTranslation(null); setOptimizedScript(null); setOptimizationAnalysis(null);
        setPhenomenonPrompt(promptToSimulate);

        try {
            const systemInstruction = `You are an expert quantum physicist and programmer. Your task is to generate a Q-Lang script to simulate a quantum phenomenon described by the user.
Q-Lang Syntax:
- QREG ALLOC <n>: Allocate n qubits.
- CREG ALLOC <n>: Allocate n classical bits.
- EXECUTE OP::<GATE> Q[target], Q[control?]: Apply a gate (e.g., H, X, Z, CNOT).
- EXECUTE OP::MEASURE Q[n] -> C[n]: Measure a qubit into a classical bit.
- Comments start with //.
- You MUST only output the raw Q-Lang code, without any explanations or markdown wrappers.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate a Q-Lang script to simulate the following quantum phenomenon: "${promptToSimulate}"`,
                config: { systemInstruction }
            });

            const responseText = response.text;
            if (!responseText) { throw new Error("Received an empty response from the AI model."); }
            const code = responseText.trim();
            setSimulationResult(code);
            return { name: promptToSimulate, code };
        } catch (error) {
            console.error("Error during simulation:", error);
            let errorMsg = "Failed to generate simulation script. The model may have encountered an issue.";
            if (typeof error === 'object' && error !== null && 'toString' in error && error.toString().includes('429')) {
                errorMsg = "Rate limit reached. Please wait a moment before running another simulation.";
            }
            setSimulationError(errorMsg);
            return null;
        } finally {
            setIsSimulating(false);
        }
    };

    const handleSimulate = () => {
        if (!phenomenonPrompt || isSimulating || isAutomationRunning) return;
        generateAndProcessScript(phenomenonPrompt);
    };
    
     const optimizeQLangScript = (code: string): { optimizedCode: string; changes: string[] } => {
        const lines = code.split('\n');
        const changes: string[] = [];
        let linesToRemove = new Set<number>();
        const xGates: { lineIndex: number; qubit: string }[] = [];
        lines.forEach((line, index) => {
            const match = line.trim().match(/^OP::X\s+(q\[\d+\]);/);
            if (match && match[1]) {
                xGates.push({ lineIndex: index, qubit: match[1] });
            }
        });
        const gatesByQubit: { [key: string]: number[] } = {};
        xGates.forEach(gate => {
            if (!gatesByQubit[gate.qubit]) gatesByQubit[gate.qubit] = [];
            gatesByQubit[gate.qubit]?.push(gate.lineIndex);
        });
        for (const qubit in gatesByQubit) {
            const indices = gatesByQubit[qubit];
            if(indices) {
              for (let i = 0; i < Math.floor(indices.length / 2) * 2; i += 2) {
                  const first = indices[i];
                  const second = indices[i+1];
                  if(first !== undefined && second !== undefined) {
                      linesToRemove.add(first);
                      linesToRemove.add(second);
                      changes.push(`Removed redundant X-gate pair on qubit ${qubit}`);
                  }
              }
            }
        }
        let commentAdded = false;
        const optimizedLines = lines.filter((_, index) => !linesToRemove.has(index))
          .map(line => {
            if (!commentAdded && changes.length > 0 && linesToRemove.has(lines.indexOf(line) - 1)) {
              commentAdded = true;
              return `    // ${changes.join('. ')}.\n` + line;
            }
            return line;
          });
        return { optimizedCode: optimizedLines.join('\n'), changes };
    };

    const handleOptimizeScript = async () => {
        if (!simulationResult || isOptimizing) return;
        setIsOptimizing(true); setOptimizedScript(null); setOptimizationAnalysis(null);
        
        await new Promise(res => setTimeout(res, 1500)); // Simulate analysis time
        
        const { optimizedCode, changes } = optimizeQLangScript(simulationResult);
        setOptimizedScript(optimizedCode);
        
        if (ai && changes.length > 0) {
            try {
                const systemInstruction = `You are Agent Q. Your QNN core has just optimized a Q-Lang script. Briefly explain the benefits of the optimizations that were performed in a short paragraph. Be concise and technical.`;
                const prompt = `My QNN core performed the following optimizations: ${changes.join(', ')}. Explain the benefits of this action.`;
                const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { systemInstruction } });
                setOptimizationAnalysis(response.text?.trim() ?? "Analysis failed.");
            } catch (e) { setOptimizationAnalysis("Failed to generate analysis due to an API error."); }
        } else if (changes.length === 0) {
            setOptimizationAnalysis("QNN analysis complete. No redundant operations found to optimize in this script.");
        }
        setIsOptimizing(false);
    };

    const handleSaveToLibrary = async () => {
        const scriptToSave = optimizedScript || simulationResult;
        const nameToSave = phenomenonPrompt;
        if (scriptToSave && nameToSave) {
            setSaveStatus('saving');
            const category = await getProtocolCategory(scriptToSave);
            const newProtocol: SavedProtocol = { name: nameToSave, code: scriptToSave, category };
            // FIX: The logic to update the library was buggy and could cause type errors.
            // Replaced with a cleaner, immutable update pattern that also handles new categories correctly.
            setLibrary(prev => {
                const newLibrary = { ...prev };
                const existingCategory = newLibrary[category] || [];
                if (!existingCategory.some(p => p.name === newProtocol.name)) {
                    newLibrary[category] = [...existingCategory, newProtocol];
                }
                return newLibrary;
            });
            setSaveStatus('success');
            setTimeout(() => { handleDiscard(); setSaveStatus('idle'); }, 2000);
        }
    };

    const handleDiscard = () => {
        setSimulationResult(null); setPhenomenonPrompt(''); setSimulationError(null); setTranslation(null); setOptimizedScript(null); setOptimizationAnalysis(null);
    };
    
    const handleLoadFromLibrary = (protocol: SavedProtocol) => {
        if (isAutomationRunning) return;
        setPhenomenonPrompt(protocol.name); setSimulationResult(protocol.code);
        setSimulationError(null); setTranslation(null); setOptimizedScript(null); setOptimizationAnalysis(null);
    };
    
    useEffect(() => {
        if (isAutomationRunning) {
            const runAutomationStep = async () => {
                const randomPrompt = automationPrompts[Math.floor(Math.random() * automationPrompts.length)];
                if (Object.values(library).flat().some(p => p.name === randomPrompt)) return;
                const result = await generateAndProcessScript(randomPrompt);
                if (result) {
                    const category = await getProtocolCategory(result.code);
                    const newProtocol: SavedProtocol = { ...result, category };
                    setLibrary(prev => {
                        const newLibrary = {...prev};
                        if (!newLibrary[category]) newLibrary[category] = [];
                        newLibrary[category]?.push(newProtocol);
                        return newLibrary;
                    });
                    setSimulationResult(null); setPhenomenonPrompt('');
                }
            };
            runAutomationStep();
            automationIntervalRef.current = window.setInterval(runAutomationStep, 8000);
        } else if (automationIntervalRef.current) clearInterval(automationIntervalRef.current);
        return () => { if (automationIntervalRef.current) clearInterval(automationIntervalRef.current) };
    }, [isAutomationRunning, library]);


    const renderSimulationResult = () => {
        if (isSimulating && !simulationResult) {
            return <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-cyan-400"><LoaderIcon className="w-8 h-8 animate-spin mb-2" /><p>Simulating: "{phenomenonPrompt}"</p></div>;
        }
        if (simulationError) {
            return <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-red-400 p-4 text-center"><AlertTriangleIcon className="w-8 h-8 mb-2" /><p>{simulationError}</p></div>;
        }
        if (simulationResult) {
            return <SyntaxHighlighter code={simulationResult} />;
        }
        return <div className="flex items-center justify-center h-full min-h-[150px] text-cyan-700"><p>Simulation output will appear here.</p></div>;
    };
    
    const renderTranslation = () => {
        if (isTranslating) return <div className="flex items-center justify-center h-full text-cyan-400"><LoaderIcon className="w-5 h-5 animate-spin mr-2" /><p className="text-sm">Translating protocol...</p></div>;
        if (translation) return <div className="text-cyan-200 text-sm whitespace-pre-wrap">{translation}</div>;
        if ((simulationResult || optimizedScript) && !isTranslating && !translation) return <div className="flex items-center justify-center h-full text-cyan-700"><p>Awaiting translation...</p></div>;
        return <div className="flex flex-col items-center justify-center h-full text-cyan-700 text-center"><p>Explanation will appear here.</p></div>;
    }

    const CollapsibleCategory: React.FC<{ category: ProtocolCategory; protocols: SavedProtocol[]; onLoad: (protocol: SavedProtocol) => void; isAutomationRunning: boolean;}> = ({ category, protocols, onLoad, isAutomationRunning }) => {
        const [isOpen, setIsOpen] = useState(true);
        const Icon = categoryIcons[category] || BoxIcon;
        return (
            <div>
                <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-2 bg-black/40 rounded-t-md border-b border-cyan-800 text-cyan-200 hover:bg-black/60"><div className="flex items-center gap-2"><Icon className="w-4 h-4" /><span className="font-semibold text-sm">{category}</span></div><ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
                {isOpen && <div className="p-2 space-y-2 bg-black/20 rounded-b-md">{protocols.map((proto, i) => ( <button key={i} onClick={() => onLoad(proto)} disabled={isAutomationRunning} className="w-full text-left p-2 rounded-md bg-black/30 hover:bg-black/50 border border-cyan-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><p className="text-sm font-semibold text-cyan-200 truncate">{proto.name}</p><p className="text-xs text-cyan-500 font-mono truncate">{proto.code.split('\n')[0]}</p></button>))}</div>}
            </div>
        )
    };

    if (!ai) return <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-black/30 border border-red-500/50 rounded-lg"><AlertTriangleIcon className="w-10 h-10 text-red-400 mb-3" /><h3 className="text-lg font-bold text-red-300">Simulator Offline</h3><p className="text-sm text-red-400">Gemini API key is not configured.</p></div>;
  
    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-4 min-h-0">
                <div className="flex-shrink-0 border border-cyan-500/30 rounded-lg p-3 bg-black/20">
                    <h3 className="text-base text-cyan-200 font-bold tracking-wider mb-2">New Protocol Simulator</h3>
                    <p className="text-xs text-cyan-400 mb-3">Describe a quantum phenomenon, and Agent Q will generate a Q-Lang script to simulate it.</p>
                    <textarea value={phenomenonPrompt} onChange={(e) => setPhenomenonPrompt(e.target.value)} rows={3} className="w-full bg-black/30 border border-blue-500/50 rounded-md p-2 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none" placeholder="e.g., 'Entangle three qubits into a GHZ state'" disabled={isSimulating || isAutomationRunning} />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <button onClick={handleSimulate} disabled={isSimulating || !phenomenonPrompt.trim() || isAutomationRunning} className="col-span-2 w-full bg-purple-500/30 hover:bg-purple-500/50 border border-purple-500/50 text-purple-200 font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 flex items-center justify-center"><BeakerIcon className="w-5 h-5 mr-2" /> Simulate Protocol</button>
                        <button onClick={() => setIsAutomationRunning(prev => !prev)} disabled={isSimulating && !isAutomationRunning} className={`w-full font-bold py-2 px-4 rounded transition-colors flex items-center justify-center border ${isAutomationRunning ? 'bg-red-500/30 hover:bg-red-500/50 border-red-500/50 text-red-200' : 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/50 text-yellow-200'}`}>{isAutomationRunning ? <><StopIcon className="w-5 h-5 mr-2" /> Stop</> : <><ArrowPathIcon className="w-5 h-5 mr-2" /> Auto</>}</button>
                        <button onClick={() => { handleLoadFromLibrary(redundancyExample); }} className="col-span-3 mt-1 w-full text-xs py-1 px-2 rounded bg-slate-600/30 hover:bg-slate-600/50 text-slate-300">Load Redundancy Example</button>
                    </div>
                </div>

                <div className="grid grid-rows-2 gap-4 flex-grow min-h-0">
                    <div className="flex-grow flex flex-col min-h-0">
                         <GlassPanel title={optimizedScript ? "Original Script" : "Simulation Result"}>
                           <div className="h-full overflow-auto pr-2">{renderSimulationResult()}</div>
                        </GlassPanel>
                        {simulationResult && !isAutomationRunning && (
                            <div className="flex-shrink-0 flex gap-2 pt-2 mt-2 border-t border-cyan-900/50 animate-fade-in">
                                <button onClick={handleSaveToLibrary} disabled={saveStatus !== 'idle'} className="flex-1 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-200 font-bold rounded transition-colors text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                    {saveStatus === 'saving' ? <><LoaderIcon className="w-4 h-4 mr-2 animate-spin"/> Saving...</> : saveStatus === 'success' ? <><CheckCircle2Icon className="w-4 h-4 mr-2"/> Saved!</> : <><CheckCircle2Icon className="w-4 h-4 mr-2"/> Save {optimizedScript ? 'Optimized' : 'Script'}</>}
                                </button>
                                <button onClick={handleDiscard} disabled={saveStatus !== 'idle'} className="flex-1 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 font-bold rounded transition-colors text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"><XIcon className="w-4 h-4 mr-2"/> Discard</button>
                                {!optimizedScript && <button onClick={handleOptimizeScript} disabled={isOptimizing || saveStatus !== 'idle'} className="flex-1 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-200 font-bold rounded transition-colors text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-wait"><SparklesIcon className="w-4 h-4 mr-2"/>{isOptimizing ? 'Analyzing...' : 'Optimize with QNN'}</button>}
                            </div>
                        )}
                    </div>
                    <div className="flex-grow flex flex-col min-h-0"><GlassPanel title={<><BookOpenIcon className="w-5 h-5 mr-2 inline-block"/> Protocol Translation</>}><div className="h-full overflow-y-auto pr-2">{renderTranslation()}</div></GlassPanel></div>
                </div>
            </div>

            <div className="min-h-0">
                {isOptimizing || optimizedScript ? (
                    <div className="h-full flex flex-col gap-4 animate-fade-in">
                        <GlassPanel title={<div className="flex items-center"><SparklesIcon className="w-5 h-5 mr-2"/> QNN Optimized Script</div>}>
                            <div className="h-full overflow-auto pr-2">{isOptimizing ? <div className="h-full flex items-center justify-center text-cyan-400"><LoaderIcon className="w-6 h-6 animate-spin" /></div> : <SyntaxHighlighter code={optimizedScript || ''} />}</div>
                        </GlassPanel>
                         <GlassPanel title="QNN Analysis Report">
                            <div className="h-full overflow-y-auto pr-2 text-sm text-cyan-200 whitespace-pre-wrap">{isOptimizing ? <div className="h-full flex items-center justify-center text-cyan-400"><LoaderIcon className="w-6 h-6 animate-spin" /></div> : optimizationAnalysis}</div>
                        </GlassPanel>
                    </div>
                ) : (
                    <GlassPanel title={<><FileCodeIcon className="w-5 h-5 mr-2 inline-block"/> Quantum Protocol Library</>}>
                        <div className="h-full overflow-y-auto pr-2">{Object.keys(library).length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center text-cyan-600 p-4"><p className="text-sm">No protocols saved.</p><p className="text-xs mt-1">Run simulations and save them, or start the automation to build your library.</p></div> : <div className="space-y-3">{CATEGORIES.map(category => library[category] && library[category]!.length > 0 ? <CollapsibleCategory key={category} category={category} protocols={library[category]!} onLoad={handleLoadFromLibrary} isAutomationRunning={isAutomationRunning} /> : null)}</div>}</div>
                    </GlassPanel>
                )}
            </div>
        </div>
    );
};

export default QuantumProgrammingInterface;
