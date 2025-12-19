import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import AnimatedBackground from './components/AnimatedBackground';
import GlassPanel from './components/GlassPanel';
import { CpuChipIcon, XIcon, GlobeIcon, BeakerIcon, FileTextIcon, ThermometerIcon, SettingsIcon, ZapIcon, BoxIcon, ShieldCheckIcon, FlaskConicalIcon, BrainCircuitIcon, AtomIcon, GitBranchIcon, ServerCogIcon, ActivityIcon, GaugeIcon, Share2Icon, FileCodeIcon, CodeBracketIcon, MessageSquareIcon, ClockIcon, ChartBarIcon, SparklesIcon, ArrowPathIcon, BuildingFarmIcon, UsersIcon, AcademicCapIcon, RocketLaunchIcon, CircleStackIcon, InformationCircleIcon, PlayIcon, StopIcon } from './components/Icons'; // Added new icons
import ResourceSteward from './components/ResourceSteward';
import HolographicContainer from './components/HolographicContainer';
import HolographicTesseract from './components/HolographicTesseract';
import CubeFace from './components/CubeFace';
import { useVoiceCommands } from './hooks/useVoiceCommands';
import AgentQ from './components/AgentQ';
import CubeNavigator from './components/CubeNavigator';
import CHIPSBackOffice from './components/CHIPSBackOffice';
import QCOSSystemEvolutionInterface from './components/QCOSSystemEvolutionInterface';
import FullScreenSwitcher from './components/FullScreenSwitcher';
import AICommandConsole from './components/AICommandConsole';
import SystemLog from './components/SystemLog';
import SemanticIntegrityCheck from './components/SemanticIntegrityCheck';
import KernelScheduler from './components/KernelScheduler';
import CHIPSBrowser from './components/CHIPSBrowser';
import QuantumProgrammingInterface from './components/QuantumProgrammingInterface';
import QBioMedDrugDiscovery from './components/QBioMedDrugDiscovery';
import MolecularSimulationToolkit from './components/MolecularSimulationToolkit';
import QuantumMonteCarloFinance from './components/QuantumMonteCarloFinance';
import QMLForge from './components/QMLForge';
import MetaprogrammingInterface from './components/MetaprogrammingInterface';
import ChatLogPanel from './components/ChatLogPanel';
import QuantumExecutionFlow from './components/QuantumExecutionFlow';
import { initialCodebase } from './utils/codebase'; // Assuming initialCodebase is available here
import { useAgentQ } from './hooks/useAgentQ';
import DeploymentSequence from './components/DeploymentSequence';
import GlobalAbundanceEngine from './components/GlobalAbundanceEngine';
import GlobalSwineForesight from './components/GlobalSwineForesight';
import PhilippineSwineResilience from './components/PhilippineSwineResilience';
import PigHavenConsumerTrust from './components/PigHavenConsumerTrust';
import QPUHealth from './components/QPUHealth';
import QuantumAppExchange from './components/QuantumAppExchange';
import PowerMetrics from './components/PowerMetrics';
import PublicDeploymentOptimizationHub from './components/PublicDeploymentOptimizationHub';
import TextToAppInterface from './components/TextToAppInterface';
import AnomalyLog from './components/AnomalyLog';
import QuantumSwineIntelligence from './components/QuantumSwineIntelligence';
import AgentQEnhancedInsights from './components/AgentQEnhancedInsights';
import QNNInteractionPanel from './components/QNNInteractionPanel';
import PredictiveTaskOrchestrationPanel from './components/PredictiveTaskOrchestrationPanel';
import SemanticDriftPanel from './components/SemanticDriftPanel';
import QuantumToWebGatewayPanel from './components/QuantumToWebGatewayPanel';
import SpecializedTrainingInputPanel from './components/SpecializedTrainingInputPanel';

// --- Type Definitions ---
interface LogEntry {
  id: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CMD' | 'SUCCESS';
  msg: string;
  time: string;
}

type IconComponent = React.FC<{ className?: string }>;
export interface AppDefinition {
  id: string;
  name: string;
  description: string;
  icon: IconComponent;
  status: 'available' | 'downloading' | 'installing' | 'installed';
  isCustom?: boolean;
  component?: React.ReactNode;
  q_uri?: string;
  https_url?: string;
}

export interface URIAssignment {
    appName: string;
    q_uri: string;
    https_url: string;
    timestamp: string;
}

export interface SystemHealth {
    cognitiveEfficiency: number;
    semanticIntegrity: number;
    dataThroughput: number;
    ipsThroughput: number;
    powerEfficiency: number;
    decoherenceFactor: number; // Lower is better
    processingSpeed: number;
    qpuTempEfficiency: number; // Lower is better
    qubitStability: number; // Lower update interval is better
}

interface PanelDefinition {
  id: string;
  title: React.ReactNode;
  description: string;
  content: React.ReactNode;
  className?: string;
}

interface FaceData {
  layout: string;
  panels: PanelDefinition[];
}

interface PanelMetadata {
  id: string;
  title: React.ReactNode;
  description: string;
  className?: string;
}

interface FaceMetadata {
  layout: string;
  panels: PanelMetadata[];
}

// localStorage key for codebase persistence
const LOCAL_STORAGE_CODEBASE_KEY = 'qcos_metaprogramming_codebase';

// Define the additional *placeholder* code that can be edited via Metaprogramming
// These are the default versions of these files.
const initialMetaprogrammingPlaceholders: { [path: string]: string } = {
  'components/AICommandConsole.tsx': `// Placeholder for AICommandConsole.tsx content
// After applying this App.tsx patch, you will edit this file in the Metaprogramming Interface.
import React from 'react';
import GlassPanel from './GlassPanel'; // Corrected relative path
import { CpuChipIcon, AcademicCapIcon, RocketLaunchIcon, CircleStackIcon, InformationCircleIcon, PlayIcon, StopIcon, ArrowPathIcon } from './Icons'; // Corrected relative path

// Interface for a training session to ensure type safety
interface TrainingSession {
  type: string;
  status: 'In Progress' | 'Completed' | 'Failed' | 'Pending';
  progress: number; // Percentage 0-100
  startedAt: string;
}

const AICommandConsole: React.FC = () => {
  // State to manage the current training session, initialized with "Special Training"
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>({
    type: "Special Training",
    status: "In Progress",
    progress: 73, // Example progress for demonstration
    startedAt: new Date().toLocaleString(), // Current time for demo
  });
  const [qnnCoreStatus, setQnnCoreStatus] = useState<'Online' | 'Training' | 'Optimizing' | 'Offline'>('Online');
  const [qnnVersion, setQnnVersion] = useState('3.12.0-QNN-Beta');
  const [lastTrained, setLastTrained] = useState('2023-10-26 14:30 UTC');


  // Effect to simulate progress update for the demo "Special Training"
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentSession && currentSession.status === "In Progress") {
      interval = setInterval(() => {
        setCurrentSession(prev => {
          if (!prev) return prev;
          const newProgress = Math.min(prev.progress + Math.floor(Math.random() * 5), 100);
          const newStatus = newProgress === 100 ? "Completed" : "In Progress";
          setQnnCoreStatus(newProgress === 100 ? 'Online' : 'Training'); // Update core status too
          return {
            ...prev,
            progress: newProgress,
            status: newStatus,
          };
        });
      }, 5000); // Update every 5 seconds for demonstration purposes
    } else if (currentSession && currentSession.status === "Completed" && qnnCoreStatus !== 'Online') {
        // Once completed, ensure core status becomes Online after a short delay
        setTimeout(() => setQnnCoreStatus('Online'), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession, qnnCoreStatus]);

  const handleStartNewTraining = () => {
    setCurrentSession({
      type: "Standard Retraining",
      status: "In Progress",
      progress: 0,
      startedAt: new Date().toLocaleString(),
    });
    setQnnCoreStatus('Training');
    setLastTrained('In Progress...');
  };

  const handleTerminateSession = () => {
    setCurrentSession(null);
    setQnnCoreStatus('Online');
    setLastTrained(new Date().toLocaleString()); // Update last trained to now
  };

  // Placeholder for other functions like deployment or config
  const handleDeployModel = () => {
    console.log("Deploying QNN Model...");
    // Simulate deployment
    setQnnCoreStatus('Optimizing');
    setTimeout(() => {
      setQnnVersion(\`3.12.\${Math.floor(Math.random() * 10) + 1}-QNN-Beta\`);
      setQnnCoreStatus('Online');
    }, 3000);
  };

  return (
    <GlassPanel title="AI Operations" icon={<CpuChipIcon className="w-5 h-5 text-cyan-300" />}>
      <div className="flex flex-col space-y-4 h-full text-cyan-50 p-2">
        {/* Agent QNN Core Status */}
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center">
            <CpuChipIcon className="w-5 h-5 mr-2" /> Agent QNN Core Status
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <p><span className="font-medium text-cyan-200">Status:</span> <span className={\`\${qnnCoreStatus === 'Online' ? 'text-green-400' : qnnCoreStatus === 'Training' || qnnCoreStatus === 'Optimizing' ? 'text-yellow-400' : 'text-red-400'}\`}>{qnnCoreStatus}</span></p>
            <p><span className="font-medium text-cyan-200">Version:</span> {qnnVersion}</p>
            <p className="col-span-2"><span className="font-medium text-cyan-200">Last Trained:</span> {lastTrained}</p>
          </div>
        </div>

        {/* Current Training Session Section */}
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-inner flex-grow">
          <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex-center">
            <CircleStackIcon className="w-5 h-5 mr-2 text-cyan-400" /> Current Training Session
          </h3>
          {currentSession ? (
            <div className="space-y-2 text-sm">
              <p className="flex items-center"><span className="font-medium text-cyan-200 w-24">Type:</span> <span className="flex-grow">{currentSession.type}</span></p>
              <p className="flex items-center"><span className="font-medium text-cyan-200 w-24">Status:</span> <span className={\`flex-grow \${currentSession.status === 'In Progress' ? 'text-yellow-400' : 'text-green-400'}\`}>{currentSession.status}</span></p>
              <div className="flex items-center">
                <span className="font-medium text-cyan-200 w-24">Progress:</span>
                <div className="flex-grow bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-cyan-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: \`\${currentSession.progress}%\` }}
                  ></div>
                </div>
                <span className="ml-2 w-10 text-right">{currentSession.progress}%</span>
              </div>
              <p className="flex items-center"><span className="font-medium text-cyan-200 w-24">Started At:</span> <span className="flex-grow">{currentSession.startedAt}</span></p>
            </div>
          ) : (
            <p className="text-gray-400 flex items-center"><InformationCircleIcon className="w-4 h-4 mr-2" /> No active QNN training session.</p>
          )}
          {currentSession?.status === "In Progress" && (
              <button
                onClick={handleTerminateSession}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center text-sm"
              >
                  <StopIcon className="w-4 h-4 mr-2" /> Terminate Session
              </button>
          )}
        </div>

        {/* QNN Training & Deployment Controls */}
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-inner flex-grow-0">
          <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center">
            <AcademicCapIcon className="w-5 h-5 mr-2" /> QNN Training & Deployment Controls
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Initiate new training cycles or deploy updated models. Remember, applications can now be assigned a public HTTPS URL via the **Quantum-to-Web Gateway**!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleStartNewTraining}
              disabled={currentSession !== null && currentSession.status === 'In Progress'}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayIcon className="w-4 h-4 mr-2" /> Start New Training
            </button>
            <button
              onClick={handleDeployModel}
              disabled={qnnCoreStatus === 'Optimizing'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RocketLaunchIcon className="w-4 h-4 mr-2" /> Deploy Model
            </button>
          </div>
        </div>

      </div>
    </GlassPanel>
  );
};
export default AICommandConsole;`,
  'components/GlassPanel.tsx': `// Placeholder for GlassPanel.tsx
import React from 'react';
interface GlassPanelProps { title: React.ReactNode; icon?: React.ReactNode; children: React.ReactNode; className?: string; }
const GlassPanel: React.FC<GlassPanelProps> = ({ title, icon, children, className }) => (
  <div className={\`relative bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-md rounded-lg shadow-xl border border-cyan-700/50 p-4 \${className || ''}\`}>
    <h2 className="flex items-center text-xl font-bold text-cyan-300 mb-4 border-b border-cyan-700/30 pb-2">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h2>
    {children}
  </div>
);
export default GlassPanel;`,
  'components/CHIPSBackOffice.tsx': `// Placeholder for CHIPSBackOffice.tsx
import React from 'react';
import GlassPanel from './GlassPanel'; // Corrected relative path
import { ServerCogIcon } from './Icons'; // Corrected relative path
const CHIPSBackOffice: React.FC = () => {
  return (
    <GlassPanel title="CHIPS Back Office (Editable)" icon={<ServerCogIcon className="w-5 h-5 text-cyan-300" />}>
      <div className="text-cyan-50 p-2">
        <p>CHIPS Back Office placeholder. This file is now editable.</p>
      </div>
    </GlassPanel>
  );
};
export default CHIPSBackOffice;`,
  // MetaprogrammingInterface.tsx itself also needs to be available in the codebase
  'components/MetaprogrammingInterface.tsx': `
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import GlassPanel from './GlassPanel'; // Corrected relative path
import SyntaxHighlighter from './SyntaxHighlighter'; // Assuming this component exists
import { CodeBracketIcon, LoaderIcon, AlertTriangleIcon, ArrowRightIcon, XIcon, CheckCircle2Icon, SparklesIcon } from './Icons'; // Corrected relative path

interface MetaprogrammingInterfaceProps {
  codebase: { [path: string]: string };
  onApplyPatch: (filePath: string, newContent: string) => void;
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const MetaprogrammingInterface: React.FC<MetaprogrammingInterfaceProps> = ({ codebase, onApplyPatch }) => {
  const [selectedFile, setSelectedFile] = useState<string>('index.tsx'); // Default to index.tsx
  const [editorContent, setEditorContent] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const filePaths = useMemo(() => Object.keys(codebase).sort(), [codebase]);

  // Load content of selected file into editor
  useEffect(() => {
    if (selectedFile && codebase[selectedFile]) {
      setEditorContent(codebase[selectedFile]);
      setResponse(null); // Clear previous response
      setError(null);
    } else {
      setEditorContent('// File not found or not loaded in codebase.');
    }
  }, [selectedFile, codebase]);

  const handleApplyPatch = () => {
    if (!selectedFile) {
      setError(\\"No file selected for patching.\\");
      return;
    }
    try {
      onApplyPatch(selectedFile, editorContent);
      setResponse(\`Successfully applied patch to \${selectedFile}\`);
      setError(null);
    } catch (e: any) {
      setError(\`Failed to apply patch: \${e.message}\`);
      setResponse(null);
    }
  };

  const handleAgentSuggest = async () => {
    if (!ai) {
      setError(\\"AI model not initialized. Check API key.\\");
      return;
    }
    if (!selectedFile || !editorContent) {
      setError(\\"Select a file and ensure editor has content for Agent Q to suggest optimizations.\\");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const model = ai.getGenerativeModel({ model: \\"gemini-pro\\" });
      const prompt = \`As Agent Q, analyze the following React/TypeScript/Tailwind CSS code for the QCOS dashboard.
File: \${selectedFile}

\`\`\`tsx
\${editorContent}
\`\`\`

Suggest potential optimizations, bug fixes, or enhancements that align with QCOS standards (e.g., performance, quantum-aware features, UI/UX, using existing icons). Provide the FULL, updated code block, and then a brief explanation of changes. If no changes are needed, state 'No changes recommended'.
Ensure the response is ONLY the updated code block first, then the explanation.\`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const codeBlockMatch = text.match(/\`\`\`tsx\\n([\\s\\S]*?)\\n\`\`\`/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        setEditorContent(codeBlockMatch[1]);
        setResponse(\\"Agent Q's suggestions loaded into editor. Review and apply.\\");
        // Extract explanation (anything after the code block)
        const explanation = text.substring(text.indexOf(\`\`\`\`) + codeBlockMatch[0].length);
        if (explanation.trim()) {
            setResponse(prev => (prev || '') + \\"\\n\\nExplanation:\\n\\" + explanation.trim());
        }
      } else {
        setResponse(\`Agent Q response: \${text}\`);
      }
    } catch (e: any) {
      setError(\`Agent Q encountered an error: \${e.message}\`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassPanel title=\\"Dashboard Metaprogramming\\" icon={<CodeBracketIcon className=\\"w-5 h-5 text-cyan-300\\" />}>
      <div className=\\"flex flex-col h-full text-cyan-50 p-2 space-y-4\\">
        <div className=\\"flex items-center space-x-2\\">
          <label htmlFor=\\"file-select\\" className=\\"text-cyan-200\\">Select File:</label>
          <select
            id=\\"file-select\\"
            className=\\"flex-grow bg-gray-700 border border-cyan-600 rounded px-3 py-2 text-cyan-50 focus:outline-none focus:ring-1 focus:ring-cyan-500\\"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            {filePaths.map((path) => (
              <option key={path} value={path}>{path}</option>
            ))}
          </select>
        </div>

        <div className=\\"flex-grow relative border border-cyan-700/50 rounded-lg overflow-hidden\\">
          <SyntaxHighlighter language=\\"tsx\\" code={editorContent} onCodeChange={setEditorContent} />
        </div>

        <div className=\\"flex flex-wrap gap-2 justify-end\\">
          <button
            onClick={handleAgentSuggest}
            className=\\"flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed\\"
            disabled={isLoading}
          >
            {isLoading ? <LoaderIcon className=\\"animate-spin mr-2\\" /> : <SparklesIcon className=\\"w-4 h-4 mr-2\\" />}
            Agent Q Suggest
          </button>
          <button
            onClick={handleApplyPatch}
            className=\\"flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed\\"
            disabled={isLoading}
          >
            <CheckCircle2Icon className=\\"w-4 h-4 mr-2\\" /> Apply Patch
          </button>
        </div>

        {isLoading && (
          <div className=\\"flex items-center text-yellow-400\\">
            <LoaderIcon className=\\"animate-spin mr-2\\" /> Agent Q is processing...
          </div>
        )}
        {error && (
          <div className=\\"flex items-center text-red-400\\">
            <AlertTriangleIcon className=\\"w-4 h-4 mr-2\\" /> Error: {error}
          </div>
        )}
        {response && (
          <div className=\\"flex items-center text-green-400 break-words\\">
            <CheckCircle2Icon className=\\"w-4 h-4 mr-2\\" /> {response}
          </div>
        )}
      </div>
    </GlassPanel>
  );
};

export default MetaprogrammingInterface;`,
};

// Mapping of face indices to their required rotation for the focused view
const faceRotations = {
  0: { x: 0, y: 0 },    // Front
  1: { x: 0, y: -90 },  // Right
  2: { x: 0, y: 180 },  // Back
  3: { x: 0, y: 90 },   // Left
  4: { x: -90, y: 0 },  // Top
  5: { x: 90, y: 0 }    // Bottom
};

// Defines the transitions between faces when using the navigator
const navigationTransitions: { [key: number]: { [key: string]: number } } = {
  0: { right: 1, left: 3, up: 4, down: 5 }, // From Front
  1: { right: 2, left: 0, up: 4, down: 5 }, // From Right
  2: { right: 3, left: 1, up: 4, down: 5 }, // From Back
  3: { right: 0, left: 2, up: 4, down: 5 }, // From Left
  4: { right: 1, left: 3, up: 2, down: 0 }, // From Top
  5: { right: 1, left: 3, up: 0, down: 2 }, // From Bottom
};

const initialLogs: LogEntry[] = [
    { id: 3, time: "00:00:03", level: 'INFO', msg: "IAI Kernel initialized." },
    { id: 2, time: "00:00:02", level: 'INFO', msg: "Quantum network link to 'rigel' established." },
    { id: 1, time: "00:00:01", level: 'INFO', msg: "QCOS Dashboard v3.11 booting..." },
];

const initialSystemHealth: SystemHealth = {
    cognitiveEfficiency: 0.94,
    semanticIntegrity: 0.985,
    dataThroughput: 1.21,
    ipsThroughput: 1.337,
    powerEfficiency: 1.0, // Multiplier, 1.0 is baseline
    decoherenceFactor: 1.0, // Multiplier, 1.0 is baseline
    processingSpeed: 1.0, // Multiplier, 1.0 is baseline
    qpuTempEfficiency: 1.0, // Multiplier, 1.0 is baseline
    qubitStability: 200, // ms interval, lower is more chaotic
};

const liveLogMessages: { level: LogEntry['level']; msg: string }[] = [
  { level: 'INFO', msg: 'IAI Kernel heartbeat received. Status: NOMINAL.' },
  { level: 'INFO', msg: 'QPU temperature stabilized at 10.8mK.' },
  { level: 'INFO', msg: "Entanglement distribution successful to node 'europa-7'." },
  { level: 'WARN', msg: 'High decoherence rate detected in Qubit 17.' },
  { level: 'INFO', msg: 'CHIPS packet routed via QAN-RELAY-004.' },
  { level: 'SUCCESS', msg: 'Quantum simulation completed with 99.8% fidelity.' },
  { level: 'INFO', msg: "Heuristic model 'pathfinder-v3' updated." },
  { level: 'INFO', msg: "User 'admin' accessed Global Config." },
  { level: 'ERROR', msg: "Connection to Q-Net node 'titan-2' timed out." },
  { level: 'INFO', msg: 'Quantum memory buffer flushed.' },
  { level: 'WARN', msg: "Latency spike on network link to 'rigel'." },
];

const initialApps: AppDefinition[] = [
  { id: 'quantum-swine-intelligence', name: 'Quantum Swine Intelligence', description: 'An ecosystem of quantum-powered apps for the global swine industry.', icon: CpuChipIcon, status: 'installed' },
  { id: 'global-swine-foresight', name: 'Global Swine Foresight', description: 'Strategic predictive analytics for global swine markets.', icon: GlobeIcon, status: 'installed', component: <GlobalSwineForesight /> },
  { id: 'philippine-swine-resilience', name: 'Philippine Swine Resilience', description: 'Actionable quantum insights for the Philippine swine industry.', icon: BuildingFarmIcon, status: 'installed', component: <PhilippineSwineResilience /> },
  { id: 'pighaven-consumer-trust', name: 'PigHaven Consumer Trust', description: 'Quantum-secured traceability and market insights for consumers.', icon: UsersIcon, status: 'installed', component: <PigHavenConsumerTrust /> },
  { id: 'chips-app-store', name: 'CHIPS Application Store', description: 'The premier destination for Quantum Applications.', icon: BoxIcon, status: 'installed', q_uri: 'CHIPS://store.qcos.dev/home', https_url: 'https://qcos.apps.web/store.qcos.dev' },
  { id: 'mol-sim', name: 'Molecular Simulation Toolkit', description: 'Simulate complex molecular interactions.', icon: FlaskConicalIcon, status: 'installed', component: <MolecularSimulationToolkit /> },
  { id: 'chips-browser', name: 'CHIPS Browser', description: 'Optimised browser for the Quantum CHIPS network.', icon: GlobeIcon, status: 'installed' },
  { id: 'generic-solver', name: 'Quantum Optimization Solver', description: 'General-purpose solver for optimization problems.', icon: BoxIcon, status: 'available' },
  { id: 'qkd-sim', name: 'QKD Simulator', description: 'Simulate BB84 and other quantum key distribution protocols.', icon: ShieldCheckIcon, status: 'available' },
  { id: 'qmc-finance', name: 'Quantum Monte Carlo: Finance', description: 'Perform complex financial risk analysis using quantum-accelerated Monte Carlo methods.', icon: ActivityIcon, status: 'installed', component: <QuantumMonteCarloFinance /> },
  { id: 'q-biomed', name: 'Q-BioMed: Drug Discovery', description: 'Accelerate drug discovery by simulating molecular structures on a quantum level.', icon: BeakerIcon, status: 'installed', component: <QBioMedDrugDiscovery /> },
  { id: 'qnet-viz', name: 'Quantum Network Visualizer', description: 'Monitor and visualize entanglement distribution across the quantum network.', icon: Share2Icon, status: 'available' },
  { id: 'vqe-toolkit', name: 'VQE Toolkit', description: 'Use the Variational Quantum Eigensolver to find molecular ground states.', icon: GitBranchIcon, status: 'available' },
];

const availableIcons: IconComponent[] = [AtomIcon, GitBranchIcon, ShieldCheckIcon, FlaskConicalIcon, BrainCircuitIcon, BoxIcon];

const panelToFaceMap: { [key: string]: number } = {
    'agentq-core': 0, 'qsh': 0, 'text-to-app': 0, 'qips-flow': 0, 'kernel-scheduler': 0,
    'sys-log': 1, 'chat-log': 1, 'abundance-engine': 1,
    'quantum-app-exchange': 2, 'ai-ops': 2, 'qpi': 2, 'meta-prog': 2, 'qcos-evo': 2, 'qml-forge': 2,
    'qpu-health': 3,
    'g-config': 4,
    'p-metrics': 5,
};

const LiveIndicator: React.FC = () => (
    <div className="flex items-center space-x-2 ml-auto">
      <div className="relative flex h-2 w-2">
        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
        <div className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></div>
      </div>
      <span className="text-red-400 text-xs font-bold tracking-widest">LIVE</span>
    </div>
  );

const getPanelMetadata = (qcosVersion: number): Record<number, FaceMetadata> => ({
  0: { // Front Face - Consolidated
    layout: 'grid grid-cols-3 grid-rows-2 gap-2',
    panels: [
      { id: 'agentq-core', title: "Agent Q Core & QNN Insights", description: "A unified interface to monitor Agent Q's cognitive core, QNN performance, and self-evolution.", className: 'col-span-2' },
      { id: 'qsh', title: 'CHIPS Back Office', description: 'Monitors the Quantum Asynchronous Network (QAN) and live CHIPS packet feed.' },
      { id: 'text-to-app', title: 'Text-to-App Interface', description: 'Live programming interface for generating quantum circuits from natural language.', className: 'col-span-1' },
      { id: 'qips-flow', title: 'QIPS Execution Flow', description: 'Visualizes the Quantum Instinctive Problem Solving (QIPS) pipeline from classical analysis to quantum execution.' },
      { id: 'kernel-scheduler', title: 'IAI Kernel Scheduler', description: "Visualizes the IAI Kernel's task distribution, managed by the QNN's parallel processing capabilities." },
    ]
  },
  1: { // Right Face - 3 panels
    layout: 'grid grid-cols-1 grid-rows-3 gap-2',
     panels: [
      { id: 'sys-log', title: <div className="flex items-center justify-between w-full"><span>System Log</span><LiveIndicator /></div>, description: 'Provides a live feed of all system-level logs and events.' },
      { id: 'chat-log', title: 'Chat Log', description: 'A canvas for copying recent chat exchanges with Agent Q.' },
      { id: 'abundance-engine', title: 'Global Abundance Engine', description: 'Simulates a dynamic global economic model to identify pathways to global abundance.' },
    ]
  },
  2: { // Back Face - Adjusted Layout
    layout: 'grid grid-cols-5 grid-rows-2 gap-2',
    panels: [
      { id: 'quantum-app-exchange', title: 'Quantum App Exchange', description: 'A marketplace for discovering, downloading, creating, and deploying quantum applications.', className: 'col-span-2' },
      { id: 'ai-ops', title: 'AI Operations', description: 'A comprehensive suite for managing, training, and deploying Agent Q via its own quantum capabilities.', className: 'col-span-3' },
      { id: 'qml-forge', title: 'QML Forge', description: "Simulate quantum machine learning processes by describing a phenomenon, generating Q-Lang scripts, and visualizing the results.", className: 'col-span-2' },
      { id: 'qpi', title: 'QCOS Quantum Protocol Simulator', description: 'View and interact with Q-Lang scripts for common quantum algorithms.' },
      { id: 'meta-prog', title: 'Dashboard Metaprogramming', description: 'Access and modify the QCOS dashboard source code with Agent Q.' },
      { id: 'qcos-evo', title: 'QCOS System Evolution', description: "Monitors all core QCOS systems and leverages the IAI's QNN to run predictive optimization simulations, enhancing overall performance and stability." },
    ]
  },
  3: { // Left Face - Consolidated
    layout: 'grid grid-cols-1',
     panels: [
      { id: 'qpu-health', title: 'Quantum Processor Unit (QPU) Health', description: 'A unified view of QPU physical health, real-time qubit states, environmental conditions, and stability metrics.' },
    ]
  },
  4: { // Top Face - 1 panel + App Chips
    layout: 'relative',
    panels: [{ id: 'g-config', title: 'Public Deployment & Optimization Hub', description: 'Manage public access for your CHIPS applications via the Quantum-to-Web Gateway and monitor their QNN optimization status.' }]
  },
  5: { // Bottom Face - 1 panel
    layout: 'grid grid-cols-1', panels: [{ id: 'p-metrics', title: 'Power & Efficiency', description: 'Shows the total power draw, Power Usage Effectiveness (PUE), and cryo-cooling status.' }]
  }
});

const App: React.FC = () => {
  const [isDeploying, setIsDeploying] = useState(true);
  const [rotation, setRotation] = useState({ x: -15, y: 35 });
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isCubeFocused, setIsCubeFocused] = useState(false);
  const [viewedFaceIndex, setViewedFaceIndex] = useState(0);
  const [focusedPanelId, setFocusedPanelId] = useState<string | null>(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>(initialLogs);
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);
  const [marketApps, setMarketApps] = useState<AppDefinition[]>(initialApps);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [uriAssignments, setUriAssignments] = useState<URIAssignment[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [qcosVersion, setQcosVersion] = useState(3.11);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(initialSystemHealth);

  // MODIFIED: Use a ref to store initial codebase and then merge with additional files
  const initialCodebaseRef = useRef<{ [path: string]: string }>(initialCodebase);

  // MODIFIED: Load codebase state from localStorage first, then merge with default placeholders.
  const [codebaseState, setCodebaseState] = useState<{ [path: string]: string }>(() => {
    // First, combine the core initial codebase with the metaprogramming placeholders
    const defaultCombinedCodebase = {
      ...initialCodebaseRef.current,
      ...initialMetaprogrammingPlaceholders,
    };

    try {
      const savedCodebase = localStorage.getItem(LOCAL_STORAGE_CODEBASE_KEY);
      if (savedCodebase) {
        const parsedSavedCodebase = JSON.parse(savedCodebase);
        // Merge saved changes on top of the default combined codebase
        // This ensures new default files aren't lost, and saved user changes persist.
        return { ...defaultCombinedCodebase, ...parsedSavedCodebase };
      }
    } catch (e) {
      console.error("Failed to parse saved codebase from localStorage", e);
      // Fallback to default combined codebase if parsing fails
    }
    return defaultCombinedCodebase;
  });

  // REMOVED: The useEffect that previously loaded additionalCode, as its logic is now
  // handled within the useState initializer for codebaseState for robust persistence.

  const lastPos = useRef({ x: 0, y: 0 });
  const dragState = useRef({ isDragging: false, didDrag: false });
  const logIdCounter = useRef(initialLogs.length);
  const CUBE_SIZE = Math.min(window.innerWidth, window.innerHeight) * 0.9;

  const panelMetadata = useMemo(() => getPanelMetadata(qcosVersion), [qcosVersion]);

  const panelInfoMap: { [key: string]: { title: React.ReactNode; description: string; } } = useMemo(() => {
    const allPanels = Object.values(panelMetadata).flatMap((view: FaceMetadata) => view.panels);
    const infoMap: { [key: string]: { title: React.ReactNode; description: string; } } = {};
    allPanels.forEach(p => { infoMap[p.id] = { title: p.title, description: p.description }; });
    marketApps.forEach(app => { infoMap[app.id] = { title: app.name, description: app.description }; });
    return infoMap;
  }, [marketApps, panelMetadata]);

  const { isAgentQOpen, toggleAgentQ, agentQProps } = useAgentQ({
      focusedPanelId,
      panelInfoMap,
      qcosVersion,
  });

  const addLog = useCallback((level: LogEntry['level'], msg: string) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    logIdCounter.current += 1;
    const newLog: LogEntry = { id: logIdCounter.current, time, level, msg };
    setSystemLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, []);

  const handleAICommand = (command: string) => {
      addLog('CMD', `> ${command}`);
      setLastExecutedCommand(command);

      let correctedCommand = command;
      if (command.toLowerCase().includes('algorithem')) {
        correctedCommand = command.replace(/algorithem/i, 'algorithm');
        addLog('INFO', `Corrected typo: "algorithem" -> "algorithm"`);
      }

      addLog('INFO', `Command not recognized: "${correctedCommand}"`);

      setTimeout(() => setLastExecutedCommand(null), 3000);
  };

  const handleInstallApp = (id: string) => {
      const appToInstall = marketApps.find(app => app.id === id);
      if (!appToInstall) return;

      addLog('INFO', `Download initiated for ${appToInstall.name} package...`);
      setMarketApps(prevApps => prevApps.map(app =>
           app.id === id ? { ...app, status: 'downloading' } : app
      ));

      setTimeout(() => {
          addLog('INFO', `Verifying package integrity for ${appToInstall.name}...`);
          setTimeout(() => {
              addLog('SUCCESS', `Package verified. Initiating installation.`);
              setMarketApps(prevApps => prevApps.map(app =>
                   app.id === id ? { ...app, status: 'installing' } : app
              ));

                             setTimeout(() => {
                  addLog('INFO', `Registering ${appToInstall.name} with local QCOS node.`);
                  if(appToInstall.q_uri) {
                      addLog('INFO', `Q-URI Activated: ${appToInstall.q_uri}`);
                  }

                   if(appToInstall.https_url) {
                      addLog('INFO', `HTTPS Gateway Activated: ${appToInstall.https_url}`);
                  }
                  setMarketApps(prevApps => prevApps.map(app =>
                       app.id === id ? { ...app, status: 'installed' } : app
                  ));
                  addLog('SUCCESS', `App successfully installed and deployed: ${appToInstall.name}`);
              }, 2000);

           }, 1500);

      }, 2000);
  };

  const handleViewFace = (faceIndex: number) => {
    setAutoRotate(false);
    setIsCubeFocused(true);
    setViewedFaceIndex(faceIndex);
  };

  const handlePanelSelect = (panelId: string) => {
    const faceIndex = panelToFaceMap[panelId];

    if (faceIndex !== undefined) {
      handleViewFace(faceIndex);
    } else {
      setAutoRotate(false);
      setIsCubeFocused(true);
    }

    setFocusedPanelId(panelId);
    setIsSwitcherOpen(false);
  };

  const handleFullDeployment = (appDetails: { name: string; description: string; code: string }) => {
    addLog('INFO', `Deployment initiated for application: "${appDetails.name}"`);

    const appSlug = appDetails.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const q_uri = `CHIPS://${appSlug}.qcos.apps/main`;
    const https_url = q_uri.replace('CHIPS://', 'https://qcos.apps.web/');

    setTimeout(() => {
      addLog('INFO', `Contacting CHIPS Back Office for address assignment...`);
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        addLog('INFO', `Q-URI Assigned: ${q_uri}`);
        addLog('INFO', `HTTPS URL Assigned: ${https_url}`);
        setUriAssignments(prev => [{ appName: appDetails.name, q_uri, https_url, timestamp }, ...prev]);

        setTimeout(() => {
          addLog('INFO', `Publishing package to CHIPS Application Store...`);
          setTimeout(() => {
            addLog('SUCCESS', `Deployment successful. "${appDetails.name}" is now live.`);

            const newApp: AppDefinition = {
              id: `custom-${Date.now()}`,
              name: appDetails.name,
              description: appDetails.description,
              icon: availableIcons[Math.floor(Math.random() * availableIcons.length)],
              status: 'installed',
              isCustom: true,
              q_uri: q_uri,
              https_url: https_url,
            };
            setMarketApps(prev => [...prev, newApp]);
            handlePanelSelect(newApp.id);
          }, 1500);
        }, 1000);
      }, 1500);
    }, 1000);
  };

  // MODIFIED: This handleApplyPatch now saves to localStorage
  const handleApplyPatch = useCallback((filePath: string, newContent: string) => {
    setCodebaseState(prev => {
      const updatedCodebase = {
        ...prev,
        [filePath]: newContent
      };
      // Persist the entire updated codebase to localStorage
      localStorage.setItem(LOCAL_STORAGE_CODEBASE_KEY, JSON.stringify(updatedCodebase));
      return updatedCodebase;
    });
    addLog('SUCCESS', `Metaprogramming patch applied to ${filePath}.`);
    addLog('INFO', `UI will reflect changes on next hot-reload cycle (simulated).`);
  }, [addLog]);

  const panelData = useMemo<Record<number, FaceData>>(() => {
        const getContentForId = (id: string): React.ReactNode => {
            switch (id) {
                case 'qcos-evo': return <QCOSSystemEvolutionInterface systemHealth={systemHealth} />;
                case 'qsh': return <CHIPSBackOffice uriAssignments={uriAssignments} />;
                case 'qips-flow': return <QuantumExecutionFlow />;
                case 'agentq-core': return <AgentQEnhancedInsights systemHealth={systemHealth} />;
                case 'text-to-app': return <TextToAppInterface large />;
                case 'sys-log': return <SystemLog logs={systemLogs} />;
                case 'qpi': return <QuantumProgrammingInterface />;
                case 'meta-prog': return <MetaprogrammingInterface codebase={codebaseState} onApplyPatch={handleApplyPatch} />;
                case 'quantum-app-exchange': return <QuantumAppExchange apps={marketApps} onInstall={handleInstallApp} onLaunch={handlePanelSelect} onDeployApp={handleFullDeployment} uriAssignments={uriAssignments}/>;
                case 'ai-ops': return (<AICommandConsole />); // Direct render of AICommandConsole
                case 'kernel-scheduler': return <KernelScheduler />;
                case 'chat-log': return <ChatLogPanel messages={agentQProps.messages} isLoading={agentQProps.isLoading} onSendMessage={(input) => agentQProps.onSendMessage(input, null)} />;
                case 'qml-forge': return <QMLForge />;
                case 'qpu-health': return <QPUHealth systemHealth={systemHealth} />;
                case 'g-config': return <PublicDeploymentOptimizationHub />;
                case 'p-metrics': return <PowerMetrics powerEfficiency={systemHealth.powerEfficiency} />;
                case 'abundance-engine': return <GlobalAbundanceEngine />;
                default: return null;
            }
        };

        const hydratedData: Record<number, FaceData> = {};
        for (const key in panelMetadata) {
            const faceIndex = parseInt(key, 10);
            const faceMeta = panelMetadata[faceIndex as keyof typeof panelMetadata];
            hydratedData[faceIndex] = {
                layout: faceMeta.layout,
                panels: faceMeta.panels.map(panelMeta => ({
                    ...panelMeta,
                    content: getContentForId(panelMeta.id)
                }))
            };
        }
        return hydratedData;
    }, [
        panelMetadata, uriAssignments, systemLogs, marketApps,
        lastExecutedCommand, isRecalibrating, isUpgrading, CUBE_SIZE, systemHealth,
        codebaseState, addLog, agentQProps.messages, agentQProps.isLoading, agentQProps.onSendMessage, handleApplyPatch,
        handleInstallApp, handlePanelSelect, handleFullDeployment, handleAICommand,
     ]);

  const allPanels = Object.values(panelData).flatMap((view: FaceData) => view.panels);
  let focusedPanelData = allPanels.find(p => p.id === focusedPanelId);

  if (!focusedPanelData && focusedPanelId) {
    const customApp = marketApps.find(app => app.id === focusedPanelId);
    if (customApp) {
      let content;
      if (customApp.id === 'quantum-swine-intelligence') {
        content = <QuantumSwineIntelligence onOpenApp={handlePanelSelect} />;
      } else if (customApp.component) {
          content = customApp.component;
      } else if (customApp.id === 'chips-browser') {
        content = <CHIPSBrowser apps={marketApps} onInstall={handleInstallApp} />;
      } else if (customApp.q_uri) {
        if (customApp.q_uri === 'CHIPS://store.qcos.dev/home') {
          content = <CHIPSBrowser apps={marketApps} onInstall={handleInstallApp} initialUri={customApp.q_uri} />;
        } else if (customApp.isCustom) {
          content = (
            <div className="p-4 text-center text-cyan-300 h-full flex flex-col items-center justify-center">
              <customApp.icon className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{customApp.name}</h2>
              <p>{customApp.description}</p>
              <div className="mt-6 p-4 bg-black/30 rounded-md border border-cyan-900 w-full max-w-2xl text-left font-mono text-sm">
                  <h3 className="text-cyan-200 font-bold mb-2 text-base text-center">Deployment Details</h3>
                  <div className="space-y-2">
                      <p>
                          <span className="text-yellow-400">Q-URI:</span> <span className="text-green-300 break-all">{customApp.q_uri}</span>
                      </p>
                      {customApp.https_url && (
                          <p>
                             <span className="text-yellow-400">HTTPS:</span> <span className="text-blue-300 break-all">{customApp.https_url}</span>
                          </p>
                      )}
                      <p className="text-xs mt-4 text-cyan-500 text-center pt-2 border-t border-cyan-900">
                          Full component rendering from user-provided code is a simulated feature.
                      </p>
                  </div>
              </div>
            </div>
          );
        } else {
           content = <CHIPSBrowser apps={marketApps} onInstall={handleInstallApp} initialUri={customApp.q_uri} />;
        }
      }
      focusedPanelData = {
        id: customApp.id,
        title: customApp.name,
        description: customApp.description,
        content: content,
      };
    }
  }

  const coreSwitcherPanels = [
    { id: 'agentq-core', title: 'Agent Q Core', icon: BrainCircuitIcon },
    { id: 'qsh', title: 'CHIPS Back Office', icon: GlobeIcon },
    { id: 'qcos-evo', title: 'System Evolution', icon: Share2Icon },
    { id: 'quantum-app-exchange', title: 'App Exchange', icon: BoxIcon },
    { id: 'qpu-health', title: 'QPU Health', icon: ThermometerIcon },
    { id: 'g-config', title: 'Deployment Hub', icon: SettingsIcon },
    { id: 'p-metrics', title: 'Power & Efficiency', icon: ZapIcon },
    { id: 'sys-log', title: 'System Log', icon: FileTextIcon },
    { id: 'qpi', title: 'Protocol Simulator', icon: FileCodeIcon },
    { id: 'meta-prog', title: 'Metaprogramming', icon: CodeBracketIcon },
    { id: 'chat-log', title: 'Chat Log', icon: MessageSquareIcon },
    { id: 'qips-flow', title: 'QIPS Flow', icon: ArrowPathIcon },
    { id: 'ai-ops', title: 'AI Ops', icon: SparklesIcon },
    { id: 'abundance-engine', title: 'Global Abundance Engine', icon: GlobeIcon },
    { id: 'qml-forge', title: 'QML Forge', icon: BrainCircuitIcon },
  ];

  const appSwitcherPanels = marketApps
      .filter(app => app.status === 'installed' && !coreSwitcherPanels.some(p => p.id === app.id))
      .map(app => ({
          id: app.id,
          title: app.name,
          icon: app.icon
      }));

  const handlePanelClick = (panelId: string) => {
    if (isCubeFocused) {
      setFocusedPanelId(panelId);
      setIsSwitcherOpen(false);
    }
  };

  const handleVoiceExpand = (section: 'text' | 'ips') => {
    handleViewFace(0);
  };

  const handleUnfocus = () => {
    if (focusedPanelId) {
      setFocusedPanelId(null);
    } else {
      setIsCubeFocused(false);
      setTimeout(() => setAutoRotate(true), 1000);
    }
    setIsSwitcherOpen(false);
  };

  const handleNavigation = (direction: 'up' | 'down' | 'left' | 'right') => {
    const nextFaceIndex = navigationTransitions[viewedFaceIndex as keyof typeof navigationTransitions]?.[direction];
    if (nextFaceIndex !== undefined) {
      setViewedFaceIndex(nextFaceIndex);
    }
  };

  const commands = [
    { command: ['rotate left', 'spin left'], callback: () => setRotation(r => ({ ...r, y: r.y + 45 })) },
    { command: ['rotate right', 'spin right'], callback: () => setRotation(r => ({ ...r, y: r.y - 45 })) },
    { command: ['rotate up'], callback: () => setRotation(r => ({ ...r, x: r.x - 45 })) },
    { command: ['rotate down'], callback: () => setRotation(r => ({ ...r, x: r.x + 45 })) },
    { command: 'stop rotation', callback: () => handleViewFace(0) },
    { command: ['resume rotation', 'auto rotate'], callback: handleUnfocus },
    { command: ['view front', 'focus front'], callback: () => handleViewFace(0) },
    { command: ['view right', 'focus right'], callback: () => handleViewFace(1) },
    { command: ['view back', 'focus back'], callback: () => handleViewFace(2) },
    { command: ['view left', 'focus left'], callback: () => handleViewFace(3) },
    { command: ['view top', 'focus top'], callback: () => handleViewFace(4) },
    { command: ['view bottom', 'focus bottom'], callback: () => handleViewFace(5) },
    { command: ['reset view', 'show cube', 'unfocus', 'close panel'], callback: handleUnfocus },
    { command: ['open text interface', 'show text interface', 'expand text interface'], callback: () => handleVoiceExpand('text') },
    { command: ['close text interface', 'hide text interface', 'collapse text interface'], callback: () => {} },
    { command: ['open neuro net', 'show neuro net', 'expand neuro net'], callback: () => handleVoiceExpand('ips') },
    {
      command: 'recalibrate sensors',
      callback: () => {
        handleViewFace(3); // Focus on the left face
        addLog('CMD', `> recalibrate sensors`);
        addLog('INFO', 'Sensor recalibration sequence initiated...');
        setIsRecalibrating(true);
        setTimeout(() => {
          setIsRecalibrating(false);
          addLog('SUCCESS', 'Sensor recalibration complete. System nominal.');
        }, 4000);
      }
    },
  ];
  const { listeningState, toggleListening, isSupported } = useVoiceCommands(commands);

  useEffect(() => {
    if (isDragging || !autoRotate || isCubeFocused || focusedPanelId !== null) return;
    let animationFrameId: number;
    const rotate = () => {
      setRotation(r => ({
        x: -15 + 10 * Math.sin(Date.now() / 2000), // More pronounced, smooth bobbing motion
        y: r.y + 0.25, // Faster rotation
      }));
      animationFrameId = requestAnimationFrame(rotate);
    };
    animationFrameId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, autoRotate, isCubeFocused, focusedPanelId]);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomLog = liveLogMessages[Math.floor(Math.random() * liveLogMessages.length)];
      addLog(randomLog.level, randomLog.msg);
    }, 3000); // Add a new log every 3 seconds

    // Simulate periodic system health updates
    const healthInterval = setInterval(() => {
      setSystemHealth(prevHealth => {
          // Introduce slight fluctuations for realism
          return {
              ...prevHealth,
              cognitiveEfficiency: Math.min(1.0, Math.max(0.9, prevHealth.cognitiveEfficiency + (Math.random() - 0.5) * 0.01)),
              semanticIntegrity: Math.min(1.0, Math.max(0.95, prevHealth.semanticIntegrity + (Math.random() - 0.5) * 0.005)),
              dataThroughput: Math.max(0.8, prevHealth.dataThroughput + (Math.random() - 0.5) * 0.1), // Gbps
              ipsThroughput: Math.max(1.0, prevHealth.ipsThroughput + (Math.random() - 0.5) * 0.1), // QIPS/sec
              powerEfficiency: Math.min(1.2, Math.max(0.9, prevHealth.powerEfficiency + (Math.random() - 0.5) * 0.02)), // Factor, lower is better
              decoherenceFactor: Math.min(1.5, Math.max(0.8, prevHealth.decoherenceFactor + (Math.random() - 0.5) * 0.05)), // Factor, lower is better
              processingSpeed: Math.min(1.5, Math.max(0.8, prevHealth.processingSpeed + (Math.random() - 0.5) * 0.05)), // Factor, higher is better
              qpuTempEfficiency: Math.min(1.2, Math.max(0.9, prevHealth.qpuTempEfficiency + (Math.random() - 0.5) * 0.02)), // Factor, lower is better
              qubitStability: Math.min(300, Math.max(100, prevHealth.qubitStability + (Math.random() - 0.5) * 10)), // ms, lower is better
          };
      });
    }, 2000); // Update every 2 seconds

    return () => {
      clearInterval(logInterval);
      clearInterval(healthInterval);
    };
  }, [addLog]);

  const handleDragStart = (clientX: number, clientY: number) => {
    dragState.current = { isDragging: true, didDrag: false };
    setAutoRotate(false);
    setIsDragging(true);
    lastPos.current = { x: clientX, y: clientY };
  };
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragState.current.isDragging) return;
    dragState.current.didDrag = true;
    const dx = clientX - lastPos.current.x; const dy = clientY - lastPos.current.y;
    setRotation(prev => ({ x: Math.max(-75, Math.min(75, prev.x - dy * 0.5)), y: prev.y + dx * 0.5, }));
    lastPos.current = { x: clientX, y: clientY };
  };
  const handleDragEnd = () => {
    if (dragState.current.isDragging) {
      setIsDragging(false);
      if (!dragState.current.didDrag && !isCubeFocused) {
          handleViewFace(0);
      }
      setTimeout(() => { if (!isCubeFocused && focusedPanelId === null) setAutoRotate(true); }, 3000);
    }
    dragState.current = { isDragging: false, didDrag: false };
  };

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX, e.clientY);
  const onMouseUp = handleDragEnd;
  const onMouseLeave = onMouseUp; // Important for when mouse leaves the cube area while dragging
  const onTouchStart = (e: React.TouchEvent) => e.touches.length === 1 && handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => e.touches.length === 1 && handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchEnd = handleDragEnd;


  const scale = isCubeFocused ? Math.min(window.innerWidth, window.innerHeight) / CUBE_SIZE * 0.9 : 1;
  const targetRotation = isCubeFocused ? faceRotations[viewedFaceIndex as keyof typeof faceRotations] : rotation;
  const getCursor = () => { if (isCubeFocused) return 'cursor-default'; if (isDragging) return 'cursor-grabbing'; return 'cursor-grab'; }
  const eventHandlers = isCubeFocused ? {} : { onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onTouchStart, onTouchMove, onTouchEnd };

  return (
    <>
      {isDeploying && <DeploymentSequence onComplete={() => setIsDeploying(false)} />}
      <div className={`w-screen h-screen bg-black/50 text-cyan-300 font-mono overflow-hidden select-none ${getCursor()}`}>
        <AnimatedBackground />

        {isCubeFocused && !focusedPanelId && <div className="fixed inset-0 z-10" onClick={handleUnfocus}></div>}

        <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col pointer-events-none">
          <header className="flex items-center justify-between mb-4 flex-shrink-0 pointer-events-auto">
            <div className="flex items-center space-x-4">
              <CpuChipIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 animate-pulse" />
              <div><h1 className="text-xl sm:text-2xl font-bold text-white tracking-widest">QCOS Dashboard v{`${qcosVersion.toFixed(2)}`}</h1><p className="text-xs sm:text-sm text-cyan-400">Quantum Computing Operations System</p></div>
            </div>
            <div className="flex items-center space-x-4">
                <ResourceSteward listeningState={listeningState} onToggleListen={toggleListening} isVoiceSupported={isSupported} />
            </div>
          </header>

          <main className={`flex-grow flex items-center justify-center pointer-events-auto transition-all duration-500 ${focusedPanelId ? 'blur-sm scale-95' : ''}`} style={{ perspective: '2000px' }}>
              <div {...eventHandlers} className="w-full h-full flex items-center justify-center">
                <HolographicContainer targetRotation={targetRotation} isDragging={isDragging} size={CUBE_SIZE} scale={scale}>
                    <HolographicTesseract>
                        {[...Array(6)].map((_, faceIndex) => {
                          const currentView = panelData[faceIndex as keyof typeof panelData];
                          const isFaceInteractive = isCubeFocused && faceIndex === viewedFaceIndex;

                          return (
                            <CubeFace
                              key={`face-${faceIndex}`}
                              isFocused={isFaceInteractive}
                              isCubeFocused={isCubeFocused}
                            >
                              <div className={`w-full h-full ${currentView.layout} transform-style-preserve-3d`}>
                                {currentView.panels.map(panel => (
                                  <div
                                     key={panel.id}
                                     onClick={() => handlePanelClick(panel.id)}
                                     className={`group min-h-0 transition-transform duration-300 ease-in-out ${isFaceInteractive ? 'cursor-pointer hover:[transform:translateZ(20px)]' : 'cursor-default'} ${panel.className || ''}`}
                                  >
                                    <GlassPanel title={panel.title}>{panel.content}</GlassPanel>
                                  </div>
                                ))}
                              </div>
                            </CubeFace>
                          );
                        })}
                    </HolographicTesseract>
                </HolographicContainer>
              </div>
          </main>
        </div>
        {isCubeFocused && !focusedPanelId && <CubeNavigator onNavigate={handleNavigation} />}

        <AgentQ
           isOpen={isAgentQOpen}
          onToggleOpen={toggleAgentQ}
          onDeployApp={handleFullDeployment}
          {...agentQProps}
        />

        <FullScreenSwitcher
             isOpen={isSwitcherOpen}
            onToggle={() => setIsSwitcherOpen(v => !v)}
            corePanels={coreSwitcherPanels}
            appPanels={appSwitcherPanels}
            onPanelSelect={handlePanelSelect}
        />
      </div>

      {focusedPanelData && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in-up" onClick={() => setFocusedPanelId(null)}>
          <div className="w-[95vw] h-[95vh] max-w-[1600px] max-h-[1000px] pointer-events-auto relative" onClick={(e) => e.stopPropagation()}>
            <GlassPanel title={focusedPanelData.title}>
              {focusedPanelData.content}
            </GlassPanel>
            <button onClick={() => setFocusedPanelId(null)} className="absolute top-3 right-3 text-cyan-400/70 hover:text-white transition-colors z-50 p-2 rounded-full hover:bg-white/10" aria-label="Close panel"><XIcon className="w-6 h-6" /></button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;