import kjvData from '@/data/kjv.json';
import { Verse } from './bibleData';

// Types for the JSON structure
interface BibleBook {
    name: string;
    abbrev: string;
    chapters: string[][];
}

const bibleLibrary: BibleBook[] = kjvData as BibleBook[];

interface FetchOptions {
    book: string;
    chapter: number;
    verse: number;
    contextBefore?: number;
    contextAfter?: number;
}

export function fetchLocalVerses({
    book,
    chapter,
    verse,
    contextBefore = 0,
    contextAfter = 0
}: FetchOptions): { verses: Verse[], error?: string } {

    // Find the book
    const bookData = bibleLibrary.find(b =>
        b.name.toLowerCase() === book.toLowerCase() ||
        b.abbrev.toLowerCase() === book.toLowerCase()
    );

    if (!bookData) {
        // Try fuzzy match or finding by partial name if needed
        return { verses: [], error: `Book '${book}' not found.` };
    }

    // Validate chapter
    if (chapter < 1 || chapter > bookData.chapters.length) {
        return { verses: [], error: `${bookData.name} has only ${bookData.chapters.length} chapters.` };
    }

    const chapterData = bookData.chapters[chapter - 1]; // 0-indexed

    // Validate verse
    if (verse < 1 || verse > chapterData.length) {
        return { verses: [], error: `${bookData.name} ${chapter} has only ${chapterData.length} verses.` };
    }

    const verses: Verse[] = [];
    const startVerse = Math.max(1, verse - contextBefore);
    const endVerse = Math.min(chapterData.length, verse + contextAfter);

    for (let v = startVerse; v <= endVerse; v++) {
        verses.push({
            book: bookData.name,
            chapter: chapter,
            verse: v,
            text: chapterData[v - 1], // 0-indexed
            isTarget: v === verse
        });
    }

    return { verses };
}

export function fetchLocalChapter(book: string, chapter: number): { verses: Verse[], error?: string } {
    const bookData = bibleLibrary.find(b =>
        b.name.toLowerCase() === book.toLowerCase() ||
        b.abbrev.toLowerCase() === book.toLowerCase()
    );

    if (!bookData) {
        return { verses: [], error: `Book '${book}' not found.` };
    }

    if (chapter < 1 || chapter > bookData.chapters.length) {
        return { verses: [], error: `${bookData.name} has only ${bookData.chapters.length} chapters.` };
    }

    const chapterData = bookData.chapters[chapter - 1];
    const verses: Verse[] = chapterData.map((text, idx) => ({
        book: bookData.name,
        chapter: chapter,
        verse: idx + 1,
        text: text,
        isTarget: false
    }));

    return { verses };
}

// Helper to search text (simple implementation for "fast" local search)
export function searchLocalVerses(query: string, limit = 10): Verse[] {
    const results: Verse[] = [];
    const lowerQuery = query.toLowerCase();

    for (const book of bibleLibrary) {
        for (let c = 0; c < book.chapters.length; c++) {
            for (let v = 0; v < book.chapters[c].length; v++) {
                if (book.chapters[c][v].toLowerCase().includes(lowerQuery)) {
                    results.push({
                        book: book.name,
                        chapter: c + 1,
                        verse: v + 1,
                        text: book.chapters[c][v]
                    });
                    if (results.length >= limit) return results;
                }
            }
        }
    }
    return results;
}
