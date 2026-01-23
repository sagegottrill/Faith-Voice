import { pipeline, env } from '@xenova/transformers';

// Configuration
// env.allowLocalModels = false; 
// env.useBrowserCache = true;

class WhisperService {
    private static instance: WhisperService;
    private transcriber: any = null;
    private isInitialized = false;
    private isProcessing = false;

    private constructor() { }

    public static getInstance(): WhisperService {
        if (!WhisperService.instance) {
            WhisperService.instance = new WhisperService();
        }
        return WhisperService.instance;
    }

    public async init() {
        if (this.isInitialized) return;

        try {
            // Using 'Xenova/whisper-tiny.en' for speed and offline capability (40MB)
            this.transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
            this.isInitialized = true;
            console.log('Whisper Model Initialized');
        } catch (error) {
            console.error('Failed to initialize Whisper:', error);
            throw error;
        }
    }

    public async transcribe(audioData: Float32Array): Promise<{ text: string }> {
        if (!this.transcriber) await this.init();
        if (this.isProcessing) throw new Error('Already processing');

        this.isProcessing = true;
        try {
            const output = await this.transcriber(audioData, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: 'english',
            });
            return { text: output.text };
        } finally {
            this.isProcessing = false;
        }
    }
}

export const whisperService = WhisperService.getInstance();
