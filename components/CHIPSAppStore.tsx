import React from 'react';
import { AppDefinition } from '../App';
import { LoaderIcon, CheckCircle2Icon, BoxIcon } from './Icons';

interface CHIPSAppStoreProps {
    apps: AppDefinition[];
    onInstall: (id: string) => void;
}

// FIX: Refactored the component to use a dedicated props interface and React.FC
// for better type inference and to resolve the issue with the 'key' prop error.
interface AppStoreCardProps {
    app: AppDefinition;
    onInstall: (id: string) => void;
}

const AppStoreCard: React.FC<AppStoreCardProps> = ({ app, onInstall }) => {
    const { id, name, description, icon: Icon, status } = app;

    const buttonConfig = {
        available: { text: 'Install', action: () => onInstall(id), classes: 'bg-cyan-500/30 hover:bg-cyan-500/50 border-cyan-500/50 text-cyan-200', disabled: false },
        downloading: { text: 'Downloading...', action: () => {}, classes: 'bg-gray-500/20 border-gray-500/50 text-gray-400 cursor-wait', disabled: true },
        installing: { text: 'Installing...', action: () => { }, classes: 'bg-gray-500/20 border-gray-500/50 text-gray-400 cursor-wait', disabled: true },
        installed: { text: 'Installed', action: () => { }, classes: 'bg-green-500/30 border-green-500/50 text-green-200 cursor-default', disabled: true },
    };
    // FIX: Corrected button configuration for 'downloading' status which was missing.
    const currentButton = buttonConfig[status] || buttonConfig.available;


    return (
        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-lg border border-cyan-500/20 transition-all duration-300 hover:bg-black/40 hover:border-cyan-500/40">
            <div className="w-16 h-16 bg-cyan-900/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-700">
                <Icon className="w-8 h-8 text-cyan-300" />
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-white text-base">{name}</h3>
                <p className="text-cyan-400 text-xs">{description}</p>
            </div>
            <button onClick={currentButton.action} disabled={currentButton.disabled} className={`w-32 flex-shrink-0 font-bold py-2 px-4 rounded transition-colors text-sm border ${currentButton.classes}`}>
                <div className="flex items-center justify-center">
                    {(status === 'installing' || status === 'downloading') && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                    {status === 'installed' && <CheckCircle2Icon className="w-4 h-4 mr-2" />}
                    {currentButton.text}
                </div>
            </button>
        </div>
    );
};


const CHIPSAppStore: React.FC<CHIPSAppStoreProps> = ({ apps, onInstall }) => {
    if (!apps || apps.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center text-cyan-500 p-4">
                <BoxIcon className="w-16 h-16 mb-4" />
                <h3 className="text-lg font-bold text-cyan-300">No Applications Available</h3>
                <p>The application store is currently empty.</p>
            </div>
        );
    }
    
    const featuredApp = apps.find(app => app.id === 'mol-sim') || apps[0];
    const otherApps = apps.filter(app => app.id !== featuredApp.id);
    const { icon: FeaturedIcon } = featuredApp;

    return (
        <div className="h-full flex flex-col text-cyan-300 animate-fade-in">
            <header className="flex-shrink-0 p-4 mb-4 rounded-lg bg-gradient-to-r from-cyan-900/50 to-purple-900/30 border border-cyan-700/50">
                <h2 className="text-2xl font-bold text-white tracking-widest">CHIPS App Store</h2>
                <p className="text-sm text-cyan-200">The premier destination for Quantum Applications.</p>
            </header>

            <main className="flex-grow space-y-6 overflow-y-auto pr-2">
                {/* Featured App */}
                <section>
                    <h3 className="text-lg text-cyan-100 font-bold mb-2">Featured Application</h3>
                    <div className="flex flex-col md:flex-row items-center gap-6 bg-black/20 p-4 rounded-lg border border-cyan-500/20">
                         <div className="w-24 h-24 bg-cyan-900/50 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-cyan-700">
                            <FeaturedIcon className="w-12 h-12 text-cyan-300" />
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h4 className="font-bold text-white text-xl">{featuredApp.name}</h4>
                            <p className="text-cyan-400 text-sm my-2">{featuredApp.description}</p>
                            <p className="text-xs text-cyan-500">Version 2.1.8 | Verified Publisher</p>
                        </div>
                        <div className="w-full md:w-40 flex-shrink-0">
                           <AppStoreCard app={featuredApp} onInstall={onInstall} />
                        </div>
                    </div>
                </section>
                
                {/* All Apps */}
                <section>
                    <h3 className="text-lg text-cyan-100 font-bold mb-2">All Applications</h3>
                    <div className="space-y-3">
                        {otherApps.map(app => (
                            <AppStoreCard key={app.id} app={app} onInstall={onInstall} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CHIPSAppStore;