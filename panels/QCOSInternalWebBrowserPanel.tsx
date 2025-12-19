import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GlobeAltIcon, ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'; // Example icons
// Assuming you have a Spinner component, adjust path if needed
// This path assumes your Spinner component is in a `components` folder relative to your project root.
import { Spinner } from '@/components/Spinner'; 

interface QCOSInternalWebBrowserContentProps {
    initialUrl?: string; // Optional initial URL
    onUrlChange?: (url: string) => void; // Callback to inform parent of URL changes
}

const QCOSInternalWebBrowserContent: React.FC<QCOSInternalWebBrowserContentProps> = ({ initialUrl, onUrlChange }) => {
    // Sanitize initialUrl to ensure it's a valid HTTP(S) URL or 'about:blank'
    const safeInitialUrl = initialUrl && (initialUrl.startsWith('http://') || initialUrl.startsWith('https://'))
        ? initialUrl
        : 'about:blank';

    const [internalUrl, setInternalUrl] = useState(safeInitialUrl);
    const [addressBarInput, setAddressBarInput] = useState(internalUrl); // State for the input field
    const [isLoading, setIsLoading] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Sync internal URL state with initialUrl prop if it changes externally
    useEffect(() => {
        if (initialUrl && initialUrl !== internalUrl && (initialUrl.startsWith('http://') || initialUrl.startsWith('https://'))) {
            setInternalUrl(initialUrl);
            setAddressBarInput(initialUrl); // Also update the address bar input
            setIsLoading(true); // Indicate loading when URL changes externally
        } else if (!initialUrl && internalUrl !== 'about:blank') {
            // If initialUrl becomes empty/invalid, reset to about:blank
            setInternalUrl('about:blank');
            setAddressBarInput('about:blank');
            setIsLoading(false);
        }
    }, [initialUrl, internalUrl]);

    const handleNavigate = useCallback((url: string) => {
        if (!url || url.trim() === '') {
            // If empty, navigate to about:blank
            setInternalUrl('about:blank');
            setAddressBarInput('about:blank');
            onUrlChange?.('about:blank');
            setIsLoading(false); // No actual network load
            return;
        }

        let formattedUrl = url.trim();
        // Add default protocol if none specified and it's not 'about:blank'
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://') && formattedUrl !== 'about:blank') {
            formattedUrl = `https://${formattedUrl}`;
        }

        setIsLoading(true);
        setInternalUrl(formattedUrl);
        setAddressBarInput(formattedUrl); // Update input field immediately
        onUrlChange?.(formattedUrl); // Inform parent
    }, [onUrlChange]);

    const handleLoad = () => {
        setIsLoading(false);
        try {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                const actualUrl = iframeRef.current.contentWindow.location.href;
                if (!actualUrl.startsWith('about:blank') && actualUrl !== internalUrl) {
                    setInternalUrl(actualUrl);
                    setAddressBarInput(actualUrl); // Keep address bar in sync with actual iframe content
                    onUrlChange?.(actualUrl);
                }
            }
        } catch (e) {
            // Cross-origin restrictions might prevent reading iframe location
            console.warn("Could not read iframe location due to cross-origin restrictions.", e);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleNavigate(e.currentTarget.value);
        }
    };

    const handleBack = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.history.back();
        }
    };

    const handleForward = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.history.forward();
        }
    };

    const handleHome = () => {
        handleNavigate('about:blank'); // Default to blank page for home
    };

    const handleRefresh = () => {
        if (iframeRef.current) {
            setIsLoading(true);
            // Re-assigning src or calling reload forces a refresh
            iframeRef.current.src = internalUrl;
            // Alternative: iframeRef.current.contentWindow.location.reload(true);
        }
    };

    return (
        <div className="flex flex-col h-full text-cyan-300">
            {/* Address Bar & Navigation */}
            <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                <button onClick={handleBack} className="p-1 rounded-md hover:bg-cyan-500/20"><ChevronLeftIcon className="w-5 h-5" /></button>
                <button onClick={handleForward} className="p-1 rounded-md hover:bg-cyan-500/20"><ChevronRightIcon className="w-5 h-5" /></button>
                <button onClick={handleHome} className="p-1 rounded-md hover:bg-cyan-500/20"><HomeIcon className="w-5 h-5" /></button>
                <button onClick={handleRefresh} className="p-1 rounded-md hover:bg-cyan-500/20"><ArrowPathIcon className="w-5 h-5" /></button>
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400">
                        <GlobeAltIcon className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        value={addressBarInput} // Use addressBarInput state for the input field
                        onChange={(e) => setAddressBarInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="https://your-app.qcos.apps.web/"
                        className="w-full bg-black/30 border border-cyan-500/50 rounded-md p-1.5 pl-10 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none text-sm font-mono"
                    />
                </div>
                <button
                    onClick={() => handleNavigate(addressBarInput)} // Navigate using the input field's value
                    className="px-3 py-1.5 bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-500/50 text-cyan-200 font-bold rounded transition-colors text-sm"
                >
                    Go
                </button>
            </div>

            {/* Content Area (Iframe) */}
            <div className="flex-grow relative bg-black/20 border border-cyan-900/80 rounded-lg overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                        <Spinner className="w-8 h-8 text-cyan-400" />
                        <span className="ml-3 text-cyan-300">Loading web content...</span>
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    src={internalUrl} // iframe src always reflects internalUrl
                    onLoad={handleLoad}
                    className="w-full h-full border-none bg-white" // iframe default background is white, ensure visibility
                    title="QCOS Internal Web Browser"
                    // Security sandbox for iframes: restrict what the content can do
                    sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin allow-top-navigation-by-user-activation allow-presentation" 
                />
            </div>
        </div>
    );
};

export { QCOSInternalWebBrowserContent }; // Export it as content, not a panel