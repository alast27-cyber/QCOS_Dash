import React, { useState } from 'react';
import GlassPanel from './GlassPanel';
import { ChartBarIcon, MagnifyingGlassIcon, PlayIcon, ActivityIcon, LoaderIcon } from './Icons';

const QuantumMonteCarloFinance: React.FC = () => {
  // State for Stock Performance Simulation
  const [stockTicker, setStockTicker] = useState<string>('');
  const [simulationHorizon, setSimulationHorizon] = useState<number>(30); // Days
  const [numPaths, setNumPaths] = useState<number>(1024);
  const [simResults, setSimResults] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // State for Investment Opportunity Scanner
  const [riskTolerance, setRiskTolerance] = useState<string>('medium');
  const [targetReturn, setTargetReturn] = useState<number>(10); // Percentage
  const [stocksToScan, setStocksToScan] = useState<string>('AAPL, MSFT, GOOG, NVDA');
  const [scanResults, setScanResults] = useState<any[] | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleRunStockSimulation = () => {
    if (!stockTicker) return;
    setIsSimulating(true);
    setSimResults(null);
    setTimeout(() => {
      setSimResults({
        projectedRange: '[$150.23 - $181.45]',
        vaR: '5.1% ($7.82)',
        expectedReturn: '8.2%',
        chartData: 'Visual chart data for price trajectory would be rendered here.'
      });
      setIsSimulating(false);
    }, 3000);
  };

  const handleScanOpportunities = () => {
    if (!stocksToScan) return;
    setIsScanning(true);
    setScanResults(null);
    setTimeout(() => {
      setScanResults([
        { ticker: 'MSFT', score: 92, projection: '+12%', risk: 'Low' },
        { ticker: 'AAPL', score: 88, projection: '+10%', risk: 'Medium' },
        { ticker: 'NVDA', score: 75, projection: '+15%', risk: 'High' },
      ]);
      setIsScanning(false);
    }, 4000);
  };

  const inputClasses = "w-full p-2 bg-black/30 border border-cyan-800 rounded-md text-white placeholder:text-cyan-600 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition duration-150 ease-in-out disabled:opacity-50";
  const buttonClasses = "w-full holographic-button flex items-center justify-center text-lg font-bold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  
  return (
    <GlassPanel title="QMC Finance: Advanced Analytics">
      <div className="p-4 h-full overflow-y-auto space-y-6">
        {/* Stock-Specific Performance Simulation */}
        <div className="p-4 bg-black/20 rounded-lg shadow-inner border border-cyan-800/50">
          <h3 className="text-xl font-semibold text-cyan-200 mb-4 flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-3 text-cyan-400" /> Stock Performance Simulation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="stockTicker" className="block text-sm font-medium text-cyan-300 mb-1">Stock Ticker</label>
              <input type="text" id="stockTicker" value={stockTicker} onChange={(e) => setStockTicker(e.target.value.toUpperCase())} placeholder="e.g., QCOS, TSLA" className={inputClasses} disabled={isSimulating}/>
            </div>
            <div>
              <label htmlFor="simulationHorizon" className="block text-sm font-medium text-cyan-300 mb-1">Horizon (Days)</label>
              <input type="number" id="simulationHorizon" value={simulationHorizon} onChange={(e) => setSimulationHorizon(Number(e.target.value))} min="1" className={inputClasses} disabled={isSimulating}/>
            </div>
            <div>
              <label htmlFor="numPaths" className="block text-sm font-medium text-cyan-300 mb-1">Quantum Paths</label>
              <input type="number" id="numPaths" value={numPaths} onChange={(e) => setNumPaths(Number(e.target.value))} min="128" step="128" className={inputClasses} disabled={isSimulating}/>
            </div>
          </div>
          <button onClick={handleRunStockSimulation} className={`${buttonClasses} bg-cyan-500/30 hover:bg-cyan-500/40 border border-cyan-500/50 text-cyan-200`} disabled={isSimulating || !stockTicker}>
            {isSimulating ? <LoaderIcon className="h-6 w-6 mr-2 animate-spin" /> : <PlayIcon className="h-6 w-6 mr-2" />}
            {isSimulating ? 'Simulating...' : 'Run Quantum Simulation'}
          </button>

          {isSimulating && (
            <div className="mt-6 text-center text-cyan-400">
                <p>Contacting QPU... Executing quantum amplitude estimation circuits.</p>
            </div>
          )}

          {simResults && !isSimulating && (
            <div className="mt-6 p-4 bg-black/30 border border-cyan-900 rounded-md text-cyan-200 animate-fade-in">
              <h4 className="font-semibold text-lg text-cyan-100 mb-2">Simulation Results for {stockTicker}:</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-900/50 p-2 rounded-md">
                    <p className="text-xs text-cyan-400">Projected Range</p>
                    <p className="font-mono text-white">{simResults.projectedRange}</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded-md">
                    <p className="text-xs text-cyan-400">Value at Risk (VaR)</p>
                    <p className="font-mono text-red-400">{simResults.vaR}</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded-md">
                    <p className="text-xs text-cyan-400">Expected Return</p>
                    <p className="font-mono text-green-400">{simResults.expectedReturn}</p>
                </div>
              </div>
              <div className="mt-3 text-xs italic text-cyan-500 text-center">
                {simResults.chartData}
              </div>
            </div>
          )}
        </div>

        {/* Investment Opportunity Scanner */}
        <div className="p-4 bg-black/20 rounded-lg shadow-inner border border-cyan-800/50">
          <h3 className="text-xl font-semibold text-cyan-200 mb-4 flex items-center">
            <MagnifyingGlassIcon className="h-6 w-6 mr-3 text-cyan-400" /> Investment Opportunity Scanner
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="riskTolerance" className="block text-sm font-medium text-cyan-300 mb-1">Risk Tolerance</label>
              <select id="riskTolerance" value={riskTolerance} onChange={(e) => setRiskTolerance(e.target.value)} className={inputClasses} disabled={isScanning}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="targetReturn" className="block text-sm font-medium text-cyan-300 mb-1">Target Return (%)</label>
              <input type="number" id="targetReturn" value={targetReturn} onChange={(e) => setTargetReturn(Number(e.target.value))} min="0" step="1" className={inputClasses} disabled={isScanning} />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="stocksToScan" className="block text-sm font-medium text-cyan-300 mb-1">Stocks to Analyze (comma-separated)</label>
              <textarea id="stocksToScan" value={stocksToScan} onChange={(e) => setStocksToScan(e.target.value.toUpperCase())} placeholder="e.g., AAPL, MSFT, GOOG, AMZN" rows={1} className={`${inputClasses} resize-none`} disabled={isScanning}/>
            </div>
          </div>
          <button onClick={handleScanOpportunities} className={`${buttonClasses} bg-purple-500/30 hover:bg-purple-500/40 border border-purple-500/50 text-purple-200`} disabled={isScanning || !stocksToScan}>
             {isScanning ? <LoaderIcon className="h-6 w-6 mr-2 animate-spin" /> : <ActivityIcon className="h-6 w-6 mr-2" />}
            {isScanning ? 'Scanning...' : 'Scan Quantum Opportunities'}
          </button>

          {isScanning && (
            <div className="mt-6 text-center text-cyan-400">
                <p>Executing parallelized VQE algorithms to assess risk profiles...</p>
            </div>
          )}

          {scanResults && !isScanning && (
            <div className="mt-6 p-4 bg-black/30 border border-cyan-900 rounded-md text-cyan-200 animate-fade-in">
              <h4 className="font-semibold text-lg text-cyan-100 mb-2">Top Investment Opportunities:</h4>
              <ul className="space-y-2">
                {scanResults.map((item: any) => (
                  <li key={item.ticker} className="grid grid-cols-4 items-center bg-slate-900/50 p-2 rounded-md text-sm">
                    <strong className="text-cyan-300 font-mono col-span-1">{item.ticker}:</strong>
                    <span className="col-span-1">Score <span className="font-bold text-white">{item.score}</span></span>
                    <span className="col-span-1">Return <span className="font-bold text-green-400">{item.projection}</span></span>
                    <span className="col-span-1">Risk <span className="font-bold text-yellow-400">{item.risk}</span></span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-xs italic text-cyan-500 text-center">
                Opportunities ranked by quantum-simulated performance and risk profiles.
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassPanel>
  );
};

export default QuantumMonteCarloFinance;
