import { BIBLE_BOOKS, NUMBER_WORDS, FAMOUS_PHRASES, VerseReference } from './bibleData';

// Convert number words to digits
function wordToNumber(word: string): number | null {
  const lower = word.toLowerCase().trim();
  
  // Direct number
  const num = parseInt(lower, 10);
  if (!isNaN(num)) return num;
  
  // Word to number
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

// Find book name from input
function findBook(input: string): { book: string; remaining: string } | null {
  const lower = input.toLowerCase().trim();
  
  // Check for numbered books first (1 John, 2 Kings, etc.)
  const numberedMatch = lower.match(/^(first|second|third|1st|2nd|3rd|1|2|3)\s+(\w+)/i);
  
  for (const book of BIBLE_BOOKS) {
    const bookLower = book.name.toLowerCase();
    
    // Exact match
    if (lower.startsWith(bookLower)) {
      return {
        book: book.name,
        remaining: lower.slice(bookLower.length).trim()
      };
    }
    
    // Abbreviation match
    for (const abbr of book.abbr) {
      if (lower.startsWith(abbr + ' ') || lower === abbr) {
        return {
          book: book.name,
          remaining: lower.slice(abbr.length).trim()
        };
      }
    }
    
    // Handle numbered books with words
    if (numberedMatch) {
      const prefix = numberedMatch[1];
      const bookPart = numberedMatch[2];
      let numPrefix = '';
      
      if (prefix === 'first' || prefix === '1st' || prefix === '1') numPrefix = '1';
      else if (prefix === 'second' || prefix === '2nd' || prefix === '2') numPrefix = '2';
      else if (prefix === 'third' || prefix === '3rd' || prefix === '3') numPrefix = '3';
      
      // Check if this matches a numbered book
      for (const abbr of book.abbr) {
        if (abbr.startsWith(numPrefix) && abbr.includes(bookPart.toLowerCase())) {
          const fullMatch = `${prefix} ${bookPart}`;
          return {
            book: book.name,
            remaining: lower.slice(fullMatch.length).trim()
          };
        }
      }
    }
  }
  
  return null;
}

// Parse chapter and verse from remaining text
function parseChapterVerse(text: string): { chapter: number; verse: number } | null {
  const cleaned = text
    .toLowerCase()
    .replace(/chapter/g, '')
    .replace(/verse/g, ':')
    .replace(/verses/g, ':')
    .replace(/and/g, '')
    .trim();
  
  // Try various patterns
  const patterns = [
    // "3:16" or "3 16"
    /(\d+)\s*[:\s]\s*(\d+)/,
    // "three sixteen" or "three verse sixteen"
    /(\w+(?:\s*-?\s*\w+)?)\s+(?:verse\s+)?(\w+(?:\s*-?\s*\w+)?)/,
    // Just chapter number
    /^(\d+)$/,
    /^(\w+)$/,
  ];
  
  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      const chapter = wordToNumber(match[1]);
      const verse = match[2] ? wordToNumber(match[2]) : 1;
      
      if (chapter !== null && verse !== null) {
        return { chapter, verse };
      }
    }
  }
  
  // Try splitting by common separators
  const parts = cleaned.split(/[\s:,]+/).filter(p => p.length > 0);
  if (parts.length >= 2) {
    const chapter = wordToNumber(parts[0]);
    const verse = wordToNumber(parts[1]);
    if (chapter !== null && verse !== null) {
      return { chapter, verse };
    }
  } else if (parts.length === 1) {
    const chapter = wordToNumber(parts[0]);
    if (chapter !== null) {
      return { chapter, verse: 1 };
    }
  }
  
  return null;
}

// Check for famous phrase matches
function checkFamousPhrases(input: string): VerseReference | null {
  const lower = input.toLowerCase().trim();
  
  for (const [phrase, ref] of Object.entries(FAMOUS_PHRASES)) {
    if (lower.includes(phrase)) {
      return ref;
    }
  }
  
  // Partial matching for flexibility
  const words = lower.split(/\s+/);
  for (const [phrase, ref] of Object.entries(FAMOUS_PHRASES)) {
    const phraseWords = phrase.split(/\s+/);
    let matchCount = 0;
    
    for (const word of words) {
      if (phraseWords.includes(word)) {
        matchCount++;
      }
    }
    
    // If more than 60% of phrase words match
    if (matchCount >= phraseWords.length * 0.6) {
      return ref;
    }
  }
  
  return null;
}

// Main parsing function
export function parseVerseReference(input: string): VerseReference | null {
  if (!input || input.trim().length === 0) {
    return null;
  }
  
  const cleaned = input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?]/g, '');
  
  // First check for famous phrases
  const phraseMatch = checkFamousPhrases(cleaned);
  if (phraseMatch) {
    return phraseMatch;
  }
  
  // Try to find a book name
  const bookResult = findBook(cleaned);
  if (!bookResult) {
    return null;
  }
  
  // Parse chapter and verse from remaining text
  const chapterVerse = parseChapterVerse(bookResult.remaining);
  if (!chapterVerse) {
    // Default to chapter 1, verse 1 if only book is specified
    return {
      book: bookResult.book,
      chapter: 1,
      verse: 1
    };
  }
  
  return {
    book: bookResult.book,
    chapter: chapterVerse.chapter,
    verse: chapterVerse.verse
  };
}

// Format verse reference for display
export function formatVerseReference(ref: VerseReference): string {
  return `${ref.book} ${ref.chapter}:${ref.verse}`;
}
