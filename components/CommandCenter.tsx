import React, { useState, useEffect, useRef } from 'react';

interface Msg {
    role: 'USER' | 'KERNEL';
    text: string;
}

const CommandCenter: React.FC = () => {
    const [messages, setMessages] = useState<Msg[]>([
        { role: 'KERNEL', text: 'Neural Link Active. Monitoring C++ Kernel...' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendCmd = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'USER', text: input } as Msg;
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/v1/command/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'KERNEL', text: data.answer }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'KERNEL', text: 'LINK FAILURE: Check Bridge/Ollama.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-black/60 font-mono text-[11px] overflow-hidden border border-cyan-500/30 rounded-lg shadow-2xl">
            {/* Header / Status Bar */}
            <div className="bg-cyan-500/10 p-1 px-3 border-b border-cyan-500/20 flex justify-between items-center text-cyan-400">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span className="tracking-widest uppercase">Kernel_Prompt_v2.0</span>
                </div>
                <span className="opacity-50 text-[9px]">{loading ? "PROCESSING..." : "IDLE"}</span>
            </div>

            {/* Chat History - flex-grow ensures it fills the available vertical space */}
            <div 
                ref={scrollRef} 
                className="flex-grow overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-cyan-500/20"
            >
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-2 rounded-md border ${
                            m.role === 'USER' 
                            ? 'bg-blue-600/10 text-blue-200 border-blue-500/40' 
                            : 'bg-cyan-600/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                        }`}>
                            <span className="block text-[9px] opacity-40 mb-1 uppercase tracking-tighter">
                                {m.role}
                            </span>
                            <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-cyan-600/5 text-cyan-500/50 p-2 animate-pulse">
                            Generating response...
                        </div>
                    </div>
                )}
            </div>

            {/* Input - Positioned at absolute bottom */}
            <div className="p-2 bg-black/80 border-t border-cyan-500/20">
                <div className="flex gap-2 items-center bg-cyan-950/20 p-2 rounded border border-cyan-500/10">
                    <span className="text-cyan-500 font-bold ml-1">$</span>
                    <input 
                        className="flex-grow bg-transparent outline-none text-cyan-300 placeholder-cyan-900"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendCmd()}
                        placeholder="ENTER SYSTEM COMMAND..."
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;