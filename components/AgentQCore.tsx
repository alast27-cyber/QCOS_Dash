import React, { useState, useEffect, useRef } from 'react';
import { GlassPanel } from '@/components/GlassPanel';
import {
  GlobeAltIcon,
  SparklesIcon,
  CpuChipIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  PuzzlePieceIcon,
  LightBulbIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/solid'; // Using solid icons for a consistent visual style

// Define the AGI Roadmap Phases for Agent Q's self-evolution
const agiRoadmapPhases = [
  {
    id: 1,
    title: 'Phase 1: Foundational Models & Multimodal Fluency',
    objective: 'To create a single model that comprehends and generates information across text, images, audio, video, and potentially other data types (like code or sensor data).',
    metrics: ['Unified Embedding Space Coherence', 'Multimodal Data Ingestion Rate', 'Self-Supervised Learning Efficacy'],
    description: 'Focuses on building and scaling models that can understand and process information from multiple modalities as seamlessly as humans do, forming a rich, interconnected foundation of world knowledge.'
  },
  {
    id: 2,
    title: 'Phase 2: Embodiment & World Modeling',
    objective: 'To develop an internal, predictive "world model." The AI should not just recognize a ball; it should understand that if you push it, it will roll.',
    metrics: ['Intuitive Physics Accuracy', 'Simulated Environment Interaction Rate', 'Predictive Model F-Score'],
    description: 'Concentrates on grounding the AI in reality (or a sufficiently complex simulation) to learn intuitive physics and common sense, understanding cause-and-effect in a dynamic world.'
  },
  {
    id: 3,
    title: 'Phase 3: Autonomous Learning & Self-Improvement',
    objective: 'To create an AI that can identify gaps in its own knowledge, formulate questions, and then seek out the information or experiments needed to fill those gaps.',
    metrics: ['Curiosity Metric (Novelty Score)', 'Automated Experimentation Yield', 'Meta-Learning Algorithm Convergence'],
    description: 'Aims for the system to break free from reliance on static, human-provided datasets, becoming an active, curious learner that directs its own education and improves its own cognitive processes.'
  },
  {
    id: 4,
    title: 'Phase 4: Integration & Generalization',
    objective: 'To achieve true task generalization. The system should be able to attempt any novel cognitive task it is presented with, using its foundational knowledge, world model, and learning abilities to figure out a solution from first principles.',
    metrics: ['Generalization Index', 'Cross-Domain Task Proficiency', 'Theory of Mind Accuracy'],
    description: 'The final phase integrates all previous capabilities into a cohesive, general-purpose cognitive architecture that can dynamically reason, plan, and adapt to any task a human can perform.'
  },
];

const AgentQCoreAndQNNInsights: React.FC = () => {
  // Agent Q's operational and cognitive state
  const [qnnStatus, setQnnStatus] = useState('Operational (Idle)');
  const [evolutionProgress, setEvolutionProgress] = useState(0); // Starts from 0, progresses through AGI phases
  const [intuitiveNNStatus, setIntuitiveNNStatus] = useState('Monitoring (Low)');
  const [instinctiveNNStatus, setInstinctiveNNStatus] = useState('Active (Stable)');
  const [cognitionNNStatus, setCognitionNNStatus] = useState('Governing (Stable)');
  const [lastEvolutionEvent, setLastEvolutionEvent] = useState('System Initialized');

  // AGI Training specific state
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [ingestedDataLog, setIngestedDataLog] = useState<string[]>([]);
  const dataLogRef = useRef<HTMLDivElement>(null);

  // Combined QNN Core Metrics, including operational and training-specific
  const [qnnMetrics, setQNNMetrics] = useState({
    qubitUtilization: 72, // Percentage
    entanglementDepth: 128, // Qubits
    processingThroughput: 1.4, // Peta-Ops/sec
    entanglementStability: 0.95, // Range 0-1
    coherenceTime: 1200, // nanoseconds
    qubitFidelity: 0.998, // Range 0-1
    trainingEpochs: 0,
    learningRate: 0.0001,
  });

  // Combined useEffect for continuous simulations and updates
  useEffect(() => {
    let trainingInterval: NodeJS.Timeout;
    let coreMetricsInterval: NodeJS.Timeout;

    if (isTrainingActive) {
      // Simulate data ingestion and training metric updates every second
      trainingInterval = setInterval(() => {
        const simulatedDataSources = [
          "wikipedia.org/QNN_Architectures",
          "arxiv.org/abs/2311.01234 (Quantum Self-Attention)",
          "github.com/QuantumAI/open-source-models",
          "researchgate.net/publication/Qubit_Error_Correction_Review",
          "nasa.gov/Mars_Rover_Telemetry_Data",
          "youtube.com/QuantumMechanicsExplained",
          "public-dataset.org/climate_change_modeling",
          "medium.com/Exploring_AGI_Pathways",
          "financial-news.com/global_market_trends",
        ];
        const randomSource = simulatedDataSources[Math.floor(Math.random() * simulatedDataSources.length)];
        const newDataSnippet = `[${new Date().toLocaleTimeString()}] Ingested from: ${randomSource}`;

        setIngestedDataLog((prev) => {
          const newLog = [...prev, newDataSnippet];
          return newLog.slice(-50); // Keep log size manageable
        });

        setQNNMetrics((prev) => ({
          ...prev,
          trainingEpochs: prev.trainingEpochs + 1,
          entanglementStability: Math.min(1.0, prev.entanglementStability + Math.random() * 0.00005),
          coherenceTime: Math.min(2000, prev.coherenceTime + Math.random() * 0.5),
        }));

        setLastEvolutionEvent(`QAGI Training Epoch ${qnnMetrics.trainingEpochs + 1} for Phase ${currentPhase} Completed`);
        setEvolutionProgress(prev => Math.min(100, prev + 0.01)); // Continuous slight progress

      }, 1000);

      // Simulate core operational metric updates every 5 seconds
      coreMetricsInterval = setInterval(() => {
        setQNNMetrics(prev => ({
          ...prev,
          qubitUtilization: Math.min(100, Math.max(0, prev.qubitUtilization + (Math.random() > 0.5 ? 1 : -1))),
          processingThroughput: parseFloat((prev.processingThroughput + (Math.random() * 0.1 - 0.05)).toFixed(2)),
        }));
        setQnnStatus('Training & Operational');
        setIntuitiveNNStatus('Learning (High)');
        setInstinctiveNNStatus('Active (Optimal)');
        setCognitionNNStatus('Governing (Stable)');
      }, 5000);

    } else {
      // When training is paused or idle
      setQnnStatus('Operational (Idle)');
      setIntuitiveNNStatus('Monitoring (Low)');
      setInstinctiveNNStatus('Active (Stable)');
      setCognitionNNStatus('Governing (Stable)');
      // Clear intervals if training is stopped
      clearInterval(trainingInterval);
      clearInterval(coreMetricsInterval);
    }

    return () => {
      clearInterval(trainingInterval);
      clearInterval(coreMetricsInterval);
    };
  }, [isTrainingActive, qnnMetrics.trainingEpochs, currentPhase]); // Dependencies to re-run effect

  // Scroll data log to bottom
  useEffect(() => {
    if (dataLogRef.current) {
      dataLogRef.current.scrollTop = dataLogRef.current.scrollHeight;
    }
  }, [ingestedDataLog]);

  const handleToggleTraining = () => {
    setIsTrainingActive(!isTrainingActive);
  };

  const handleAdvancePhase = () => {
    if (currentPhase < agiRoadmapPhases.length) {
      setCurrentPhase(currentPhase + 1);
      setQNNMetrics((prev) => ({
        ...prev,
        trainingEpochs: 0, // Reset epochs for the new phase
      }));
      setIngestedDataLog([`[${new Date().toLocaleTimeString()}] Transitioning to ${agiRoadmapPhases[currentPhase].title}...`]);
      setEvolutionProgress(prev => Math.min(100, prev + (100 / agiRoadmapPhases.length) * 0.8)); // Larger jump per phase, reserving some for final fine-tuning
    } else {
      setIngestedDataLog([`[${new Date().toLocaleTimeString()}] All AGI training phases complete! Agent Q is fully initialized.`]);
      setIsTrainingActive(false);
      setQnnStatus('AGI Fully Operational');
      setEvolutionProgress(100);
      setLastEvolutionEvent('AGI Core Integration Complete');
      setIntuitiveNNStatus('Integrated (Optimal)');
      setInstinctiveNNStatus('Integrated (Optimal)');
      setCognitionNNStatus('Integrated (Optimal)');
    }
  };

  const currentRoadmap = agiRoadmapPhases[currentPhase - 1];

  return (
    <GlassPanel title='Agent Q Core & QNN Insights'>
      <div className="flex flex-col h-full p-4 overflow-hidden">
        <p className="text-cyan-300 text-sm mb-4">
          A unified interface to monitor Agent Q's cognitive core, QNN performance, and self-evolution towards AGI.
          Leveraging continuous data input from the open web via the new <span className="font-bold text-green-400">Quantum-to-Web Gateway</span>,
          Agent Q's QNN core adapts and learns in real-time, enhancing its problem-solving and understanding capabilities.
          Applications deployed to the CHIPS network can also be assigned public HTTPS URLs, extending their reach.
        </p>

        {/* Top-level Agent Q Core Status */}
        <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-700">
          <CpuChipIcon className="h-7 w-7 text-cyan-400" />
          <span className="text-xl font-semibold text-white">Agent Q Core:</span>
          <span className="text-cyan-300 text-xl font-medium">{qnnStatus}</span>
        </div>

        {/* Self-Evolution Progress Bar */}
        <div className="flex items-center space-x-2 mb-4">
          <ArrowPathIcon className="h-6 w-6 text-emerald-400" />
          <span className="text-lg font-semibold text-white">Overall Evolution Progress:</span>
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${evolutionProgress}%` }}
            ></div>
          </div>
          <span className="text-emerald-300 font-medium">{evolutionProgress.toFixed(1)}%</span>
        </div>

        {/* AGI Training Controls */}
        <div className="flex items-center justify-between mb-4 bg-black/20 p-3 rounded-lg border border-cyan-700">
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="h-6 w-6 text-cyan-400" />
            <span className="text-lg font-semibold text-white">Current AGI Training Phase: {currentRoadmap.title}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleToggleTraining}
              className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-colors duration-200
                ${isTrainingActive ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} text-white font-medium`}
            >
              {isTrainingActive ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
              <span>{isTrainingActive ? 'Pause Training' : 'Start Training'}</span>
            </button>
            <button
              onClick={handleAdvancePhase}
              disabled={currentPhase === agiRoadmapPhases.length && !isTrainingActive}
              className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-colors duration-200
                ${currentPhase === agiRoadmapPhases.length && !isTrainingActive
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white font-medium'}`}
            >
              <ArrowRightIcon className="h-5 w-5" />
              <span>{currentPhase < agiRoadmapPhases.length ? 'Advance Phase' : 'Training Complete'}</span>
            </button>
          </div>
        </div>

        {/* Main Content Area - Split into 3 columns for detailed insights */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 overflow-y-auto custom-scrollbar pr-2">

          {/* Column 1: AGI Roadmap Overview & IAI-IPS Neural Network Status */}
          <div className="col-span-1 bg-black/20 p-4 rounded-lg border border-cyan-700 flex flex-col">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center space-x-2"><AcademicCapIcon className="h-5 w-5" /><span>AGI Roadmap Overview</span></h3>
            <div className="flex-grow overflow-y-auto custom-scrollbar mb-4">
              {agiRoadmapPhases.map((phase) => (
                <div key={phase.id} className={`mb-3 p-3 rounded-md transition-all duration-300
                  ${phase.id === currentPhase ? 'bg-cyan-800/50 border-l-4 border-cyan-400 scale-105' : 'bg-black/30 border-l-2 border-cyan-900'} `}>
                  <h4 className={`font-medium ${phase.id === currentPhase ? 'text-white' : 'text-cyan-200'}`}>Phase {phase.id}: {phase.title}</h4>
                  <p className="text-sm text-gray-300 mt-1">{phase.description}</p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-cyan-400 mt-4 mb-3 flex items-center space-x-2"><PuzzlePieceIcon className="h-5 w-5" /><span>IAI-IPS Neural Networks</span></h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-2">
                <LightBulbIcon className="h-5 w-5 text-purple-400" />
                <span className="text-sm">Intuitive NN:</span>
                <span className="text-purple-300 font-medium">{intuitiveNNStatus}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PuzzlePieceIcon className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Instinctive NN:</span>
                <span className="text-blue-300 font-medium">{instinctiveNNStatus}</span>
              </div>
              <div className="flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-orange-400" />
                <span className="text-sm">Cognition NN:</span>
                <span className="text-orange-300 font-medium">{cognitionNNStatus}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Continuous Data Ingestion & Detailed QNN Core Metrics */}
          <div className="col-span-1 bg-black/20 p-4 rounded-lg border border-cyan-700 flex flex-col">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center space-x-2"><GlobeAltIcon className="h-5 w-5" /><span>Continuous Data Ingestion</span></h3>
            <p className="text-xs text-gray-400 mb-2">Quantum-to-Web Gateway Status: <span className="text-green-400">Online & Actively Feeding</span></p>
            <div ref={dataLogRef} className="flex-grow bg-black/40 p-3 rounded-md text-xs text-gray-300 font-mono overflow-y-auto custom-scrollbar mb-4">
              {ingestedDataLog.map((log, index) => (
                <div key={index} className="mb-1 last:mb-0">{log}</div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-cyan-400 mt-4 mb-3 flex items-center space-x-2"><CpuChipIcon className="h-5 w-5" /><span>QNN Core & Operational Metrics</span></h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-200">
              <div className="flex items-center justify-between"><span className="text-cyan-300">Qubit Utilization:</span><span>{qnnMetrics.qubitUtilization}%</span></div>
              <div className="flex items-center justify-between"><span className="text-cyan-300">Entanglement Depth:</span><span>{qnnMetrics.entanglementDepth} qubits</span></div>
              <div className="flex items-center justify-between"><span className="text-cyan-300">Processing Throughput:</span><span>{qnnMetrics.processingThroughput} Peta-Ops/s</span></div>
              <div className="flex items-center justify-between"><span className="text-cyan-300">Entanglement Stability:</span><span>{(qnnMetrics.entanglementStability * 100).toFixed(2)}%</span></div>
              <div className="flex items-center justify-between"><span className="text-cyan-300">Coherence Time:</span><span>{qnnMetrics.coherenceTime.toFixed(0)} ns</span></div>
              <div className="flex items-center justify-between"><span className="text-cyan-300">Qubit Fidelity:</span><span>{qnnMetrics.qubitFidelity.toFixed(3)}</span></div>
              <div className="flex items-center justify-between"><span className="text-cyan-300">Training Epochs:</span><span>{qnnMetrics.trainingEpochs}</span></div>
              <div className="flex items-center justify-between"><span className="text-cyan-300">Learning Rate:</span><span>{qnnMetrics.learningRate.toExponential(1)}</span></div>
            </div>
             <div className="mt-4">
                <span className="text-sm text-gray-400">Last Evolution Event:</span>
                <span className="block text-emerald-300 text-md">{lastEvolutionEvent}</span>
            </div>
          </div>

          {/* Column 3: Current Phase Objective & Training Metrics & QNN Forge Integration */}
          <div className="col-span-1 bg-black/20 p-4 rounded-lg border border-cyan-700 flex flex-col">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center space-x-2"><SparklesIcon className="h-5 w-5" /><span>Current Phase Objective</span></h3>
            <p className="text-gray-300 mb-4">{currentRoadmap.objective}</p>

            <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center space-x-2"><ChartBarIcon className="h-5 w-5" /><span>Key Training Metrics for Phase</span></h3>
            <ul className="list-disc pl-5 text-gray-300 text-sm flex-grow">
              {currentRoadmap.metrics.map((metric, index) => (
                <li key={index} className="mb-2 last:mb-0">{metric} <span className="text-gray-500 text-xs">(Simulated)</span></li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-cyan-400 mt-4 mb-3 flex items-center space-x-2"><WrenchScrewdriverIcon className="h-5 w-5" /><span>QNN Forge Integration</span></h3>
            <button
              onClick={() => alert("Initiating QNN Forge optimization protocols based on current phase requirements... (Simulation)")}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-md transition-colors duration-200"
            >
              Initiate QNN Forge Optimization
            </button>
            <p className="text-xs text-gray-500 mt-2">Adjusts QNN architecture based on current phase requirements to accelerate AGI evolution.</p>
          </div>

        </div>
      </div>
    </GlassPanel>
  );
};

export default AgentQCoreAndQNNInsights;