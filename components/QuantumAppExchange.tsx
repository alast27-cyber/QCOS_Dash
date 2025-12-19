import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import {
    BoxIcon, LoaderIcon, CheckCircle2Icon, BrainCircuitIcon, BeakerIcon,
    FileCodeIcon, CrosshairIcon, AlertTriangleIcon, UploadCloudIcon, DownloadCloudIcon, GlobeIcon,
    ArrowRightIcon, CodeBracketIcon, XIcon, RocketLaunchIcon,
    // Corrected: Replacing 'FactoryIcon' with 'BuildingIcon' to fix the build error
    ServerCogIcon, PlayIcon, TrendingUpIcon, ActivityIcon, CpuChipIcon, BuildingIcon
} from './Icons';
import { AppDefinition, URIAssignment } from '../App';
import DeployAppModal from './DeployAppModal';
import GlassPanel from './GlassPanel';

// --- Reusable Modal Component ---
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in-up" onClick={onClose}>
            <div className="w-[90vw] h-[90vh] max-w-[1200px] max-h-[800px] pointer-events-auto relative" onClick={(e) => e.stopPropagation()}>
                <GlassPanel title={title}>
                    <div className="p-4 h-full">
                        {children}
                    </div>
                </GlassPanel>
                <button onClick={onClose} className="absolute top-3 right-3 text-cyan-400/70 hover:text-white transition-colors z-50 p-2 rounded-full hover:bg-white/10">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

// --- Mock Data and Services (for Generator and Market Stations) ---

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const MarketStation: React.FC<{ apps: AppDefinition[]; onInstallApp: (app: AppDefinition) => void }> = ({ apps, onInstallApp }) => {
    const marketApps: AppDefinition[] = [
        { id: 'm-1', name: 'Q-State Simulator', description: 'Advanced quantum state simulation environment for teaching and research.', icon: BeakerIcon, status: 'available', size: 12.5, type: 'Science' },
        { id: 'm-2', name: 'Tensor Flow QNN', description: 'Deployment of a high-performance Quantum Neural Network for image classification.', icon: BrainCircuitIcon, status: 'available', size: 45.1, type: 'AI/ML' },
        { id: 'm-3', name: 'Secure Q-Chat', description: 'End-to-end encrypted communication using quantum key distribution principles.', icon: Share2Icon, status: 'available', size: 5.8, type: 'Security' },
        { id: 'm-4', name: 'CHIPS Ledger Explorer', description: 'Real-time monitoring and analysis tool for the CHIPS network ledger.', icon: FileCodeIcon, status: 'available', size: 8.9, type: 'System' },
    ];

    return (
        <div className="space-y-4 h-full overflow-y-auto pr-2">
            <h2 className="text-xl font-bold text-cyan-300">Available Applications ({marketApps.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketApps.map(app => (
                    <div key={app.id} className="bg-black/40 p-4 rounded-xl border border-cyan-700/50 hover:border-cyan-500 transition-all duration-300 flex justify-between items-center">
                        <div>
                            <div className="flex items-center text-lg font-semibold text-white">
                                <app.icon className="w-6 h-6 mr-3 text-cyan-400" />
                                {app.name}
                            </div>
                            <p className="text-sm text-cyan-200 mt-1">{app.description}</p>
                            <div className="text-xs text-cyan-500 mt-2 flex space-x-3">
                                <span>{app.type}</span>
                                <span>| {app.size.toFixed(1)} GB</span>
                            </div>
                        </div>
                        <button
                            onClick={() => onInstallApp(app)}
                            disabled={apps.some(a => a.id === app.id)}
                            className="holographic-button px-4 py-1 text-sm font-semibold rounded-md flex items-center bg-green-600 hover:bg-green-700 disabled:bg-gray-600/50 transition-colors"
                        >
                            {apps.some(a => a.id === app.id) ? 'Installed' : <><DownloadCloudIcon className="w-4 h-4 mr-2" /> Install</>}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GeneratorStation: React.FC<{ code: string; onCodeChange: (code: string) => void }> = ({ code, onCodeChange }) => {
    const [prompt, setPrompt] = useState('Generate a simple quantum application using Q-Lang that calculates the superposition state probability of three qubits.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!ai) {
            setError("AI service not configured.");
            return;
        }

        setIsLoading(true);
        setError(null);
        onCodeChange('// Generating code...'); // Clear previous code

        const systemInstruction = `You are a QCOS Quantum Application Generator. Your task is to generate a complete, standalone Q-Lang (Quantum Language) script based on the user's prompt. The code MUST be functional and should only include the Q-Lang code block, nothing else.`;

        try {
            const userQuery = `Generate Q-Lang code for this request: ${prompt}`;
            
            // Using exponential backoff for API calls
            const generateWithRetry = async (retries = 3): Promise<string> => {
                try {
                    const payload = {
                        contents: [{ parts: [{ text: userQuery }] }],
                        systemInstruction: { parts: [{ text: systemInstruction }] },
                    };
                    const apiKey = "";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        if (response.status === 429 && retries > 0) {
                            const delay = Math.pow(2, 3 - retries) * 1000;
                            await new Promise(resolve => setTimeout(resolve, delay));
                            return generateWithRetry(retries - 1);
                        }
                        throw new Error(`API call failed with status: ${response.status}`);
                    }

                    const result = await response.json();
                    return result.candidates?.[0]?.content?.parts?.[0]?.text || 'Error: No code generated.';
                } catch (e) {
                    if (retries > 0) {
                        const delay = Math.pow(2, 3 - retries) * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return generateWithRetry(retries - 1);
                    }
                    throw e;
                }
            };

            const generatedText = await generateWithRetry();

            // Simple post-processing to extract the code block
            const codeMatch = generatedText.match(/```(q-lang|quantum|code|qsharp)?\s*([\s\S]*?)```/i);
            const extractedCode = codeMatch ? codeMatch[2].trim() : generatedText.trim();
            
            onCodeChange(extractedCode);

        } catch (e) {
            console.error("Code generation error:", e);
            setError(`Could not generate code: ${e instanceof Error ? e.message : String(e)}`);
            onCodeChange('// ERROR: Code generation failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <h2 className="text-xl font-bold text-cyan-300">Generate New Q-Lang App</h2>
            <div className="flex flex-col">
                <label htmlFor="prompt" className="text-sm font-medium text-cyan-300 mb-1 flex items-center"><BrainCircuitIcon className="w-4 h-4 mr-2" /> App Description Prompt</label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    placeholder="Describe the quantum algorithm or application you want to create..."
                    className="w-full p-3 text-sm bg-black/50 border border-cyan-700/50 rounded-md focus:border-cyan-500 focus:ring-cyan-500 transition-all text-white placeholder-cyan-500/50"
                />
            </div>
            
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="holographic-button bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/50 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center"
            >
                {isLoading ? (
                    <div className="flex items-center">
                        <LoaderIcon className="h-5 w-5 animate-spin mr-2" /> Generating Code...
                    </div>
                ) : (
                    <div className="flex items-center">
                        <RocketLaunchIcon className="h-5 w-5 mr-2" /> Generate Q-Lang Code
                    </div>
                )}
            </button>
            
            {error && (
                <div className="text-red-400 text-sm flex items-center"><AlertTriangleIcon className="w-4 h-4 mr-2" /> {error}</div>
            )}

            <div className="flex flex-col flex-grow min-h-0">
                <h3 className="text-md font-semibold text-cyan-300 mb-1 flex items-center"><CodeBracketIcon className="w-4 h-4 mr-2" /> Generated Q-Lang Code</h3>
                <div className="flex-grow rounded-md overflow-hidden border border-cyan-700/50 bg-black/30">
                    <pre className="text-xs p-3 overflow-auto h-full text-green-300 whitespace-pre-wrap">
                        {code}
                    </pre>
                </div>
            </div>
        </div>
    );
};

const ExportStation: React.FC<{ apps: AppDefinition[]; uriAssignments: URIAssignment[] }> = ({ apps, uriAssignments }) => {
    return (
        <div className="space-y-6 h-full overflow-y-auto pr-2">
            
            <section>
                <h2 className="text-xl font-bold text-cyan-300 mb-3 flex items-center"><CheckCircle2Icon className="w-6 h-6 mr-3" /> Deployed CHIPS Applications ({apps.length})</h2>
                {apps.length === 0 ? (
                    <p className="text-cyan-500">No applications currently installed on the CHIPS network.</p>
                ) : (
                    <div className="space-y-3">
                        {apps.map(app => (
                            <div key={app.id} className="bg-black/40 p-3 rounded-lg border border-cyan-800 flex items-center justify-between">
                                <div className="flex items-center">
                                    <app.icon className="w-5 h-5 mr-3 text-cyan-400" />
                                    <div>
                                        <p className="font-semibold text-white">{app.name}</p>
                                        <p className="text-xs text-cyan-500">{app.id}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${app.status === 'running' ? 'bg-green-700/50 text-green-300' : 'bg-yellow-700/50 text-yellow-300'}`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="border-t border-cyan-800 pt-6">
                <h2 className="text-xl font-bold text-purple-300 mb-3 flex items-center"><GlobeIcon className="w-6 h-6 mr-3" /> Quantum-to-Web Gateway URLs ({uriAssignments.length})</h2>
                {uriAssignments.length === 0 ? (
                    <p className="text-purple-500">No public URLs assigned via the Gateway.</p>
                ) : (
                    <div className="space-y-3">
                        {uriAssignments.map((assignment, index) => (
                            <div key={index} className="bg-black/40 p-3 rounded-lg border border-purple-800">
                                <p className="font-semibold text-white flex items-center">
                                    <ArrowRightIcon className="w-4 h-4 mr-2 text-purple-400" />
                                    {assignment.serviceName}
                                </p>
                                <p className="text-sm text-purple-300 break-all ml-6">
                                    <a href={assignment.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{assignment.url}</a>
                                </p>
                                <p className="text-xs text-purple-500 ml-6 mt-1">
                                    CHIPS App ID: {assignment.chipsAppId}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};


// --- Main Component ---

interface QuantumAppExchangeProps {
    apps: AppDefinition[];
    uriAssignments: URIAssignment[];
    onDeployApp: (details: { name: string; description: string; code: string; }) => void;
    onInstallApp: (app: AppDefinition) => void;
}

const QuantumAppExchange: React.FC<QuantumAppExchangeProps> = (props) => {
    const { onDeployApp, onInstallApp } = props;
    const [isMarketOpen, setIsMarketOpen] = useState(false);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [isDeploymentsOpen, setIsDeploymentsOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('// Your generated Q-Lang code will appear here.');

    const handleInstallFromMarket = (app: AppDefinition) => {
        onInstallApp(app);
        setIsMarketOpen(false); // Close modal on install
    };

    return <>
        <div className="p-4 space-y-4">
            <h2 className="text-2xl font-extrabold text-cyan-200 tracking-wide flex items-center mb-4">
                <BoxIcon className="w-6 h-6 mr-3 text-cyan-400" /> Quantum App Exchange
            </h2>
            <p className="text-cyan-400 text-sm">
                Manage all CHIPS applications: deploy custom Q-Lang code, install pre-built models from the Market, and assign public gateway access.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                    onClick={() => setIsMarketOpen(true)}
                    className="flex flex-col items-center justify-center p-6 bg-cyan-800/50 hover:bg-cyan-700/60 transition-all rounded-xl border border-cyan-600/50 hover:border-cyan-400/80 holographic-glow shadow-xl"
                >
                    <DownloadCloudIcon className="w-8 h-8 text-white mb-2" />
                    <span className="font-semibold text-lg text-white">App Market</span>
                    <span className="text-xs text-cyan-300">Browse & Install Pre-built Apps</span>
                </button>

                <button
                    onClick={() => setIsGeneratorOpen(true)}
                    className="flex flex-col items-center justify-center p-6 bg-purple-800/50 hover:bg-purple-700/60 transition-all rounded-xl border border-purple-600/50 hover:border-purple-400/80 holographic-glow shadow-xl"
                >
                    <BrainCircuitIcon className="w-8 h-8 text-white mb-2" />
                    <span className="font-semibold text-lg text-white">Q-Lang Generator</span>
                    <span className="text-xs text-purple-300">Generate Apps with AI Prompting</span>
                </button>
                
                <button
                    onClick={() => setIsDeploymentsOpen(true)}
                    className="flex flex-col items-center justify-center p-6 bg-green-800/50 hover:bg-green-700/60 transition-all rounded-xl border border-green-600/50 hover:border-green-400/80 holographic-glow shadow-xl"
                >
                    <ServerCogIcon className="w-8 h-8 text-white mb-2" />
                    <span className="font-semibold text-lg text-white">Deployments</span>
                    <span className="text-xs text-green-300">Manage QCOS & Gateway URLs</span>
                </button>
            </div>

            {/* Current Apps Section */}
            <div className="pt-4 border-t border-cyan-800">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <CpuChipIcon className="w-5 h-5 mr-2 text-cyan-400" /> Installed CHIPS Apps
                </h3>
                {props.apps.length === 0 ? (
                    <div className="bg-black/30 p-4 rounded-lg text-cyan-400 text-sm flex items-center">
                        <AlertTriangleIcon className="w-5 h-5 mr-3 text-yellow-400" />
                        No applications installed. Use the App Market or Generator to begin.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {props.apps.map(app => (
                            <div key={app.id} className="bg-black/30 p-3 rounded-lg flex items-center justify-between border border-cyan-900">
                                <div className="flex items-center">
                                    <app.icon className="w-5 h-5 mr-3 text-cyan-400" />
                                    <div>
                                        <p className="font-semibold text-white">{app.name}</p>
                                        <p className="text-xs text-cyan-500">{app.description}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${app.status === 'running' ? 'bg-green-700/50 text-green-300' : 'bg-gray-700/50 text-gray-300'}`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex justify-end gap-3">
                <div className="flex space-x-3">
                    <button onClick={() => setIsDeployModalOpen(true)} className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-md transition-colors duration-200 holographic-button">
                        <ArrowRightIcon className="w-4 h-4 mr-2" /> Deploy Application
                    </button>
                    <button onClick={() => setIsDeploymentsOpen(true)} className="flex items-center px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium rounded-md transition-colors duration-200 holographic-button">
                        <GlobeIcon className="w-4 h-4 mr-2" /> Gateway URLs
                    </button>
                </div>
            </div>
        </div>

        <Modal isOpen={isMarketOpen} onClose={() => setIsMarketOpen(false)} title="App Market"><MarketStation apps={props.apps} onInstallApp={handleInstallFromMarket} /></Modal>
        <Modal isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} title="App Generator"><GeneratorStation code={generatedCode} onCodeChange={setGeneratedCode} /></Modal>
        <Modal isOpen={isDeploymentsOpen} onClose={() => setIsDeploymentsOpen(false)} title="Recent Deployments & Gateway Assignments"><ExportStation apps={props.apps} uriAssignments={props.uriAssignments} /></Modal>
        {isDeployModalOpen && <DeployAppModal code={generatedCode} onDeploy={details => { onDeployApp(details); setIsDeployModalOpen(false); }} onClose={() => setIsDeployModalOpen(false)} />}
    </>;
};

export default QuantumAppExchange;