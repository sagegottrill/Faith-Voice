import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
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
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
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

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const intentToListenRef = useRef(false); // Track user intent independent of status
  const autoRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition (ONLY ONCE)
  useEffect(() => {
    if (!isSupported) return;

    // cleanup previous instance if any (though effect should ideally run once)
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
      if (event.error === 'no-speech') {
        return; // Ignore no-speech, keep trying if continuous
      }

      console.warn(`Speech recognition error: ${event.error}`);

      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        setIsListening(false);
        intentToListenRef.current = false;
        setError(event.error === 'not-allowed'
          ? 'Microphone access denied.'
          : 'No microphone found.');
      } else if (event.error === 'network') {
        // Keep intent, it will try to restart in onend
        setError('Network error. Retrying...');
      } else {
        // For other errors, we might want to stop to prevent crazy loops
        // But if it's 'aborted' we just let onend handle it
        if (event.error !== 'aborted') {
          setIsListening(false);
        }
      }
    };

    recognition.onend = () => {
      // Logic: If user WANTS to listen (intent=true), try to restart.
      if (intentToListenRef.current) {
        console.log('Recognition ended unexpectedly. Restarting...');

        // Debounce restart slightly to avoid rapid loops on persistent errors
        autoRestartTimeoutRef.current = setTimeout(() => {
          if (intentToListenRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // If start fails (e.g. not allowed), stop the loop
              console.error("Failed to restart logic:", e);
              intentToListenRef.current = false;
              setIsListening(false);
            }
          }
        }, 300);

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
  }, [isSupported]); // Dependency is ONLY isSupported, not isListening

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    intentToListenRef.current = true;
    setTranscript('');
    setInterimTranscript('');
    setError(null);

    try {
      recognitionRef.current.start();
    } catch (err: any) {
      if (err.name !== 'InvalidStateError') {
        // InvalidStateError means it's already started, which is fine
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
  }, []); // Remove isListening dependency

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
    resetTranscript
  };
}
