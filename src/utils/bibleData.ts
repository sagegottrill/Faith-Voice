// Bible book data with names, abbreviations, and chapter counts
export const BIBLE_BOOKS = [
  { name: 'Genesis', abbr: ['gen', 'ge', 'gn'], chapters: 50 },
  { name: 'Exodus', abbr: ['exod', 'ex', 'exo'], chapters: 40 },
  { name: 'Leviticus', abbr: ['lev', 'le', 'lv'], chapters: 27 },
  { name: 'Numbers', abbr: ['num', 'nu', 'nm', 'nb'], chapters: 36 },
  { name: 'Deuteronomy', abbr: ['deut', 'de', 'dt'], chapters: 34 },
  { name: 'Joshua', abbr: ['josh', 'jos', 'jsh'], chapters: 24 },
  { name: 'Judges', abbr: ['judg', 'jdg', 'jg', 'jdgs'], chapters: 21 },
  { name: 'Ruth', abbr: ['rth', 'ru'], chapters: 4 },
  { name: '1 Samuel', abbr: ['1sam', '1sa', '1s', 'first samuel'], chapters: 31 },
  { name: '2 Samuel', abbr: ['2sam', '2sa', '2s', 'second samuel'], chapters: 24 },
  { name: '1 Kings', abbr: ['1kgs', '1ki', '1k', 'first kings'], chapters: 22 },
  { name: '2 Kings', abbr: ['2kgs', '2ki', '2k', 'second kings'], chapters: 25 },
  { name: '1 Chronicles', abbr: ['1chr', '1ch', 'first chronicles'], chapters: 29 },
  { name: '2 Chronicles', abbr: ['2chr', '2ch', 'second chronicles'], chapters: 36 },
  { name: 'Ezra', abbr: ['ezr', 'ez'], chapters: 10 },
  { name: 'Nehemiah', abbr: ['neh', 'ne'], chapters: 13 },
  { name: 'Esther', abbr: ['esth', 'est', 'es'], chapters: 10 },
  { name: 'Job', abbr: ['jb'], chapters: 42 },
  { name: 'Psalms', abbr: ['ps', 'psa', 'psm', 'pss', 'psalm'], chapters: 150 },
  { name: 'Proverbs', abbr: ['prov', 'pro', 'prv', 'pr'], chapters: 31 },
  { name: 'Ecclesiastes', abbr: ['eccl', 'ecc', 'ec', 'qoh'], chapters: 12 },
  { name: 'Song of Solomon', abbr: ['song', 'sos', 'so', 'songs', 'song of songs'], chapters: 8 },
  { name: 'Isaiah', abbr: ['isa', 'is'], chapters: 66 },
  { name: 'Jeremiah', abbr: ['jer', 'je', 'jr'], chapters: 52 },
  { name: 'Lamentations', abbr: ['lam', 'la'], chapters: 5 },
  { name: 'Ezekiel', abbr: ['ezek', 'eze', 'ezk'], chapters: 48 },
  { name: 'Daniel', abbr: ['dan', 'da', 'dn'], chapters: 12 },
  { name: 'Hosea', abbr: ['hos', 'ho'], chapters: 14 },
  { name: 'Joel', abbr: ['joe', 'jl'], chapters: 3 },
  { name: 'Amos', abbr: ['amo', 'am'], chapters: 9 },
  { name: 'Obadiah', abbr: ['obad', 'ob'], chapters: 1 },
  { name: 'Jonah', abbr: ['jon', 'jnh'], chapters: 4 },
  { name: 'Micah', abbr: ['mic', 'mc'], chapters: 7 },
  { name: 'Nahum', abbr: ['nah', 'na'], chapters: 3 },
  { name: 'Habakkuk', abbr: ['hab', 'hb'], chapters: 3 },
  { name: 'Zephaniah', abbr: ['zeph', 'zep', 'zp'], chapters: 3 },
  { name: 'Haggai', abbr: ['hag', 'hg'], chapters: 2 },
  { name: 'Zechariah', abbr: ['zech', 'zec', 'zc'], chapters: 14 },
  { name: 'Malachi', abbr: ['mal', 'ml'], chapters: 4 },
  { name: 'Matthew', abbr: ['matt', 'mt', 'mat'], chapters: 28 },
  { name: 'Mark', abbr: ['mrk', 'mk', 'mr'], chapters: 16 },
  { name: 'Luke', abbr: ['luk', 'lk'], chapters: 24 },
  { name: 'John', abbr: ['joh', 'jn', 'jhn'], chapters: 21 },
  { name: 'Acts', abbr: ['act', 'ac'], chapters: 28 },
  { name: 'Romans', abbr: ['rom', 'ro', 'rm'], chapters: 16 },
  { name: '1 Corinthians', abbr: ['1cor', '1co', 'first corinthians', '1 corinthians'], chapters: 16 },
  { name: '2 Corinthians', abbr: ['2cor', '2co', 'second corinthians', '2 corinthians'], chapters: 13 },
  { name: 'Galatians', abbr: ['gal', 'ga'], chapters: 6 },
  { name: 'Ephesians', abbr: ['eph', 'ephes'], chapters: 6 },
  { name: 'Philippians', abbr: ['phil', 'php', 'pp'], chapters: 4 },
  { name: 'Colossians', abbr: ['col', 'co'], chapters: 4 },
  { name: '1 Thessalonians', abbr: ['1thess', '1th', 'first thessalonians', '1 thessalonians'], chapters: 5 },
  { name: '2 Thessalonians', abbr: ['2thess', '2th', 'second thessalonians', '2 thessalonians'], chapters: 3 },
  { name: '1 Timothy', abbr: ['1tim', '1ti', 'first timothy', '1 timothy'], chapters: 6 },
  { name: '2 Timothy', abbr: ['2tim', '2ti', 'second timothy', '2 timothy'], chapters: 4 },
  { name: 'Titus', abbr: ['tit', 'ti'], chapters: 3 },
  { name: 'Philemon', abbr: ['phlm', 'phm', 'pm'], chapters: 1 },
  { name: 'Hebrews', abbr: ['heb'], chapters: 13 },
  { name: 'James', abbr: ['jas', 'jm'], chapters: 5 },
  { name: '1 Peter', abbr: ['1pet', '1pe', '1pt', 'first peter', '1 peter'], chapters: 5 },
  { name: '2 Peter', abbr: ['2pet', '2pe', '2pt', 'second peter', '2 peter'], chapters: 3 },
  { name: '1 John', abbr: ['1john', '1jn', '1jo', 'first john', '1 john'], chapters: 5 },
  { name: '2 John', abbr: ['2john', '2jn', '2jo', 'second john', '2 john'], chapters: 1 },
  { name: '3 John', abbr: ['3john', '3jn', '3jo', 'third john', '3 john'], chapters: 1 },
  { name: 'Jude', abbr: ['jud', 'jd'], chapters: 1 },
  { name: 'Revelation', abbr: ['rev', 're', 'rv', 'revelations'], chapters: 22 },
];

// Number words to digits mapping
export const NUMBER_WORDS: Record<string, number> = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
  'twenty-one': 21, 'twenty-two': 22, 'twenty-three': 23, 'twenty-four': 24, 'twenty-five': 25,
  'twenty-six': 26, 'twenty-seven': 27, 'twenty-eight': 28, 'twenty-nine': 29, 'thirty': 30,
  'thirty-one': 31, 'thirty-two': 32, 'thirty-three': 33, 'thirty-four': 34, 'thirty-five': 35,
  'thirty-six': 36, 'thirty-seven': 37, 'thirty-eight': 38, 'thirty-nine': 39, 'forty': 40,
  'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
  'hundred': 100, 'one hundred': 100, 'first': 1, 'second': 2, 'third': 3,
};

// Famous verse phrases for fuzzy matching
export const FAMOUS_PHRASES: Record<string, { book: string; chapter: number; verse: number }> = {
  'the lord is my shepherd': { book: 'Psalms', chapter: 23, verse: 1 },
  'for god so loved the world': { book: 'John', chapter: 3, verse: 16 },
  'in the beginning': { book: 'Genesis', chapter: 1, verse: 1 },
  'i can do all things': { book: 'Philippians', chapter: 4, verse: 13 },
  'love is patient': { book: 'First Corinthians', chapter: 13, verse: 4 },
  'be strong and courageous': { book: 'Joshua', chapter: 1, verse: 9 },
  'trust in the lord': { book: 'Proverbs', chapter: 3, verse: 5 },
  'fear not': { book: 'Isaiah', chapter: 41, verse: 10 },
  'the lord is my light': { book: 'Psalms', chapter: 27, verse: 1 },
  'blessed are the poor in spirit': { book: 'Matthew', chapter: 5, verse: 3 },
  'our father who art in heaven': { book: 'Matthew', chapter: 6, verse: 9 },
  'the fruit of the spirit': { book: 'Galatians', chapter: 5, verse: 22 },
  'faith hope and love': { book: 'First Corinthians', chapter: 13, verse: 13 },
  'all things work together': { book: 'Romans', chapter: 8, verse: 28 },
  'do not be anxious': { book: 'Philippians', chapter: 4, verse: 6 },
  'i am the way': { book: 'John', chapter: 14, verse: 6 },
  'be still and know': { book: 'Psalms', chapter: 46, verse: 10 },
  'create in me a clean heart': { book: 'Psalms', chapter: 51, verse: 10 },
  'the wages of sin': { book: 'Romans', chapter: 6, verse: 23 },
  'by grace you have been saved': { book: 'Ephesians', chapter: 2, verse: 8 },
};

export interface VerseReference {
  book: string;
  chapter: number;
  verse: number;
}

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  isTarget?: boolean;
}
