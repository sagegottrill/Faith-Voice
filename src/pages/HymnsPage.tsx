import React, { useState, useMemo, useCallback } from 'react';
import { SACRED_SONGS, searchHymns, Hymn } from '@/data/sacredSongs';
import Navigation from '@/components/Navigation';
import {
    Search, Music, ChevronLeft, ChevronRight,
    X, Maximize2, Minimize2, BookOpen
} from 'lucide-react';

const BACKGROUND_THEMES = [
    { id: 'classic', label: 'Classic', bg: 'bg-black', text: 'text-white' },
    { id: 'midnight', label: 'Midnight', bg: 'bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1321]', text: 'text-white' },
    { id: 'royal', label: 'Royal', bg: 'bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#16082a]', text: 'text-white' },
    { id: 'forest', label: 'Forest', bg: 'bg-gradient-to-br from-[#0a1f0a] via-[#1a3a1a] to-[#0d2e0d]', text: 'text-white' },
    { id: 'golden', label: 'Golden', bg: 'bg-gradient-to-br from-[#2a1f0a] via-[#3d2e12] to-[#1a1408]', text: 'text-amber-50' },
    { id: 'ocean', label: 'Ocean', bg: 'bg-gradient-to-br from-[#0a1a2a] via-[#0f2e4a] to-[#081420]', text: 'text-cyan-50' },
    { id: 'burgundy', label: 'Burgundy', bg: 'bg-gradient-to-br from-[#2a0a0a] via-[#4a1220] to-[#1a0808]', text: 'text-rose-50' },
    { id: 'stained', label: 'Stained Glass', bg: 'bg-gradient-to-br from-[#2a1a0a] via-[#1a2a3a] to-[#3a1a2a]', text: 'text-amber-50' },
];

const HymnsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);
    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const [isPresentationMode, setIsPresentationMode] = useState(false);
    const [backgroundTheme, setBackgroundTheme] = useState(() => {
        return localStorage.getItem('faith-voice-hymn-bg') || 'midnight';
    });

    const filteredHymns = useMemo(() => {
        if (!searchQuery.trim()) return SACRED_SONGS;
        return searchHymns(searchQuery);
    }, [searchQuery]);

    const currentTheme = BACKGROUND_THEMES.find(t => t.id === backgroundTheme) || BACKGROUND_THEMES[1];

    const selectHymn = useCallback((hymn: Hymn) => {
        setSelectedHymn(hymn);
        setCurrentVerseIndex(0);

        // Broadcast to OBS
        try {
            const channel = new BroadcastChannel('voicebible-obs');
            channel.postMessage({
                type: 'hymn-update',
                payload: {
                    title: hymn.title,
                    number: hymn.number,
                    verse: hymn.verses[0],
                    verseIndex: 0,
                    author: hymn.author,
                    chorus: hymn.chorus,
                }
            });
            channel.close();
        } catch { /* ignore */ }
    }, []);

    const navigateVerse = useCallback((direction: 'prev' | 'next') => {
        if (!selectedHymn) return;

        setCurrentVerseIndex(prev => {
            const total = selectedHymn.verses.length;
            const newIndex = direction === 'next' ? Math.min(prev + 1, total - 1) : Math.max(prev - 1, 0);

            // Broadcast to OBS
            try {
                const channel = new BroadcastChannel('voicebible-obs');
                channel.postMessage({
                    type: 'hymn-update',
                    payload: {
                        title: selectedHymn.title,
                        number: selectedHymn.number,
                        verse: selectedHymn.verses[newIndex],
                        verseIndex: newIndex,
                        author: selectedHymn.author,
                        chorus: selectedHymn.chorus,
                    }
                });
                channel.close();
            } catch { /* ignore */ }

            return newIndex;
        });
    }, [selectedHymn]);

    const setBackground = useCallback((id: string) => {
        setBackgroundTheme(id);
        localStorage.setItem('faith-voice-hymn-bg', id);
    }, []);

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedHymn) return;
            if (e.key === 'ArrowLeft') navigateVerse('prev');
            if (e.key === 'ArrowRight') navigateVerse('next');
            if (e.key === 'Escape') {
                if (isPresentationMode) setIsPresentationMode(false);
                else setSelectedHymn(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedHymn, isPresentationMode, navigateVerse]);

    // Presentation mode
    if (isPresentationMode && selectedHymn) {
        return (
            <div className={`fixed inset-0 z-[100] ${currentTheme.bg} ${currentTheme.text} flex flex-col items-center justify-center p-8 md:p-16 transition-all duration-700`}>
                {/* Controls (hidden until hover) */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-50 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-black/60 to-transparent">
                    <div>
                        <p className="text-xs text-white/50 tracking-widest uppercase font-medium">Sacred Songs & Solos • #{selectedHymn.number}</p>
                        <h2 className="text-2xl font-serif font-bold text-white mt-1">{selectedHymn.title}</h2>
                    </div>
                    <div className="flex gap-3">
                        {/* Background themes */}
                        <div className="flex gap-1.5 bg-white/10 rounded-full p-1.5">
                            {BACKGROUND_THEMES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setBackground(t.id)}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${backgroundTheme === t.id ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'}`}
                                    style={{ background: t.id === 'classic' ? '#000' : t.id === 'midnight' ? '#1a2744' : t.id === 'royal' ? '#2d1b4e' : t.id === 'forest' ? '#1a3a1a' : t.id === 'golden' ? '#3d2e12' : t.id === 'ocean' ? '#0f2e4a' : t.id === 'burgundy' ? '#4a1220' : '#2a1a0a' }}
                                    title={t.label}
                                />
                            ))}
                        </div>
                        <button onClick={() => setIsPresentationMode(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                            <Minimize2 className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Hymn Content */}
                <div className="max-w-4xl mx-auto text-center animate-in fade-in duration-500">
                    <p className="text-lg md:text-xl opacity-50 mb-2 tracking-widest uppercase font-sans">
                        Verse {currentVerseIndex + 1} of {selectedHymn.verses.length}
                    </p>

                    <p className="text-3xl md:text-5xl lg:text-6xl font-serif leading-relaxed mb-8 whitespace-pre-line" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                        {selectedHymn.verses[currentVerseIndex]}
                    </p>

                    {selectedHymn.chorus && (
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-xs tracking-widest uppercase opacity-50 mb-4 font-sans">Chorus</p>
                            <p className="text-2xl md:text-3xl lg:text-4xl font-serif italic opacity-80 whitespace-pre-line" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                                {selectedHymn.chorus}
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation hint */}
                <div className="absolute bottom-10 left-0 right-0 text-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                    <div className="inline-flex gap-8 bg-white/10 backdrop-blur-md px-8 py-3 rounded-full text-white/70 text-sm">
                        <button onClick={() => navigateVerse('prev')} className="flex items-center gap-2 hover:text-white transition-colors">
                            <ChevronLeft className="w-4 h-4" /> Previous Verse
                        </button>
                        <span className="font-mono opacity-50">ESC</span>
                        <button onClick={() => navigateVerse('next')} className="flex items-center gap-2 hover:text-white transition-colors">
                            Next Verse <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent transition-colors duration-500">
            <Navigation />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-5">
                            <Music className="w-3 h-3" />
                            Sacred Songs & Solos
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4 font-bold tracking-tight">
                            Hymnal
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
                            50 beloved hymns from the Sacred Songs and Solos collection.
                            Search by number, title, or lyrics.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="max-w-2xl mx-auto mb-10">
                        <div className="lush-glass rounded-2xl p-2 flex items-center gap-2">
                            <Search className="ml-3 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder='Search hymns... (e.g., "Amazing Grace" or "23")'
                                className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder-muted-foreground h-12 text-lg focus:outline-none"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Selected Hymn Display */}
                    {selectedHymn && !isPresentationMode && (
                        <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Controls */}
                            <div className="flex items-center justify-between mb-6 px-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedHymn(null)}
                                        className="p-3 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors group"
                                    >
                                        <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <div>
                                        <h2 className="text-xl font-serif font-bold text-foreground">#{selectedHymn.number} — {selectedHymn.title}</h2>
                                        <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">by {selectedHymn.author}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {/* Background theme selector */}
                                    <div className="hidden md:flex gap-1 bg-secondary/50 rounded-full p-1">
                                        {BACKGROUND_THEMES.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setBackground(t.id)}
                                                className={`w-5 h-5 rounded-full border-2 transition-all ${backgroundTheme === t.id ? 'border-accent scale-110' : 'border-border hover:border-accent/50'}`}
                                                style={{ background: t.id === 'classic' ? '#000' : t.id === 'midnight' ? '#1a2744' : t.id === 'royal' ? '#2d1b4e' : t.id === 'forest' ? '#1a3a1a' : t.id === 'golden' ? '#3d2e12' : t.id === 'ocean' ? '#0f2e4a' : t.id === 'burgundy' ? '#4a1220' : '#2a1a0a' }}
                                                title={t.label}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setIsPresentationMode(true)}
                                        className="p-3 bg-secondary/50 hover:bg-secondary rounded-full text-muted-foreground hover:text-accent transition-all"
                                        title="Enter Presentation Mode"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Hymn Content Card */}
                            <div className={`${currentTheme.bg} ${currentTheme.text} rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl transition-all duration-700`}>
                                <div className="max-w-3xl mx-auto text-center">
                                    <p className="text-sm opacity-50 mb-6 tracking-widest uppercase font-sans">
                                        Verse {currentVerseIndex + 1} of {selectedHymn.verses.length}
                                    </p>

                                    <p className="text-2xl md:text-4xl font-serif leading-relaxed mb-8 whitespace-pre-line" style={{ lineHeight: 1.8 }}>
                                        {selectedHymn.verses[currentVerseIndex]}
                                    </p>

                                    {selectedHymn.chorus && (
                                        <div className="mt-8 pt-6 border-t border-white/10">
                                            <p className="text-xs tracking-widest uppercase opacity-50 mb-4 font-sans">Chorus</p>
                                            <p className="text-xl md:text-2xl font-serif italic opacity-80 whitespace-pre-line" style={{ lineHeight: 1.6 }}>
                                                {selectedHymn.chorus}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Verse Navigation */}
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={() => navigateVerse('prev')}
                                    disabled={currentVerseIndex === 0}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-card border border-border hover:border-accent hover:text-accent transition-all shadow-sm disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div className="flex items-center gap-2">
                                    {selectedHymn.verses.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentVerseIndex(i)}
                                            className={`w-3 h-3 rounded-full transition-all ${i === currentVerseIndex ? 'bg-accent scale-125' : 'bg-border hover:bg-accent/50'}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigateVerse('next')}
                                    disabled={currentVerseIndex === selectedHymn.verses.length - 1}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-card border border-border hover:border-accent hover:text-accent transition-all shadow-sm disabled:opacity-30"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Hymn Grid */}
                    {!selectedHymn && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
                            {filteredHymns.map((hymn) => (
                                <button
                                    key={hymn.number}
                                    onClick={() => selectHymn(hymn)}
                                    className="lush-card p-6 text-left hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-serif font-bold text-lg border border-accent/20 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                            {hymn.number}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-serif font-bold text-foreground text-base leading-tight mb-1 truncate">
                                                {hymn.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground truncate">{hymn.author}</p>
                                            <p className="text-xs text-muted-foreground/60 mt-2 line-clamp-2 leading-relaxed">
                                                {hymn.verses[0].split('\n')[0]}...
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}

                            {filteredHymns.length === 0 && (
                                <div className="col-span-full text-center py-16">
                                    <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground text-lg">No hymns found for "{searchQuery}"</p>
                                    <p className="text-muted-foreground/60 text-sm mt-2">Try searching by number, title, or lyrics</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HymnsPage;
