
import { parseVerseReference } from '../src/utils/bibleParser';

const testCases = [
    "First John",
    "1st John",
    "1 John",
    "First John 1:1",
    "Second Peter",
    "2nd Peter",
    "Genesis",
    "The Gospel of John"
];

console.log("Running Bible Parser Tests...");

testCases.forEach(input => {
    const result = parseVerseReference(input);
    console.log(`Input: "${input}"`);
    if (result) {
        console.log(`  => Book: ${result.book}, Chapter: ${result.chapter}, Verse: ${result.verse}`);
    } else {
        console.log(`  => NULL (Failed to parse)`);
    }
});
