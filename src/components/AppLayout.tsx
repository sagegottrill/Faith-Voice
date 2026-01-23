import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './Navigation';
import { fetchLocalVerses } from '@/utils/localBible';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSavedVerses } from '@/hooks/useSavedVerses';
import { parseVerseReference, formatVerseReference } from '@/utils/bibleParser';
import { VerseReference, Verse } from '@/utils/bibleData';
import MicrophoneButton from './MicrophoneButton';
import VoiceTranscript from './VoiceTranscript';
import VerseDisplay from './VerseDisplay';
import ExamplePhrases from './ExamplePhrases';
import SavedVersesPanel from './SavedVersesPanel';
import { Search, Bookmark } from 'lucide-react';

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

  const [verses, setVerses] = useState<Verse[]>([]);
  const [reference, setReference] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentRef, setCurrentRef] = useState<VerseReference | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showSavedPanel, setShowSavedPanel] = useState(false);

  // Fetch verses from local JSON
  const fetchVerses = useCallback(async (ref: VerseReference) => {
    setIsLoading(true);
    setFetchError(null);
    setCurrentRef(ref);

    try {
      // Simulate a small delay for UI smoothness (optional, can be removed for "super fast")
      // await new Promise(resolve => setTimeout(resolve, 100));

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
      const ref = parseVerseReference(transcript);
      if (ref) {
        fetchVerses(ref);
      } else if (transcript.trim().length > 0) {
        setFetchError(`Couldn't find a verse matching "${transcript}". Try saying something like "John 3:16" or "Psalm 23".`);
      }
    }
  }, [isListening, transcript, fetchVerses, isLoading]);

  // Handle microphone button click
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setVerses([]);
      setFetchError(null);
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
        setFetchError(`Couldn't find a verse matching "${manualInput}". Try something like "John 3:16".`);
      }
    }
  };

  // Close verse display
  const handleClose = () => {
    setVerses([]);
    setReference('');
    setFetchError(null);
    resetTranscript();
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
      // Don't handle if panel is open or typing in input
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
      // Space to start/stop listening (when not in input)
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
    <div className="min-h-screen bible-gradient">
      {/* Header */}
      {/* Header */}
      <Navigation
        onManualSearchClick={() => setShowManualInput(!showManualInput)}
        onSavedVersesClick={() => setShowSavedPanel(true)}
        savedCount={savedVerses.length}
      />

      {/* Manual input bar */}
      {showManualInput && (
        <div className="fixed top-[73px] left-0 right-0 z-40 bg-[#1A2744] border-b border-white/10 fade-in">
          <form onSubmit={handleManualSubmit} className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Type a verse reference (e.g., John 3:16)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#D4AF37] text-[#0F1629] font-medium rounded-lg hover:bg-[#E8D48A] transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main content */}
      <main className={`pt-24 ${showManualInput ? 'pt-36' : ''} pb-16 px-4 transition-all duration-300`}>
        <div className="max-w-4xl mx-auto">
          {/* Hero section */}
          {!showVerseDisplay && (
            <div className="text-center pt-12 md:pt-20 fade-in">
              {/* Tagline */}
              <p className="text-[#D4AF37] text-sm uppercase tracking-widest mb-4">
                Voice-Powered Scripture Search
              </p>

              {/* Main heading */}
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Crimson Text', serif" }}
              >
                Speak a Verse,<br />
                <span className="text-[#D4AF37]">Find the Word</span>
              </h2>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-12">
                Simply speak a Bible reference or a familiar phrase, and be taken directly to the Scripture.
              </p>

              {/* Microphone button */}
              <div className="flex flex-col items-center">
                <MicrophoneButton
                  isListening={isListening}
                  isProcessing={isLoading}
                  isSupported={isSupported}
                  onClick={handleMicClick}
                />

                <p className="mt-16 text-white/50 text-sm">
                  {isListening
                    ? 'Listening... speak now'
                    : 'Tap the microphone to begin'
                  }
                </p>
              </div>

              {/* Voice transcript */}
              <VoiceTranscript
                transcript={transcript}
                interimTranscript={interimTranscript}
                isListening={isListening}
                error={speechError}
              />

              {/* Example phrases */}
              <ExamplePhrases onPhraseClick={handlePhraseClick} />

              {/* Features section */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2" style={{ fontFamily: "'Crimson Text', serif" }}>
                    Natural Speech
                  </h3>
                  <p className="text-white/60 text-sm">
                    Say "John three sixteen" or "Psalm twenty-three" — we understand natural language.
                  </p>
                </div>

                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                    <Bookmark className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2" style={{ fontFamily: "'Crimson Text', serif" }}>
                    Save Favorites
                  </h3>
                  <p className="text-white/60 text-sm">
                    Bookmark verses to your personal collection and add notes for reflection.
                  </p>
                </div>

                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2" style={{ fontFamily: "'Crimson Text', serif" }}>
                    Famous Phrases
                  </h3>
                  <p className="text-white/60 text-sm">
                    Say "The Lord is my shepherd" or "For God so loved" and we'll find the verse.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Verse display */}
          {showVerseDisplay && (
            <div className="pt-8">
              {/* Back to search button */}
              {!isLoading && verses.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={handleClose}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>New Search</span>
                  </button>
                </div>
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
                <div className="mt-12 text-center">
                  <p className="text-white/50 mb-4">Search for another verse</p>
                  <MicrophoneButton
                    isListening={isListening}
                    isProcessing={isLoading}
                    isSupported={isSupported}
                    onClick={handleMicClick}
                  />

                  {/* Voice transcript when searching again */}
                  <VoiceTranscript
                    transcript={transcript}
                    interimTranscript={interimTranscript}
                    isListening={isListening}
                    error={speechError}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0F1629]/90 backdrop-blur-sm border-t border-white/10 py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-4 text-xs text-white/40">
          <span>KJV Translation</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Press Space to start voice search</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Made with faith</span>
        </div>
      </footer>

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
