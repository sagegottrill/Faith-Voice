
const fs = require('fs');
const path = require('path');

const kjvPath = path.join(__dirname, '../public/bibles/kjv.json');

console.log(`Reading from: ${kjvPath}`);

try {
    const rawData = fs.readFileSync(kjvPath, 'utf8');
    const bibleData = JSON.parse(rawData);

    console.log(`Loaded ${bibleData.verses.length} verses.`);
    let modifiedCount = 0;

    bibleData.verses = bibleData.verses.map((verse) => {
        let originalText = verse.text;
        let newText = originalText;

        // Remove paragraph markers
        newText = newText.replace(/\u00B6/g, '').trim();

        // Remove brackets [added text]
        // Strategy: Remove the brackets but KEEP the text? Or remove the text inside?
        // KJV brackets usually denote translators' additions.
        // User said "messy kjv dirty".
        // Usually people want to remove the [ ] but KEEP the text inside for readability.
        // "God saw that [it was] good" -> "God saw that it was good".
        newText = newText.replace(/\[/g, '').replace(/\]/g, '');

        if (newText !== originalText) {
            modifiedCount++;
        }

        return {
            ...verse,
            text: newText
        };
    });

    console.log(`Cleaned ${modifiedCount} verses.`);

    const newJson = JSON.stringify(bibleData, null, 0); // Compress it too? No, keep logic simple.
    // user wants "speed", minimal JSON might helps but minimal whitespace is better. 
    // But let's keep it somewhat readable or just compact?
    // Let's output compact to save space/time loading.

    fs.writeFileSync(kjvPath, newJson);
    console.log(`Successfully wrote cleaned data to ${kjvPath}`);

} catch (err) {
    console.error("Error processing KJV:", err);
}
