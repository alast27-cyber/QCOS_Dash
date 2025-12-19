
import React, { useState } from 'react';
import GlassPanel from './GlassPanel';
import { AtomIcon, BeakerIcon, ChartBarIcon, PlayIcon, StopIcon, MagnifyingGlassIcon, UploadCloudIcon } from './Icons';

// --- Detail View for Simulation Report ---
const SimulationReportDetail = ({ result }: { result: any }) => {
    return (
        <div className="bg-black/20 p-4 animate-fade-in">
            <h4 className="font-semibold text-cyan-200 mb-3 text-base">Detailed Simulation Report</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Binding Affinity Profile */}
                <div className="md:col-span-1 bg-cyan-950/50 p-3 rounded-md">
                    <h5 className="font-bold text-cyan-300 mb-2">Binding Affinity Profile</h5>
                    <div className="space-y-1">
                        {result.bindingDistribution.map((value: number, i: number) => (
                            <div key={i} className="flex items-center">
                                <span className="w-10 text-cyan-500">{`-${8 + i * 0.5}`}</span>
                                <div className="flex-grow bg-cyan-800/50 rounded-full h-2">
                                    <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-cyan-600 mt-2 text-center">Energy Distribution (kcal/mol)</p>
                </div>

                {/* Quantum & Computational Details */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-cyan-950/50 p-3 rounded-md">
                        <h5 className="font-bold text-cyan-300 mb-2">Quantum State Analysis</h5>
                        <p className="font-mono text-cyan-100 whitespace-nowrap">{result.finalState}</p>
                        <p className="text-cyan-600 mt-1">Final Qubit State Vector</p>
                    </div>
                     <div className="bg-cyan-950/50 p-3 rounded-md">
                        <h5 className="font-bold text-cyan-300 mb-2">Computational Details</h5>
                        <ul className="font-mono text-cyan-100 space-y-1">
                            <li>Qubits Utilized: {result.qubitsUsed}</li>
                            <li>Circuit Depth: {result.circuitDepth}</li>
                            <li>Sim Time (QPU): {result.simulationTime}</li>
                        </ul>
                    </div>
                    <div className="col-span-2 bg-cyan-950/50 p-3 rounded-md">
                        <h5 className="font-bold text-cyan-300 mb-2">Conformer Analysis</h5>
                        <p className="text-cyan-200">{result.conformerAnalysis}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const QBioMedDrugDiscovery: React.FC = () => {
    const [molecularStructure, setMolecularStructure] = useState<string | null>(null); // Stores actual structure data
    const [structureSource, setStructureSource] = useState<string | null>(null); // e.g., "PDB: 1ABC", "File: molecule.pdb"
    const [pdbIdInput, setPdbIdInput] = useState<string>('');
    const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'completed'>('idle');
    const [simulationResults, setSimulationResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataLoading, setDataLoading] = useState<boolean>(false); // For loading molecular data
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [expandedResultIndex, setExpandedResultIndex] = useState<number | null>(null);

    const processFile = (file: File | undefined) => {
        if (file && (file.name.toLowerCase().endsWith('.pdb') || file.name.toLowerCase().endsWith('.xyz') || file.name.toLowerCase().endsWith('.mol'))) {
            setDataLoading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                setMolecularStructure(e.target?.result as string);
                setStructureSource(`File: ${file.name}`);
                setDataLoading(false);
            };
            reader.readAsText(file);
        } else if (file) {
            alert("Unsupported file type. Please upload a .pdb, .xyz, or .mol file.");
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        processFile(event.target.files?.[0]);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(false);
        processFile(event.dataTransfer.files?.[0]);
    };


    const handleLoadFromPDB = async () => {
        if (!pdbIdInput.trim()) {
            alert("Please enter a PDB ID.");
            return;
        }
        setDataLoading(true);
        setMolecularStructure(null); // Clear previous data
        setStructureSource(null);

        try {
            // Simulate fetching from PDB. In a real application, you'd make an API call.
            console.log(`Attempting to load PDB ID: ${pdbIdInput}`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

            const dummyPDBContent = `
HEADER    DRUG TARGET COMPLEX
TITLE     SIMULATED PDB STRUCTURE FOR ${pdbIdInput.toUpperCase()}
... (full PDB content would be here) ...
ATOM      1  N   ALA A   1      21.220  17.770  19.530  1.00 12.00           N
ATOM      2  CA  ALA A   1      20.670  18.960  18.980  1.00 12.00           C
...
`;
            setMolecularStructure(dummyPDBContent); // Store the "fetched" content
            setStructureSource(`PDB ID: ${pdbIdInput.toUpperCase()}`);
            alert(`PDB ID ${pdbIdInput.toUpperCase()} loaded successfully (simulated).`);

        } catch (error) {
            console.error("Failed to load PDB data:", error);
            alert(`Failed to load PDB ID ${pdbIdInput.toUpperCase()}. Please check the ID.`);
            setMolecularStructure(null);
            setStructureSource(null);
        } finally {
            setDataLoading(false);
        }
    };

    const startSimulation = async () => {
        setLoading(true);
        setSimulationStatus('running');
        setSimulationResults([]); // Clear previous results
        setExpandedResultIndex(null); // Collapse any open reports
        // Simulate an asynchronous quantum simulation
        await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate QPU processing time

        const dummyResults = [
            { 
                molecule: structureSource || "Unknown Molecule", target: "Protein X", bindingEnergy: -8.5, quantumScore: 0.92,
                qubitsUsed: 58, circuitDepth: 120, simulationTime: '4.2s', finalState: '0.82|01⟩ - 0.57|10⟩',
                bindingDistribution: [10, 30, 45, 15],
                conformerAnalysis: "Lowest energy conformer shows strong hydrophobic interaction at active site C. Pi-stacking observed with Phenylalanine residue."
            },
            { 
                molecule: "Drug B", target: "Protein X", bindingEnergy: -7.1, quantumScore: 0.78,
                qubitsUsed: 46, circuitDepth: 98, simulationTime: '3.1s', finalState: '0.61|01⟩ - 0.79|10⟩',
                bindingDistribution: [40, 35, 20, 5],
                conformerAnalysis: "Multiple stable conformers found. The primary conformation shows moderate hydrogen bonding potential."
            },
            { 
                molecule: "Drug C", target: "Protein X", bindingEnergy: -9.1, quantumScore: 0.95,
                qubitsUsed: 62, circuitDepth: 155, simulationTime: '5.8s', finalState: '0.91|01⟩ - 0.41|10⟩',
                bindingDistribution: [5, 15, 30, 50],
                conformerAnalysis: "Single, highly stable conformer identified. Excellent geometric and electrostatic complementarity to the binding pocket."
            },
        ];
        setSimulationResults(dummyResults);
        setSimulationStatus('completed');
        setLoading(false);
    };

    const stopSimulation = () => {
        // In a real scenario, this would send a cancellation command to the QPU
        setSimulationStatus('idle');
        setLoading(false);
        console.log("Simulation stopped.");
    };

    return (
        <GlassPanel title="Q-BioMed: Drug Discovery">
            <div className="flex flex-col h-full p-4 space-y-4 text-cyan-300">
                {/* Section 1: Molecular Data Input & Visualization */}
                <div className="flex-1 border border-cyan-700 rounded-lg p-3 flex flex-col">
                    <h3 className="flex items-center text-lg font-semibold mb-2">
                        <AtomIcon className="h-5 w-5 mr-2 text-cyan-400" /> Molecular Structure
                    </h3>
                     <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
                        {/* PDB ID Input */}
                        <div className="flex-1 flex items-center space-x-2 min-w-[200px]">
                            <input
                                type="text"
                                value={pdbIdInput}
                                onChange={(e) => setPdbIdInput(e.target.value)}
                                placeholder="Enter PDB ID (e.g., 1CRN)"
                                className="flex-grow bg-cyan-900 border border-cyan-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-cyan-100"
                                disabled={dataLoading}
                            />
                            <button
                                onClick={handleLoadFromPDB}
                                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={dataLoading || !pdbIdInput.trim()}
                            >
                                <MagnifyingGlassIcon className="h-5 w-5 mr-2" /> Load PDB
                            </button>
                        </div>
                    </div>
                    {dataLoading && (
                        <div className="text-center py-2 flex items-center justify-center text-cyan-400">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading molecular data...
                        </div>
                    )}
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex-1 bg-gradient-to-br from-cyan-950 to-blue-950 rounded-md p-2 flex items-center justify-center text-cyan-500 italic transition-all duration-300 ${isDraggingOver ? 'border-2 border-dashed border-cyan-300 scale-105 shadow-lg' : 'border border-transparent'}`}
                    >
                        {molecularStructure ? (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <span className="text-sm mb-2 text-white">3D Molecular Viewer will render here.</span>
                                <span className="text-xs text-cyan-400">Source: {structureSource}</span>
                            </div>
                        ) : (
                             <div className="text-center p-4">
                                <UploadCloudIcon className="w-10 h-10 mx-auto mb-2" />
                                <p className="font-semibold text-cyan-400">Drag & Drop a .PDB file here</p>
                                <p className="text-xs mt-2">or</p>
                                <label htmlFor="molecular-upload" className="mt-2 inline-block px-4 py-2 bg-cyan-600/50 hover:bg-cyan-700/70 rounded-md cursor-pointer transition-colors duration-200 text-white">
                                    Click to Upload
                                    <input
                                        id="molecular-upload"
                                        type="file"
                                        accept=".pdb,.xyz,.mol"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        disabled={dataLoading}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 2: Simulation Controls */}
                <div className="border border-cyan-700 rounded-lg p-3">
                    <h3 className="flex items-center text-lg font-semibold mb-2">
                        <BeakerIcon className="h-5 w-5 mr-2 text-cyan-400" /> Quantum Simulation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-cyan-200">Simulation Type:</label>
                            <select className="mt-1 block w-full bg-cyan-900 border border-cyan-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-cyan-100">
                                <option>Drug-Target Binding Affinity</option>
                                <option>Protein Folding Dynamics</option>
                                <option>Molecular Docking</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cyan-200">QPU Allocation (Qubits):</label>
                            <input type="number" defaultValue={64} min={16} max={256} className="mt-1 block w-full bg-cyan-900 border border-cyan-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-cyan-100" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        {simulationStatus !== 'running' ? (
                            <button
                                onClick={startSimulation}
                                disabled={!molecularStructure || loading || dataLoading} // Disable if no structure or data is loading
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PlayIcon className="h-5 w-5 mr-2" /> Start Simulation
                            </button>
                        ) : (
                            <button
                                onClick={stopSimulation}
                                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                            >
                                <StopIcon className="h-5 w-5 mr-2" /> Stop Simulation
                            </button>
                        )}
                    </div>
                </div>

                {/* Section 3: Simulation Results */}
                <div className="flex-1 border border-cyan-700 rounded-lg p-3 flex flex-col">
                    <h3 className="flex items-center text-lg font-semibold mb-2">
                        <ChartBarIcon className="h-5 w-5 mr-2 text-cyan-400" /> Simulation Results
                    </h3>
                    {loading && (
                        <div className="text-center py-4 flex items-center justify-center text-cyan-400">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Running Quantum Simulation...
                        </div>
                    )}
                    {!loading && simulationResults.length > 0 && (
                        <div className="overflow-auto flex-1">
                            <table className="min-w-full text-sm text-left text-cyan-100">
                                <thead className="text-xs text-cyan-300 uppercase bg-cyan-900">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Molecule</th>
                                        <th scope="col" className="px-6 py-3">Target</th>
                                        <th scope="col" className="px-6 py-3">Binding Energy (kcal/mol)</th>
                                        <th scope="col" className="px-6 py-3">Quantum Affinity Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {simulationResults.map((result, index) => (
                                        <React.Fragment key={index}>
                                            <tr 
                                                className="bg-cyan-950 border-b border-cyan-800 hover:bg-cyan-900 transition-colors duration-150 cursor-pointer"
                                                onClick={() => setExpandedResultIndex(expandedResultIndex === index ? null : index)}
                                            >
                                                <td className="px-6 py-4 font-medium whitespace-nowrap">{result.molecule}</td>
                                                <td className="px-6 py-4">{result.target}</td>
                                                <td className="px-6 py-4">{result.bindingEnergy.toFixed(2)}</td>
                                                <td className="px-6 py-4">{result.quantumScore.toFixed(3)}</td>
                                            </tr>
                                            {expandedResultIndex === index && (
                                                <tr className="bg-black/20 border-b-2 border-cyan-700">
                                                    <td colSpan={4} className="p-0">
                                                        <SimulationReportDetail result={result} />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!loading && simulationStatus === 'idle' && !molecularStructure && (
                        <div className="text-center py-4 text-cyan-500 italic">
                            Load a molecular structure (from file or PDB) and start a simulation to see results.
                        </div>
                    )}
                    {!loading && simulationStatus === 'completed' && simulationResults.length === 0 && (
                        <div className="text-center py-4 text-cyan-500 italic">
                            Simulation completed with no results. Check parameters.
                        </div>
                    )}
                </div>
            </div>
        </GlassPanel>
    );
};

export default QBioMedDrugDiscovery;
