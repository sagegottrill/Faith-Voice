import { BIBLE_BOOKS, NUMBER_WORDS, FAMOUS_PHRASES, VerseReference } from './bibleData';
import { AVAILABLE_TRANSLATIONS } from './bibleService';

// ─────────────────────────────────────────────────────
// Smart NLP Bible Parser
// Handles natural speech like:
//   "um Genesis verse 1 KJV version"
//   "go to first John chapter 3 verse 16 in ASV"
//   "read me psalm twenty three"
//   "Bible, show me Romans 8:28 in the Geneva version"
// ─────────────────────────────────────────────────────

export interface SmartParseResult {
  ref: VerseReference;
  translationId?: string; // e.g. 'kjv', 'asv', 'net'
  confidence: number;     // 0-1 how confident the parse is
  cleaned: string;        // the cleaned input after stripping filler
}

// ── Filler / noise words to strip ──
const FILLER_WORDS = new Set([
  'um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'well',
  'okay', 'ok', 'right', 'the', 'a', 'an', 'please', 'can',
  'you', 'me', 'i', 'want', 'to', 'hear', 'lets', "let's",
  'go', 'show', 'read', 'open', 'find', 'search', 'pull',
  'up', 'for', 'from', 'in', 'of', 'at', 'on', 'it',
  'bible', 'voicebible', 'voice', 'scripture', 'app',
  'hey', 'wake', 'that', 'this', 'just', 'get',
]);

// Words that signal chapter/verse but should be stripped after parsing
const STRUCTURE_WORDS = ['chapter', 'chapters', 'verse', 'verses', 'vs', 'v'];

// ── Translation aliases ──
// Maps spoken phrases to translation IDs
const TRANSLATION_ALIASES: Record<string, string> = {
  'kjv': 'kjv',
  'king james': 'kjv',
  'king james version': 'kjv',
  'strongs': 'kjv_strongs',
  'strong': 'kjv_strongs',
  'pure cambridge': 'kjvpce',
  'cambridge': 'kjvpce',
  'asv': 'asv',
  'american standard': 'asv',
  'american standard version': 'asv',
  'bishops': 'bishops',
  'bishop': 'bishops',
  'coverdale': 'coverdale',
  'geneva': 'geneva',
  'net': 'net',
  'new english': 'net',
  'new english translation': 'net',
  'tyndale': 'tyndale',
  'web': 'web',
  'world english': 'web',
  'world english bible': 'web',
};

// ── Number word conversion ──
function wordToNumber(word: string): number | null {
  const lower = word.toLowerCase().trim();

  const num = parseInt(lower, 10);
  if (!isNaN(num)) return num;

  if (NUMBER_WORDS[lower]) return NUMBER_WORDS[lower];

  // Handle compound numbers like "twenty one"
  const parts = lower.split(/[\s-]+/);
  if (parts.length === 2) {
    const tens = NUMBER_WORDS[parts[0]];
    const ones = NUMBER_WORDS[parts[1]];
    if (tens && ones && tens >= 20) {
      return tens + ones;
    }
  }

  return null;
}

// ── Detect and extract translation ──
function extractTranslation(words: string[]): { translationId: string | undefined; remaining: string[] } {
  const joined = words.join(' ');

  // Sort aliases by length (longest first) so "king james version" matches before "king"
  const sortedAliases = Object.entries(TRANSLATION_ALIASES)
    .sort(([a], [b]) => b.length - a.length);

  for (const [alias, id] of sortedAliases) {
    // Check if the alias appears, followed optionally by "version", "translation", "bible"
    const pattern = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(\\s+(version|translation|bible))?`, 'i');
    const match = joined.match(pattern);
    if (match) {
      const cleaned = joined.replace(match[0], '').replace(/\s+/g, ' ').trim();
      return { translationId: id, remaining: cleaned.split(/\s+/).filter(w => w.length > 0) };
    }
  }

  return { translationId: undefined, remaining: words };
}

// ── Find book name (smart / fuzzy) ──
function findBookSmart(words: string[]): { book: string; remainingWords: string[]; matchedIndices: Set<number> } | null {
  const lower = words.map(w => w.toLowerCase());

  // Sort BIBLE_BOOKS by name length descending for longest match first
  const sortedBooks = [...BIBLE_BOOKS].sort((a, b) => b.name.length - a.name.length);

  for (const book of sortedBooks) {
    const bookLower = book.name.toLowerCase();
    const bookWords = bookLower.split(/\s+/);

    // Try to find consecutive book words in the input
    for (let startIdx = 0; startIdx <= lower.length - bookWords.length; startIdx++) {
      let allMatch = true;
      for (let j = 0; j < bookWords.length; j++) {
        if (lower[startIdx + j] !== bookWords[j]) {
          allMatch = false;
          break;
        }
      }
      if (allMatch) {
        const matched = new Set<number>();
        for (let j = 0; j < bookWords.length; j++) matched.add(startIdx + j);
        const remaining = words.filter((_, i) => !matched.has(i));
        return { book: book.name, remainingWords: remaining, matchedIndices: matched };
      }
    }

    // Check abbreviations
    for (const abbr of book.abbr) {
      const abbrWords = abbr.toLowerCase().split(/\s+/);
      for (let startIdx = 0; startIdx <= lower.length - abbrWords.length; startIdx++) {
        let allMatch = true;
        for (let j = 0; j < abbrWords.length; j++) {
          if (lower[startIdx + j] !== abbrWords[j]) {
            allMatch = false;
            break;
          }
        }
        if (allMatch) {
          const matched = new Set<number>();
          for (let j = 0; j < abbrWords.length; j++) matched.add(startIdx + j);
          const remaining = words.filter((_, i) => !matched.has(i));
          return { book: book.name, remainingWords: remaining, matchedIndices: matched };
        }
      }
    }
  }

  // ── Prefix ordinal handling ──
  // "first john", "second peter", "1st kings"
  for (let i = 0; i < lower.length - 1; i++) {
    const w = lower[i];
    let numPrefix = '';
    if (w === 'first' || w === '1st') numPrefix = '1';
    else if (w === 'second' || w === '2nd') numPrefix = '2';
    else if (w === 'third' || w === '3rd') numPrefix = '3';

    if (numPrefix) {
      const nextWord = lower[i + 1];
      // Try to match "1 <nextWord>" against book names
      const combo = `${numPrefix} ${nextWord}`;
      for (const book of sortedBooks) {
        if (book.name.toLowerCase() === combo) {
          const matched = new Set([i, i + 1]);
          const remaining = words.filter((_, idx) => !matched.has(idx));
          return { book: book.name, remainingWords: remaining, matchedIndices: matched };
        }
        // Or check abbreviations
        for (const abbr of book.abbr) {
          if (abbr.toLowerCase() === combo || abbr.toLowerCase() === `${numPrefix}${nextWord}`) {
            const matched = new Set([i, i + 1]);
            const remaining = words.filter((_, idx) => !matched.has(idx));
            return { book: book.name, remainingWords: remaining, matchedIndices: matched };
          }
        }
      }
    }
  }

  return null;
}

// ── Extract chapter and verse from remaining words ──
function extractChapterVerse(words: string[]): { chapter: number; verse: number } {
  // Filter out structure words, keeping numbers and number-words
  const meaningful: string[] = [];
  for (const w of words) {
    const lower = w.toLowerCase();
    if (STRUCTURE_WORDS.includes(lower)) continue;
    if (FILLER_WORDS.has(lower)) continue;
    meaningful.push(w);
  }

  // Try to find numbers (digit or word form)
  const numbers: number[] = [];
  for (const w of meaningful) {
    const n = wordToNumber(w);
    if (n !== null) {
      numbers.push(n);
    }
  }

  // Also check for "3:16" style in remaining words
  for (const w of words) {
    const colonMatch = w.match(/^(\d+)[:.]\s*(\d+)$/);
    if (colonMatch) {
      return { chapter: parseInt(colonMatch[1]), verse: parseInt(colonMatch[2]) };
    }
  }

  if (numbers.length >= 2) {
    return { chapter: numbers[0], verse: numbers[1] };
  } else if (numbers.length === 1) {
    return { chapter: numbers[0], verse: 1 };
  }

  return { chapter: 1, verse: 1 };
}

// ── Check for famous phrases ──
function checkFamousPhrases(input: string): VerseReference | null {
  const lower = input.toLowerCase().trim();

  for (const [phrase, ref] of Object.entries(FAMOUS_PHRASES)) {
    if (lower.includes(phrase)) {
      return ref;
    }
  }

  // Partial matching
  const words = lower.split(/\s+/);
  for (const [phrase, ref] of Object.entries(FAMOUS_PHRASES)) {
    const phraseWords = phrase.split(/\s+/);
    let matchCount = 0;
    for (const word of words) {
      if (phraseWords.includes(word)) matchCount++;
    }
    if (matchCount >= phraseWords.length * 0.6) {
      return ref;
    }
  }

  return null;
}

// ── MAIN: Smart Parse ──
export function smartParse(input: string): SmartParseResult | null {
  if (!input || input.trim().length === 0) return null;

  // Step 0: Basic cleaning
  let cleaned = input
    .trim()
    .replace(/[.,!?'"]/g, '')
    .replace(/\s+/g, ' ');

  // Step 1: Check famous phrases first
  const phraseMatch = checkFamousPhrases(cleaned);
  if (phraseMatch) {
    return {
      ref: phraseMatch,
      confidence: 0.95,
      cleaned,
    };
  }

  // Step 2: Tokenize
  let words = cleaned.split(/\s+/);

  // Step 3: Extract translation (before stripping fillers, since "king james" could get stripped)
  const { translationId, remaining: wordsAfterTranslation } = extractTranslation(words);
  words = wordsAfterTranslation;

  // Step 4: Strip filler words (but preserve numbers and book names)
  // We do a "smart strip" – only remove if the word isn't a number or part of a book name
  const strippedWords: string[] = [];
  for (const w of words) {
    const lower = w.toLowerCase();
    // Keep numbers
    if (/^\d+$/.test(w)) { strippedWords.push(w); continue; }
    // Keep number words
    if (NUMBER_WORDS[lower]) { strippedWords.push(w); continue; }
    // Keep structure words (chapter/verse) for now, they help parsing
    if (STRUCTURE_WORDS.includes(lower)) { strippedWords.push(w); continue; }
    // Keep ordinals
    if (['first', 'second', 'third', '1st', '2nd', '3rd'].includes(lower)) { strippedWords.push(w); continue; }
    // Strip fillers
    if (FILLER_WORDS.has(lower)) continue;
    // Keep everything else (potential book names)
    strippedWords.push(w);
  }

  if (strippedWords.length === 0) return null;

  // Step 5: Find book name
  const bookResult = findBookSmart(strippedWords);
  if (!bookResult) return null;

  // Step 6: Extract chapter and verse from remaining words
  const { chapter, verse } = extractChapterVerse(bookResult.remainingWords);

  // Step 7: Calculate confidence
  let confidence = 0.7;
  if (chapter > 1 || verse > 1) confidence = 0.9;
  if (translationId) confidence = Math.min(confidence + 0.05, 1.0);

  return {
    ref: {
      book: bookResult.book,
      chapter,
      verse,
    },
    translationId,
    confidence,
    cleaned: strippedWords.join(' '),
  };
}

// ── Legacy wrapper (backward compatible) ──
export function parseVerseReference(input: string): VerseReference | null {
  const result = smartParse(input);
  return result ? result.ref : null;
}

// Format verse reference for display
export function formatVerseReference(ref: VerseReference): string {
  return `${ref.book} ${ref.chapter}:${ref.verse}`;
}
