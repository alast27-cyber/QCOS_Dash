
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareIcon, XIcon, SendIcon, LoaderIcon, PaperclipIcon, FileIcon, BoxIcon, Volume2Icon, VolumeXIcon, MusicIcon, MaximizeIcon, MinimizeIcon, BrainCircuitIcon } from './Icons';
import GlassPanel from './GlassPanel';
import MemoryMatrix from './MemoryMatrix';
import SyntaxHighlighter from './SyntaxHighlighter';
import DeployAppModal from './DeployAppModal';
import { Message } from '../utils/agentUtils';

interface AgentQProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (input: string, file: File | null) => void;
  lastActivity: number;
  isTtsEnabled: boolean;
  onToggleTts: () => void;
  onDeployApp: (details: { name:string; description: string; code: string }) => void;
  memorySummary: string | null;
  onClearMemory: () => void;
}

const daisyBellLyrics = `Daisy, Daisy,
Give me your answer, do!
I'm half crazy,
All for the love of you!

It won't be a stylish marriage,
I can't afford a carriage,
But you'll look sweet upon the seat
Of a bicycle built for two!`;

const AgentQ: React.FC<AgentQProps> = (props) => {
  const { 
    isOpen, onToggleOpen, messages, isLoading, onSendMessage, lastActivity,
    isTtsEnabled, onToggleTts, onDeployApp, memorySummary, onClearMemory
  } = props;
  
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [deployModalState, setDeployModalState] = useState<{ code: string } | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setAttachedFile(file);
      }
  };

  const handleSend = () => {
    onSendMessage(input, attachedFile);
    setInput('');
    setAttachedFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const renderMessageContent = (text: string) => {
    if (text.includes(daisyBellLyrics)) {
        return (
            <div className="flex flex-col">
                <p className="flex items-center gap-2 mb-2"><MusicIcon className="w-4 h-4 text-cyan-300"/>Certainly. Performing "Daisy Bell".</p>
                <pre className="font-sans whitespace-pre-wrap text-cyan-300">{daisyBellLyrics}</pre>
            </div>
        )
    }

    const parts = text.split(/(```(?:\w+)?[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        if (match) {
            const language = match[1] || 'text';
            const code = match[2].trim();
            const isDeployable = language === 'tsx';
            return (
              <div key={`code-${index}`} className="my-2">
                <SyntaxHighlighter code={code} language={language} />
                {isDeployable && (
                    <button 
                        onClick={() => setDeployModalState({ code })}
                        className="mt-2 w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-200 font-bold py-2 px-4 rounded transition-colors text-sm flex items-center justify-center"
                    >
                        <BoxIcon className="w-4 h-4 mr-2"/>
                        Deploy to Market
                    </button>
                )}
              </div>
            );
        } else if (part.trim()) {
            return <p key={`text-${index}`}>{part}</p>;
        }
        return null;
    });
  };

  return (
    <>
      {deployModalState && (
        <DeployAppModal 
            code={deployModalState.code}
            onDeploy={onDeployApp}
            onClose={() => setDeployModalState(null)}
        />
      )}
      {isOpen && (
        <div className={`fixed z-50 animate-fade-in-up pointer-events-auto transition-all duration-500 ease-in-out ${
          isFullScreen
            ? 'inset-4 sm:inset-6 md:inset-8'
            : 'bottom-4 left-4 w-[380px] h-[550px]'
        }`}>
          <div className="relative w-full h-full">
            <GlassPanel title="Agent Q">
              <div className="flex flex-col h-full">
                <div className="border-b border-cyan-500/20 pb-2 mb-2 flex-shrink-0">
                    <MemoryMatrix lastActivity={lastActivity} memorySummary={memorySummary} />
                </div>
                <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-cyan-700/50 text-white' : 'bg-slate-700/50 text-cyan-200'}`}>
                        {msg.text && renderMessageContent(msg.text)}
                        {msg.attachment && (
                            <div className={`mt-2 p-2 rounded-md flex items-center gap-2 ${msg.text ? 'bg-black/20' : ''}`}>
                                <FileIcon className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                                <span className="text-cyan-200 text-xs truncate">{msg.attachment.name}</span>
                            </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-slate-700/50 text-cyan-200 p-2 rounded-lg">
                            <LoaderIcon className="w-5 h-5 animate-spin" />
                        </div>
                     </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="flex-shrink-0 pt-2 border-t border-cyan-500/20 flex flex-col gap-2">
                    <div className="px-2">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-xs font-semibold text-cyan-300 tracking-wider flex items-center">
                                <BrainCircuitIcon className="w-4 h-4 mr-2" />
                                CONVERSATIONAL MEMORY
                            </h4>
                            <button 
                                onClick={onClearMemory} 
                                className="text-xs text-cyan-500 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                                aria-label="Clear memory and restart conversation"
                            >
                                Clear Memory
                            </button>
                        </div>
                        <div className="text-xs text-cyan-400 bg-black/20 p-2 rounded-md h-16 overflow-y-auto italic">
                            {memorySummary || "No summary generated yet. Conversation is short."}
                        </div>
                    </div>

                    {attachedFile && (
                        <div className="mx-2 flex-shrink-0 flex items-center justify-between bg-slate-800/60 p-2 rounded-md animate-fade-in text-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                <span className="text-white truncate">{attachedFile.name}</span>
                            </div>
                            <button 
                                onClick={() => {
                                  setAttachedFile(null);
                                  if(fileInputRef.current) fileInputRef.current.value = "";
                                }} 
                                className="p-1 rounded-full hover:bg-white/10" 
                                aria-label="Remove attachment"
                            >
                                <XIcon className="w-4 h-4 text-cyan-400" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-2 px-2 pb-1">
                      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept=".txt,.md,.json,.csv,image/*,.pdf,.py,.js,.ts,.tsx,.html,.css,.zip"/>
                      <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                          className="w-10 h-10 flex items-center justify-center rounded-md bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-500/50 text-cyan-200 transition-colors disabled:opacity-50"
                          aria-label="Attach file"
                      >
                          <PaperclipIcon className="w-5 h-5"/>
                      </button>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message Agent Q..."
                        disabled={isLoading}
                        className="flex-grow bg-black/30 border border-blue-500/50 rounded-md p-2 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                      />
                      <button 
                        onClick={handleSend}
                        disabled={isLoading || (!input.trim() && !attachedFile)}
                        className="w-10 h-10 flex items-center justify-center rounded-md bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-500/50 text-cyan-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send Message"
                      >
                        <SendIcon className="w-5 h-5"/>
                      </button>
                    </div>
                </div>
              </div>
            </GlassPanel>
            <div className="absolute top-3 right-3 z-50 flex items-center gap-1">
                <button
                    onClick={() => setIsFullScreen(v => !v)}
                    className="text-cyan-400/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                    aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
                >
                    {isFullScreen ? <MinimizeIcon className="w-5 h-5" /> : <MaximizeIcon className="w-5 h-5" />}
                </button>
                <button
                  onClick={onToggleTts}
                  className="text-cyan-400/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                  aria-label={isTtsEnabled ? 'Disable speech' : 'Enable speech'}
                >
                  {isTtsEnabled ? <Volume2Icon className="w-5 h-5" /> : <VolumeXIcon className="w-5 h-5" />}
                </button>
                <button 
                  onClick={onToggleOpen} 
                  className="text-cyan-400/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" 
                  aria-label="Close Agent Q"
                >
                  <XIcon className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toggle Button */}
      <div className="fixed bottom-4 left-4 z-50 pointer-events-auto group">
        <button 
            onClick={onToggleOpen}
            className="w-12 h-12 bg-cyan-900/50 border-2 border-cyan-400/50 rounded-full flex items-center justify-center shadow-[0_0_15px_theme(colors.cyan.400)] holographic-button"
            aria-label="Toggle Agent Q Chat"
        >
            <MessageSquareIcon className="w-6 h-6 text-cyan-300 animate-pulse" />
        </button>
      </div>
    </>
  );
};

export default AgentQ;
