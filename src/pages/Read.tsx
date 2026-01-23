import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { BIBLE_BOOKS, Verse } from '@/utils/bibleData';
import { fetchLocalChapter } from '@/utils/localBible';
import VerseDisplay from '@/components/VerseDisplay';
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';

const ReadPage: React.FC = () => {
    const [view, setView] = useState<'books' | 'chapters' | 'verses'>('books');
    const [selectedBook, setSelectedBook] = useState<{ name: string; chapters: number } | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<number>(1);
    const [chapterVerses, setChapterVerses] = useState<Verse[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleBookClick = (book: typeof BIBLE_BOOKS[0]) => {
        setSelectedBook(book);
        setView('chapters');
    };

    const handleChapterClick = (chapter: number) => {
        if (selectedBook) {
            setSelectedChapter(chapter);
            const result = fetchLocalChapter(selectedBook.name, chapter);
            if (result.error) {
                setError(result.error);
            } else {
                setChapterVerses(result.verses);
                setView('verses');
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

        let newChapter = direction === 'next' ? selectedChapter + 1 : selectedChapter - 1;

        if (newChapter < 1) return; // Can't go before chapter 1
        if (newChapter > selectedBook.chapters) return; // Can't go after last chapter

        handleChapterClick(newChapter);
    };

    return (
        <div className="min-h-screen bible-gradient text-white">
            <Navigation />

            <div className="pt-24 px-4 max-w-6xl mx-auto pb-16">

                {/* Header / Breadcrumbs */}
                <div className="flex items-center gap-2 mb-8 text-sm md:text-base">
                    <button
                        onClick={handleBackToBooks}
                        className={`hover:text-[#D4AF37] transition-colors ${view === 'books' ? 'font-bold text-[#D4AF37]' : 'text-white/60'}`}
                    >
                        Books
                    </button>

                    {selectedBook && (
                        <>
                            <ChevronRight className="w-4 h-4 text-white/40" />
                            <button
                                onClick={handleBackToChapters}
                                className={`hover:text-[#D4AF37] transition-colors ${view === 'chapters' ? 'font-bold text-[#D4AF37]' : 'text-white/60'}`}
                            >
                                {selectedBook.name}
                            </button>
                        </>
                    )}

                    {view === 'verses' && (
                        <>
                            <ChevronRight className="w-4 h-4 text-white/40" />
                            <span className="font-bold text-[#D4AF37]">Chapter {selectedChapter}</span>
                        </>
                    )}
                </div>

                {/* Views */}
                {view === 'books' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-4xl font-bold mb-8 text-center" style={{ fontFamily: "'Crimson Text', serif" }}>
                            Select a Book
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {BIBLE_BOOKS.map((book) => (
                                <button
                                    key={book.name}
                                    onClick={() => handleBookClick(book)}
                                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all hover:scale-[1.02} group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-lg">{book.name}</span>
                                        <BookOpen className="w-4 h-4 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
                                    </div>
                                    <span className="text-xs text-white/40 mt-1 block">{book.chapters} Chapters</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'chapters' && selectedBook && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={handleBackToBooks} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Crimson Text', serif" }}>
                                {selectedBook.name}
                            </h1>
                        </div>

                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
                            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                                <button
                                    key={chapter}
                                    onClick={() => handleChapterClick(chapter)}
                                    className="aspect-square flex items-center justify-center bg-white/5 hover:bg-[#D4AF37] hover:text-[#0F1629] border border-white/10 rounded-lg text-lg font-medium transition-all"
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
                            translation="KJV"
                            isLoading={false}
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
