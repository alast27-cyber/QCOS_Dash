
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { LoaderIcon, AlertTriangleIcon } from './Icons';

// --- Type Definitions for Circuit Data ---
interface Gate {
    type: 'H' | 'X' | 'CNOT';
    target: number;
    control?: number;
}

interface CircuitData {
    qubits: number;
    circuit: Gate[];
}

// --- Constants for Rendering ---
const GATE_VISUALS: { [key: string]: { color: string; symbol: string } } = {
    'H': { color: '#38bdf8', symbol: 'H' }, // blue-400
    'X': { color: '#a78bfa', symbol: 'X' }, // violet-400
};
const GATE_WIDTH = 25;
const GATE_PADDING = 25;
const QUBIT_SPACING = 40;

// --- Gemini API Schema ---
const schema = {
  type: Type.OBJECT,
  properties: {
    qubits: {
      type: Type.INTEGER,
      description: "The total number of qubits required for the circuit. Must be between 1 and 5."
    },
    circuit: {
      type: Type.ARRAY,
      description: "An array of quantum gates to be applied in sequence.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: "The type of gate. Supported types: 'H' (Hadamard), 'X' (Pauli-X/NOT), 'CNOT' (Controlled-NOT)."
          },
          target: {
            type: Type.INTEGER,
            description: "The zero-based index of the target qubit."
          },
          control: {
            type: Type.INTEGER,
            description: "The zero-based index of the control qubit. Only for 'CNOT' gates."
          }
        },
        required: ["type", "target"]
      }
    }
  },
  required: ["qubits", "circuit"]
};


// --- Dynamic Circuit Preview Component ---
const DynamicCircuitPreview = ({ data }: { data: CircuitData }) => {
    const { qubits, circuit } = data;
    const height = qubits * QUBIT_SPACING + 20;
    const width = (circuit.length + 1) * (GATE_WIDTH + GATE_PADDING) + 20;

    return (
        <div className="w-full h-full bg-black/30 p-4 rounded-md border border-cyan-900 flex items-center justify-start overflow-x-auto">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Render qubit lines */}
                {Array.from({ length: qubits }).map((_, i) => (
                    <g key={`q-line-${i}`}>
                        <line x1="20" y1={20 + i * QUBIT_SPACING} x2={width - 20} y2={20 + i * QUBIT_SPACING} stroke="white" />
                        <text x="0" y={24 + i * QUBIT_SPACING} fill="cyan" fontSize="10">{`q${i}`}</text>
                    </g>
                ))}
                {/* Render gates */}
                {circuit.map((gate, step) => {
                    const x = 30 + step * (GATE_WIDTH + GATE_PADDING);
                    const y = 10 + gate.target * QUBIT_SPACING;

                    if (gate.type === 'CNOT' && gate.control !== undefined) {
                        const controlY = 20 + gate.control * QUBIT_SPACING;
                        const targetY = 20 + gate.target * QUBIT_SPACING;
                        const midX = x + GATE_WIDTH / 2;
                        return (
                            <g key={`gate-${step}`}>
                                <line x1={midX} y1={controlY} x2={midX} y2={targetY} stroke="white" />
                                <circle cx={midX} cy={controlY} r="4" fill="white" />
                                <circle cx={midX} cy={targetY} r="8" stroke="white" strokeWidth="1.5" fill="none" />
                                <line x1={midX - 5} y1={targetY} x2={midX + 5} y2={targetY} stroke="white" strokeWidth="1.5" />
                                <line x1={midX} y1={targetY - 5} x2={midX} y2={targetY + 5} stroke="white" strokeWidth="1.5" />
                            </g>
                        );
                    } else {
                        const visual = GATE_VISUALS[gate.type];
                        if (!visual) return null;
                        return (
                            <g key={`gate-${step}`}>
                                <rect x={x} y={y} width={GATE_WIDTH} height={GATE_WIDTH} fill={visual.color} stroke="white" strokeWidth="1" rx="2" />
                                <text x={x + GATE_WIDTH / 2} y={y + GATE_WIDTH / 2 + 5} fill="black" fontSize="12" fontWeight="bold" textAnchor="middle">{visual.symbol}</text>
                            </g>
                        );
                    }
                })}
            </svg>
        </div>
    );
};

// --- Main Text-to-App Component ---
const TextToAppInterface: React.FC<{ large?: boolean }> = ({ large = false }) => {
    const [prompt, setPrompt] = useState('');
    const [circuitData, setCircuitData] = useState<CircuitData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setError(null);
        setCircuitData(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY environment variable not found.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Based on the following prompt, generate a JSON object representing a quantum circuit. The circuit should have a number of qubits (1-5) and a sequence of gates. Supported gates are 'H', 'X', and 'CNOT'. For CNOT, specify 'control' and 'target' qubits. For others, just a 'target'. Qubit indices are zero-based. Prompt: "${prompt}"`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });

            const responseText = response.text;
            if (!responseText) {
                throw new Error("Received an empty response from the AI model.");
            }
            const jsonStr = responseText.trim();
            const parsedData = JSON.parse(jsonStr) as CircuitData;
            
            if (typeof parsedData.qubits !== 'number' || !Array.isArray(parsedData.circuit)) {
                throw new Error("Invalid circuit data structure received.");
            }

            setCircuitData(parsedData);

        } catch (e) {
            console.error("Error generating circuit:", e);
            let errorMsg = "Failed to generate circuit. The model may be unable to process this request. Please try a different prompt.";
            if (typeof e === 'object' && e !== null && 'toString' in e && e.toString().includes('429')) {
                errorMsg = "Rate limit reached. Please wait a moment before generating another circuit.";
            }
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const renderPreview = () => {
        const previewClasses = `w-full h-full min-h-[90px] bg-black/30 border border-dashed border-blue-500/50 rounded-md flex items-center justify-center ${large ? 'min-h-[120px]' : ''}`;
        
        if (isLoading) {
            return (
                <div className={previewClasses}>
                    <LoaderIcon className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
            );
        }
        if (error) {
            return (
                <div className={`${previewClasses} flex-col text-center p-2`}>
                    <AlertTriangleIcon className="w-8 h-8 text-red-400 mb-2"/>
                    <p className="text-red-400 text-xs">{error}</p>
                </div>
            );
        }
        if (circuitData) {
            return <DynamicCircuitPreview data={circuitData} />;
        }
        return (
            <div className={previewClasses}>
                <p className="text-gray-500 text-center">Circuit will be visualized here</p>
            </div>
        );
    };

    return (
        <div className={`flex flex-col gap-4 text-sm ${large ? 'flex-grow' : 'md:grid md:grid-cols-2'}`}>
            <div className={`flex flex-col ${large ? 'flex-grow' : ''}`}>
                <label htmlFor="prompt-input" className="block text-cyan-400 mb-1">
                    Programming Interface
                </label>
                <textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={large ? 6 : 3}
                    className={`w-full bg-black/30 border border-blue-500/50 rounded-md p-2 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none ${large ? 'flex-grow' : ''}`}
                    placeholder="e.g., 'Create a Bell state with 2 qubits...'"
                    disabled={isLoading}
                />
                <button 
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt}
                    className="mt-2 w-full bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-500/50 text-cyan-200 font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Generating...' : 'Generate Circuit'}
                </button>
            </div>
            <div className={large ? 'flex flex-col flex-grow' : ''}>
                <p className="text-cyan-400 mb-1">Live App Preview</p>
                <div className={large ? 'flex-grow' : ''}>
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
}

export default TextToAppInterface;
