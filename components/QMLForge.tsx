import React, { useState, useEffect } from 'react';
import GlassPanel from './GlassPanel';
import {
  ChevronDownIcon, CodeBracketIcon, SparklesIcon, PlayIcon, StopIcon, ChartBarIcon,
  GlobeIcon, RocketLaunchIcon, CheckCircle2Icon, CpuChipIcon
} from './Icons';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// --- Type Definitions ---
interface MetricPoint {
  epoch: number;
  accuracy: number;
  loss: number;
}

// --- Combined QML Forge Component ---
const QMLForge: React.FC = () => {
  // State from QMLTemplateGenerator
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [numFeatures, setNumFeatures] = useState<number>(2);
  const [circuitDepth, setCircuitDepth] = useState<number>(1);
  const [generatedQLang, setGeneratedQLang] = useState<string>('');

  // State from QMLSimulationVisualizer
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);

  // State from QMLWebGatewayDeployment
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'in-progress' | 'success' | 'error'>('idle');
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [appName, setAppName] = useState<string>('qml-model-inference');
  
  const simulationIntervalRef = React.useRef<number | null>(null);

  // --- Logic from QMLTemplateGenerator ---
  const generateQSVCQLang = () => {
    const qsvcScript = `QREG q[${numFeatures}]; // Quantum register for features
CREG c[${numFeatures}]; // Classical register for measurement
PARAM THETA[${numFeatures * circuitDepth * 2}]; // Example: Parameters for variational circuit

ALLOC q, c;

// ZZFeatureMap
FUNC apply_feature_map(qbits, features) {
    FOR i FROM 0 TO ${numFeatures - 1} {
        OP::H qbits[i];
        OP::RZ features[i], qbits[i]; // Encoding features
    }
    FOR i FROM 0 TO ${numFeatures - 2} {
        OP::CZ qbits[i], qbits[i+1];
    }
}

// Basic Variational Circuit (e.g., repeating block of Ry and CZ)
FUNC apply_variational_circuit(qbits, params, depth) {
    FOR d FROM 0 TO depth-1 {
        FOR i FROM 0 TO ${numFeatures - 1} {
            OP::RY params[d * ${numFeatures} + i], qbits[i];
        }
        FOR i FROM 0 TO ${numFeatures - 2} {
            OP::CZ qbits[i], qbits[i+1];
        }
    }
}

EXECUTE {
    // Assume 'DATA_FEATURES' is provided externally during execution
    apply_feature_map(q, DATA_FEATURES);
    apply_variational_circuit(q, THETA, ${circuitDepth});
    MEASURE q -> c; // For classification output
}
`;
    setGeneratedQLang(qsvcScript);
  };

  // --- Logic from QMLSimulationVisualizer (adapted for Recharts) ---
  const stopSimulation = () => {
    setIsSimulating(false);
    if(simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
  };
    
  const simulateTraining = () => {
    setIsSimulating(true);
    setMetrics([]);

    let currentEpoch = 0;
    simulationIntervalRef.current = window.setInterval(() => {
      if (currentEpoch >= 20) {
        stopSimulation();
        return;
      }

      currentEpoch++;
      setMetrics(prev => {
          const lastMetric = prev[prev.length - 1];
          const newAccuracy = Math.min(0.95, lastMetric ? lastMetric.accuracy + Math.random() * 0.03 : 0.6);
          const newLoss = Math.max(0.1, lastMetric ? lastMetric.loss - Math.random() * 0.05 : 1.5);
          return [...prev, { epoch: currentEpoch, accuracy: newAccuracy, loss: newLoss }];
      });
    }, 500);
  };
  
  useEffect(() => {
      return () => {
          if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      }
  }, []);

  // --- Logic from QMLWebGatewayDeployment ---
  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus('in-progress');
    setPublicUrl('');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const generatedUrl = `https://qcos.apps.web/${appName.toLowerCase().replace(/\s/g, '-')}-${Math.random().toString(36).substring(2, 8)}`;
    setPublicUrl(generatedUrl);
    setDeploymentStatus('success');
    setIsDeploying(false);
  };
  
  const chartOptions = {
      stroke: 'rgb(150, 230, 230)',
      tick: { color: 'rgb(150, 230, 230)', fontSize: 10 },
      grid: { stroke: 'rgba(50, 100, 100, 0.3)' },
      label: { fill: 'rgb(100, 200, 200)', fontSize: 12 }
  };

  return (
    <GlassPanel title="QML Forge">
        <div className="p-4 h-full grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Controls Column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-black/20 p-4 rounded-lg border border-cyan-800/50">
                    <h3 className="text-lg font-semibold text-cyan-300 flex items-center mb-3"><SparklesIcon className="h-5 w-5 mr-2" /> Q-Lang Template Generator</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <label htmlFor="template-select" className="text-cyan-300 text-sm">Template:</label>
                          <select id="template-select" className="flex-grow bg-black/40 border border-cyan-700 text-cyan-200 rounded p-2 focus:ring-cyan-500 focus:border-cyan-500" value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
                            <option value="">-- Choose --</option>
                            <option value="qsvc-zz">Quantum SVC (ZZFeatureMap)</option>
                            <option value="qnn-ansatz">Basic QNN Ansatz</option>
                          </select>
                        </div>
                        {selectedTemplate === 'qsvc-zz' && (
                          <div className="space-y-3 animate-fade-in">
                            <div className="flex items-center justify-between">
                              <label htmlFor="num-features" className="text-cyan-300 text-sm">Num Features:</label>
                              <input id="num-features" type="number" min="1" max="8" value={numFeatures} onChange={(e) => setNumFeatures(parseInt(e.target.value))} className="w-24 bg-black/40 border border-cyan-700 text-cyan-200 rounded p-2" />
                            </div>
                            <div className="flex items-center justify-between">
                              <label htmlFor="circuit-depth" className="text-cyan-300 text-sm">Circuit Depth:</label>
                              <input id="circuit-depth" type="number" min="1" max="5" value={circuitDepth} onChange={(e) => setCircuitDepth(parseInt(e.target.value))} className="w-24 bg-black/40 border border-cyan-700 text-cyan-200 rounded p-2" />
                            </div>
                            <button onClick={generateQSVCQLang} className="holographic-button mt-2 w-full flex items-center justify-center px-4 py-2 bg-cyan-600/30 hover:bg-cyan-700/50 text-white rounded-md transition-colors"><SparklesIcon className="h-5 w-5 mr-2" /> Generate Q-Lang</button>
                          </div>
                        )}
                    </div>
                </div>

                <div className="bg-black/20 p-4 rounded-lg border border-cyan-800/50">
                    <h3 className="text-lg font-semibold text-cyan-300 flex items-center mb-3"><RocketLaunchIcon className="h-5 w-5 mr-2" /> QML Model Public Deployment</h3>
                    <p className="text-cyan-400 text-xs mb-3">Deploy your trained QML model as a public HTTPS endpoint via the Quantum-to-Web Gateway.</p>
                     <div className="space-y-3">
                        <div>
                            <label htmlFor="app-name" className="text-cyan-300 text-sm mb-1 block">Application Name:</label>
                            <input id="app-name" type="text" value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full bg-black/40 border border-cyan-700 text-cyan-200 rounded p-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., my-qml-classifier" disabled={isDeploying} />
                        </div>
                        <button onClick={handleDeploy} disabled={isDeploying || deploymentStatus === 'success'} className="holographic-button mt-2 w-full flex items-center justify-center px-4 py-2 rounded-md transition-colors bg-purple-600/30 hover:bg-purple-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                            {isDeploying ? <><CpuChipIcon className="h-5 w-5 mr-2 animate-pulse" /> Deploying...</> : <><RocketLaunchIcon className="h-5 w-5 mr-2" /> Deploy to Web</>}
                        </button>
                    </div>
                     {deploymentStatus === 'success' && publicUrl && (
                        <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded text-green-300 text-xs animate-fade-in">
                            <div className="flex items-center mb-1"><CheckCircle2Icon className="h-4 w-4 mr-2" /><p className="font-semibold">Deployment Successful!</p></div>
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="block text-cyan-400 underline break-all hover:text-cyan-200"><GlobeIcon className="h-4 w-4 inline-block mr-1" />{publicUrl}</a>
                        </div>
                    )}
                </div>
            </div>

            {/* Visualization Column */}
            <div className="lg:col-span-3 flex flex-col gap-4">
                 <div className="bg-black/20 p-4 rounded-lg border border-cyan-800/50 flex-grow flex flex-col min-h-0">
                    <h3 className="text-lg font-semibold text-cyan-300 flex items-center mb-3"><ChartBarIcon className="h-5 w-5 mr-2" /> QML Simulation & Metrics</h3>
                     <div className="flex justify-center space-x-4 mb-4">
                        <button onClick={simulateTraining} disabled={isSimulating} className="holographic-button flex-grow flex items-center justify-center px-4 py-2 rounded-md transition-colors bg-cyan-600/30 hover:bg-cyan-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed"><PlayIcon className="h-5 w-5 mr-2" /> Start Simulation</button>
                        <button onClick={stopSimulation} disabled={!isSimulating} className="holographic-button flex-grow flex items-center justify-center px-4 py-2 rounded-md transition-colors bg-red-600/30 hover:bg-red-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed"><StopIcon className="h-5 w-5 mr-2" /> Stop Simulation</button>
                    </div>
                    {metrics.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 flex-grow">
                            <div className="min-h-[150px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={metrics}><CartesianGrid {...chartOptions.grid} /><XAxis dataKey="epoch" {...chartOptions} /><YAxis {...chartOptions} domain={[0, 1]} /><Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgb(75, 192, 192)' }} /><Legend wrapperStyle={{ fontSize: '12px' }} /><Line type="monotone" dataKey="accuracy" stroke="#4ade80" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
                            <div className="min-h-[150px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={metrics}><CartesianGrid {...chartOptions.grid} /><XAxis dataKey="epoch" {...chartOptions} /><YAxis {...chartOptions} domain={[0, 'dataMax + 0.2']} /><Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgb(255, 99, 132)' }} /><Legend wrapperStyle={{ fontSize: '12px' }} /><Line type="monotone" dataKey="loss" stroke="#f87171" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
                        </div>
                    ) : (<p className="text-center text-cyan-500 flex-grow flex items-center justify-center">Press "Start Simulation" to view real-time QML training metrics.</p>)}
                </div>
                 <div className="bg-black/20 p-4 rounded-lg border border-cyan-800/50 min-h-[150px] flex flex-col">
                    <h3 className="text-lg font-semibold text-cyan-300 flex items-center mb-2"><CodeBracketIcon className="h-5 w-5 mr-2" /> Generated Q-Lang Script</h3>
                    <div className="flex-grow overflow-auto">
                        <pre className="p-3 bg-black/40 border border-cyan-800 rounded text-xs overflow-x-auto text-green-300 font-mono h-full">
                            <code>{generatedQLang || "// Press 'Generate Q-Lang' to create a script..."}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    </GlassPanel>
  );
};

export default QMLForge;
