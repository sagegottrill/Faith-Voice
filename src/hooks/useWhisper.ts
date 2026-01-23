import { useState, useCallback, useRef, useEffect } from 'react';
import { whisperService } from '@/services/WhisperService';

export const useWhisper = () => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<{ stop: () => void } | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const isListeningRef = useRef(false);

    useEffect(() => {
        // Preload model
        whisperService.init().catch(console.error);
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const startListening = useCallback(async () => {
        if (isListeningRef.current) return;

        try {
            setError(null);
            setTranscript('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            isListeningRef.current = true;
            setIsListening(true);

            // Create AudioContext (16kHz required by Whisper models usually)
            const audioCtx = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioCtx;

            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);

            source.connect(processor);
            processor.connect(audioCtx.destination);

            const audioData: number[] = [];

            processor.onaudioprocess = (e) => {
                if (!isListeningRef.current) return;
                const inputData = e.inputBuffer.getChannelData(0);
                for (let i = 0; i < inputData.length; i++) {
                    audioData.push(inputData[i]);
                }
            };

            mediaRecorderRef.current = {
                stop: async () => {
                    isListeningRef.current = false;
                    setIsListening(false);

                    // Stop tracks
                    stream.getTracks().forEach(track => track.stop());

                    // Disconnect nodes
                    source.disconnect();
                    processor.disconnect();

                    if (audioCtx.state !== 'closed') {
                        await audioCtx.close();
                    }

                    // Process
                    if (audioData.length > 0) {
                        setIsProcessing(true);
                        try {
                            const float32 = new Float32Array(audioData);
                            // Process in main thread for now (might freeze UI slightly on weak devices)
                            // Ideally offload to worker
                            const result = await whisperService.transcribe(float32);
                            setTranscript(result.text);
                        } catch (err: any) {
                            setError(err.message || 'Transcription failed');
                        } finally {
                            setIsProcessing(false);
                        }
                    }
                }
            };

        } catch (err: any) {
            setError(err.message || 'Microphone access denied');
            setIsListening(false);
            isListeningRef.current = false;
        }
    }, []);

    const stopListening = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    return {
        transcript,
        // Mimic the WebSpeech API interface somewhat
        interimTranscript: '', // Whisper doesn't do interim in this basic mode
        isListening,
        isSupported: true, // Assuming modern browser
        error,
        startListening,
        stopListening,
        resetTranscript,
        isProcessing
    };
};
