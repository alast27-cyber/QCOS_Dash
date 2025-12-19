import { useState, useEffect, useRef, useCallback } from 'react';

// Added proper TypeScript definitions for the Web Speech API to resolve the "Cannot find name 'SpeechRecognition'" error.
declare global {
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
    readonly resultIndex: number;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onstart: () => void;
    onend: () => void;
  }

  const SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
  
  const webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }
}

interface Command {
  command: string | string[];
  callback: (spoken: string) => void;
}

// Check for browser support
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSupported = !!SpeechRecognitionAPI;

export type ListeningState = 'idle' | 'listening' | 'error' | 'permission_denied';


export const useVoiceCommands = (commands: Command[]) => {
  const [listeningState, setListeningState] = useState<ListeningState>('idle');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const commandsRef = useRef(commands);
  commandsRef.current = commands;
  const errorTimeoutRef = useRef<number | null>(null);
  
  const isListeningIntentRef = useRef(false);
  const permissionDeniedRef = useRef(false); // Ref to lock state after a fatal permission error

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    // --- Proactive Permission Check ---
    let permissionStatus: PermissionStatus | null = null;
    const handlePermissionChange = () => {
        if (!permissionStatus) return;
        if (permissionStatus.state === 'denied') {
            setListeningState('permission_denied');
            permissionDeniedRef.current = true;
            if (isListeningIntentRef.current && recognitionRef.current) {
                isListeningIntentRef.current = false;
                recognitionRef.current.stop();
            }
        }
    };

    if (typeof navigator.permissions?.query === 'function') {
        navigator.permissions.query({ name: 'microphone' } as any).then(status => {
            permissionStatus = status;
            handlePermissionChange(); // Check initial state
            permissionStatus.addEventListener('change', handlePermissionChange);
        }).catch(err => {
            console.warn("Could not query microphone permission:", err);
        });
    }
    // --- End Proactive Check ---

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    // FIX: Changed language to a more common and widely supported value 'en-US' to prevent potential errors on browsers that do not support 'ceb-PH'.
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListeningState('listening');
    };

    recognition.onend = () => {
      if (permissionDeniedRef.current) {
        return;
      }
      
      if (isListeningIntentRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Speech recognition restart failed:", e);
          isListeningIntentRef.current = false;
          setListeningState('error');
        }
      } else {
        setListeningState('idle');
      }
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
      console.log('Voice transcript:', transcript);
      
      for (const { command, callback } of commandsRef.current) {
        const commandsList = Array.isArray(command) ? command : [command];
        if (commandsList.some(c => transcript.includes(c.toLowerCase()))) {
          callback(transcript);
          break; // Execute first matched command
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      // 'not-allowed' is a fatal error that requires user action to resolve.
      if (event.error === 'not-allowed') {
        permissionDeniedRef.current = true;
        isListeningIntentRef.current = false;
        setListeningState('permission_denied');
        return;
      }
      
      // For other recoverable errors like 'no-speech' or 'network',
      // we just log them. The `onend` event will fire subsequently,
      // and our logic there will attempt to restart the recognition service
      // if the user still intends for it to be listening.
      console.warn(`Speech recognition error: ${event.error}. The service will attempt to restart.`);
    };
    
    recognitionRef.current = recognition;

    return () => {
      isListeningIntentRef.current = false;
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      if (recognitionRef.current) {
          recognitionRef.current.onstart = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.stop();
      }
      if (permissionStatus) {
        permissionStatus.removeEventListener('change', handlePermissionChange);
      }
    };
  }, []);

  useEffect(() => {
    if (listeningState === 'error') {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = window.setTimeout(() => {
        if (!isListeningIntentRef.current) {
          setListeningState('idle');
        }
      }, 3000);
    }
     return () => {
      if(errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    }
  }, [listeningState]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current || permissionDeniedRef.current) return;

    if (isListeningIntentRef.current) {
      isListeningIntentRef.current = false;
      recognitionRef.current.stop();
    } else {
      isListeningIntentRef.current = true;
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Could not start recognition:", e);
        isListeningIntentRef.current = false;
        setListeningState('error');
      }
    }
  }, []);
  
  return { listeningState, toggleListening, isSupported };
};