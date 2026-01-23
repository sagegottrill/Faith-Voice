import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ChevronLeft,
  ChevronRight,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-xl font-light tracking-wide">Finding Passage...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 fade-in relative z-10">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <X className="w-12 h-12 text-red-400" />
            <p className="text-red-200 text-lg font-medium">{error}</p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg transition-colors border border-red-500/20"
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
      transition-all duration-500 ease-in-out
      ${isPresentationMode
        ? 'fixed inset-0 z-[100] bg-black text-white'
        : 'w-full max-w-4xl mx-auto mt-8 fade-in relative z-10'
      }
    `}>

      {/* Controls Header - Visible on Hover or when not in full presentation flow */}
      <div className={`
        flex items-center justify-between p-4 z-50 transition-opacity duration-300
        ${isPresentationMode ? 'absolute top-0 left-0 right-0 opacity-0 hover:opacity-100 bg-gradient-to-b from-black/80 to-transparent' : ''}
      `}>
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${isPresentationMode ? 'bg-white/10' : 'bg-white/5'}`}>
            <BookOpen className={`w-6 h-6 ${isPresentationMode ? 'text-white' : 'text-[#D4AF37]'}`} />
          </div>
          <div>
            <h2 className={`font-bold ${isPresentationMode ? 'text-2xl' : 'text-xl md:text-2xl text-white'}`} style={{ fontFamily: "'Crimson Text', serif" }}>
              {reference}
            </h2>
            <span className="text-xs text-white/50 uppercase tracking-widest">{translation}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Saved/Bookmark Button (only relevant to specific verse, maybe hide in group view or show for current slide) */}

          <button
            onClick={togglePresentation}
            className="p-2.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            title={isPresentationMode ? "Exit Presentation" : "Enter Presentation Mode"}
          >
            {isPresentationMode ? <Minimize2 className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="p-2.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`
        ${isPresentationMode ? 'h-screen flex items-center justify-center' : ''}
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
                    flex-[0_0_100%] min-w-0 pl-4 relative flex flex-col items-center justify-center p-8
                    ${!isPresentationMode ? 'py-12' : ''}
                  `}
                >
                  <div className={`
                    max-w-5xl mx-auto text-center transition-all duration-500
                    ${isPresentationMode ? 'scale-110' : ''}
                  `}>
                    {/* Verse Number Bubble */}
                    <div className={`
                      inline-flex items-center justify-center mb-6 
                      ${isPresentationMode
                        ? 'w-16 h-16 text-2xl bg-[#D4AF37] text-black font-bold rounded-full shadow-lg shadow-[#D4AF37]/20'
                        : 'w-10 h-10 text-sm bg-white/10 text-[#D4AF37] font-bold rounded-full border border-white/10'
                      }
                    `}>
                      {verse.verse}
                    </div>

                    {/* Verse Text */}
                    <p className={`
                      leading-relaxed font-medium
                      ${isPresentationMode
                        ? 'text-4xl md:text-6xl text-white drop-shadow-xl'
                        : 'text-2xl md:text-3xl text-white/90'
                      }
                    `} style={{ fontFamily: isPresentationMode ? "'Crimson Text', serif" : "'Inter', sans-serif" }}>
                      "{verse.text}"
                    </p>

                    {/* Action Bar (Standard Mode Only) */}
                    {!isPresentationMode && onToggleSave && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(verse.book, verse.chapter, verse.verse, verse.text);
                        }}
                        className={`
                            mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-full transition-all border
                            ${isSaved
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : 'bg-transparent text-white/50 border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                          }
                          `}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save Verse'}</span>
                      </button>
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
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all disabled:opacity-30"
            disabled={!emblaApi?.canScrollPrev()}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all disabled:opacity-30"
            disabled={!emblaApi?.canScrollNext()}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Presentation Controls Hint */}
      {isPresentationMode && (
        <div className="absolute bottom-8 left-0 right-0 text-center opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="inline-flex gap-4 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full text-white/50 text-sm">
            <span>← Previous</span>
            <span>ESC to Exit</span>
            <span>Next →</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerseDisplay;
