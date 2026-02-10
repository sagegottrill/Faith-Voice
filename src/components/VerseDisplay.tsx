import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  BookOpen,
  Bookmark,
  Maximize2,
  Minimize2,
  Monitor
} from 'lucide-react';
import { Verse } from '@/utils/bibleData';

interface VerseDisplayProps {
  verses: Verse[];
  reference: string;
  translation: string;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  isVerseSaved?: (book: string, chapter: number, verse: number) => boolean;
  onToggleSave?: (book: string, chapter: number, verse: number, text: string) => void;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({
  verses,
  reference,
  translation,
  isLoading,
  error,
  onClose,
  onNavigate,
  isVerseSaved,
  onToggleSave
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center' });
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync selected index with Embla
  useEffect(() => {
    if (!emblaApi) return;

    // Find target verse index
    const targetIndex = verses.findIndex(v => v.isTarget);
    if (targetIndex !== -1) {
      emblaApi.scrollTo(targetIndex, true); // Immediate scroll without animation first time
      setSelectedIndex(targetIndex);
    }

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, verses]);

  const togglePresentation = useCallback(() => {
    setIsPresentationMode(prev => !prev);
    // Re-layout embla after mode switch
    if (emblaApi) setTimeout(() => emblaApi.reInit(), 100);
  }, [emblaApi]);

  // Keyboard navigation for Presentation Mode
  useEffect(() => {
    if (!isPresentationMode && !emblaApi) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPresentationMode(false);

      if (emblaApi) {
        if (e.key === 'ArrowLeft') emblaApi.scrollPrev();
        if (e.key === 'ArrowRight') emblaApi.scrollNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, emblaApi]);


  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground text-xl font-light tracking-wide">Finding Passage...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 fade-in relative z-10">
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <X className="w-12 h-12 text-destructive" />
            <p className="text-destructive text-lg font-medium">{error}</p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors border border-destructive/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verses.length === 0) return null;

  return (
    <div className={`
      transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
      ${isPresentationMode
        ? 'fixed inset-0 z-[100] bg-black text-white'
        : 'w-full max-w-5xl mx-auto mt-8 fade-in relative z-10'
      }
    `}>

      {/* Controls Header */}
      {!isPresentationMode && (
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors group"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">{reference}</h2>
              <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">{translation}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              // @ts-expect-error - Electron bridge
              onClick={() => {
                if (window.electronAPI?.projectVerse) {
                  window.electronAPI.projectVerse({
                    text: verses[selectedIndex]?.text,
                    reference: reference,
                    translation: translation,
                    verseNumber: verses[selectedIndex]?.verse
                  });
                } else {
                  console.warn("Projection not available in web mode");
                }
              }}
              className={`p-3 rounded-full transition-all ${
                // @ts-expect-error - Electron bridge
                window.electronAPI?.projectVerse
                  ? 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-accent'
                  : 'bg-secondary/20 text-muted-foreground/50 cursor-not-allowed'
                }`}
              title="Project to Second Screen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={togglePresentation}
              className="p-3 bg-secondary/50 hover:bg-secondary rounded-full text-muted-foreground hover:text-accent transition-all"
              title="Enter Presentation Mode"
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Presentation Mode Controls (Overlay) */}
      {isPresentationMode && (
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-50 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-black/80 to-transparent">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">{reference}</h2>
            <p className="text-xs text-white/50 tracking-widest uppercase">{translation}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={togglePresentation} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <Minimize2 className="w-6 h-6" />
            </button>
            <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`
        ${isPresentationMode ? 'h-screen flex items-center justify-center' : 'lush-glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden'}
      `}>
        {/* Embla Carousel Viewport */}
        <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {verses.map((verse, index) => {
              const isSaved = isVerseSaved?.(verse.book, verse.chapter, verse.verse) ?? false;
              return (
                <div
                  key={`${verse.chapter}-${verse.verse}`}
                  className={`
                    flex-[0_0_100%] min-w-0 pl-4 relative flex flex-col items-center justify-center p-8 md:p-12
                    ${!isPresentationMode ? 'py-16' : ''}
                  `}
                >
                  <div className={`
                    max-w-4xl mx-auto text-center transition-all duration-500
                    ${isPresentationMode ? 'scale-110' : ''}
                  `}>

                    {/* Verse Number Bubble */}
                    {!isPresentationMode && (
                      <div className="mb-8 flex justify-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent font-serif font-bold text-xl border border-accent/20">
                          {verse.verse}
                        </span>
                      </div>
                    )}

                    {/* Verse Text */}
                    <p className={`
                      leading-relaxed break-words whitespace-normal
                      ${isPresentationMode
                        ? 'text-4xl md:text-6xl text-white drop-shadow-2xl font-serif'
                        : 'text-2xl md:text-4xl text-foreground font-serif'
                      }
                    `} style={{ lineHeight: 1.6, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      {isPresentationMode && <span className="text-[#D4AF37] align-top text-2xl mr-2 font-sans opacity-80">{verse.verse}</span>}
                      {verse.text}
                    </p>

                    {/* Action Bar (Standard Mode Only) */}
                    {!isPresentationMode && onToggleSave && (
                      <div className="mt-10 flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSave(verse.book, verse.chapter, verse.verse, verse.text);
                          }}
                          className={`
                                inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium border text-sm
                                ${isSaved
                              ? 'bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20'
                              : 'bg-transparent text-muted-foreground border-border hover:border-accent hover:text-accent'
                            }
                              `}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                          {isSaved ? 'Saved to Library' : 'Save Text'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Floating Buttons (Standard Mode) */}
      {!isPresentationMode && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-card border border-border hover:border-accent hover:text-accent transition-all shadow-sm disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground"
            disabled={!emblaApi?.canScrollPrev()}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-card border border-border hover:border-accent hover:text-accent transition-all shadow-sm disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground"
            disabled={!emblaApi?.canScrollNext()}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Presentation Controls Hint */}
      {isPresentationMode && (
        <div className="absolute bottom-10 left-0 right-0 text-center opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="inline-flex gap-8 bg-white/10 backdrop-blur-md px-8 py-3 rounded-full text-white/70 text-sm">
            <span className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Previous</span>
            <span className="font-mono opacity-50">ESC</span>
            <span className="flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></span>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerseDisplay;
