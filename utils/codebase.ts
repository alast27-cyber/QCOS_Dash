// This file contains the entire source code of the application for the Metaprogramming Interface.

const index_tsx = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

const App_tsx = `
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import AnimatedBackground from './components/AnimatedBackground';
import GlassPanel from './components/GlassPanel';
import { CpuChipIcon, XIcon, GlobeIcon, BeakerIcon, FileTextIcon, ThermometerIcon, SettingsIcon, ZapIcon, BoxIcon, ShieldCheckIcon, FlaskConicalIcon, BrainCircuitIcon, AtomIcon, GitBranchIcon, ServerCogIcon, ActivityIcon, GaugeIcon, Share2Icon, FileCodeIcon, CodeBracketIcon, MessageSquareIcon, ClockIcon, ChartBarIcon, SparklesIcon, ArrowPathIcon, BuildingFarmIcon, UsersIcon } from './components/Icons';
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
import { initialCodebase } from './utils/codebase';
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
      { id: 'ai-ops', title: 'AI Operations', description: 'Command and control for AI, including command console, semantic checks, and system task scheduling.', className: 'col-span-3' },
      { id: 'qml-forge', title: 'QML Forge', description: "Simulate quantum machine learning processes by describing a phenomenon, generating Q-Lang scripts, and visualizing the results.", className: 'col-span-2' },
      { id: 'qpi', title: 'QCOS Quantum Protocol Simulator', description: 'View and interact with Q-Lang scripts for common quantum algorithms.' },
      { id: 'meta-prog', title: 'Dashboard Metaprogramming', description: 'Access and modify the QCOS dashboard source code with Agent Q.' },
      { id: 'qcos-evo', title: 'QCOS System Evolution', description: 'Monitors all core QCOS systems and leverages the IAI\\'s QNN to run predictive optimization simulations, enhancing overall performance and stability.' },
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


// ... (rest of the App.tsx content is unchanged, so it's omitted for brevity)
`;

const components_MetaprogrammingInterface_tsx = `
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import GlassPanel from './GlassPanel';
import SyntaxHighlighter from './SyntaxHighlighter';
import { CodeBracketIcon, LoaderIcon, AlertTriangleIcon, ArrowRightIcon, XIcon, CheckCircle2Icon } from './Icons';

interface MetaprogrammingInterfaceProps {
  codebase: { [path: string]: string };
  onApplyPatch: (filePath: string, newContent: string) => void;
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

// ... (component content is in the other file change)
`;


export const initialCodebase: { [path: string]: string } = {
  'index.tsx': index_tsx,
  'App.tsx': App_tsx,
  'components/MetaprogrammingInterface.tsx': components_MetaprogrammingInterface_tsx,
};