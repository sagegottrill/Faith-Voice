import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './Navigation';
import { fetchLocalVerses, searchLocalVerses } from '@/utils/localBible';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSavedVerses } from '@/hooks/useSavedVerses';
import { parseVerseReference, formatVerseReference } from '@/utils/bibleParser';
import { VerseReference, Verse } from '@/utils/bibleData';
import MicrophoneButton from './MicrophoneButton';
import VoiceTranscript from './VoiceTranscript';
import VerseDisplay from './VerseDisplay';
import ExamplePhrases from './ExamplePhrases';
import SavedVersesPanel from './SavedVersesPanel';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { classifyIntent } from '@/utils/intentClassifier';
import { Search, Bookmark, Sparkles } from 'lucide-react';

interface VerseResponse {
    verses: Verse[];
    reference: string;
    translation: string;
    error?: string;
}

const AppLayout: React.FC = () => {
    const {
        transcript,
        interimTranscript,
        isListening,
        isSupported,
        error: speechError,
        startListening,
        stopListening,
        resetTranscript
    } = useSpeechRecognition();

    const {
        savedVerses,
        isLoading: savedVersesLoading,
        isVerseSaved,
        toggleSaveVerse,
        updateNote,
        deleteVerse
    } = useSavedVerses();

    const { search: semanticSearch, isReady: isSemanticReady, isLoading: isSemanticLoading } = useSemanticSearch();

    const [verses, setVerses] = useState<Verse[]>([]);
    const [reference, setReference] = useState('');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [currentRef, setCurrentRef] = useState<VerseReference | null>(null);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const [showSavedPanel, setShowSavedPanel] = useState(false);
    const [lastIntent, setLastIntent] = useState<string | null>(null);

    // Fetch verses from local JSON
    const fetchVerses = useCallback(async (ref: VerseReference) => {
        setIsLoading(true);
        setFetchError(null);
        setCurrentRef(ref);

        try {
            const { verses: foundVerses, error } = fetchLocalVerses({
                book: ref.book,
                chapter: ref.chapter,
                verse: ref.verse,
                contextBefore: 3,
                contextAfter: 3
            });

            if (error) {
                setFetchError(error);
                return;
            }

            if (foundVerses && foundVerses.length > 0) {
                setVerses(foundVerses);
                setReference(formatVerseReference(ref));
                setTranslation('KJV (Offline)');
            } else {
                setFetchError('No verses found for this reference.');
            }
        } catch (err: any) {
            console.error('Error fetching verses:', err);
            setFetchError(err.message || 'Failed to fetch verses.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Process transcript when speech ends
    useEffect(() => {
        if (!isListening && transcript && !isLoading) {

            // 1. Intent Gatekeeper
            const intent = classifyIntent(transcript);
            setLastIntent(intent.type);

            // If it's just a story/conversation, ignore it.
            if (intent.type === 'NARRATIVE') {
                console.log('Ignored Narrative:', transcript);
                // We could set a temporary UI state here to show "Ignored"
                // For now, we rely on the visual feedback of *not* searching.
                return;
            }

            const ref = parseVerseReference(transcript);
            if (ref) {
                fetchVerses(ref);
            } else if (transcript.trim().length > 0) {
                const searchResults = searchLocalVerses(transcript.trim());
                if (searchResults.length > 0) {
                    setVerses(searchResults);
                    setReference(`Search: "${transcript}"`);
                    setTranslation('KJV (Offline)');
                    setFetchError(null);
                } else {
                    setFetchError(`Couldn't find any verses matching "${transcript}".`);

                    // Fallback to Semantic Search
                    if (isSemanticReady) {
                        setFetchError(null);
                        setIsLoading(true);
                        semanticSearch(transcript).then(results => {
                            if (results.length > 0) {
                                // Fetch the full verse text for the top result
                                const topResult = results[0];
                                const ref = parseVerseReference(topResult.reference);
                                if (ref) {
                                    fetchVerses(ref);
                                    setReference(formatVerseReference(ref));
                                    setTranslation(`KJV • ${Math.round(topResult.score * 100)}% match`);
                                }
                            } else {
                                setFetchError(`No verses found matching "${transcript}"`);
                            }
                            setIsLoading(false);
                        });
                    }
                }
            }
        } else if (isListening) {
            setLastIntent(null);
        }
    }, [isListening, transcript, fetchVerses, isLoading, isSemanticReady, semanticSearch]);

    // Handle microphone button click
    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            resetTranscript();
            setVerses([]);
            setFetchError(null);
            setLastIntent(null);
            startListening();
        }
    };

    // Handle example phrase click
    const handlePhraseClick = (phrase: string) => {
        const ref = parseVerseReference(phrase);
        if (ref) {
            resetTranscript();
            setVerses([]);
            setFetchError(null);
            fetchVerses(ref);
        }
    };

    // Handle manual input submit
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualInput.trim()) {
            const ref = parseVerseReference(manualInput);
            if (ref) {
                resetTranscript();
                setVerses([]);
                setFetchError(null);
                fetchVerses(ref);
                setManualInput('');
                setShowManualInput(false);
            } else {
                const searchResults = searchLocalVerses(manualInput.trim());
                if (searchResults.length > 0) {
                    setVerses(searchResults);
                    setReference(`Search: "${manualInput}"`);
                    setTranslation('KJV (Offline)');
                    setFetchError(null);
                    setManualInput('');
                    setShowManualInput(false);
                } else {
                    setFetchError(`Couldn't find any verses matching "${manualInput}".`);

                    // Fallback to Semantic Search
                    if (isSemanticReady) {
                        setFetchError(null);
                        setIsLoading(true);
                        semanticSearch(manualInput).then(results => {
                            if (results.length > 0) {
                                // Fetch the full verse text for the top result
                                const topResult = results[0];
                                const ref = parseVerseReference(topResult.reference);
                                if (ref) {
                                    fetchVerses(ref);
                                    setReference(formatVerseReference(ref));
                                    setTranslation(`KJV • ${Math.round(topResult.score * 100)}% match`);
                                }
                            } else {
                                setFetchError(`No verses found matching "${manualInput}"`);
                            }
                            setManualInput('');
                            setShowManualInput(false);
                            setIsLoading(false);
                        });
                    }
                }
            }
        }
    };

    // Close verse display
    const handleClose = () => {
        setVerses([]);
        setReference('');
        setFetchError(null);
        resetTranscript();
        setLastIntent(null);
    };

    // Navigate to previous/next verse
    const handleNavigate = (direction: 'prev' | 'next') => {
        if (!currentRef) return;

        const newRef = { ...currentRef };
        if (direction === 'prev') {
            newRef.verse = Math.max(1, newRef.verse - 1);
        } else {
            newRef.verse = newRef.verse + 1;
        }

        fetchVerses(newRef);
    };

    // Handle toggle save verse
    const handleToggleSave = async (book: string, chapter: number, verse: number, text: string) => {
        await toggleSaveVerse(book, chapter, verse, text);
    };

    // Handle verse click from saved panel
    const handleSavedVerseClick = (book: string, chapter: number, verse: number) => {
        setShowSavedPanel(false);
        fetchVerses({ book, chapter, verse });
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showSavedPanel) return;

            if (verses.length > 0) {
                if (e.key === 'ArrowLeft') {
                    handleNavigate('prev');
                } else if (e.key === 'ArrowRight') {
                    handleNavigate('next');
                } else if (e.key === 'Escape') {
                    handleClose();
                }
            }
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                handleMicClick();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [verses, currentRef, showSavedPanel]);

    const showVerseDisplay = verses.length > 0 || isLoading || fetchError;

    return (
        <div className="min-h-screen bg-transparent transition-colors duration-500">
            <Navigation
                onManualSearchClick={() => setShowManualInput(!showManualInput)}
                onSavedVersesClick={() => setShowSavedPanel(true)}
                savedCount={savedVerses.length}
            />

            {/* Manual input bar */}
            {showManualInput && (
                <div className="fixed top-24 left-4 right-4 z-40 animate-in fade-in slide-in-from-top-2">
                    <form onSubmit={handleManualSubmit} className="max-w-2xl mx-auto">
                        <div className="lush-glass rounded-2xl p-2 flex items-center gap-2">
                            <Search className="ml-3 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                                placeholder="Type a verse reference (e.g., John 3:16)"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder-muted-foreground h-12 text-lg focus:outline-none"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setManualInput('');
                                    setShowManualInput(false);
                                }}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Main content */}
            <main className={`pt-24 ${showManualInput ? 'pt-36' : ''} pb-16 px-4 transition-all duration-300`}>
                <div className="max-w-5xl mx-auto">
                    {/* Hero section */}
                    {!showVerseDisplay && (
                        <div className="animate-in fade-in duration-700">

                            {/* Daily Greeting Area */}
                            <div className="text-center mb-12 py-8">
                                <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                                    Daily Devotion
                                </span>
                                <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-4 font-bold tracking-tight">
                                    Good Morning.
                                </h2>
                                <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed text-balance">
                                    Connect with the Word through your voice. What scripture is on your heart today?
                                </p>
                            </div>

                            {/* Main Interaction Area */}
                            <div className="grid md:grid-cols-12 gap-6 items-start">

                                {/* Left Column: Quick Actions */}
                                <div className="hidden md:flex md:col-span-3 flex-col gap-4">
                                    <div className="lush-card p-6 flex flex-col items-center text-center gap-3 hover:scale-[1.02] cursor-pointer group" onClick={() => setShowSavedPanel(true)}>
                                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                            <Bookmark className="w-6 h-6 text-accent" />
                                        </div>
                                        <h3 className="font-serif font-bold text-foreground">My Library</h3>
                                        <p className="text-xs text-muted-foreground">Access your {savedVerses.length} saved verses</p>
                                    </div>
                                    <div className="lush-card p-6 flex flex-col items-center text-center gap-3 hover:scale-[1.02] cursor-pointer group" onClick={() => setShowManualInput(true)}>
                                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                            <Search className="w-6 h-6 text-accent" />
                                        </div>
                                        <h3 className="font-serif font-bold text-foreground">Quick Find</h3>
                                        <p className="text-xs text-muted-foreground">Type a reference manually</p>
                                    </div>
                                </div>

                                {/* Center Column: Microphone (Hero) */}
                                <div className="md:col-span-6 flex flex-col items-center">
                                    <div className="relative mb-8">
                                        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full opacity-50" />
                                        <MicrophoneButton
                                            isListening={isListening}
                                            isProcessing={isLoading}
                                            isSupported={isSupported}
                                            onClick={handleMicClick}
                                        />
                                    </div>

                                    <div className="h-24 flex items-center justify-center w-full">
                                        <VoiceTranscript
                                            transcript={transcript}
                                            interimTranscript={interimTranscript}
                                            isListening={isListening}
                                            error={speechError}
                                        />
                                    </div>

                                    {/* Intent Feedback */}
                                    {lastIntent === 'NARRATIVE' && (
                                        <div className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-muted-foreground animate-in fade-in slide-in-from-top-2">
                                            Ignored narrative speech
                                        </div>
                                    )}

                                    <p className="text-muted-foreground/60 text-sm mt-4 font-medium tracking-wide uppercase">
                                        {isListening ? 'Listening...' : 'Tap Mic to Speak'}
                                    </p>
                                </div>

                                {/* Right Column: Inspiration */}
                                <div className="md:col-span-3 flex flex-col gap-4">
                                    <div className="lush-card p-5">
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Try Saying</h3>
                                        <div className="flex flex-col gap-2">
                                            {["Psalm 23", "John 3:16", "The Lord is my shepherd", "Romans 8:28"].map(phrase => (
                                                <button
                                                    key={phrase}
                                                    onClick={() => handlePhraseClick(phrase)}
                                                    className="text-left px-3 py-2 rounded-lg hover:bg-secondary text-sm text-foreground/80 hover:text-accent transition-colors truncate"
                                                >
                                                    "{phrase}"
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Only: stacked cards */}
                            <div className="md:hidden mt-12 grid grid-cols-2 gap-4">
                                <div className="lush-card p-4 flex flex-col items-center gap-2" onClick={() => setShowSavedPanel(true)}>
                                    <Bookmark className="w-5 h-5 text-accent" />
                                    <span className="text-sm font-bold">Library</span>
                                </div>
                                <div className="lush-card p-4 flex flex-col items-center gap-2" onClick={() => setShowManualInput(true)}>
                                    <Search className="w-5 h-5 text-accent" />
                                    <span className="text-sm font-bold">Type</span>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Verse display */}
                    {showVerseDisplay && (
                        <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Back to search button */}
                            {!isLoading && verses.length > 0 && (
                                <button
                                    onClick={handleClose}
                                    className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all group"
                                >
                                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    <span className="text-sm font-medium">Back to Home</span>
                                </button>
                            )}

                            <VerseDisplay
                                verses={verses}
                                reference={reference}
                                translation={translation}
                                isLoading={isLoading}
                                error={fetchError}
                                onClose={handleClose}
                                onNavigate={handleNavigate}
                                isVerseSaved={isVerseSaved}
                                onToggleSave={handleToggleSave}
                            />

                            {/* Search again section */}
                            {verses.length > 0 && !isLoading && (
                                <div className="mt-16 flex justify-center">
                                    <div className="lush-glass rounded-full px-6 py-3 flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground font-medium">Search again</span>
                                        <div className="w-px h-4 bg-border" />
                                        <button onClick={handleMicClick} className="p-2 bg-accent rounded-full text-accent-foreground hover:scale-105 transition-transform shadow-lg shadow-accent/20">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Saved Verses Panel */}
            <SavedVersesPanel
                isOpen={showSavedPanel}
                onClose={() => setShowSavedPanel(false)}
                savedVerses={savedVerses}
                isLoading={savedVersesLoading}
                onDeleteVerse={deleteVerse}
                onUpdateNote={updateNote}
                onVerseClick={handleSavedVerseClick}
            />
        </div>
    );
};

export default AppLayout;
