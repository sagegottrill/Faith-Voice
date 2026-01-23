// A curated list of popular verses to demonstrate semantic search.
// In a full production app, this would be the entire Bible, indexed in a vector DB (like SQLite-vss or a binary file).

export interface PopularVerse {
    reference: string;
    text: string;
    embedding?: number[];
}

export const POPULAR_VERSES: PopularVerse[] = [
    { reference: "John 11:35", text: "Jesus wept." },
    { reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
    { reference: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
    { reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want." },
    { reference: "Genesis 1:1", text: "In the beginning God created the heaven and the earth." },
    { reference: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end." },
    { reference: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
    { reference: "Ephesians 2:8", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God." },
    { reference: "Proverbs 3:5", text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding." },
    { reference: "Revelation 22:20", text: "He which testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus." },
    { reference: "1 Corinthians 13:4", text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up." },
    { reference: "Matthew 5:14", text: "Ye are the light of the world. A city that is set on an hill cannot be hid." },
    { reference: "Isaiah 53:5", text: "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed." }
];
