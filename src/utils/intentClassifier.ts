import { BIBLE_BOOKS } from './bibleData';

export type IntentType = 'COMMAND' | 'NARRATIVE' | 'MEDIA' | 'UNCERTAIN';

interface IntentResult {
    type: IntentType;
    confidence: number;
    reason?: string;
}

// Wake words that must be present for activation
// We will allow these to be extended at runtime potentially, but for now specific defaults
export const DEFAULT_WAKE_WORDS = [
    'voicebible', 'voice bible', 'bible app', 'scripture app',
    'hey bible', 'okay bible', 'bible', 'wake up', 'media'
];

const COMMAND_TRIGGERS = [
    'open', 'go to', 'search', 'find', 'show me', 'display', 'read', 'pull up'
];

const MEDIA_TRIGGERS = [
    'media', 'project', 'presentation', 'screen', 'display mode'
];

const SCRIPTURE_PREFIXES = [
    'bible says', 'scripture says', 'book of', 'letter to', 'gospel of'
];

export const classifyIntent = (text: string, customWakeWords: string[] = []): IntentResult => {
    const normalized = text.toLowerCase().trim();

    if (!normalized) return { type: 'UNCERTAIN', confidence: 0 };

    // CRITICAL: Check for wake word FIRST
    // Only activate if preacher explicitly addresses the app
    // Combine default and any custom ones
    const wakeWords = [...DEFAULT_WAKE_WORDS, ...customWakeWords.map(w => w.toLowerCase())];
    const hasWakeWord = wakeWords.some(wake => normalized.includes(wake));

    // 1. Check for Direct Scripture Reference (Strongest Signal)
    // Build a massive regex of all names AND abbreviations
    // Flatten all names and abbrs into one array
    const allBookIdentifiers = BIBLE_BOOKS.flatMap(b => [b.name, ...b.abbr].map(s => s.toLowerCase()));
    // Sort by length descending to match longest first (e.g. "1 John" before "John")
    const sortedIdentifiers = [...new Set(allBookIdentifiers)].sort((a, b) => b.length - a.length);

    const bookPattern = sortedIdentifiers.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const verseRegex = new RegExp(`\\b(${bookPattern})\\b\\s+\\d+([:.]\\s*\\d+)?`, 'i');
    const hasVerseReference = verseRegex.test(normalized);

    // Check for just a book name (e.g. "Genesis", "1st John")
    // Use word boundary to avoid partial matches inside other words
    const bookRegex = new RegExp(`\\b(${bookPattern})\\b`, 'i');
    const hasBookReference = bookRegex.test(normalized);

    // RULE: Must have wake word OR explicit verse reference OR just a book name
    // BUT disregard this rule if it is a MEDIA command
    const isMediaIntent = MEDIA_TRIGGERS.some(trigger => normalized.includes(trigger));
    if (isMediaIntent) {
        return { type: 'MEDIA', confidence: 0.95, reason: 'Media trigger detected' };
    }

    if (!hasWakeWord && !hasVerseReference && !hasBookReference) {
        return { type: 'NARRATIVE', confidence: 0.95, reason: 'No wake word or bible reference' };
    }

    // If we have a verse reference, it's a command
    if (hasVerseReference) {
        return { type: 'COMMAND', confidence: 1.0, reason: 'Detected explicit verse reference' };
    }

    // If we have just a book reference, treat as command (will default to ch 1)
    if (hasBookReference) {
        return { type: 'COMMAND', confidence: 0.9, reason: 'Detected book reference' };
    }

    // 2. Check for Explicit Command Triggers (with wake word)
    const startsWithCommand = COMMAND_TRIGGERS.some(trigger => normalized.includes(trigger));
    if (hasWakeWord && startsWithCommand) {
        return { type: 'COMMAND', confidence: 0.9, reason: 'Wake word + command trigger' };
    }

    // 3. Check for Scripture Prefixes (with wake word)
    const hasScripturePrefix = SCRIPTURE_PREFIXES.some(prefix => normalized.includes(prefix));
    if (hasWakeWord && hasScripturePrefix) {
        return { type: 'COMMAND', confidence: 0.85, reason: 'Wake word + scripture context' };
    }

    // 4. Narrative/Casual Speech Detection
    const wordCount = normalized.split(/\s+/).length;
    if (wordCount > 15) {
        return { type: 'NARRATIVE', confidence: 0.8, reason: 'Too long / narrative flow' };
    }

    // 5. Short phrase with wake word -> likely a search
    if (hasWakeWord && wordCount < 10) {
        return { type: 'COMMAND', confidence: 0.7, reason: 'Wake word + short phrase' };
    }

    return { type: 'NARRATIVE', confidence: 0.6, reason: 'Default fallback' };
};
