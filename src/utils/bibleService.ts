import { Verse } from './bibleData';

export interface BibleMetadata {
    name: string;
    shortname: string;
    module: string;
    year: string;
    lang: string;
    publisher: string | null;
    description: string;
    copyright_statement: string;
}

export interface BibleVerseData {
    book_name: string;
    book: number;
    chapter: number;
    verse: number;
    text: string;
}

export interface BibleTranslationData {
    metadata: BibleMetadata;
    verses: BibleVerseData[];
}

export interface AvailableTranslation {
    id: string; // Filename without extension, e.g., 'kjv', 'asv'
    name: string; // Display name
}

export const AVAILABLE_TRANSLATIONS: AvailableTranslation[] = [
    { id: 'kjv', name: 'King James Version' },
    { id: 'kjv_strongs', name: 'KJV w/ Strongs' },
    { id: 'kjvpce', name: 'KJV (Pure Cambridge)' },
    { id: 'asv', name: 'American Standard Version' },
    { id: 'asvs', name: 'ASV (1901)' },
    { id: 'bishops', name: 'Bishops Bible (1568)' },
    { id: 'coverdale', name: 'Coverdale Bible (1535)' },
    { id: 'geneva', name: 'Geneva Bible (1599)' },
    { id: 'net', name: 'New English Translation' },
    { id: 'tyndale', name: 'Tyndale Bible (1526)' },
    { id: 'web', name: 'World English Bible' }
];

class BibleService {
    private currentTranslationId: string = 'kjv';
    // nested cache: translationId -> bookName (lowercase) -> chapterNumber -> verses
    private index: Record<string, Record<string, Record<number, Verse[]>>> = {};
    private metadataCache: Record<string, BibleMetadata> = {};
    private loadingPromise: Promise<void> | null = null;

    getAvailableTranslations(): AvailableTranslation[] {
        return AVAILABLE_TRANSLATIONS;
    }

    getCurrentTranslation(): AvailableTranslation {
        return AVAILABLE_TRANSLATIONS.find(t => t.id === this.currentTranslationId) || AVAILABLE_TRANSLATIONS[0];
    }

    async setTranslation(translationId: string): Promise<void> {
        if (this.currentTranslationId === translationId && this.index[translationId]) return;

        this.currentTranslationId = translationId;
        await this.ensureDataLoaded();
    }

    private async loadTranslationData(id: string): Promise<void> {
        try {
            const response = await fetch(`/bibles/${id}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load Bible translation: ${id}`);
            }
            const data: BibleTranslationData = await response.json();

            // Build Index
            this.index[id] = {};
            this.metadataCache[id] = data.metadata;

            data.verses.forEach(v => {
                const bookKey = this.normalizeKey(v.book_name);
                if (!this.index[id][bookKey]) {
                    this.index[id][bookKey] = {};
                }
                if (!this.index[id][bookKey][v.chapter]) {
                    this.index[id][bookKey][v.chapter] = [];
                }

                this.index[id][bookKey][v.chapter].push({
                    book: v.book_name,
                    chapter: v.chapter,
                    verse: v.verse,
                    text: v.text
                });
            });

        } catch (error) {
            console.error("Error loading Bible data:", error);
            throw error;
        }
    }

    private async ensureDataLoaded(): Promise<void> {
        if (this.index[this.currentTranslationId]) return;

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this.loadTranslationData(this.currentTranslationId)
            .finally(() => {
                this.loadingPromise = null;
            });

        return this.loadingPromise;
    }

    private normalizeKey(key: string): string {
        return key.toLowerCase().replace(/\s+/g, '').replace(/first/g, '1').replace(/second/g, '2').replace(/third/g, '3').replace(/1st/g, '1').replace(/2nd/g, '2').replace(/3rd/g, '3');
    }

    async getChapter(bookName: string, chapter: number): Promise<Verse[]> {
        await this.ensureDataLoaded();

        const targetKey = this.normalizeKey(bookName);
        const books = this.index[this.currentTranslationId];

        if (!books) return [];

        // Direct match attempt (fast)
        if (books[targetKey]) {
            return books[targetKey][chapter] || [];
        }

        // Fuzzy/smart match (fallback)
        const availableKeys = Object.keys(books);
        const key = availableKeys.find(k => {
            // We already normalized keys on load, but let's double check just in case
            // actually, we should store normalized keys in the index!
            // But if we didn't, we'd need to normalize here.
            // Let's rely on loadTranslationData using normalizeKey.
            return k === targetKey || k.includes(targetKey) || targetKey.includes(k);
        });

        if (key && books[key][chapter]) {
            return books[key][chapter];
        }
        return [];
    }

    async search(query: string, limit: number = 50): Promise<Verse[]> {
        await this.ensureDataLoaded();
        const lowerQuery = query.toLowerCase();
        const results: Verse[] = [];

        const books = this.index[this.currentTranslationId];
        if (!books) return [];

        for (const book of Object.values(books)) {
            for (const chapter of Object.values(book)) {
                for (const verse of chapter) {
                    if (verse.text.toLowerCase().includes(lowerQuery)) {
                        results.push(verse);
                        if (results.length >= limit) return results;
                    }
                }
            }
        }

        return results;
    }
}

export const bibleService = new BibleService();
