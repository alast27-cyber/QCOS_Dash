import React, { useState, useEffect, useCallback } from 'react';
import { GlobeIcon, CheckCircle2Icon, LoaderIcon, AlertTriangleIcon, Share2Icon, GitBranchIcon, FileTextIcon, ServerCogIcon, MagnifyingGlassIcon } from './Icons';
import { AppDefinition } from '../App';
import CHIPSAppStore from './CHIPSAppStore';
import QCOSUserIdentityNodeRegistry from './QCOSUserIdentityNodeRegistry';
import QuantumDataSearchPanel from './QuantumDataSearchPanel';

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';
interface ParsedURI {
    protocol: string;
    dqnAlias: string;
    algorithmDomain: string;
    taskReference: string;
}

const storeAddress = "CHIPS://store.qcos.dev/home";
const bookmarks = [
    storeAddress,
    "CHIPS://qan-root-001/sys/health_check",
    "CHIPS://iai-core/cognitive/status",
];

const ConnectionLog = ({ log }: { log: string[] }) => (
    <div className="font-mono text-xs text-cyan-300 space-y-1">
        {log.map((entry, i) => (
            <p key={i} className="animate-fade-in">&gt; {entry}</p>
        ))}
    </div>
);

const ConnectedView = ({ uri, parsed }: { uri: string; parsed: ParsedURI }) => (
    <div className="h-full flex flex-col text-cyan-300 animate-fade-in">
        <h3 className="text-base text-white font-bold">Resolution Successful</h3>
        <p className="text-xs text-green-400 font-mono mb-4">{uri}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black/20 p-3 rounded-md border border-cyan-900">
                <h4 className="flex items-center text-cyan-200 font-bold mb-2"><ServerCogIcon className="w-4 h-4 mr-2"/> DQN Alias</h4>
                <p className="font-mono text-white text-lg">{parsed.dqnAlias}</p>
            </div>
             <div className="bg-black/20 p-3 rounded-md border border-cyan-900">
                <h4 className="flex items-center text-cyan-200 font-bold mb-2"><GitBranchIcon className="w-4 h-4 mr-2"/> Algorithm Domain</h4>
                <p className="font-mono text-white text-lg">{parsed.algorithmDomain || '(none)'}</p>
            </div>
             <div className="bg-black/20 p-3 rounded-md border border-cyan-900 col-span-2">
                <h4 className="flex items-center text-cyan-200 font-bold mb-2"><FileTextIcon className="w-4 h-4 mr-2"/> Task Reference</h4>
                <p className="font-mono text-white">{parsed.taskReference}</p>
            </div>
        </div>
        <div className="mt-4 flex-grow bg-black/20 p-3 rounded-md border border-cyan-900">
            <h4 className="text-cyan-200 font-bold mb-2">Simulated Resource Data</h4>
            <p className="text-xs text-cyan-400 whitespace-pre-wrap font-mono">
{`{
  "resource_type": "Quantum Task",
  "status": "IDLE",
  "required_qubits": ${Math.floor(Math.random() * (128-8) + 8)},
  "last_accessed": "${new Date(Date.now() - Math.random() * 1e10).toISOString()}",
  "permissions": "READ/EXECUTE"
}`}
            </p>
        </div>
    </div>
);

interface CHIPSBrowserProps {
    apps: AppDefinition[];
    onInstall: (id: string) => void;
    initialUri?: string;
}

const CHIPSBrowser: React.FC<CHIPSBrowserProps> = ({ apps, onInstall, initialUri = '' }) => {
    const [uri, setUri] = useState(initialUri);
    const [status, setStatus] = useState<ConnectionStatus>('idle');
    const [log, setLog] = useState<string[]>([]);
    const [parsedUri, setParsedUri] = useState<ParsedURI | null>(null);
    const [isStoreView, setIsStoreView] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [view, setView] = useState<'browser' | 'search'>('browser');

    const handleAuthentication = () => {
        setTimeout(() => {
            setIsAuthenticated(true);
            if (initialUri) {
                handleConnect(initialUri);
            }
        }, 1200);
    };

    const handleConnect = useCallback((targetUri: string) => {
        if (!targetUri.trim()) return;
        setView('browser');
        setUri(targetUri);
        setStatus('connecting');
        setLog([]);
        setParsedUri(null);
        setIsStoreView(false);

        const protocol = 'CHIPS://';
        if (!targetUri.startsWith(protocol)) {
            setLog(["ERROR: Invalid protocol. Must start with CHIPS://"]);
            setStatus('error');
            return;
        }

        const pathlessUri = targetUri.substring(protocol.length);
        const firstSlashIndex = pathlessUri.indexOf('/');
        
        const fullHost = firstSlashIndex === -1 ? pathlessUri : pathlessUri.substring(0, firstSlashIndex);
        const path = firstSlashIndex === -1 ? '/' : pathlessUri.substring(firstSlashIndex);

        if (!fullHost) {
            setLog(["ERROR: URI resolution failed. Missing host."]);
            setStatus('error');
            return;
        }
        
        const firstDotIndex = fullHost.indexOf('.');
        const dqnAlias = firstDotIndex === -1 ? fullHost : fullHost.substring(0, firstDotIndex);
        const algorithmDomain = firstDotIndex === -1 ? '' : fullHost.substring(firstDotIndex);
        
        const steps = [
            "Initiating CHIPS connection...",
            `Resolving DQN Alias: "${dqnAlias}"`,
            "Authenticating via EKS...",
            "Establishing quantum-secured link...",
        ];
        
        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < steps.length) {
                setLog(prev => [...prev, steps[stepIndex]]);
                stepIndex++;
            } else {
                clearInterval(interval);
                setParsedUri({ protocol, dqnAlias, algorithmDomain, taskReference: path });
                setLog(prev => [...prev, "Connection established."]);
                setStatus('connected');
                if (targetUri === storeAddress) {
                    setIsStoreView(true);
                }
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (isAuthenticated && initialUri) {
            handleConnect(initialUri);
        }
    }, [initialUri, handleConnect, isAuthenticated]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleConnect(uri);
        }
    };
    
    const renderContent = () => {
        if (view === 'search') {
            return <QuantumDataSearchPanel />;
        }

        switch (status) {
            case 'connecting':
                return <ConnectionLog log={log} />;
            case 'connected':
                if (isStoreView) {
                    return <CHIPSAppStore apps={apps} onInstall={onInstall} />;
                }
                return parsedUri ? <ConnectedView uri={uri} parsed={parsedUri} /> : null;
            case 'error':
                return <div className="text-center text-red-400 p-4"><AlertTriangleIcon className="w-10 h-10 mx-auto mb-2" /><p>{log[log.length - 1]}</p></div>;
            case 'idle':
            default:
                return (
                    <div className="text-center text-cyan-400 p-4 h-full flex flex-col justify-center">
                        <Share2Icon className="w-16 h-16 mx-auto mb-4 text-cyan-600/70" />
                        <h3 className="text-lg font-bold text-white">Quantum CHIPS Network</h3>
                        <p>Enter a CHIPS URI or select a bookmark to begin.</p>
                    </div>
                );
        }
    }
    
    const getButtonClasses = (buttonView: typeof view) => {
        const base = "flex-1 p-2 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2";
        const active = "bg-cyan-500/20 text-cyan-200 border-cyan-400";
        const inactive = "text-cyan-500 border-transparent hover:bg-cyan-500/10";
        return `${base} ${view === buttonView ? active : inactive}`;
    };

    if (!isAuthenticated) {
        return <QCOSUserIdentityNodeRegistry onLogin={handleAuthentication} onRegister={handleAuthentication} />;
    }

    return (
        <div className="h-full flex flex-col p-4">
            {/* Address Bar */}
            <div className="flex gap-2 mb-4 flex-shrink-0">
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 font-bold">
                        <GlobeIcon className="w-4 h-4 inline-block mr-2" />
                        CHIPS://
                    </span>
                    <input
                        type="text"
                        value={uri.replace('CHIPS://', '')}
                        onChange={(e) => setUri(`CHIPS://${e.target.value}`)}
                        onKeyDown={handleKeyDown}
                        placeholder="rigel.grover.search/DB_7bit_User101"
                        className="w-full bg-black/30 border border-blue-500/50 rounded-md p-2 pl-24 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none font-mono"
                    />
                </div>
                <button
                    onClick={() => handleConnect(uri)}
                    disabled={status === 'connecting'}
                    className="px-4 py-2 bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-500/50 text-cyan-200 font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center w-32"
                >
                    {status === 'connecting' ? <LoaderIcon className="w-5 h-5 animate-spin"/> : 'Resolve'}
                </button>
            </div>
            
            {/* Bookmarks */}
            <div className="flex gap-2 mb-4 text-xs font-mono flex-shrink-0 flex-wrap">
                <span className="text-cyan-500 pt-1">Bookmarks:</span>
                {bookmarks.map(bm => (
                    <button key={bm} onClick={() => handleConnect(bm)} className="px-2 py-1 bg-slate-800/50 hover:bg-slate-700/70 rounded text-cyan-300">
                        {bm.split('//')[1].split('/')[0]}
                    </button>
                ))}
            </div>

            {/* View Switcher */}
            <div className="flex-shrink-0 flex border-b border-cyan-500/30 mb-4">
                <button onClick={() => setView('browser')} className={getButtonClasses('browser')}>
                    <GlobeIcon className="w-5 h-5" /> URI Resolver
                </button>
                <button onClick={() => setView('search')} className={getButtonClasses('search')}>
                    <MagnifyingGlassIcon className="w-5 h-5" /> Data Search
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow bg-black/30 border border-cyan-900/80 rounded-lg p-4 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default CHIPSBrowser;