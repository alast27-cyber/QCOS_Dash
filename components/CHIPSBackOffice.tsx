import React from 'react';
import { GoogleGenAI } from '@google/genai';
import { BrainCircuitIcon, LoaderIcon, AlertTriangleIcon } from './Icons';
import QANExecutionSimulator from './QANExecutionSimulator';
import { URIAssignment } from '../App';

// --- NEW COMPONENT: DQN INQUIRY ---
const DQNInquiry: React.FC = () => {
    const [inquiry, setInquiry] = React.useState('');
    const [response, setResponse] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleInquiry = async () => {
        if (!inquiry.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setResponse(null);

        if (!process.env.API_KEY) {
            setError("API Key not configured. Cannot contact Agent Q.");
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = `You are an AI expert integrated into the QCOS (Quantum Computing Operations System) dashboard. You are analyzing the live CHIPS packet feed. Your task is to answer questions about the Decentralized Quantum Nodes (DQNs) based on the provided inquiry. Be concise and technical, as if speaking to a network administrator. The current context involves nodes like 'rigel', 'europa-7', and 'titan-2'.`;
            
            const geminiResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Inquiry about DQN: "${inquiry}"`,
                config: { systemInstruction }
            });

            const responseText = geminiResponse.text;
            if (!responseText) {
                throw new Error("Received an empty response from the model.");
            }
            setResponse(responseText.trim());
        } catch (e) {
            console.error("Error during DQN inquiry:", e);
            setError("Failed to get a response from the AI core. The network may be unstable.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-cyan-300 text-sm tracking-widest text-left flex-shrink-0 mb-2 flex items-center">
                <BrainCircuitIcon className="w-4 h-4 mr-2" /> DQN INQUIRY
            </h3>
            <div className="flex-grow bg-black/30 p-2 rounded-md border border-cyan-900 text-xs font-mono overflow-y-auto">
                {isLoading && (
                    <div className="flex items-center justify-center h-full text-cyan-400">
                        <LoaderIcon className="w-6 h-6 animate-spin mr-2" />
                        Querying AI Core...
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-full text-red-400">
                        <AlertTriangleIcon className="w-6 h-6 mr-2" />
                        {error}
                    </div>
                )}
                {response && (
                    <p className="whitespace-pre-wrap animate-fade-in text-white">{response}</p>
                )}
                {!isLoading && !error && !response && (
                    <p className="text-cyan-700">Awaiting inquiry...</p>
                )}
            </div>
            <div className="flex gap-2 mt-2">
                <textarea
                    rows={1}
                    value={inquiry}
                    onChange={(e) => setInquiry(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleInquiry(); } }}
                    placeholder="e.g., 'What is the status of DQN rigel?'"
                    className="flex-grow bg-black/40 border border-blue-500/50 rounded-md p-2 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none resize-none text-sm"
                    disabled={isLoading}
                />
                <button
                    onClick={handleInquiry}
                    disabled={isLoading || !inquiry.trim()}
                    className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 border border-purple-500/50 text-purple-200 font-bold rounded transition-colors disabled:opacity-50"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};


// --- CHIPS Packet Simulation Data ---
const mockPackets = [
    "CHIPS://QAN-ROOT-001/EXEC_QSC_V2 | SCOPE::GEO::REG | EKS_REF::a8c5f2b9... | HASH::03e1b7c4...",
    "CHIPS://QAN-ROOT-001/EXEC_QSC_V2 | SCOPE::FIN::FRONT_OFFICE | EKS_REF::f4d9a1e0... | HASH::9a2c8f7b...",
    "CHIPS://QAN-RELAY-003/ROUTE_V1 | SCOPE::SYS::MAINT | EKS_REF::3b1e6f4d... | HASH::d5e0a1c3...",
    "CHIPS://QAN-ROOT-001/EXEC_QSC_V2 | SCOPE::GEO::EU_WEST | EKS_REF::b9c2d7f8... | HASH::4f8e1a2b...",
];

const PacketFeed = () => {
    const [packets, setPackets] = React.useState<string[]>([]);
    
    React.useEffect(() => {
        const interval = setInterval(() => {
            const newPacket = mockPackets[Math.floor(Math.random() * mockPackets.length)];
            setPackets(prev => [newPacket, ...prev.slice(0, 5)]);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full bg-black/30 p-2 rounded-md border border-cyan-900 text-xs font-mono flex flex-col-reverse overflow-hidden">
            <div>
            {packets.map((packet, index) => (
                <p key={index} className="whitespace-pre-wrap animate-fade-in">
                    <span className="text-cyan-400">&gt; </span>
                    {packet.split(' | ').map((part, i) => (
                        <React.Fragment key={i}>
                            <span className={i === 0 ? 'text-green-400' : i === 1 ? 'text-yellow-300' : 'text-purple-400'}>
                                {part}
                            </span>
                            {i < packet.split(' | ').length - 1 && <span className="text-cyan-600"> | </span>}
                        </React.Fragment>
                    ))}
                </p>
            ))}
            </div>
        </div>
    );
};

const URIAssignmentLog: React.FC<{ assignments: URIAssignment[] }> = ({ assignments }) => {
    return (
        <div className="h-full flex flex-col">
            <h3 className="text-cyan-300 text-sm tracking-widest text-left flex-shrink-0 mb-2">RECENT ADDRESS ASSIGNMENTS</h3>
            <div className="flex-grow bg-black/30 p-2 rounded-md border border-cyan-900 text-xs font-mono overflow-y-auto flex flex-col-reverse">
                <div>
                    {!assignments || assignments.length === 0 ? (
                        <p className="text-cyan-700">Awaiting new application deployments...</p>
                    ) : (
                        assignments.map((a, i) => (
                            <div key={i} className="animate-fade-in mb-2 last:mb-0">
                                <p><span className="text-cyan-400">{a.timestamp}</span> <span className="text-purple-400">ASSIGN</span> <span className="text-white">"{a.appName}"</span></p>
                                <p className="pl-4"><span className="text-yellow-400 font-bold w-14 inline-block">Q-URI:</span> <span className="text-green-400">{a.q_uri}</span></p>
                                {a.https_url && (
                                     <p className="pl-4"><span className="text-yellow-400 font-bold w-14 inline-block">HTTPS:</span> <span className="text-blue-400">{a.https_url}</span></p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

interface CHIPSBackOfficeProps {
    uriAssignments: URIAssignment[];
}

const CHIPSBackOffice: React.FC<CHIPSBackOfficeProps> = ({ uriAssignments }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Left side: QAN Simulator & URI Log */}
            <div className="flex flex-col space-y-4 min-h-0">
               <div className="flex-1 min-h-0">
                    <QANExecutionSimulator />
               </div>
               <div className="flex-1 min-h-0">
                    <URIAssignmentLog assignments={uriAssignments} />
               </div>
            </div>

            {/* Right side: Packet Feed & DQN Inquiry */}
            <div className="flex flex-col space-y-4 min-h-0">
                <div className="flex-1 flex flex-col min-h-0">
                    <h3 className="text-cyan-300 text-sm tracking-widest text-left flex-shrink-0 mb-2">LIVE CHIPS:// PACKET FEED</h3>
                    <div className="flex-grow w-full min-h-0">
                        <PacketFeed />
                    </div>
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                    <DQNInquiry />
                </div>
            </div>
        </div>
    );
};

export default CHIPSBackOffice;