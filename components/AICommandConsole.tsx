import React, { useState, useEffect } from 'react';
import GlassPanel from './GlassPanel';
import { CpuChipIcon, ShieldCheckIcon, CloudArrowUpIcon, BeakerIcon, ChartBarIcon, CheckCircleIcon, PlayIcon, Cog6ToothIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const AICommandConsole: React.FC = () => {
  // State for simulated live data
  const [qubitUtilization, setQubitUtilization] = useState(87);
  const [entanglementStability, setEntanglementStability] = useState(99.8);
  const [qipsThroughput, setQipsThroughput] = useState(1.2); // M ops/s
  const [lastScanTime, setLastScanTime] = useState(new Date());
  const [anomalyCount, setAnomalyCount] = useState(0);
  const [criticalAnomalies, setCriticalAnomalies] = useState(0); // Keeping critical at 0 for simulation
  const [pendingPatches, setPendingPatches] = useState(3);
  const [trainingAccuracy, setTrainingAccuracy] = useState(85.0); // Current simulated accuracy
  const [gatewayOperational, setGatewayOperational] = useState(true); // Gateway status

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate Qubit Utilization: fluctuate between 85-90%
      setQubitUtilization(prev => parseFloat((85 + Math.random() * 5).toFixed(1)));

      // Simulate Entanglement Stability: fluctuate between 99.5-99.9%
      setEntanglementStability(prev => parseFloat((99.5 + Math.random() * 0.4).toFixed(1)));

      // Simulate QIPS Throughput: fluctuate between 1.1-1.3 M ops/s
      setQipsThroughput(prev => parseFloat((1.1 + Math.random() * 0.2).toFixed(1)));

      // Simulate Last Scan Time
      setLastScanTime(new Date());

      // Simulate Anomalies: small chance to show 1 anomaly temporarily
      if (Math.random() < 0.05) { // 5% chance
        setAnomalyCount(1);
      } else {
        setAnomalyCount(0);
      }

      // Simulate Pending Patches: decrease over time, minimum 0
      setPendingPatches(prev => Math.max(0, prev - (Math.random() < 0.1 ? 1 : 0))); // 10% chance to decrease by 1

      // Simulate AGI Training Progress: gradually increase accuracy towards 95%
      setTrainingAccuracy(prev => {
        if (prev < 95) {
          return parseFloat((prev + Math.random() * 0.1).toFixed(1)); // Increase slowly
        }
        return 95.0; // Cap at 95%
      });

      // Gateway status remains operational for this simulation
      setGatewayOperational(true);

    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <GlassPanel title="AI Operations">
      <div className="p-4 space-y-6 text-cyan-300">
        {/* Agent Q Core Status */}
        <div className="border-b border-cyan-700 pb-4">
          <h3 className="text-xl font-semibold mb-3 flex items-center">
            <CpuChipIcon className="h-6 w-6 mr-2 text-cyan-400" /> Agent Q Core Status
          </h3>
          <p className="text-sm">Agent Q (v3.11) online. Cognitive core (QNN) operational.</p>
          <div className="grid grid-cols-2 gap-y-2 mt-3 text-sm">
            <div className="flex items-center"><ChartBarIcon className="h-4 w-4 mr-2 text-cyan-500" />Qubit utilization: <span className="font-bold ml-1">{qubitUtilization}%</span></div>
            <div className="flex items-center"><ShieldCheckIcon className="h-4 w-4 mr-2 text-cyan-500" />Entanglement stability: <span className="font-bold ml-1">{entanglementStability}%</span></div>
            <div className="flex items-center"><PlayIcon className="h-4 w-4 mr-2 text-cyan-500" />QIPS throughput: <span className="font-bold ml-1">{qipsThroughput}M ops/s</span></div>
          </div>
        </div>

        {/* AGI Training Roadmap */}
        <div className="border-b border-cyan-700 pb-4">
          <h3 className="text-xl font-semibold mb-3 flex items-center">
            <BeakerIcon className="h-6 w-6 mr-2 text-cyan-400" /> AGI Training Roadmap
          </h3>
          <p className="text-sm font-semibold">Phase 1 (Active):</p>
          <ul className="list-disc list-inside text-sm ml-2 mb-2">
            <li>Contextual Deep Learning & Quantum Language Modeling.</li>
            <li>Q-Lang script generation & optimization (Current focus)</li>
            <li>Multi-modal data integration</li>
            <li>Real-time environmental adaptation</li>
          </ul>
          <p className="text-sm font-semibold mt-3">Phase 2 (Upcoming):</p>
          <ul className="list-disc list-inside text-sm ml-2">
            <li>Instinctive Problem Solving & Autonomous Quantum Algorithm Design.</li>
            <li>QIPS pipeline enhancement</li>
            <li>Self-modifying QNN architectures</li>
            <li>Ethical AI constraint learning</li>
          </ul>
          <p className="text-sm mt-3 flex items-center">
            <Cog6ToothIcon className="h-4 w-4 mr-2 text-cyan-500" />
            <span className="font-bold mr-1">Next milestone:</span> {trainingAccuracy.toFixed(1)}% accuracy in complex Q-Lang circuit prediction.
            {trainingAccuracy >= 95 && <CheckCircleIcon className="h-5 w-5 ml-2 text-green-400" />}
          </p>
          <button className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white text-sm transition-colors duration-200">
            Manage AGI Training Roadmap
          </button>
        </div>

        {/* Data Patching & Integrity */}
        <div className="border-b border-cyan-700 pb-4">
          <h3 className="text-xl font-semibold mb-3 flex items-center">
            <CloudArrowUpIcon className="h-6 w-6 mr-2 text-cyan-400" /> Data Patching & Integrity
          </h3>
          <p className="text-sm font-semibold">Quantum Data Integrity Checks:</p>
          <p className="text-sm ml-2">Performing real-time error correction using quantum error-correcting codes.</p>
          <p className="text-sm ml-2 mt-1">Last full scan: <span className="font-bold">{formatTime(lastScanTime)}</span>.</p>
          <p className="text-sm ml-2">Detected anomalies: <span className="font-bold">{anomalyCount}</span> (Critical: <span className="font-bold">{criticalAnomalies}</span>, Minor: <span className="font-bold">{anomalyCount}</span>)</p>

          <p className="text-sm font-semibold mt-3">Data Patching Status:</p>
          <p className="text-sm ml-2">QNN-driven adaptive data augmentation and state re-synchronization.</p>
          <p className="text-sm ml-2 mt-1 flex items-center">
            Pending patches: <span className="font-bold ml-1">{pendingPatches}</span>
            {pendingPatches === 0 && <CheckCircleIcon className="h-5 w-5 ml-2 text-green-400" />}
            {pendingPatches > 0 && <span className="ml-1 text-red-400">(Scheduled for next maintenance window)</span>}
          </p>
          <p className="italic text-xs mt-2 text-cyan-400">*Using quantum entanglement for secure and efficient data distribution across CHIPS network.*</p>
        </div>

        {/* System Diagnostics */}
        <div className="border-b border-cyan-700 pb-4">
          <h3 className="text-xl font-semibold mb-3 flex items-center">
            <Cog6ToothIcon className="h-6 w-6 mr-2 text-cyan-400" /> System Diagnostics
          </h3>
          <p className="text-sm">Running continuous self-diagnostic protocols.</p>
          <p className="text-sm mb-2">No critical alerts.</p>
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white text-sm transition-colors duration-200">
            Access QNN Forge for core evolution and training
          </button>
        </div>

        {/* Quantum-to-Web Gateway */}
        <div>
          <h3 className="text-xl font-semibold mb-3 flex items-center">
            <GlobeAltIcon className="h-6 w-6 mr-2 text-cyan-400" /> Quantum-to-Web Gateway
          </h3>
          <p className="text-sm">Gateway status: <span className={`font-bold ${gatewayOperational ? 'text-green-400' : 'text-red-400'}`}>{gatewayOperational ? 'Operational' : 'Offline'}</span>.</p>
          <p className="text-sm">Public-facing HTTPS URL assignment enabled for CHIPS applications.</p>
          <p className="italic text-xs mt-2 text-cyan-400">*Manage public deployments via the 'Public Deployment & Optimization Hub' panel.*</p>
        </div>
      </div>
    </GlassPanel>
  );
};

export default AICommandConsole;