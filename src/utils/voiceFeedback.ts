// Voice feedback utility for sermon mode
// Provides spoken confirmations when commands are recognized

export class VoiceFeedback {
    private synth: SpeechSynthesis;
    private enabled: boolean = false;

    constructor() {
        this.synth = window.speechSynthesis;
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    speak(text: string, options: { rate?: number; pitch?: number; volume?: number; onStart?: () => void; onEnd?: () => void } = {}) {
        if (!this.enabled || !this.synth) {
            options.onEnd?.();
            return;
        }

        // Cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate ?? 1.2; // Faster for responsiveness
        utterance.pitch = options.pitch ?? 1.0;
        utterance.volume = options.volume ?? 0.8;

        if (options.onStart) utterance.onstart = options.onStart;
        if (options.onEnd) utterance.onend = options.onEnd;
        utterance.onerror = (e) => {
            console.error('Speech synthesis error:', e);
            options.onEnd?.();
        };

        // Use a clear, professional voice if available
        const voices = this.synth.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes('Google') || v.name.includes('Microsoft') || v.lang.startsWith('en')
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        this.synth.speak(utterance);
    }

    // Quick confirmations
    confirmVerse(reference: string, options?: { onStart?: () => void; onEnd?: () => void }) {
        this.speak(`${reference}`, options);
    }

    confirmSearch(query: string, options?: { onStart?: () => void; onEnd?: () => void }) {
        this.speak(`Searching for ${query}`, options);
    }

    confirmMedia() {
        this.speak('Toggling presentation');
    }

    confirmTranslation(translation: string) {
        this.speak(`Switching to ${translation}`);
    }

    error(message: string, options?: { onStart?: () => void; onEnd?: () => void }) {
        this.speak(`Error: ${message}`, { ...options, pitch: 0.9 });
    }
}

export const voiceFeedback = new VoiceFeedback();
