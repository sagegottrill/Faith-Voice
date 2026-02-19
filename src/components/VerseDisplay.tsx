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
  Monitor,
  Palette
} from 'lucide-react';
import { Verse } from '@/utils/bibleData';

// ==========================================
// 🎨 Background Theme Presets
// ==========================================
export const VERSE_BACKGROUNDS = [
  {
    id: 'classic',
    label: 'Classic Dark',
    bgClass: 'bg-black',
    textClass: 'text-white',
    accentColor: '#D4AF37',
  },
  {
    id: 'midnight',
    label: 'Midnight Blue',
    bgClass: 'bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1321]',
    textClass: 'text-white',
    accentColor: '#5B9BD5',
  },
  {
    id: 'royal',
    label: 'Royal Purple',
    bgClass: 'bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#16082a]',
    textClass: 'text-white',
    accentColor: '#B48EF0',
  },
  {
    id: 'forest',
    label: 'Forest Sanctuary',
    bgClass: 'bg-gradient-to-br from-[#0a1f0a] via-[#1a3a1a] to-[#0d2e0d]',
    textClass: 'text-white',
    accentColor: '#6ECF6E',
  },
  {
    id: 'golden',
    label: 'Golden Hour',
    bgClass: 'bg-gradient-to-br from-[#2a1f0a] via-[#3d2e12] to-[#1a1408]',
    textClass: 'text-amber-50',
    accentColor: '#D4AF37',
  },
  {
    id: 'ocean',
    label: 'Ocean Deep',
    bgClass: 'bg-gradient-to-br from-[#0a1a2a] via-[#0f2e4a] to-[#081420]',
    textClass: 'text-cyan-50',
    accentColor: '#4DD2E8',
  },
  {
    id: 'burgundy',
    label: 'Burgundy Elegance',
    bgClass: 'bg-gradient-to-br from-[#2a0a0a] via-[#4a1220] to-[#1a0808]',
    textClass: 'text-rose-50',
    accentColor: '#E8627C',
  },
  {
    id: 'stained',
    label: 'Stained Glass',
    bgClass: 'bg-gradient-to-br from-[#2a1a0a] via-[#1a2a3a] to-[#3a1a2a]',
    textClass: 'text-amber-50',
    accentColor: '#E8A832',
  },
];

const themeColors: Record<string, string> = {
  classic: '#000000',
  midnight: '#1a2744',
  royal: '#2d1b4e',
  forest: '#1a3a1a',
  golden: '#3d2e12',
  ocean: '#0f2e4a',
  burgundy: '#4a1220',
  stained: '#2a1a0a',
};

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
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState(() => {
    return localStorage.getItem('faith-voice-verse-bg') || 'classic';
  });

  const currentTheme = VERSE_BACKGROUNDS.find(t => t.id === backgroundTheme) || VERSE_BACKGROUNDS[0];

  const setBackground = useCallback((id: string) => {
    setBackgroundTheme(id);
    localStorage.setItem('faith-voice-verse-bg', id);
  }, []);

  // Sync selected index with Embla
  useEffect(() => {
    if (!emblaApi) return;

    const targetIndex = verses.findIndex(v => v.isTarget);
    if (targetIndex !== -1) {
      emblaApi.scrollTo(targetIndex, true);
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

  // Broadcast to OBS whenever the verse changes
  useEffect(() => {
    if (verses.length === 0 || selectedIndex >= verses.length) return;
    const verse = verses[selectedIndex];

    try {
      const channel = new BroadcastChannel('voicebible-obs');
      channel.postMessage({
        type: 'verse-update',
        payload: {
          text: verse.text,
          reference: reference,
          translation: translation,
          verseNumber: verse.verse,
        }
      });
      channel.close();
    } catch { /* ignore */ }

    // Also save to localStorage for cross-tab fallback
    try {
      localStorage.setItem('voicebible-obs-data', JSON.stringify({
        text: verse.text,
        reference: reference,
        translation: translation,
        verseNumber: verse.verse,
      }));
    } catch { /* ignore */ }
  }, [selectedIndex, verses, reference, translation]);

  const togglePresentation = useCallback(() => {
    setIsPresentationMode(prev => !prev);
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
        ? `fixed inset-0 z-[100] ${currentTheme.bgClass} ${currentTheme.textClass}`
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
            {/* Background Theme Picker */}
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="p-3 bg-secondary/50 hover:bg-secondary rounded-full text-muted-foreground hover:text-accent transition-all"
                title="Change Background Theme"
              >
                <Palette className="w-5 h-5" />
              </button>

              {showThemePicker && (
                <div className="absolute right-0 top-14 z-50 bg-card/95 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Background</p>
                  <div className="grid grid-cols-4 gap-2">
                    {VERSE_BACKGROUNDS.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setBackground(t.id);
                          setShowThemePicker(false);
                        }}
                        className={`w-9 h-9 rounded-xl border-2 transition-all hover:scale-110 ${backgroundTheme === t.id ? 'border-accent ring-2 ring-accent/30 scale-110' : 'border-border hover:border-accent/50'}`}
                        style={{ background: themeColors[t.id] || '#000' }}
                        title={t.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if ((window as any).electronAPI?.projectVerse) {
                  (window as any).electronAPI.projectVerse({
                    text: verses[selectedIndex]?.text,
                    reference: reference,
                    translation: translation,
                    verseNumber: verses[selectedIndex]?.verse
                  });
                } else {
                  console.warn("Projection not available in web mode");
                }
              }}
              className={`p-3 rounded-full transition-all ${(window as any).electronAPI?.projectVerse
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
            {/* Background Themes in presentation */}
            <div className="flex gap-1.5 bg-white/10 rounded-full p-1.5">
              {VERSE_BACKGROUNDS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setBackground(t.id)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${backgroundTheme === t.id ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'}`}
                  style={{ background: themeColors[t.id] || '#000' }}
                  title={t.label}
                />
              ))}
            </div>
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
        ${isPresentationMode ? 'h-screen flex items-center justify-center' : `${currentTheme.bgClass} ${currentTheme.textClass} rounded-3xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-700`}
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
                    <div className="mb-8 flex justify-center">
                      <span
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full font-serif font-bold text-xl border"
                        style={{
                          backgroundColor: `${currentTheme.accentColor}20`,
                          borderColor: `${currentTheme.accentColor}40`,
                          color: currentTheme.accentColor,
                        }}
                      >
                        {verse.verse}
                      </span>
                    </div>

                    {/* Verse Text */}
                    <p className={`
                      leading-relaxed break-words whitespace-normal font-serif
                      ${isPresentationMode
                        ? 'text-4xl md:text-6xl drop-shadow-2xl'
                        : 'text-2xl md:text-4xl'
                      }
                    `} style={{ lineHeight: 1.6, wordWrap: 'break-word', overflowWrap: 'break-word', textShadow: isPresentationMode ? '0 4px 20px rgba(0,0,0,0.5)' : undefined }}>
                      {verse.text}
                    </p>

                    {/* Action Bar */}
                    {onToggleSave && (
                      <div className="mt-10 flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSave(verse.book, verse.chapter, verse.verse, verse.text);
                          }}
                          className={`
                                inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium border text-sm
                                ${isSaved
                              ? 'shadow-lg'
                              : 'bg-transparent border-white/20 hover:border-white/40'
                            }
                              `}
                          style={isSaved ? {
                            backgroundColor: currentTheme.accentColor,
                            borderColor: currentTheme.accentColor,
                            color: '#000',
                          } : undefined}
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
