import { useState, useCallback, useEffect } from 'react';

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple';

export interface VerseHighlight {
    book: string;
    chapter: number;
    verse: number;
    color: HighlightColor;
    timestamp: string;
}

const STORAGE_KEY = 'voicebible_highlights';

export const HIGHLIGHT_COLORS: { color: HighlightColor; label: string; bg: string; ring: string }[] = [
    { color: 'yellow', label: 'Yellow', bg: 'bg-yellow-200/40 dark:bg-yellow-500/20', ring: 'ring-yellow-400' },
    { color: 'green', label: 'Green', bg: 'bg-emerald-200/40 dark:bg-emerald-500/20', ring: 'ring-emerald-400' },
    { color: 'blue', label: 'Blue', bg: 'bg-blue-200/40 dark:bg-blue-500/20', ring: 'ring-blue-400' },
    { color: 'pink', label: 'Pink', bg: 'bg-pink-200/40 dark:bg-pink-500/20', ring: 'ring-pink-400' },
    { color: 'purple', label: 'Purple', bg: 'bg-purple-200/40 dark:bg-purple-500/20', ring: 'ring-purple-400' },
];

function makeKey(book: string, chapter: number, verse: number): string {
    return `${book}:${chapter}:${verse}`;
}

export function useHighlights() {
    const [highlights, setHighlights] = useState<Map<string, VerseHighlight>>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const arr: VerseHighlight[] = JSON.parse(stored);
                const map = new Map<string, VerseHighlight>();
                arr.forEach(h => map.set(makeKey(h.book, h.chapter, h.verse), h));
                return map;
            }
        } catch (e) {
            console.error('Failed to load highlights:', e);
        }
        return new Map();
    });

    const persist = useCallback((map: Map<string, VerseHighlight>) => {
        const arr = Array.from(map.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
        setHighlights(new Map(map));
    }, []);

    const getHighlight = useCallback((book: string, chapter: number, verse: number): VerseHighlight | undefined => {
        return highlights.get(makeKey(book, chapter, verse));
    }, [highlights]);

    const setHighlight = useCallback((book: string, chapter: number, verse: number, color: HighlightColor) => {
        const key = makeKey(book, chapter, verse);
        const updated = new Map(highlights);
        updated.set(key, { book, chapter, verse, color, timestamp: new Date().toISOString() });
        persist(updated);
    }, [highlights, persist]);

    const removeHighlight = useCallback((book: string, chapter: number, verse: number) => {
        const key = makeKey(book, chapter, verse);
        const updated = new Map(highlights);
        updated.delete(key);
        persist(updated);
    }, [highlights, persist]);

    const toggleHighlight = useCallback((book: string, chapter: number, verse: number, color: HighlightColor) => {
        const existing = getHighlight(book, chapter, verse);
        if (existing && existing.color === color) {
            removeHighlight(book, chapter, verse);
        } else {
            setHighlight(book, chapter, verse, color);
        }
    }, [getHighlight, setHighlight, removeHighlight]);

    const getHighlightColor = useCallback((book: string, chapter: number, verse: number): HighlightColor | null => {
        const h = highlights.get(makeKey(book, chapter, verse));
        return h ? h.color : null;
    }, [highlights]);

    const getHighlightBgClass = useCallback((book: string, chapter: number, verse: number): string => {
        const color = getHighlightColor(book, chapter, verse);
        if (!color) return '';
        const found = HIGHLIGHT_COLORS.find(c => c.color === color);
        return found ? found.bg : '';
    }, [getHighlightColor]);

    const allHighlights = Array.from(highlights.values());

    return {
        getHighlight,
        setHighlight,
        removeHighlight,
        toggleHighlight,
        getHighlightColor,
        getHighlightBgClass,
        allHighlights,
        highlightCount: allHighlights.length,
    };
}
