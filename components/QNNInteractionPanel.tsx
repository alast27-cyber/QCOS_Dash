import React, { useState } from 'react';
import GlassPanel from './GlassPanel';
import { CpuChipIcon, SparklesIcon, CircleStackIcon } from './Icons';

const QNNInteractionPanel: React.FC = () => {
  const [trainingStatus, setTrainingStatus] = useState('Idle');

  const initiateTraining = () => {
    setTrainingStatus('Training in Progress...');
    setTimeout(() => {
      setTrainingStatus('Training Complete');
    }, 3000); // Simulate training time
  };

  return (
    <GlassPanel title='QNN Core & Evolution'>
      <div className="p-4 space-y-4 text-cyan-200 h-full flex flex-col">
        <div className="flex items-center space-x-2">
          <CpuChipIcon className="h-6 w-6 text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-300">QNN Core Metrics</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p className="flex items-center"><CircleStackIcon className="h-4 w-4 mr-2 text-cyan-500" /> Coherence Index: <span className="ml-auto text-cyan-100">0.985</span></p>
          <p className="flex items-center"><CircleStackIcon className="h-4 w-4 mr-2 text-cyan-500" /> Entanglement Depth: <span className="ml-auto text-cyan-100">12</span></p>
          <p className="flex items-center"><CircleStackIcon className="h-4 w-4 mr-2 text-cyan-500" /> Neuron Count: <span className="ml-auto text-cyan-100">2048Q</span></p>
          <p className="flex items-center"><CircleStackIcon className="h-4 w-4 mr-2 text-cyan-500" /> Processing Speed: <span className="ml-auto text-cyan-100">3.2 P-QFLOPs</span></p>
        </div>

        <div className="border-t border-cyan-800 pt-4 mt-4 flex-grow flex flex-col">
          <div className="flex items-center space-x-2 mb-3">
            <SparklesIcon className="h-6 w-6 text-cyan-400" />
            <h3 className="text-lg font-semibold text-cyan-300">QNN Forge Training</h3>
          </div>
          <p className="text-sm mb-3">Training Status: <span className={`font-medium ${trainingStatus.includes('Progress') ? 'text-yellow-300' : trainingStatus.includes('Complete') ? 'text-green-300' : 'text-cyan-100'}`}>{trainingStatus}</span></p>
          <div className="flex-grow"></div>
          <button
            onClick={initiateTraining}
            disabled={trainingStatus.includes('Progress')}
            className="w-full holographic-button bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {trainingStatus.includes('Progress') ? 'Training...' : 'Initiate QNN Forge Training'}
          </button>
        </div>
      </div>
    </GlassPanel>
  );
};

export default QNNInteractionPanel;
