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

    speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}) {
        if (!this.enabled || !this.synth) return;

        // Cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate ?? 1.2; // Faster for responsiveness
        utterance.pitch = options.pitch ?? 1.0;
        utterance.volume = options.volume ?? 0.8;

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
    confirmVerse(reference: string) {
        this.speak(`${reference}`);
    }

    confirmSearch(query: string) {
        this.speak(`Searching for ${query}`);
    }

    confirmMedia() {
        this.speak('Toggling presentation');
    }

    confirmTranslation(translation: string) {
        this.speak(`Switching to ${translation}`);
    }

    error(message: string) {
        this.speak(`Error: ${message}`, { pitch: 0.9 });
    }
}

export const voiceFeedback = new VoiceFeedback();
