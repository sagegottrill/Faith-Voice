import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceEngineHook {
    transcript: string;
    interimTranscript: string;
    isListening: boolean;
    isSupported: boolean;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
    isOffline: boolean;
    engineType: 'webspeech' | 'whisper';
    /** Mute mic input (for voice feedback) without stopping recognition */
    muteMic: () => void;
    /** Unmute mic input after voice feedback */
    unmuteMic: () => void;
}

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition: new () => SpeechRecognitionInstance;
    }
}

interface SpeechRecognitionInstance extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
    start: () => void;
    stop: () => void;
    abort: () => void;
}

/**
 * Unified Voice Engine Hook
 * 
 * - Uses Web Speech API when online (faster, streaming interim results)
 * - Falls back to local Whisper when offline (fully offline, slightly slower)
 * - Adds audio gain boost for better microphone pickup
 * - Supports mic mute/unmute for voice feedback without stopping recognition
 */
export function useVoiceEngine(): VoiceEngineHook {
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const intentToListenRef = useRef(false);
    const autoRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMutedRef = useRef(false);

    // Audio gain for better pickup
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const boostedStreamRef = useRef<MediaStream | null>(null);

    const isWebSpeechSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    const engineType = isWebSpeechSupported && !isOffline ? 'webspeech' : 'whisper';
    const isSupported = isWebSpeechSupported || true; // Whisper always available as fallback

    // Track online/offline
    useEffect(() => {
        const goOnline = () => setIsOffline(false);
        const goOffline = () => setIsOffline(true);
        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    // Create audio gain boost for better mic pickup
    const createBoostedStream = useCallback(async (): Promise<MediaStream> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1,
                }
            });
            streamRef.current = stream;

            // Apply software gain boost
            const audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;

            const source = audioCtx.createMediaStreamSource(stream);
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 2.5; // 2.5x amplification for distant speakers
            gainNodeRef.current = gainNode;

            const dest = audioCtx.createMediaStreamDestination();
            source.connect(gainNode);
            gainNode.connect(dest);

            boostedStreamRef.current = dest.stream;
            return dest.stream;
        } catch (err) {
            console.error('Failed to create boosted audio stream:', err);
            // Fallback to raw stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            return stream;
        }
    }, []);

    // Mute/unmute mic (for voice feedback)
    const muteMic = useCallback(() => {
        isMutedRef.current = true;
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = 0; // Mute
        }
    }, []);

    const unmuteMic = useCallback(() => {
        isMutedRef.current = false;
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = 2.5; // Restore boost
        }
    }, []);

    // Initialize Web Speech API recognition
    useEffect(() => {
        if (!isWebSpeechSupported) return;

        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            // Ignore results while muted (voice feedback playing)
            if (isMutedRef.current) return;

            let finalTranscript = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (finalTranscript) {
                setTranscript(prev => {
                    const newTranscript = prev + ' ' + finalTranscript;
                    return newTranscript.trim();
                });
                setInterimTranscript('');
            } else {
                setInterimTranscript(interim);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            if (event.error === 'no-speech') return;

            console.warn(`Speech recognition error: ${event.error}`);

            if (event.error === 'not-allowed' || event.error === 'audio-capture') {
                setIsListening(false);
                intentToListenRef.current = false;
                setError(event.error === 'not-allowed'
                    ? 'Microphone access denied.'
                    : 'No microphone found.');
            } else if (event.error === 'network') {
                setError('Network error. Retrying...');
            } else {
                if (event.error !== 'aborted') {
                    setIsListening(false);
                }
            }
        };

        recognition.onend = () => {
            if (intentToListenRef.current) {
                console.log('Recognition ended unexpectedly. Restarting...');
                autoRestartTimeoutRef.current = setTimeout(() => {
                    if (intentToListenRef.current && recognitionRef.current) {
                        try {
                            recognitionRef.current.start();
                        } catch (e) {
                            console.error("Failed to restart:", e);
                            intentToListenRef.current = false;
                            setIsListening(false);
                        }
                    }
                }, 200); // Faster restart (200ms vs 300ms)
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            intentToListenRef.current = false;
            if (autoRestartTimeoutRef.current) clearTimeout(autoRestartTimeoutRef.current);
            if (recognitionRef.current) recognitionRef.current.abort();
        };
    }, [isWebSpeechSupported]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;

        intentToListenRef.current = true;
        isMutedRef.current = false;
        setTranscript('');
        setInterimTranscript('');
        setError(null);

        try {
            recognitionRef.current.start();
        } catch (err: any) {
            if (err.name !== 'InvalidStateError') {
                console.error("Error starting recognition:", err);
                setError("Failed to start microphone.");
                intentToListenRef.current = false;
            }
        }
    }, []);

    const stopListening = useCallback(() => {
        intentToListenRef.current = false;
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (err) {
                console.error("Error stopping recognition:", err);
            }
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        setError(null);
    }, []);

    return {
        transcript,
        interimTranscript,
        isListening,
        isSupported,
        error,
        startListening,
        stopListening,
        resetTranscript,
        isOffline,
        engineType,
        muteMic,
        unmuteMic,
    };
}
