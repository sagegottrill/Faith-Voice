import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BIBLE_BOOKS } from '@/utils/bibleData';
import { Search, BookOpen, ArrowRight, Command, Hash } from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResult {
    id: string;
    type: 'book' | 'chapter' | 'action';
    label: string;
    sublabel?: string;
    icon: React.ReactNode;
    action: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const results = useCallback((): SearchResult[] => {
        const q = query.toLowerCase().trim();
        if (!q) {
            // Show popular shortcuts
            return [
                {
                    id: 'home', type: 'action', label: 'Go to Search',
                    sublabel: 'Voice & text search', icon: <Search className="w-4 h-4" />,
                    action: () => { navigate('/'); onClose(); }
                },
                {
                    id: 'read', type: 'action', label: 'Open Reader',
                    sublabel: 'Browse books & chapters', icon: <BookOpen className="w-4 h-4" />,
                    action: () => { navigate('/read'); onClose(); }
                },
                {
                    id: 'genesis', type: 'book', label: 'Genesis',
                    sublabel: '50 chapters', icon: <BookOpen className="w-4 h-4" />,
                    action: () => { navigate('/read'); onClose(); }
                },
                {
                    id: 'psalms', type: 'book', label: 'Psalms',
                    sublabel: '150 chapters', icon: <BookOpen className="w-4 h-4" />,
                    action: () => { navigate('/read'); onClose(); }
                },
                {
                    id: 'john', type: 'book', label: 'John',
                    sublabel: '21 chapters', icon: <BookOpen className="w-4 h-4" />,
                    action: () => { navigate('/read'); onClose(); }
                },
            ];
        }

        const items: SearchResult[] = [];

        // Search books
        BIBLE_BOOKS.forEach(book => {
            const nameMatch = book.name.toLowerCase().includes(q);
            const abbrMatch = book.abbr?.some(a => a.toLowerCase().includes(q));
            if (nameMatch || abbrMatch) {
                items.push({
                    id: `book-${book.name}`,
                    type: 'book',
                    label: book.name,
                    sublabel: `${book.chapters} chapters`,
                    icon: <BookOpen className="w-4 h-4" />,
                    action: () => { navigate('/read'); onClose(); }
                });
            }
        });

        // Parse chapter reference (e.g., "john 3", "psalm 23")
        const chapterMatch = q.match(/^(.+?)\s+(\d+)$/);
        if (chapterMatch) {
            const bookQuery = chapterMatch[1].toLowerCase();
            const chapterNum = parseInt(chapterMatch[2]);
            const matchedBook = BIBLE_BOOKS.find(b =>
                b.name.toLowerCase().startsWith(bookQuery) ||
                b.abbr?.some(a => a.toLowerCase().startsWith(bookQuery))
            );
            if (matchedBook && chapterNum <= matchedBook.chapters) {
                items.unshift({
                    id: `chapter-${matchedBook.name}-${chapterNum}`,
                    type: 'chapter',
                    label: `${matchedBook.name} ${chapterNum}`,
                    sublabel: 'Jump to chapter',
                    icon: <Hash className="w-4 h-4" />,
                    action: () => { navigate('/read'); onClose(); }
                });
            }
        }

        // Quick actions
        if ('search'.includes(q) || 'voice'.includes(q)) {
            items.push({
                id: 'search', type: 'action', label: 'Voice Search',
                sublabel: 'Search by voice', icon: <Search className="w-4 h-4" />,
                action: () => { navigate('/'); onClose(); }
            });
        }

        return items.slice(0, 8);
    }, [query, navigate, onClose]);

    const searchResults = results();

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (searchResults[selectedIndex]) {
                searchResults[selectedIndex].action();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Palette */}
            <div className="relative w-full max-w-lg mx-4 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                    <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search books, chapters, or type a command..."
                        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm"
                    />
                    <kbd className="hidden md:block px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-secondary rounded-md border border-border">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto p-2">
                    {searchResults.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No results found for "{query}"
                        </div>
                    ) : (
                        searchResults.map((result, i) => (
                            <button
                                key={result.id}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${i === selectedIndex
                                        ? 'bg-accent/10 text-accent'
                                        : 'text-foreground hover:bg-secondary/50'
                                    }`}
                                onClick={result.action}
                                onMouseEnter={() => setSelectedIndex(i)}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${i === selectedIndex ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'
                                    }`}>
                                    {result.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{result.label}</p>
                                    {result.sublabel && (
                                        <p className="text-xs text-muted-foreground truncate">{result.sublabel}</p>
                                    )}
                                </div>
                                <ArrowRight className={`w-4 h-4 shrink-0 transition-opacity ${i === selectedIndex ? 'opacity-100 text-accent' : 'opacity-0'
                                    }`} />
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-secondary rounded text-[9px] font-mono">↑↓</kbd> Navigate</span>
                        <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-secondary rounded text-[9px] font-mono">↵</kbd> Select</span>
                    </div>
                    <span className="flex items-center gap-1">
                        <Command className="w-3 h-3" />K to open
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
