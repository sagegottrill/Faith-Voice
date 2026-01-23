import { BIBLE_BOOKS } from './bibleData';

export type IntentType = 'COMMAND' | 'NARRATIVE' | 'UNCERTAIN';

interface IntentResult {
    type: IntentType;
    confidence: number;
    reason?: string;
}

// Wake words that must be present for activation
const WAKE_WORDS = [
    'voicebible', 'voice bible', 'bible app', 'scripture app',
    'hey bible', 'okay bible', 'bible'
];

const COMMAND_TRIGGERS = [
    'open', 'go to', 'search', 'find', 'show me', 'display', 'read', 'pull up'
];

const SCRIPTURE_PREFIXES = [
    'bible says', 'scripture says', 'book of', 'letter to', 'gospel of'
];

export const classifyIntent = (text: string): IntentResult => {
    const normalized = text.toLowerCase().trim();

    if (!normalized) return { type: 'UNCERTAIN', confidence: 0 };

    // CRITICAL: Check for wake word FIRST
    // Only activate if preacher explicitly addresses the app
    const hasWakeWord = WAKE_WORDS.some(wake => normalized.includes(wake));

    // 1. Check for Direct Scripture Reference (Strongest Signal)
    const bookNames = BIBLE_BOOKS.map(b => b.name.toLowerCase()).join('|');
    const verseRegex = new RegExp(`\\b(${bookNames})\\b\\s+\\d+([:.]\\s*\\d+)?`, 'i');
    const hasVerseReference = verseRegex.test(normalized);

    // RULE: Must have wake word OR explicit verse reference
    if (!hasWakeWord && !hasVerseReference) {
        return { type: 'NARRATIVE', confidence: 0.95, reason: 'No wake word or verse reference' };
    }

    // If we have a verse reference, it's a command
    if (hasVerseReference) {
        return { type: 'COMMAND', confidence: 1.0, reason: 'Detected explicit verse reference' };
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
