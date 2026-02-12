import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './Navigation';
import { bibleService } from '@/utils/bibleService';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSavedVerses } from '@/hooks/useSavedVerses';
import { smartParse, parseVerseReference, formatVerseReference } from '@/utils/bibleParser';
import { VerseReference, Verse } from '@/utils/bibleData';
import MicrophoneButton from './MicrophoneButton';
import VoiceTranscript from './VoiceTranscript';
import VerseDisplay from './VerseDisplay';
import ExamplePhrases from './ExamplePhrases';
import SavedVersesPanel from './SavedVersesPanel';
import CommandPalette from './CommandPalette';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { useReadingStats } from '@/hooks/useReadingStats';
import { classifyIntent } from '@/utils/intentClassifier';
import { isTopicQuery, extractTopicKeyword, searchTopics } from '@/utils/topicIndex';
import { getCuteError, getCuteLoading } from '@/utils/cuteErrors';
import { voiceFeedback } from '@/utils/voiceFeedback';
import { groqBible } from '@/utils/groqBible';
import { Search, Bookmark, Sparkles, Mic, Zap, BrainCircuit, CloudOff } from 'lucide-react';
import { toast } from "sonner";

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
    const [presentationMode, setPresentationMode] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const { trackChapter, trackSearch } = useReadingStats();
    const [sermonMode, setSermonMode] = useState(() => {
        const saved = localStorage.getItem('faith-voice-sermon-mode');
        return saved === 'true';
    });

    // Toggle sermon mode (always-on listening)
    const toggleSermonMode = useCallback(() => {
        setSermonMode(prev => {
            const newMode = !prev;
            localStorage.setItem('faith-voice-sermon-mode', String(newMode));
            voiceFeedback.setEnabled(newMode);

            if (newMode) {
                voiceFeedback.speak('Sermon mode activated');
                // Auto-start listening
                setTimeout(() => {
                    if (!isListening) startListening();
                }, 1000);
            } else {
                voiceFeedback.speak('Normal mode');
                if (isListening) stopListening();
            }
            return newMode;
        });
    }, [isListening, startListening, stopListening]);

    // Toggle presentation mode (triggered by MEDIA intent)
    const togglePresentationMode = useCallback(() => {
        setPresentationMode(prev => !prev);
        console.log('Presentation mode toggled');
        voiceFeedback.confirmMedia();
    }, []);

    // Initialize voice feedback on mount
    useEffect(() => {
        voiceFeedback.setEnabled(sermonMode);
    }, [sermonMode]);

    // Fetch verses from BibleService
    const fetchVerses = useCallback(async (ref: VerseReference) => {
        setIsLoading(true);
        setFetchError(null);
        setCurrentRef(ref);

        try {
            // Get the full chapter content
            const chapterVerses = await bibleService.getChapter(ref.book, ref.chapter);

            if (chapterVerses && chapterVerses.length > 0) {
                // Add isTarget flag for highlighting
                const versesWithHighlight = chapterVerses.map(v => ({
                    ...v,
                    isTarget: v.verse === ref.verse
                }));

                setVerses(versesWithHighlight);
                setReference(formatVerseReference(ref));

                // Highlight specific verse if requested
                // We'll pass this down or handle scrolling later
                // For now, setting the verses is enough
                const currentTrans = bibleService.getCurrentTranslation();
                setTranslation(currentTrans.name);
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

    // Auto-submit on silence
    useEffect(() => {
        if (!isListening || !transcript.trim()) return;

        const timer = setTimeout(() => {
            console.log("Auto-submitting due to silence...");
            stopListening();
            // The useEffect below will handle the actual processing when isListening becomes false
        }, 800); // 0.8s silence timeout (Faster response)

        return () => clearTimeout(timer);
    }, [transcript, isListening, stopListening]);

    // Process transcript when speech ends (Smart NLP Pipeline)
    useEffect(() => {
        if (!isListening && transcript && !isLoading) {
            console.log("Processing transcript:", transcript);

            // 1. Intent Gatekeeper
            const savedWakeWords = localStorage.getItem('faith-voice-wake-words');
            const customWakeWords = savedWakeWords ? JSON.parse(savedWakeWords) : [];
            const intent = classifyIntent(transcript, customWakeWords);
            setLastIntent(intent.type);

            // Handle Media/Projection Toggle
            if (intent.type === 'MEDIA') {
                console.log("Media Intent Detected");
                togglePresentationMode();
                setReference("Presentation Mode Toggled");
                return;
            }

            // 2. Smart NLP Parse — the brain
            const smartResult = smartParse(transcript);

            // If narrative AND smart parse found nothing, ignore
            if (intent.type === 'NARRATIVE' && !smartResult) {
                console.log('Ignored Narrative:', transcript);
                return;
            }

            if (smartResult) {
                console.log('Smart Parse Result:', smartResult);

                // Voice feedback
                const refText = formatVerseReference(smartResult.ref);
                voiceFeedback.confirmVerse(refText);

                // Auto-switch translation if user specified one (e.g. "KJV version")
                if (smartResult.translationId) {
                    console.log('Auto-switching to translation:', smartResult.translationId);
                    const trans = bibleService.getCurrentTranslation();
                    bibleService.setTranslation(smartResult.translationId);
                    voiceFeedback.confirmTranslation(trans.name);
                }

                fetchVerses(smartResult.ref);
                trackSearch();
            } else if (transcript.trim().length > 0) {
                const trimmed = transcript.trim();

                // ========== TOPIC QUERY DETECTION ==========
                // "Verses about love", "What does the Bible say about fear", etc.
                if (isTopicQuery(trimmed)) {
                    const keyword = extractTopicKeyword(trimmed);
                    const topicResults = searchTopics(keyword);

                    if (topicResults.length > 0) {
                        const topic = topicResults[0];
                        console.log('Topic match:', topic.topic, '→', topic.verses.length, 'verses');
                        voiceFeedback.confirmSearch(`${topic.topic} — ${topic.verses.length} verses`);

                        // Fetch the first verse to display the chapter, then show all topic verses
                        const firstVerse = topic.verses[0];
                        const ref = parseVerseReference(firstVerse.reference);
                        if (ref) {
                            fetchVerses(ref);
                            setReference(`${topic.topic}: ${topic.verses.length} verses`);
                            setTranslation('KJV • Topic Match');
                        }
                        trackSearch();
                        setIsLoading(false);
                        return;
                    }
                }

                // Also try topic match even without "verses about" prefix
                const directTopics = searchTopics(trimmed);
                if (directTopics.length > 0 && directTopics[0].aliases.some(a => trimmed.toLowerCase() === a)) {
                    const topic = directTopics[0];
                    console.log('Direct topic match:', topic.topic);
                    voiceFeedback.confirmSearch(`${topic.topic} — ${topic.verses.length} verses`);
                    const firstVerse = topic.verses[0];
                    const ref = parseVerseReference(firstVerse.reference);
                    if (ref) {
                        fetchVerses(ref);
                        setReference(`${topic.topic}: ${topic.verses.length} verses`);
                        setTranslation('KJV • Topic Match');
                    }
                    trackSearch();
                    setIsLoading(false);
                    return;
                }

                // ========== KEYWORD SEARCH FALLBACK ==========
                setIsLoading(true);
                voiceFeedback.confirmSearch(trimmed);
                trackSearch();

                // Check for COMPLEX AI QUERY (The "Dangerous" Part)
                if (groqBible.isComplexQuery(trimmed)) {
                    console.log('Complex query detected, asking Groq AI...');
                    const loadingMsg = getCuteLoading();
                    toast.info(loadingMsg, { duration: 3000, icon: '🤔' });

                    // Don't wait for keyword search, start AI immediately
                    groqBible.ask(trimmed).then(aiResponse => {
                        console.log('Groq AI Response:', aiResponse);
                        if (aiResponse.references.length > 0) {
                            // Perfect! AI found verses.
                            // 1. Speak the answer (optional, or just confirm)
                            if (aiResponse.answer) {
                                voiceFeedback.speak(aiResponse.answer); // Speak the AI's concise answer
                            }

                            // 2. Parse the first reference to display
                            // (Future: support displaying multiple distinct passages)
                            const firstRef = parseVerseReference(aiResponse.references[0]);
                            if (firstRef) {
                                fetchVerses(firstRef);
                                setReference(aiResponse.references[0]);
                                setTranslation('KJV • AI Match');
                                setIsLoading(false);
                            }
                        } else {
                            // AI failed to find verses, fallback to standard keyword search results
                            bibleService.search(trimmed).then(searchResults => {
                                // ... (existing logic)
                                if (searchResults.length > 0) {
                                    setVerses(searchResults);
                                    setReference(`Search: "${transcript}"`);
                                    const currentTrans = bibleService.getCurrentTranslation();
                                    setTranslation(currentTrans.name);
                                    setFetchError(null);
                                } else {
                                    const cuteErr = getCuteError();
                                    setFetchError(cuteErr);
                                    toast.error(cuteErr);

                                    // (Semantic fallback here)
                                    if (isSemanticReady) {
                                        setFetchError(null);
                                        semanticSearch(transcript).then(results => {
                                            if (results.length > 0) {
                                                const topResult = results[0];
                                                const ref = parseVerseReference(topResult.reference);
                                                if (ref) {
                                                    fetchVerses(ref);
                                                    setReference(formatVerseReference(ref));
                                                    setTranslation(`KJV • ${Math.round(topResult.score * 100)}% match`);
                                                }
                                            } else {
                                                const finalErr = getCuteError();
                                                setFetchError(finalErr);
                                                voiceFeedback.error("I couldn't find that.");
                                            }
                                            setIsLoading(false);
                                        });
                                    }
                                }
                                setIsLoading(false);
                            });
                        }
                    });
                    return; // Early return to let AI handle it
                }

                // Standard keyword search (Fast path)
                bibleService.search(trimmed).then(searchResults => {
                    if (searchResults.length > 0) {
                        setVerses(searchResults);
                        setReference(`Search: "${transcript}"`);
                        const currentTrans = bibleService.getCurrentTranslation();
                        setTranslation(currentTrans.name);
                        setFetchError(null);
                    } else {
                        setFetchError(`Couldn't find any verses matching "${transcript}".`);

                        // Fallback to Semantic Search
                        if (isSemanticReady) {
                            setFetchError(null);
                            semanticSearch(transcript).then(results => {
                                if (results.length > 0) {
                                    const topResult = results[0];
                                    const ref = parseVerseReference(topResult.reference);
                                    if (ref) {
                                        fetchVerses(ref);
                                        setReference(formatVerseReference(ref));
                                        setTranslation(`KJV • ${Math.round(topResult.score * 100)}% match`);
                                    }
                                } else {
                                    setFetchError(`No verses found matching "${transcript}"`);
                                    voiceFeedback.error('No verses found');
                                }
                                setIsLoading(false);
                            });
                            return;
                        }
                    }
                    setIsLoading(false);
                });
            }

            // Auto-restart in sermon mode
            if (sermonMode) {
                setTimeout(() => {
                    resetTranscript();
                    startListening();
                }, 1500); // Brief pause before restarting
            }
        }
    }, [isListening, transcript, isLoading, togglePresentationMode, isSemanticReady, fetchVerses, sermonMode, resetTranscript, startListening]);


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
        resetTranscript();
        setVerses([]);
        setFetchError(null);

        // Try direct verse reference first
        const ref = parseVerseReference(phrase);
        if (ref) {
            fetchVerses(ref);
            trackSearch();
            return;
        }

        // Try topic query
        if (isTopicQuery(phrase)) {
            const keyword = extractTopicKeyword(phrase);
            const topicResults = searchTopics(keyword);
            if (topicResults.length > 0) {
                const topic = topicResults[0];
                const firstVerse = topic.verses[0];
                const topicRef = parseVerseReference(firstVerse.reference);
                if (topicRef) {
                    fetchVerses(topicRef);
                    setReference(`${topic.topic}: ${topic.verses.length} verses`);
                    setTranslation('KJV • Topic Match');
                }
                trackSearch();
                return;
            }
        }

        // Direct topic word match (e.g., just "love")
        const directTopics = searchTopics(phrase);
        if (directTopics.length > 0) {
            const topic = directTopics[0];
            const firstVerse = topic.verses[0];
            const topicRef = parseVerseReference(firstVerse.reference);
            if (topicRef) {
                fetchVerses(topicRef);
                setReference(`${topic.topic}: ${topic.verses.length} verses`);
                setTranslation('KJV • Topic Match');
            }
            trackSearch();
            return;
        }

        // Fallback: keyword search
        setIsLoading(true);
        bibleService.search(phrase).then(searchResults => {
            if (searchResults.length > 0) {
                setVerses(searchResults);
                setReference(`Search: "${phrase}"`);
                const currentTrans = bibleService.getCurrentTranslation();
                setTranslation(currentTrans.name);
            } else {
                setFetchError(`No verses found for "${phrase}"`);
            }
            setIsLoading(false);
        });
        trackSearch();
    };

    // Handle manual input submit
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualInput.trim()) {
            const trimmed = manualInput.trim();
            const ref = parseVerseReference(trimmed);
            if (ref) {
                resetTranscript();
                setVerses([]);
                setFetchError(null);
                fetchVerses(ref);
                setManualInput('');
                setShowManualInput(false);
                trackSearch();
            } else {
                // Try topic query first
                const topicMatch = isTopicQuery(trimmed) ? searchTopics(extractTopicKeyword(trimmed)) : searchTopics(trimmed);
                if (topicMatch.length > 0) {
                    const topic = topicMatch[0];
                    const firstVerse = topic.verses[0];
                    const topicRef = parseVerseReference(firstVerse.reference);
                    if (topicRef) {
                        resetTranscript();
                        setVerses([]);
                        setFetchError(null);
                        fetchVerses(topicRef);
                        setReference(`${topic.topic}: ${topic.verses.length} verses`);
                        setTranslation('KJV • Topic Match');
                    }
                    setManualInput('');
                    setShowManualInput(false);
                    trackSearch();
                    return;
                }

                // Check for COMPLEX AI QUERY
                if (groqBible.isComplexQuery(trimmed)) {
                    console.log('Manual complex query, asking Groq AI...');
                    const loadingMsg = getCuteLoading();
                    toast.info(loadingMsg, { duration: 3000, icon: '🤔' });
                    setIsLoading(true);

                    groqBible.ask(trimmed).then(aiResponse => {
                        if (aiResponse.references.length > 0) {
                            if (aiResponse.answer) {
                                voiceFeedback.speak(aiResponse.answer);
                            }
                            const firstRef = parseVerseReference(aiResponse.references[0]);
                            if (firstRef) {
                                fetchVerses(firstRef);
                                setReference(aiResponse.references[0]);
                                setTranslation('KJV • AI Match');
                            }
                        } else {
                            // Fallback to keyword search if AI fails
                            bibleService.search(trimmed).then(searchResults => {
                                if (searchResults.length > 0) {
                                    setVerses(searchResults);
                                    setReference(`Search: "${manualInput}"`);
                                    const currentTrans = bibleService.getCurrentTranslation();
                                    setTranslation(currentTrans.name);
                                    setFetchError(null);
                                    setManualInput('');
                                    setShowManualInput(false);
                                } else {
                                    const cuteErr = getCuteError();
                                    setFetchError(cuteErr);
                                    toast.error(cuteErr);

                                    if (isSemanticReady) {
                                        semanticSearch(manualInput).then(results => {
                                            if (results.length > 0) {
                                                const topResult = results[0];
                                                const ref = parseVerseReference(topResult.reference);
                                                if (ref) {
                                                    fetchVerses(ref);
                                                    setReference(formatVerseReference(ref));
                                                    setTranslation(`KJV • ${Math.round(topResult.score * 100)}% match`);
                                                }
                                            } else {
                                                const finalErr = getCuteError();
                                                setFetchError(finalErr);
                                            }
                                            setIsLoading(false);
                                        });
                                        return;
                                    }
                                }
                                setIsLoading(false);
                            });
                        }
                        setManualInput('');
                        setShowManualInput(false);
                        setIsLoading(false);
                    });
                    return;
                }

                // Keyword search fallback
                setIsLoading(true);
                trackSearch();
                bibleService.search(trimmed).then(searchResults => {
                    if (searchResults.length > 0) {
                        setVerses(searchResults);
                        setReference(`Search: "${manualInput}"`);
                        const currentTrans = bibleService.getCurrentTranslation();
                        setTranslation(currentTrans.name);
                        setFetchError(null);
                        setManualInput('');
                        setShowManualInput(false);
                    } else {
                        setFetchError(`Couldn't find any verses matching "${manualInput}".`);

                        // Fallback to Semantic Search
                        if (isSemanticReady) {
                            setFetchError(null);
                            semanticSearch(manualInput).then(results => {
                                if (results.length > 0) {
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
                            return;
                        }
                    }
                    setIsLoading(false);
                });
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

    // Keyboard navigation + ⌘K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ⌘K / Ctrl+K — Command Palette
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(prev => !prev);
                return;
            }

            if (showSavedPanel || commandPaletteOpen) return;

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
    }, [verses, currentRef, showSavedPanel, commandPaletteOpen]);

    const showVerseDisplay = verses.length > 0 || isLoading || fetchError;

    return (
        <div className="min-h-screen bg-transparent transition-colors duration-500">
            <Navigation
                onManualSearchClick={() => setShowManualInput(!showManualInput)}
                onSavedVersesClick={() => setShowSavedPanel(true)}
                savedCount={savedVerses.length}
                sermonMode={sermonMode}
                onSermonModeToggle={toggleSermonMode}
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

                            {/* Voice-First Hero */}
                            <div className="text-center mb-10 py-6">
                                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-5">
                                    <Zap className="w-3 h-3" />
                                    Voice-Powered Bible Search
                                </div>
                                <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-4 font-bold tracking-tight">
                                    Speak the Word.
                                </h2>
                                <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed text-balance">
                                    Say any verse, topic, or question — and hear God's Word instantly.
                                    No typing needed.
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
                                            {["Psalm 23", "John 3:16", "Verses about love", "The Lord is my shepherd", "What does the Bible say about fear"].map(phrase => (
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

            {/* Command Palette */}
            <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        </div>
    );
};

export default AppLayout;
