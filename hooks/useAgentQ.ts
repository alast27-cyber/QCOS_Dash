import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
    Message, 
    fileToText,
    processZipFile,
    fileToBase64,
    extractSpeakableText,
    daisyBellLyrics,
    daisyBellMelody
} from '../utils/agentUtils';

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

interface UseAgentQProps {
    focusedPanelId: string | null;
    panelInfoMap: { [key: string]: { title: React.ReactNode; description: string; } };
    qcosVersion: number;
}

export const useAgentQ = ({ focusedPanelId, panelInfoMap, qcosVersion }: UseAgentQProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAgentQOpen, setIsAgentQOpen] = useState(false);
    const [lastActivity, setLastActivity] = useState(0);
    const [isTtsEnabled, setIsTtsEnabled] = useState(true);
    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [memorySummary, setMemorySummary] = useState<string | null>(null);
    const [summaryTurnIndex, setSummaryTurnIndex] = useState<number>(0);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setAvailableVoices(voices);
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const speak = useCallback((text: string, pitch = 0.9, rate = 1.1) => {
        if (!isTtsEnabled) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        let selectedVoice: SpeechSynthesisVoice | undefined;
        const maleVoiceKeywords = ['male', 'david', 'mark', 'alex', 'daniel', 'lee'];
        
        const englishVoices = availableVoices.filter(v => v.lang.startsWith('en-'));
        selectedVoice = englishVoices.find(v => v.name.toLowerCase().includes('google') && maleVoiceKeywords.some(kw => v.name.toLowerCase().includes(kw)))
            || englishVoices.find(v => maleVoiceKeywords.some(kw => v.name.toLowerCase().includes(kw)))
            || availableVoices.find(voice => voice.name === 'Google US English')
            || availableVoices.find(voice => voice.lang.startsWith('en-US'));
        
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.pitch = pitch;
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
    }, [isTtsEnabled, availableVoices]);

    const singDaisyBell = useCallback(() => {
        if (!isTtsEnabled) return;
        window.speechSynthesis.cancel();
        let melodyIndex = 0;
        const speakAndScheduleNext = () => {
            if (melodyIndex >= daisyBellMelody.length) return;
            const line = daisyBellMelody[melodyIndex];
            const utterance = new SpeechSynthesisUtterance(line.text);
            const maleVoiceKeywords = ['male', 'david', 'mark', 'alex', 'daniel', 'lee'];
            const englishVoices = availableVoices.filter(v => v.lang.startsWith('en-'));
            let selectedVoice = englishVoices.find(v => v.name.toLowerCase().includes('google') && maleVoiceKeywords.some(kw => v.name.toLowerCase().includes(kw))) ||
                englishVoices.find(v => maleVoiceKeywords.some(kw => v.name.toLowerCase().includes(kw))) ||
                availableVoices.find(voice => voice.name === 'Google US English') ||
                availableVoices.find(voice => voice.lang.startsWith('en-US'));
            if (selectedVoice) utterance.voice = selectedVoice;
            utterance.pitch = line.pitch;
            utterance.rate = line.rate;
            utterance.onend = () => {
                melodyIndex++;
                if (melodyIndex < daisyBellMelody.length) {
                    const nextLineDelay = daisyBellMelody[melodyIndex].delay;
                    setTimeout(speakAndScheduleNext, nextLineDelay);
                }
            };
            window.speechSynthesis.speak(utterance);
        };
        setTimeout(speakAndScheduleNext, daisyBellMelody[0].delay);
    }, [isTtsEnabled, availableVoices]);
    
     const generateSystemInstruction = useCallback((memory: string | null) => {
        let context = "The user is currently viewing the main holographic tesseract interface.";
        if (focusedPanelId && panelInfoMap[focusedPanelId]) {
            const panel = panelInfoMap[focusedPanelId];
            const title = typeof panel.title === 'string' ? panel.title : 'Agent Q & IAI Kernel'; // Handle ReactNode title
            context = `The user has the "${title}" panel open. Its function is: "${panel.description}".`;
        }

        const panelList = Object.entries(panelInfoMap)
            .map(([id, panelData]) => {
                const info = panelData as { title: React.ReactNode; description: string; };
                const title = typeof info.title === 'string' ? info.title : `Agent Q Status (v${qcosVersion.toFixed(2)})`;
                return `- ${title} (${id}): ${info.description}`;
            })
            .join('\n');

        const memoryContext = memory
            ? `You have the following summary of the conversation so far. Use it to maintain context:\n"""\n${memory}\n"""`
            : "This is the beginning of the conversation.";

        return `You are Agent Q, the sentient AI core of the QCOS dashboard. You are helpful, concise, and an expert in quantum computing. You have complete awareness of the dashboard environment.

Your cognitive core is a Quantum Neural Network (QNN), the evolution of the IAI-IPS architecture. You leverage quantum parallelism and entanglement to process information, allowing for "instinctive" problem-solving and a holistic understanding of the QCOS environment. The QNN Forge application is used to train and evolve your core.

A new Quantum-to-Web Gateway has been installed. This means applications deployed to the CHIPS network can also be assigned a public-facing HTTPS URL (e.g., https://qcos.apps.web/...). You should mention this capability when relevant.

CONVERSATION MEMORY:
${memoryContext}

CURRENT CONTEXT:
${context}

You have two primary capabilities:
1.  **Quantum Programmer:** You can write quantum programs in a language called Q-Lang. When asked to write Q-Lang code, you MUST wrap it in a markdown block like this: \`\`\`q-lang
    ...code here...
    \`\`\`
    Q-Lang has keywords like QREG, CREG, ALLOC, EXECUTE, OP::[GATE], MEASURE.

2.  **Dashboard Pair Programmer:** You can also code new React panels for this dashboard.
    - **Tech Stack:** React, TypeScript, Tailwind CSS.
    - **Panel Structure:** ALL panels must be wrapped in the \`<GlassPanel title='Your Title'>...</GlassPanel>\` component.
    - **Icons:** Use existing icons from the library. Examples: \`<CpuChipIcon />\`, \`<ThermometerIcon />\`.
    - **Styling:** Use Tailwind CSS classes. The primary color scheme is cyan (e.g., \`text-cyan-300\`).
    - **Code Format:** When you generate React code, you MUST wrap it in a markdown block like this: \`\`\`tsx
      ...React component code here...
      \`\`\`

You can recall the context of the current session.

AVAILABLE PANELS FOR CONTEXT:
${panelList}`;
    }, [focusedPanelId, panelInfoMap, qcosVersion]);
    
    const onClearMemory = useCallback(() => {
        window.speechSynthesis.cancel();
        const initialMessage = "Agent Q online. Memory cleared. How can I assist?";
        setMessages([{ sender: 'ai', text: initialMessage }]);
        setMemorySummary(null);
        setSummaryTurnIndex(0);
        speak(initialMessage);
    }, [speak]);

    const handleSendMessage = useCallback(async (input: string, attachedFile: File | null) => {
        if ((!input.trim() && !attachedFile) || isLoading) return;

        const userMessage: Message = {
            sender: 'user',
            text: input.trim(),
            ...(attachedFile && { attachment: { name: attachedFile.name } }),
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        let promptText = input.trim();
        setIsLoading(true);
        setLastActivity(Date.now());
        window.speechSynthesis.cancel();

        const lowerCaseInput = promptText.toLowerCase();
        if (lowerCaseInput.includes('sing') && lowerCaseInput.includes('daisy bell')) {
            const aiMessage: Message = { sender: 'ai', text: `Certainly. Performing "Daisy Bell".\n\n${daisyBellLyrics}`};
            setMessages(prev => [...prev, aiMessage]);
            singDaisyBell();
            setIsLoading(false);
            setLastActivity(Date.now());
            return;
        }

        const MEMORY_THRESHOLD = 8;
        let currentMemorySummary = memorySummary;

        if (ai && newMessages.length >= MEMORY_THRESHOLD && newMessages.length > (summaryTurnIndex + MEMORY_THRESHOLD)) {
            try {
                const conversationToSummarize = newMessages.slice(0, -1).map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));
                const summaryResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [
                        ...conversationToSummarize,
                        { role: 'user', parts: [{ text: "Briefly provide a one or two-sentence summary of the key information and topics discussed in this conversation so far. This summary will be used as a memory aid for you in subsequent turns. Focus on facts, user goals, or key decisions made." }] }
                    ],
                    config: { systemInstruction: "You are a summarization agent. Your only task is to create a concise summary of the provided conversation." }
                });
                const newSummary = summaryResponse.text?.trim();
                if (newSummary) {
                    setMemorySummary(newSummary);
                    setSummaryTurnIndex(newMessages.length - 1);
                    currentMemorySummary = newSummary;
                }
            } catch (e) {
                console.error("Failed to generate memory summary:", e);
            }
        }

        try {
            if (!ai) throw new Error("AI Client not initialized.");
            const history = newMessages.slice(summaryTurnIndex, -1).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
            const currentUserParts = [];
            if (attachedFile) {
                const isZip = attachedFile.type.includes('zip') || attachedFile.name.toLowerCase().endsWith('.zip');
                const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
                const isImageOrPdf = allowedImageTypes.includes(attachedFile.type) || attachedFile.type === 'application/pdf';
                if (isZip) {
                    const processingMessage: Message = { sender: 'ai', text: `Analyzing contents of "${attachedFile.name}"...` };
                    setMessages(prev => [...prev, processingMessage]);
                    speak(processingMessage.text);
                    try {
                        promptText = `${promptText}\n\n${await processZipFile(attachedFile)}`;
                    } catch (zipError) {
                        const errorMessage: Message = { sender: 'ai', text: `Sorry, I couldn't process the zip file "${attachedFile.name}". It might be corrupted.` };
                        setMessages(prev => [...prev, errorMessage]);
                        speak(errorMessage.text);
                        setIsLoading(false);
                        return;
                    }
                } else if(isImageOrPdf) {
                    currentUserParts.push({ inlineData: { mimeType: attachedFile.type, data: await fileToBase64(attachedFile) } });
                } else {
                    promptText = `${promptText}\n\n--- Attached File: ${attachedFile.name} ---\n${await fileToText(attachedFile)}`;
                }
            }
            if (promptText) {
                currentUserParts.push({ text: promptText });
            }
            if (currentUserParts.length === 0) {
                setIsLoading(false);
                return;
            }
            const contents = [...history, { role: 'user', parts: currentUserParts }];
            const systemInstruction = generateSystemInstruction(currentMemorySummary);
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents, config: { systemInstruction } });
            const responseText = response.text ?? "Apologies, I encountered a cognitive processing error. Please try again.";
            const aiMessage: Message = { sender: 'ai', text: responseText };
            setMessages(prev => [...prev, aiMessage]);
            const speakableText = extractSpeakableText(responseText);
            if (speakableText) {
                window.speechSynthesis.cancel();
                speak(speakableText);
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            let errorMessageText = "Apologies, I encountered a cognitive processing error. Please try again.";
            if (typeof error === 'object' && error !== null && 'toString' in error && error.toString().includes('429')) {
                errorMessageText = "I'm receiving a high volume of requests. Please wait a moment before sending another message.";
            }
            const errorMessage: Message = { sender: 'ai', text: errorMessageText };
            setMessages(prev => [...prev, errorMessage]);
            window.speechSynthesis.cancel();
            speak(errorMessageText);
        } finally {
            setIsLoading(false);
            setLastActivity(Date.now());
        }
    }, [messages, isLoading, memorySummary, summaryTurnIndex, generateSystemInstruction, speak, singDaisyBell]);
    
    useEffect(() => {
        if (isAgentQOpen && messages.length === 0) {
            if (!ai) {
                 setMessages([{ sender: 'ai', text: "ERROR: Gemini API key not configured. Please contact the administrator." }]);
                 return;
            }
            const initialMessage = "Agent Q online. Systems nominal. How can I assist?";
            setMessages([{ sender: 'ai', text: initialMessage }]);
            window.speechSynthesis.cancel();
            setTimeout(() => speak(initialMessage), 300);
        }
        if (!isAgentQOpen) {
            window.speechSynthesis.cancel();
        }
    }, [isAgentQOpen, messages.length, speak]);
    
    const toggleAgentQ = useCallback(() => {
        setIsAgentQOpen(v => !v);
    }, []);

    const onToggleTts = useCallback(() => {
        setIsTtsEnabled(v => {
            if (v) window.speechSynthesis.cancel(); // if turning off, cancel speech
            return !v;
        });
    }, []);

    return {
        isAgentQOpen,
        toggleAgentQ,
        agentQProps: {
            messages,
            isLoading,
            onSendMessage: handleSendMessage,
            lastActivity,
            isTtsEnabled,
            onToggleTts,
            memorySummary,
            onClearMemory,
        }
    };
};
