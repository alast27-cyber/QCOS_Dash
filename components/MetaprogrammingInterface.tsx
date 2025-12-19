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

type DiffLine = {
    type: 'added' | 'removed' | 'context';
    text: string;
};

// A simple diffing algorithm (Longest Common Subsequence based)
const createDiff = (original: string, modified: string): DiffLine[] => {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    const m = originalLines.length;
    const n = modifiedLines.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (originalLines[i - 1] === modifiedLines[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const diff: DiffLine[] = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
            diff.unshift({ type: 'context', text: originalLines[i - 1] });
            i--; j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diff.unshift({ type: 'added', text: modifiedLines[j - 1] });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
            diff.unshift({ type: 'removed', text: originalLines[i - 1] });
            i--;
        } else {
            break;
        }
    }
    return diff;
};

const DiffViewer: React.FC<{ diff: DiffLine[] }> = ({ diff }) => {
    const getLineClass = (type: DiffLine['type']) => {
        switch (type) {
            case 'added': return 'bg-green-900/50';
            case 'removed': return 'bg-red-900/50';
            default: return '';
        }
    };
    
    const getLinePrefix = (type: DiffLine['type']) => {
        switch (type) {
            case 'added': return '+';
            case 'removed': return '-';
            default: return ' ';
        }
    };

    return (
        <pre className="w-full h-full bg-black/30 border border-blue-500/50 rounded-md p-2 text-white font-mono text-xs overflow-auto">
            <code>
                {diff.map((line, index) => (
                    <div key={index} className={getLineClass(line.type)}>
                       <span className="select-none pr-2">{getLinePrefix(line.type)}</span>
                       <span>{line.text}</span>
                    </div>
                ))}
            </code>
        </pre>
    );
};


const MetaprogrammingInterface: React.FC<MetaprogrammingInterfaceProps> = ({ codebase, onApplyPatch }) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [userRequest, setUserRequest] = useState('');
    const [proposedPatch, setProposedPatch] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const fileList = Object.keys(codebase); // This extracts all file paths from the codebase prop

    useEffect(() => {
        if (!selectedFile && fileList.length > 0) {
            setSelectedFile(fileList[0]);
        }
    }, [fileList, selectedFile]);
    
    useEffect(() => {
        setProposedPatch(null);
        setUserRequest('');
        setError(null);
        setStatusMessage(null);
    }, [selectedFile]);
    
    const diffResult = useMemo(() => {
        if (proposedPatch && selectedFile && codebase[selectedFile]) {
            return createDiff(codebase[selectedFile], proposedPatch);
        }
        return null;
    }, [proposedPatch, selectedFile, codebase]);

    const handleGeneratePatch = async () => {
        if (!selectedFile || !userRequest.trim() || !ai) return;

        setIsLoading(true);
        setError(null);
        setProposedPatch(null);
        setStatusMessage(null);

        try {
            const systemInstruction = `You are Agent Q, a metaprogramming AI. You can read and modify the source code of your own dashboard. The user will provide a file path, the file's current content, and a modification request. You MUST return ONLY the full, updated content of the modified file. Do not include explanations, markdown wrappers (\`\`\`tsx), or any other text outside of the raw file content.`;
            
            const prompt = `File to modify: ${selectedFile}\n\nModification request: "${userRequest}"\n\n---\n\nCURRENT FILE CONTENT:\n\n${codebase[selectedFile]}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { systemInstruction },
            });
            
            const responseText = response.text;
            if (!responseText) {
                throw new Error("Received an empty response from the AI model.");
            }

            setProposedPatch(responseText.trim());

        } catch (e) {
            console.error("Error generating patch:", e);
            let errorMsg = "Failed to generate patch. The model may have encountered an issue.";
            if (typeof e === 'object' && e !== null && 'toString' in e && e.toString().includes('429')) {
                errorMsg = "Rate limit reached. Please wait a moment before trying again.";
            }
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleApply = () => {
        if (selectedFile && proposedPatch) {
            onApplyPatch(selectedFile, proposedPatch);
            setProposedPatch(null);
            setStatusMessage(`Patch successfully applied to ${selectedFile}.`);
            setTimeout(() => setStatusMessage(null), 4000);
        }
    };

    const handleReject = () => {
        setProposedPatch(null);
    };
    
    if (!ai) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-black/30 border border-red-500/50 rounded-lg">
                <AlertTriangleIcon className="w-10 h-10 text-red-400 mb-3" />
                <h3 className="text-lg font-bold text-red-300">Interface Offline</h3>
                <p className="text-sm text-red-400">Gemini API key is not configured.</p>
            </div>
        );
    }

    return (
        <div className="h-full grid grid-cols-12 gap-4">
            {/* File Navigator - This section already lists all files from the codebase prop */}
            <div className="col-span-3 flex flex-col min-h-0">
                <h3 className="text-cyan-300 text-sm tracking-widest flex-shrink-0 mb-2">CODEBASE</h3>
                <div className="flex-grow bg-black/30 p-2 rounded-md border border-cyan-900 overflow-y-auto custom-scrollbar">
                    {fileList.map(file => (
                        <button 
                            key={file}
                            onClick={() => setSelectedFile(file)}
                            className={`w-full text-left text-xs p-1 rounded font-mono transition-colors ${selectedFile === file ? 'bg-cyan-500/30 text-cyan-200' : 'text-cyan-400 hover:bg-cyan-500/10'}`}
                        >
                            {file}
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor & Controls */}
            <div className="col-span-9 flex flex-col min-h-0 gap-4">
                <div className="flex-shrink-0">
                     <h3 className="text-cyan-300 text-sm tracking-widest mb-2">MODIFICATION REQUEST</h3>
                     <div className="flex gap-2">
                        <textarea
                            value={userRequest}
                            onChange={(e) => setUserRequest(e.target.value)}
                            rows={2}
                            className="flex-grow bg-black/30 border border-blue-500/50 rounded-md p-2 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                            placeholder={`e.g., "Change the title of the QPU Core Temps panel to 'QPU Cryo-Metrics'"`}
                            disabled={isLoading}
                        />
                        <button onClick={handleGeneratePatch} disabled={isLoading || !userRequest.trim()} className="w-40 px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 border border-purple-500/50 text-purple-200 font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center">
                            {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin"/> : <><CodeBracketIcon className="w-5 h-5 mr-2"/> Generate Patch</>}
                        </button>
                    </div>
                </div>
                
                {error && (
                     <div className="flex items-center gap-2 text-red-400 bg-red-900/50 p-2 rounded-md border border-red-500/50 animate-fade-in">
                        <AlertTriangleIcon className="w-5 h-5 flex-shrink-0"/>
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                {statusMessage && (
                     <div className="flex items-center gap-2 text-green-400 bg-green-900/50 p-2 rounded-md border border-green-500/50 animate-fade-in">
                        <CheckCircle2Icon className="w-5 h-5 flex-shrink-0"/>
                        <p className="text-sm">{statusMessage}</p>
                    </div>
                )}

                <div className="flex-grow flex flex-col min-h-0">
                    {diffResult ? (
                        <div className="flex flex-col flex-grow min-h-0">
                            <h3 className="text-cyan-300 text-sm tracking-widest mb-2">PROPOSED PATCH: {selectedFile}</h3>
                            <div className="flex-grow min-h-0">
                                <DiffViewer diff={diffResult} />
                            </div>
                        </div>
                    ) : (
                         <div className="flex flex-col flex-grow min-h-0">
                            <h3 className="text-cyan-300 text-sm tracking-widest mb-2">CURRENT: {selectedFile}</h3>
                            <div className="flex-grow min-h-0"><SyntaxHighlighter code={selectedFile && codebase[selectedFile] ? codebase[selectedFile] : ''} language="tsx"/></div>
                        </div>
                    )}
                </div>

                 {proposedPatch && (
                    <div className="flex-shrink-0 flex justify-end gap-2 animate-fade-in-up">
                        <button onClick={handleReject} className="w-32 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 border border-red-500/50 text-red-200 font-bold rounded transition-colors flex items-center justify-center">
                            <XIcon className="w-5 h-5 mr-2"/> Reject
                        </button>
                        <button onClick={handleApply} className="w-32 px-4 py-2 bg-green-500/30 hover:bg-green-500/50 border border-green-500/50 text-green-200 font-bold rounded transition-colors flex items-center justify-center">
                           <ArrowRightIcon className="w-5 h-5 mr-2"/> Apply
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetaprogrammingInterface;