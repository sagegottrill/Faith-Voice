import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { BIBLE_BOOKS, Verse } from '@/utils/bibleData';
import { bibleService, AVAILABLE_TRANSLATIONS } from '@/utils/bibleService';
import VerseDisplay from '@/components/VerseDisplay';
import { BookOpen, ChevronRight, ArrowLeft, Globe } from 'lucide-react';

const ReadPage: React.FC = () => {
    const [view, setView] = useState<'books' | 'chapters' | 'verses'>('books');
    const [selectedBook, setSelectedBook] = useState<{ name: string; chapters: number } | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<number>(1);
    const [chapterVerses, setChapterVerses] = useState<Verse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [translationId, setTranslationId] = useState<string>('kjv');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Load translation and refresh content if needed
    useEffect(() => {
        const loadTranslation = async () => {
            try {
                setIsLoading(true);
                await bibleService.setTranslation(translationId);

                // If currently viewing a chapter, re-fetch verses with new translation
                if (view === 'verses' && selectedBook) {
                    const verses = await bibleService.getChapter(selectedBook.name, selectedChapter);
                    setChapterVerses(verses);
                }
            } catch (err) {
                console.error("Failed to load translation", err);
                setError("Failed to load Bible translation.");
            } finally {
                setIsLoading(false);
            }
        };
        loadTranslation();
    }, [translationId]);

    const handleBookClick = (book: typeof BIBLE_BOOKS[0]) => {
        setSelectedBook(book);
        setView('chapters');
    };

    const handleChapterClick = async (chapter: number) => {
        if (selectedBook) {
            setSelectedChapter(chapter);
            setIsLoading(true);
            try {
                // Ensure translation is loaded (idempotent)
                await bibleService.setTranslation(translationId);
                const verses = await bibleService.getChapter(selectedBook.name, chapter);

                if (verses.length === 0) {
                    setError("No verses found for this chapter.");
                } else {
                    setChapterVerses(verses);
                    setView('verses');
                    setError(null);
                }
            } catch (err) {
                setError("Failed to load verses.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBackToBooks = () => {
        setView('books');
        setSelectedBook(null);
    };

    const handleBackToChapters = () => {
        setView('chapters');
        setChapterVerses([]);
    };

    const handleCloseViewer = () => {
        // Just go back to chapters view when "closing" the verse display
        handleBackToChapters();
    }

    const handleNavigateVerses = (direction: 'prev' | 'next') => {
        // Simple chapter navigation
        if (!selectedBook) return;

        const newChapter = direction === 'next' ? selectedChapter + 1 : selectedChapter - 1;

        if (newChapter < 1) return; // Can't go before chapter 1
        if (newChapter > selectedBook.chapters) return; // Can't go after last chapter

        handleChapterClick(newChapter);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Navigation />

            <div className="pt-24 px-4 max-w-6xl mx-auto pb-16">

                {/* Header / Breadcrumbs */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2 text-sm md:text-base">
                        <button
                            onClick={handleBackToBooks}
                            className={`transition-colors ${view === 'books' ? 'font-bold text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Books
                        </button>

                        {selectedBook && (
                            <>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                <button
                                    onClick={handleBackToChapters}
                                    className={`transition-colors ${view === 'chapters' ? 'font-bold text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {selectedBook.name}
                                </button>
                            </>
                        )}

                        {view === 'verses' && (
                            <>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                <span className="font-bold text-accent">Chapter {selectedChapter}</span>
                            </>
                        )}
                    </div>

                    {/* Translation Switcher */}
                    <div className="flex items-center gap-2 bg-secondary/30 rounded-full p-1 px-3">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <select
                            value={translationId}
                            onChange={(e) => setTranslationId(e.target.value)}
                            className="bg-transparent border-none text-xs font-medium text-foreground focus:ring-0 cursor-pointer"
                        >
                            {AVAILABLE_TRANSLATIONS.map(t => (
                                <option key={t.id} value={t.id} className="bg-background text-foreground">
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {isLoading && view !== 'verses' && (
                    <div className="flex justify-center my-12">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Views */}
                {view === 'books' && !isLoading && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                                Sacred Library
                            </h1>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                                Select a book to begin your reading journey.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {BIBLE_BOOKS.map((book) => (
                                <button
                                    key={book.name}
                                    onClick={() => handleBookClick(book)}
                                    className="lush-card p-5 text-left group hover:scale-[1.02] active:scale-95 border-l-4 border-l-transparent hover:border-l-accent"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${['Matthew', 'Mark', 'Luke', 'John'].includes(book.name) ? 'bg-accent/10 text-accent' : 'bg-secondary text-muted-foreground group-hover:bg-accent/5 group-hover:text-accent'}`}>
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground/60">{book.chapters} CH</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors font-serif">
                                        {book.name}
                                    </h3>
                                    <div className="h-0.5 w-8 bg-border mt-3 group-hover:w-full group-hover:bg-accent/50 transition-all duration-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'chapters' && selectedBook && !isLoading && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col items-center mb-10">
                            <button onClick={handleBackToBooks} className="mb-6 p-2 bg-secondary/50 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
                                {selectedBook.name}
                            </h1>
                            <p className="text-muted-foreground">Select a chapter</p>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                                <button
                                    key={chapter}
                                    onClick={() => handleChapterClick(chapter)}
                                    className="aspect-square flex items-center justify-center bg-card hover:bg-accent hover:text-accent-foreground border border-border hover:border-accent rounded-xl text-lg font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                                >
                                    {chapter}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'verses' && selectedBook && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <VerseDisplay
                            verses={chapterVerses}
                            reference={`${selectedBook.name} ${selectedChapter}`}
                            translation={AVAILABLE_TRANSLATIONS.find(t => t.id === translationId)?.name || translationId.toUpperCase()}
                            isLoading={isLoading}
                            error={error}
                            onClose={handleCloseViewer}
                            onNavigate={handleNavigateVerses}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReadPage;
