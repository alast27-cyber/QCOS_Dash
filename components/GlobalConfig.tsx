import React from 'react';
import { SettingsIcon } from './Icons';

const ConfigToggle = ({ label, active, disabled = false }: { label: string; active: boolean, disabled?: boolean }) => {
    return (
        <div className={`flex items-center justify-between py-2 border-b border-cyan-500/20 ${disabled ? 'opacity-50' : ''}`}>
            <span className="text-sm text-cyan-200">{label}</span>
            <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${active ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform ${active ? 'translate-x-5' : ''}`}/>
            </div>
        </div>
    );
};

const GlobalConfig: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col p-4">
        <div className="flex items-center text-cyan-300 mb-4 flex-shrink-0">
            <SettingsIcon className="w-6 h-6 mr-2"/>
            <h3 className="text-base font-bold tracking-widest">GLOBAL CONFIG</h3>
        </div>
        <div className="flex-grow w-full flex flex-col">
            <ConfigToggle label="Auto-Calibration" active={true} />
            <ConfigToggle label="Error Correction" active={true} />
            <ConfigToggle label="IAI Proactive Tuning" active={false} />
            <ConfigToggle label="Verbose Logging" active={false} />
            <ConfigToggle label="External Access" active={false} disabled={true}/>
        </div>
    </div>
  );
};

export default GlobalConfig;