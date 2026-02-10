import React, { useState, useEffect } from 'react';
import { Trash2, Plus, RefreshCw } from 'lucide-react';
import { DEFAULT_WAKE_WORDS } from '@/utils/intentClassifier';

interface WakeWordSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const WakeWordSettings: React.FC<WakeWordSettingsProps> = ({ isOpen, onClose }) => {
    const [customWords, setCustomWords] = useState<string[]>([]);
    const [newWord, setNewWord] = useState('');

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('faith-voice-wake-words');
            if (saved) {
                setCustomWords(JSON.parse(saved));
            }
        }
    }, [isOpen]);

    const saveWords = (words: string[]) => {
        localStorage.setItem('faith-voice-wake-words', JSON.stringify(words));
        setCustomWords(words);
    };

    const handleAdd = () => {
        if (newWord.trim()) {
            const updated = [...customWords, newWord.trim()];
            saveWords(updated);
            setNewWord('');
        }
    };

    const handleDelete = (wordToDelete: string) => {
        const updated = customWords.filter(w => w !== wordToDelete);
        saveWords(updated);
    };

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
                            <RefreshCw className="w-5 h-5" />
                            How Wake Words Work
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The app only responds when you say a <strong>wake word</strong> followed by a Bible verse reference.
                            You can add your own custom phrases here.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground mb-3">Active Wake Words</h3>

                        {/* Default Words (Read-only) */}
                        <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Default (Built-in)</p>
                            <div className="flex flex-wrap gap-2">
                                {DEFAULT_WAKE_WORDS.map(word => (
                                    <div key={word} className="px-3 py-2 bg-secondary/50 rounded-lg border border-border/50 text-sm opacity-80">
                                        {word}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Custom Words */}
                        <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Custom (Your phrases)</p>
                            <div className="flex flex-wrap gap-2">
                                {customWords.length === 0 && <span className="text-sm italic text-muted-foreground">No custom words yet.</span>}
                                {customWords.map(word => (
                                    <div key={word} className="pl-3 pr-1 py-1 bg-primary/10 rounded-lg border border-primary/20 text-sm flex items-center gap-2">
                                        <span className="font-medium text-primary">{word}</span>
                                        <button onClick={() => handleDelete(word)} className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add New */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newWord}
                                onChange={(e) => setNewWord(e.target.value)}
                                placeholder="Enter specific phrase (e.g., 'Listen Now')"
                                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 font-medium"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold text-foreground mb-3">Example Commands</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <div>
                                    <p className="font-medium text-foreground">"Bible, John 3:16"</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <div>
                                    <p className="font-medium text-foreground">"Media, display mode"</p>
                                    <p className="text-muted-foreground text-xs">Toggles presentation screen</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                    >
                        Success
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WakeWordSettings;
