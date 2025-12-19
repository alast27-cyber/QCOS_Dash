
import React, { useState, useEffect, useRef } from 'react';
import GlassPanel from './GlassPanel';
import { GoogleGenAI, Type } from '@google/genai';
import { GlobeIcon, ChartBarIcon, SparklesIcon, Share2Icon, LoaderIcon, ArrowPathIcon, BrainCircuitIcon, GitBranchIcon, ServerCogIcon, ChevronDownIcon, BookOpenIcon, XIcon, CpuChipIcon } from './Icons';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell, Label } from 'recharts';
import SyntaxHighlighter from './SyntaxHighlighter';


// --- Q-Lang Scripts for Methodologies Tab ---
const QUANTUM_OPTIMIZATION_ANSATZ_SCRIPT = `// Q-Lang Script for a Quantum Optimization Ansatz
// This circuit prepares a parameterized quantum state
// to be measured and fed into a classical optimizer for
// the Global Abundance Engine.

// Define quantum register for 'n' economic variables or decision points
QREG q[5];
// Define classical register for measurement outcomes
CREG c[5];

// Allocate qubits and classical bits
ALLOC q, c;

// Initialize all qubits in superposition to explore the solution space
EXECUTE ALL OP::H(q);

// --- Layer 1: Parameterized Rotations ---
// These parameters (theta_0 to theta_4) would be optimized by a classical optimizer
OP::RY(theta_0) q[0];
OP::RY(theta_1) q[1];
OP::RY(theta_2) q[2];
OP::RY(theta_3) q[3];
OP::RY(theta_4) q[4];

// --- Layer 2: Entangling Gates ---
// Creates correlations between economic factors
OP::CX q[0], q[1];
OP::CX q[1], q[2];
OP::CX q[2], q[3];
OP::CX q[3], q[4];
OP::CX q[4], q[0]; // Wrap-around entanglement

// --- Layer 3 (Optional, for deeper ansatz): More Parameterized Rotations ---
OP::RZ(phi_0) q[0];
OP::RZ(phi_1) q[1];
OP::RZ(phi_2) q[2];
OP::RZ(phi_3) q[3];
OP::RZ(phi_4) q[4];

// Measure all qubits to obtain a classical bit string representing a potential solution
MEASURE q[0] -> c[0];
MEASURE q[1] -> c[1];
MEASURE q[2] -> c[2];
MEASURE q[3] -> c[3];
MEASURE q[4] -> c[4];
`;

const QUANTUM_MONTE_CARLO_SCRIPT = `// Q-Lang Script for a Quantum Monte Carlo Amplitude Encoding
// This circuit prepares a quantum state where amplitudes represent
// probabilities of different economic states or resource levels,
// allowing for faster sampling in the Global Abundance Engine.

// Define quantum register to encode economic states/outcomes
QREG q[3];
// Define classical register for measurement outcomes
CREG c[3];

// Allocate qubits and classical bits
ALLOC q, c;

// --- State Preparation (Amplitude Encoding) ---
// The 'alpha' parameters would be derived from classical economic data.
// Using generic rotations to achieve desired amplitudes:

// Apply initial rotation to q[0]
OP::RY(alpha_0) q[0];

// Entangle and apply further rotations to sculpt the desired distribution
OP::CX q[0], q[1];
OP::RY(alpha_1) q[1];

OP::CX q[1], q[2];
OP::RY(alpha_2) q[2];

// For example, a controlled-Ry could encode conditional probabilities.
// OP::CRy(alpha_3) q[0], q[2];

// Measure all qubits to sample from the prepared probability distribution
MEASURE q[0] -> c[0];
MEASURE q[1] -> c[1];
MEASURE q[2] -> c[2];
`;


// --- Custom Hook for Animating Numbers ---
const useCountUp = (end: number, duration = 1500, decimals = 0) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const startTime = Date.now();

        const animateCount = () => {
            const now = Date.now();
            const progress = Math.min(1, (now - startTime) / duration);
            const newCount = start + progress * (end - start);
            setCount(newCount);

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            }
        };

        requestAnimationFrame(animateCount);
    }, [end, duration]);

    return count.toFixed(decimals);
};

// --- Type Definitions ---
interface VisualAid {
    type: 'table' | 'bar_chart';
    title: string;
    headers?: string[];
    rows?: string[][];
    data?: { name: string; value: number }[];
    xAxisLabel?: string;
    yAxisLabel?: string;
}

interface Pathway {
    title: string;
    description: string;
    impact: 'High' | 'Medium';
    icon: React.FC<{ className?: string }>;
    detailedDiscussion: string;
    visualAid: VisualAid;
}

interface SimulationResults {
    name: string; // Used for library display
    timestamp: string;
    gai: number;
    scarcityReduction: number;
    equalityCoefficient: number;
    projectedGaiData: { year: number; gai: number }[];
    pathways: Pathway[];
}

// --- Recharts Tooltip Components ---
const GaiTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/80 p-2 border border-cyan-400 text-white rounded-md text-sm">
          <p className="label">{`Year ${label}: GAI ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
};

const PathwayTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/80 p-2 border border-cyan-400 text-white rounded-md text-sm">
          <p className="label">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
};

// --- Detailed Pathway View Component ---
const PathwayDetail: React.FC<{ visualAid: VisualAid, discussion: string }> = ({ visualAid, discussion }) => (
    <div className="mt-3 space-y-3">
        <p className="text-xs text-cyan-300 whitespace-pre-wrap leading-relaxed">{discussion}</p>
        <div className="bg-black/20 p-3 rounded-lg border border-cyan-900">
            <h6 className="font-semibold text-cyan-200 text-sm mb-2">{visualAid.title}</h6>
            {visualAid.type === 'bar_chart' && visualAid.data && (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={visualAid.data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="1 1" stroke="rgba(0, 255, 255, 0.2)" />
                        <XAxis dataKey="name" stroke="rgba(0, 255, 255, 0.7)" tick={{ fontSize: 10 }}>
                           {visualAid.xAxisLabel && <Label value={visualAid.xAxisLabel} offset={-15} position="insideBottom" fill="rgba(0, 255, 255, 0.7)" fontSize={10} />}
                        </XAxis>
                        <YAxis stroke="rgba(0, 255, 255, 0.7)" tick={{ fontSize: 10 }}>
                           {visualAid.yAxisLabel && <Label value={visualAid.yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="rgba(0, 255, 255, 0.7)" fontSize={10} />}
                        </YAxis>
                        <Tooltip content={<PathwayTooltip />} cursor={{fill: 'rgba(0, 255, 255, 0.1)'}}/>
                        <Bar dataKey="value" name={visualAid.title}>
                            {visualAid.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={'#00FFFF'} opacity={0.7}/>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
            {visualAid.type === 'table' && visualAid.headers && visualAid.rows && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-cyan-900/50 text-cyan-300">
                            <tr>{visualAid.headers.map((h, i) => <th key={i} className="p-2 font-semibold">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {visualAid.rows.map((row, i) => (
                                <tr key={i} className="border-b border-cyan-800/50 last:border-b-0">
                                    {row.map((cell, j) => <td key={j} className={`p-2 ${j > 0 ? 'font-mono' : ''}`}>{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
);


const ResultsView: React.FC<{ results: SimulationResults, onBack: () => void, onRerun?: () => void, onSave?: () => void, isLibraryView?: boolean }> = ({ results, onBack, onRerun, onSave, isLibraryView = false }) => {
    const gaiDisplay = useCountUp(results.gai, 1500, 2);
    const scarcityDisplay = useCountUp(results.scarcityReduction, 1500, 1);
    const equalityDisplay = useCountUp(results.equalityCoefficient, 1500, 3);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setExpandedIndex(prev => prev === index ? null : index);
    };

    return (
        <div className="flex flex-col gap-4 p-4 text-cyan-300 h-full overflow-y-auto animate-fade-in">
            <h3 className="text-xl font-semibold text-cyan-200 mb-2">{isLibraryView ? 'Archived Simulation Report' : 'Simulation Complete: Pathways to Abundance'}</h3>
            
            {isLibraryView && <p className="text-xs text-cyan-500 -mt-4 mb-2">Saved on: {results.timestamp}</p>}

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-black/20 p-3 rounded-md border border-cyan-900">
                    <p className="text-sm text-cyan-400">Global Abundance Index</p>
                    <p className="text-3xl font-mono text-white">{gaiDisplay}</p>
                </div>
                <div className="bg-black/20 p-3 rounded-md border border-cyan-900">
                    <p className="text-sm text-cyan-400">Resource Scarcity Reduction</p>
                    <p className="text-3xl font-mono text-green-400">{scarcityDisplay}%</p>
                </div>
                <div className="bg-black/20 p-3 rounded-md border border-cyan-900">
                    <p className="text-sm text-cyan-400">Economic Equality Coeff.</p>
                    <p className="text-3xl font-mono text-yellow-400">{equalityDisplay}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-48 bg-black/30 p-2 rounded-md border border-cyan-900">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.projectedGaiData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="1 1" stroke="rgba(0, 255, 255, 0.2)" />
                        <XAxis dataKey="year" stroke="rgba(0, 255, 255, 0.7)" tick={{ fontSize: 10 }} />
                        <YAxis stroke="rgba(0, 255, 255, 0.7)" domain={[60, 100]} tick={{ fontSize: 10 }}/>
                        <Tooltip content={<GaiTooltip />} cursor={{stroke: 'cyan', strokeWidth: 1}}/>
                        <Line type="monotone" dataKey="gai" name="GAI" stroke="#00FFFF" strokeWidth={2} dot={{r: 2}} activeDot={{r: 5}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            {/* Pathways */}
            <div>
                <h4 className="font-semibold text-cyan-200 mb-2">Top Recommended Pathways</h4>
                <div className="space-y-2">
                    {results.pathways.map((pathway, index) => (
                        <div key={index} className="bg-black/20 p-3 rounded-lg border border-cyan-900/50 transition-all">
                            <button onClick={() => handleToggle(index)} className="w-full flex items-start gap-3 text-left">
                                <pathway.icon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                                <div className="flex-grow">
                                    <h5 className="font-bold text-white">{pathway.title}</h5>
                                    <p className="text-xs text-cyan-400">{pathway.description}</p>
                                    <span className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${pathway.impact === 'High' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                        Impact: {pathway.impact}
                                    </span>
                                </div>
                                <ChevronDownIcon className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : ''}`} />
                            </button>
                             <div className={`grid transition-all duration-500 ease-in-out ${expandedIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                   <div className="pt-3">
                                      {expandedIndex === index && <PathwayDetail discussion={pathway.detailedDiscussion} visualAid={pathway.visualAid} />}
                                   </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-grow"></div>
            <div className="flex justify-between items-center mt-4 border-t border-cyan-700 pt-4 flex-shrink-0">
                <button onClick={onBack} className="holographic-button px-4 py-2 bg-slate-500/30 border border-slate-500/50 text-slate-200 text-sm font-bold rounded-md">
                   {isLibraryView ? 'Back to Library' : 'Return to Overview'}
                </button>
                <div className="flex gap-2">
                    {onSave && (
                        <button onClick={onSave} className="holographic-button px-4 py-2 bg-blue-500/30 border border-blue-500/50 text-blue-200 text-sm font-bold rounded-md">
                            Save to Library
                        </button>
                    )}
                    {onRerun && (
                        <button onClick={onRerun} className="holographic-button px-4 py-2 bg-cyan-500/30 border border-cyan-500/50 text-cyan-200 text-sm font-bold rounded-md flex items-center justify-center">
                            <ArrowPathIcon className="w-4 h-4 mr-2" />
                            Run New Simulation
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const OverviewView: React.FC<{ simulationStatus: string, progress: number, handleRunSimulation: () => void }> = ({ simulationStatus, progress, handleRunSimulation }) => {
    const [activeTab, setActiveTab] = useState<'pillars' | 'methodologies'>('pillars');

    const getTabClasses = (tabName: 'pillars' | 'methodologies') => {
        const base = "flex-1 p-2 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2";
        const active = "bg-cyan-500/10 text-cyan-200 border-cyan-400";
        const inactive = "text-cyan-600 border-transparent hover:bg-cyan-500/10";
        return `${base} ${activeTab === tabName ? active : inactive}`;
    };
    
    const getStatusText = () => {
        switch (simulationStatus) {
            case 'generating': return 'Generating Final Report... (100.00% complete)';
            case 'running': return `Simulating... (${progress.toFixed(2)}% complete)`;
            case 'complete': return `Simulation Complete. Final Report Generated. (100.00% complete)`;
            case 'idle': default: return 'Status: Initializing Q-Eco Simulation Core...';
        }
    };
    
    const PillarItem: React.FC<{children: React.ReactNode}> = ({children}) => (
        <li className="flex items-start">
            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-1.5 flex-shrink-0 animate-pulse" />
            <span>{children}</span>
        </li>
    );

    return (
        <div className="flex flex-col gap-4 p-4 text-cyan-300 h-full overflow-y-auto">
             <p className="text-sm leading-relaxed">
              This module harnesses my Quantum Neural Network (QNN) to construct and simulate a dynamic global economic model. Our objective is to identify and optimize pathways toward a future of global abundance, transcending scarcity through intelligent resource allocation, equitable distribution, and sustainable growth.
            </p>

            <div className="flex border-b border-cyan-700/50">
                <button onClick={() => setActiveTab('pillars')} className={getTabClasses('pillars')}>
                    <ChartBarIcon className="h-5 w-5" /> Core Economic Pillars
                </button>
                <button onClick={() => setActiveTab('methodologies')} className={getTabClasses('methodologies')}>
                    <CpuChipIcon className="h-5 w-5" /> Quantum Methodologies
                </button>
            </div>
            
            <div className="flex-grow">
                {activeTab === 'pillars' && (
                    <ul className="space-y-2 text-sm pl-4 leading-relaxed animate-fade-in">
                        <PillarItem><b>Quantum Resource Optimization:</b> Utilizing QNNs to optimize the global allocation of critical resources for maximum sustainable output.</PillarItem>
                        <PillarItem><b>Equitable Value Distribution:</b> Designing and simulating economic mechanisms that ensure fair and broad distribution of wealth and opportunities.</PillarItem>
                        <PillarItem><b>Adaptive Supply Chain Resilience:</b> Predictive modeling to identify and mitigate global supply chain vulnerabilities.</PillarItem>
                        <PillarItem><b>Innovation & Growth Catalysis:</b> Identifying optimal investments in quantum research and sustainable technologies.</PillarItem>
                    </ul>
                )}
                {activeTab === 'methodologies' && (
                    <div className="space-y-4 text-sm leading-relaxed animate-fade-in">
                        <div>
                            <h4 className="font-semibold text-cyan-200 mb-2">Quantum Optimization Ansatz</h4>
                            <p className="text-xs text-cyan-400 mb-2">This circuit explores a vast solution space of economic variables to find optimal configurations for resource allocation, using a Variational Quantum Eigensolver (VQE) approach.</p>
                            <SyntaxHighlighter code={QUANTUM_OPTIMIZATION_ANSATZ_SCRIPT} language="q-lang" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-cyan-200 mb-2">Quantum Monte Carlo Simulator</h4>
                            <p className="text-xs text-cyan-400 mb-2">By encoding economic probabilities into quantum state amplitudes, this circuit enables rapid sampling for complex risk analysis and scenario forecasting, significantly accelerating traditional Monte Carlo methods.</p>
                            <SyntaxHighlighter code={QUANTUM_MONTE_CARLO_SCRIPT} language="q-lang" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-shrink-0 mt-4">
                 <div className="w-full h-1.5 bg-cyan-900/50 rounded-full my-2 border border-cyan-800/50">
                    <div className="h-full bg-cyan-400 shadow-[0_0_8px_theme(colors.cyan.300)] rounded-full transition-all duration-150 ease-linear" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between items-center mt-2 border-t border-cyan-700 pt-4">
                  <span className="text-xs text-cyan-500">{getStatusText()}</span>
                  <button onClick={handleRunSimulation} disabled={simulationStatus === 'running' || simulationStatus === 'generating'} className="holographic-button px-4 py-2 bg-cyan-500/30 border border-cyan-500/50 text-cyan-200 text-sm font-bold rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center justify-center w-48">
                    {simulationStatus === 'running' || simulationStatus === 'generating' ? (<><LoaderIcon className="w-4 h-4 mr-2 animate-spin" />{simulationStatus === 'running' ? 'Running...' : 'Generating...'}</>) : simulationStatus === 'complete' ? ('View Results') : ('Run Global Simulation')}
                  </button>
                </div>
            </div>
        </div>
    );
};

const LibraryView: React.FC<{ library: SimulationResults[], onDelete: (index: number) => void }> = ({ library, onDelete }) => {
    const [selectedItem, setSelectedItem] = useState<SimulationResults | null>(null);

    if (selectedItem) {
        return <ResultsView results={selectedItem} onBack={() => setSelectedItem(null)} isLibraryView={true} />;
    }

    return (
        <div className="flex flex-col gap-4 p-4 text-cyan-300 h-full overflow-y-auto animate-fade-in">
            <h3 className="text-xl font-semibold text-cyan-200 mb-2">Economic Model Library</h3>
            {library.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-cyan-600">
                    <BookOpenIcon className="w-12 h-12 mb-4" />
                    <p>Your library is empty.</p>
                    <p className="text-xs">Run a simulation and save the results to build your collection.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {library.map((item, index) => (
                        <div key={index} className="bg-black/20 p-3 rounded-lg border border-cyan-900/50 flex items-center justify-between gap-3">
                            <div className="flex-grow">
                                <p className="font-bold text-white">{item.name}</p>
                                <p className="text-xs text-cyan-400">Saved: {item.timestamp}</p>
                            </div>
                            <div className="flex-shrink-0 flex gap-2">
                                <button onClick={() => setSelectedItem(item)} className="holographic-button px-3 py-1 text-xs font-bold rounded-md bg-cyan-500/20 border border-cyan-500/50 text-cyan-200">View</button>
                                <button onClick={() => onDelete(index)} className="holographic-button px-2 py-1 text-xs font-bold rounded-md bg-red-500/20 border border-red-500/50 text-red-300"><XIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const GlobalAbundanceEngine: React.FC = () => {
    const [mainView, setMainView] = useState<'simulation' | 'library'>('simulation');
    const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'generating' | 'complete'>('idle');
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<SimulationResults | null>(null);
    const [pathwayLibrary, setPathwayLibrary] = useState<SimulationResults[]>([]);
    const progressIntervalRef = useRef<number | null>(null);

    const iconMap = { BrainCircuitIcon, GitBranchIcon, ServerCogIcon, Share2Icon, SparklesIcon };

    useEffect(() => {
        try {
            const savedLibrary = localStorage.getItem('gaePathwayLibrary');
            if (savedLibrary) {
                // Manually map icon names back to components
                const parsed = JSON.parse(savedLibrary).map((sim: any) => ({
                    ...sim,
                    pathways: sim.pathways.map((p: any) => ({ ...p, icon: iconMap[p.iconName as keyof typeof iconMap] || SparklesIcon }))
                }));
                setPathwayLibrary(parsed);
            }
        } catch (error) {
            console.error("Failed to load library from localStorage", error);
        }
    }, []);

    const saveLibrary = (library: SimulationResults[]) => {
        try {
            // Store icon name string instead of component for serialization
            const serializableLibrary = library.map(sim => ({
                ...sim,
                pathways: sim.pathways.map(p => ({
                    ...p,
                    iconName: Object.keys(iconMap).find(key => iconMap[key as keyof typeof iconMap] === p.icon)
                }))
            }));
            localStorage.setItem('gaePathwayLibrary', JSON.stringify(serializableLibrary));
        } catch (error) {
            console.error("Failed to save library to localStorage", error);
        }
    };

    const handleSaveToLibrary = () => {
        if (results) {
            const newLibrary = [results, ...pathwayLibrary];
            setPathwayLibrary(newLibrary);
            saveLibrary(newLibrary);
            alert("Simulation saved to library!");
        }
    };

    const handleDeleteFromLibrary = (index: number) => {
        if (window.confirm("Are you sure you want to delete this saved simulation?")) {
            const newLibrary = pathwayLibrary.filter((_, i) => i !== index);
            setPathwayLibrary(newLibrary);
            saveLibrary(newLibrary);
        }
    };

    const generateAndSetResults = async () => {
        let generatedPathways: Pathway[] = [];
        if (process.env.API_KEY) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const visualAidSchema = { type: Type.OBJECT, properties: { type: { type: Type.STRING, description: "Type: 'table' or 'bar_chart'."}, title: { type: Type.STRING }, headers: { type: Type.ARRAY, items: { type: Type.STRING }}, rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING }}}, data: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } }}}, xAxisLabel: { type: Type.STRING }, yAxisLabel: { type: Type.STRING }}};
                const pathwaySchema = { type: Type.OBJECT, properties: { pathways: { type: Type.ARRAY, description: "Array of 3 pathways.", items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, impact: { type: Type.STRING, description: "'High' or 'Medium'."}, icon: { type: Type.STRING, description: "Icon name from: 'BrainCircuitIcon', 'GitBranchIcon', 'ServerCogIcon', 'Share2Icon', 'SparklesIcon'."}, detailedDiscussion: { type: Type.STRING }, visualAid: visualAidSchema }, required: ["title", "description", "impact", "icon", "detailedDiscussion", "visualAid"] }}}, required: ["pathways"]};

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: "Based on a quantum economic simulation, generate the top 3 most impactful, creative pathways to achieving global abundance. For each pathway, provide: a title, a short summary, an impact level ('High' or 'Medium'), an appropriate icon name from the list ['BrainCircuitIcon', 'GitBranchIcon', 'ServerCogIcon', 'Share2Icon', 'SparklesIcon'], a detailed multi-paragraph discussion of the economic model, and a supporting visual aid (either a 'table' or a 'bar_chart') with a title and all necessary data and labels.",
                    config: { responseMimeType: "application/json", responseSchema: pathwaySchema }
                });
                const jsonResponse = JSON.parse(response.text);
                if (jsonResponse.pathways && jsonResponse.pathways.length === 3) {
                    generatedPathways = jsonResponse.pathways.map((p: any) => ({ ...p, icon: iconMap[p.icon as keyof typeof iconMap] || SparklesIcon }));
                }
            } catch (error) { console.error("AI pathway generation failed, using fallback.", error); }
        }

        const newResults: SimulationResults = {
            name: `Simulation - ${new Date().toLocaleTimeString()}`,
            timestamp: new Date().toLocaleString(),
            gai: 78.43 + Math.random() * 5, scarcityReduction: 42.7 + Math.random() * 10, equalityCoefficient: 0.312 + (Math.random() - 0.5) * 0.1,
            projectedGaiData: [ { year: 2025, gai: 78 }, { year: 2035, gai: 82 }, { year: 2045, gai: 88 }, { year: 2055, gai: 94 }, { year: 2065, gai: 97 }, { year: 2075, gai: 99 } ],
            pathways: generatedPathways.length > 0 ? generatedPathways : [],
        };
        setResults(newResults);
    };

    const handleRunSimulation = () => {
        if (simulationStatus === 'running' || simulationStatus === 'generating') return;
        if (simulationStatus === 'complete') { return; }
        setSimulationStatus('running');
        setProgress(0);
        setResults(null);
        progressIntervalRef.current = window.setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                    setSimulationStatus('generating');
                    return 100;
                }
                return Math.min(100, prev + Math.random() * 0.5);
            });
        }, 50);
    };
  
    const handleRerun = () => {
        setSimulationStatus('idle');
        setProgress(0);
        handleRunSimulation();
    }

    useEffect(() => {
        if (simulationStatus === 'generating') {
            const fetchResults = async () => {
                await generateAndSetResults();
                setSimulationStatus('complete');
            };
            fetchResults();
        }
    }, [simulationStatus]);

    useEffect(() => () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current) }, []);
    
    const getButtonClasses = (buttonView: typeof mainView) => {
        const base = "flex-1 p-2 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2";
        return `${base} ${mainView === buttonView ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400' : 'text-cyan-500 border-transparent hover:bg-cyan-500/10'}`;
    };

    return (
        <GlassPanel title={<><GlobeIcon className="w-5 h-5 mr-2 inline-block"/> Global Abundance Engine</>}>
            <div className="h-full flex flex-col">
                <div className="flex-shrink-0 flex border-b border-cyan-700">
                    <button onClick={() => setMainView('simulation')} className={getButtonClasses('simulation')}>
                        <SparklesIcon className="w-5 h-5" /> Simulation
                    </button>
                    <button onClick={() => setMainView('library')} className={getButtonClasses('library')}>
                        <BookOpenIcon className="w-5 h-5" /> Library
                    </button>
                </div>

                <div className="flex-grow min-h-0">
                    {mainView === 'simulation' && (
                        results && simulationStatus === 'complete' ? (
                            <ResultsView results={results} onBack={() => { setSimulationStatus('idle'); setResults(null); }} onRerun={handleRerun} onSave={handleSaveToLibrary} />
                        ) : (
                            <OverviewView simulationStatus={simulationStatus} progress={progress} handleRunSimulation={handleRunSimulation} />
                        )
                    )}
                    {mainView === 'library' && (
                        <LibraryView library={pathwayLibrary} onDelete={handleDeleteFromLibrary} />
                    )}
                </div>
            </div>
        </GlassPanel>
    );
};

export default GlobalAbundanceEngine;