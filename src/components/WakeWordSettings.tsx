import React from 'react';

interface WakeWordSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const WakeWordSettings: React.FC<WakeWordSettingsProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="lush-glass rounded-3xl p-8 max-w-2xl w-full mx-4 animate-in zoom-in-95 slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground">Wake Word Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-6">
                        <h3 className="font-bold text-accent mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            How Wake Words Work
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The app only responds when you say a <strong>wake word</strong> followed by a Bible verse reference.
                            This prevents accidental activations during your sermon.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground mb-3">Active Wake Words</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {['Bible', 'VoiceBible', 'Hey Bible', 'Scripture App', 'Bible App'].map(word => (
                                <div key={word} className="px-4 py-3 bg-secondary rounded-lg border border-border">
                                    <span className="font-mono text-sm text-foreground">"{word}"</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold text-foreground mb-3">Example Commands</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <div>
                                    <p className="font-medium text-foreground">"Bible, John 3:16"</p>
                                    <p className="text-muted-foreground text-xs">Will activate and show the verse</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <div>
                                    <p className="font-medium text-foreground">"VoiceBible, find Psalm 23"</p>
                                    <p className="text-muted-foreground text-xs">Will activate and search</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-red-500 mt-0.5">✗</span>
                                <div>
                                    <p className="font-medium text-foreground">"I was reading John yesterday..."</p>
                                    <p className="text-muted-foreground text-xs">Will be ignored (no wake word)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/5 border border-accent/10 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground">
                            <strong>Tip:</strong> The app listens continuously but only activates when it hears a wake word + verse reference.
                            This allows you to preach naturally without interruptions.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WakeWordSettings;
