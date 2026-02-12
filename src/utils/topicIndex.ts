import { BIBLE_BOOKS } from './bibleData';

export interface TopicVerse {
    reference: string; book: string; chapter: number; verse: number; snippet: string;
}
export interface TopicEntry {
    topic: string; aliases: string[]; verses: TopicVerse[];
}

// Helper to create verse entries concisely
const v = (ref: string, book: string, ch: number, vs: number, snippet: string): TopicVerse =>
    ({ reference: ref, book, chapter: ch, verse: vs, snippet });

export const TOPIC_INDEX: TopicEntry[] = [
    {
        topic: "Love", aliases: ["love", "loving", "charity", "beloved", "affection", "compassion"], verses: [
            v("1 Corinthians 13:4-7", "1 Corinthians", 13, 4, "Charity suffereth long, and is kind; charity envieth not..."),
            v("John 3:16", "John", 3, 16, "For God so loved the world, that he gave his only begotten Son..."),
            v("Romans 8:38-39", "Romans", 8, 38, "Neither death, nor life... shall separate us from the love of God..."),
            v("1 John 4:19", "1 John", 4, 19, "We love him, because he first loved us."),
            v("John 15:13", "John", 15, 13, "Greater love hath no man than this, that a man lay down his life..."),
            v("1 John 4:8", "1 John", 4, 8, "He that loveth not knoweth not God; for God is love."),
        ]
    },
    {
        topic: "Faith", aliases: ["faith", "believe", "believing", "trust", "trusting", "confidence"], verses: [
            v("Hebrews 11:1", "Hebrews", 11, 1, "Now faith is the substance of things hoped for..."),
            v("Romans 10:17", "Romans", 10, 17, "So then faith cometh by hearing, and hearing by the word of God."),
            v("Matthew 17:20", "Matthew", 17, 20, "If ye have faith as a grain of mustard seed... nothing impossible"),
            v("Galatians 2:20", "Galatians", 2, 20, "I live by the faith of the Son of God, who loved me..."),
            v("James 2:17", "James", 2, 17, "Even so faith, if it hath not works, is dead, being alone."),
        ]
    },
    {
        topic: "Strength", aliases: ["strength", "strong", "power", "powerful", "might", "mighty", "endurance"], verses: [
            v("Philippians 4:13", "Philippians", 4, 13, "I can do all things through Christ which strengtheneth me."),
            v("Isaiah 40:31", "Isaiah", 40, 31, "They that wait upon the LORD shall renew their strength..."),
            v("Psalm 46:1", "Psalms", 46, 1, "God is our refuge and strength, a very present help in trouble."),
            v("2 Timothy 1:7", "2 Timothy", 1, 7, "God hath not given us the spirit of fear; but of power..."),
            v("Ephesians 6:10", "Ephesians", 6, 10, "Be strong in the Lord, and in the power of his might."),
            v("Nehemiah 8:10", "Nehemiah", 8, 10, "The joy of the LORD is your strength."),
        ]
    },
    {
        topic: "Peace", aliases: ["peace", "peaceful", "calm", "tranquility", "rest", "anxiety", "anxious", "worry", "worried", "stress"], verses: [
            v("Philippians 4:6-7", "Philippians", 4, 6, "Be careful for nothing... the peace of God shall keep your hearts..."),
            v("John 14:27", "John", 14, 27, "Peace I leave with you, my peace I give unto you..."),
            v("Isaiah 26:3", "Isaiah", 26, 3, "Thou wilt keep him in perfect peace, whose mind is stayed on thee..."),
            v("Psalm 46:10", "Psalms", 46, 10, "Be still, and know that I am God..."),
            v("John 16:33", "John", 16, 33, "In the world ye shall have tribulation: but be of good cheer..."),
        ]
    },
    {
        topic: "Hope", aliases: ["hope", "hopeful", "hoping", "expectation", "future", "encouragement"], verses: [
            v("Jeremiah 29:11", "Jeremiah", 29, 11, "For I know the thoughts that I think toward you... thoughts of peace..."),
            v("Romans 15:13", "Romans", 15, 13, "Now the God of hope fill you with all joy and peace in believing..."),
            v("Romans 8:28", "Romans", 8, 28, "All things work together for good to them that love God..."),
            v("Lamentations 3:22-23", "Lamentations", 3, 22, "His compassions fail not. They are new every morning..."),
        ]
    },
    {
        topic: "Fear", aliases: ["fear", "afraid", "scared", "courage", "courageous", "brave", "boldness"], verses: [
            v("Isaiah 41:10", "Isaiah", 41, 10, "Fear thou not; for I am with thee: be not dismayed..."),
            v("Joshua 1:9", "Joshua", 1, 9, "Be strong and of a good courage; be not afraid..."),
            v("2 Timothy 1:7", "2 Timothy", 1, 7, "God hath not given us the spirit of fear; but of power..."),
            v("Psalm 27:1", "Psalms", 27, 1, "The LORD is my light and my salvation; whom shall I fear?"),
            v("Deuteronomy 31:6", "Deuteronomy", 31, 6, "Be strong and of a good courage, fear not..."),
        ]
    },
    {
        topic: "Forgiveness", aliases: ["forgiveness", "forgive", "forgiving", "pardon", "mercy", "merciful"], verses: [
            v("1 John 1:9", "1 John", 1, 9, "If we confess our sins, he is faithful and just to forgive us..."),
            v("Ephesians 4:32", "Ephesians", 4, 32, "Be ye kind one to another, tenderhearted, forgiving one another..."),
            v("Colossians 3:13", "Colossians", 3, 13, "Forbearing one another, and forgiving one another..."),
            v("Psalm 103:12", "Psalms", 103, 12, "As far as the east is from the west, so far hath he removed our transgressions..."),
        ]
    },
    {
        topic: "Healing", aliases: ["healing", "heal", "health", "sickness", "sick", "disease", "recovery"], verses: [
            v("Jeremiah 17:14", "Jeremiah", 17, 14, "Heal me, O LORD, and I shall be healed..."),
            v("Isaiah 53:5", "Isaiah", 53, 5, "With his stripes we are healed."),
            v("Psalm 147:3", "Psalms", 147, 3, "He healeth the broken in heart, and bindeth up their wounds."),
            v("James 5:14-15", "James", 5, 14, "Is any sick among you? let him call for the elders..."),
        ]
    },
    {
        topic: "Wisdom", aliases: ["wisdom", "wise", "knowledge", "understanding", "discernment", "insight"], verses: [
            v("James 1:5", "James", 1, 5, "If any of you lack wisdom, let him ask of God..."),
            v("Proverbs 3:5-6", "Proverbs", 3, 5, "Trust in the LORD with all thine heart..."),
            v("Proverbs 1:7", "Proverbs", 1, 7, "The fear of the LORD is the beginning of knowledge..."),
            v("Psalm 119:105", "Psalms", 119, 105, "Thy word is a lamp unto my feet, and a light unto my path."),
        ]
    },
    {
        topic: "Prayer", aliases: ["prayer", "pray", "praying", "intercession", "supplication"], verses: [
            v("Philippians 4:6", "Philippians", 4, 6, "In every thing by prayer and supplication with thanksgiving..."),
            v("1 Thessalonians 5:17", "1 Thessalonians", 5, 17, "Pray without ceasing."),
            v("James 5:16", "James", 5, 16, "The effectual fervent prayer of a righteous man availeth much."),
            v("Jeremiah 33:3", "Jeremiah", 33, 3, "Call unto me, and I will answer thee..."),
            v("Matthew 7:7", "Matthew", 7, 7, "Ask, and it shall be given you; seek, and ye shall find..."),
        ]
    },
    {
        topic: "Marriage", aliases: ["marriage", "married", "husband", "wife", "spouse", "wedding"], verses: [
            v("Genesis 2:24", "Genesis", 2, 24, "Therefore shall a man leave his father and his mother..."),
            v("Ephesians 5:25", "Ephesians", 5, 25, "Husbands, love your wives, even as Christ also loved the church..."),
            v("Proverbs 18:22", "Proverbs", 18, 22, "Whoso findeth a wife findeth a good thing..."),
        ]
    },
    {
        topic: "Money", aliases: ["money", "wealth", "rich", "finance", "prosperity", "provision", "tithe", "giving", "generosity"], verses: [
            v("Matthew 6:33", "Matthew", 6, 33, "Seek ye first the kingdom of God... all these things shall be added..."),
            v("Malachi 3:10", "Malachi", 3, 10, "Bring ye all the tithes into the storehouse... I will pour you out a blessing..."),
            v("Philippians 4:19", "Philippians", 4, 19, "My God shall supply all your need according to his riches in glory..."),
            v("Luke 6:38", "Luke", 6, 38, "Give, and it shall be given unto you; good measure, pressed down..."),
        ]
    },
    {
        topic: "Death", aliases: ["death", "dying", "grief", "mourning", "loss", "funeral", "heaven", "eternal life", "afterlife"], verses: [
            v("John 11:25-26", "John", 11, 25, "I am the resurrection, and the life..."),
            v("Psalm 23:4", "Psalms", 23, 4, "Though I walk through the valley of the shadow of death..."),
            v("Revelation 21:4", "Revelation", 21, 4, "God shall wipe away all tears... there shall be no more death..."),
            v("2 Corinthians 5:8", "2 Corinthians", 5, 8, "To be absent from the body, and to be present with the Lord."),
        ]
    },
    {
        topic: "Depression", aliases: ["depression", "depressed", "sad", "sadness", "despair", "hopeless", "discouraged", "overwhelmed", "lonely"], verses: [
            v("Psalm 34:18", "Psalms", 34, 18, "The LORD is nigh unto them that are of a broken heart..."),
            v("Psalm 42:11", "Psalms", 42, 11, "Why art thou cast down, O my soul? hope thou in God..."),
            v("Matthew 11:28", "Matthew", 11, 28, "Come unto me, all ye that labour and are heavy laden..."),
            v("Psalm 30:5", "Psalms", 30, 5, "Weeping may endure for a night, but joy cometh in the morning."),
        ]
    },
    {
        topic: "Patience", aliases: ["patience", "patient", "waiting", "wait", "endure", "persevere", "perseverance"], verses: [
            v("James 1:2-4", "James", 1, 2, "Count it all joy... the trying of your faith worketh patience..."),
            v("Romans 12:12", "Romans", 12, 12, "Rejoicing in hope; patient in tribulation; continuing instant in prayer."),
            v("Isaiah 40:31", "Isaiah", 40, 31, "They that wait upon the LORD shall renew their strength..."),
            v("Galatians 6:9", "Galatians", 6, 9, "Let us not be weary in well doing: for in due season we shall reap..."),
        ]
    },
    {
        topic: "Anger", aliases: ["anger", "angry", "wrath", "rage", "temper", "frustrated", "frustration"], verses: [
            v("James 1:19-20", "James", 1, 19, "Let every man be swift to hear, slow to speak, slow to wrath..."),
            v("Proverbs 15:1", "Proverbs", 15, 1, "A soft answer turneth away wrath..."),
            v("Ephesians 4:26", "Ephesians", 4, 26, "Be ye angry, and sin not: let not the sun go down upon your wrath..."),
            v("Psalm 37:8", "Psalms", 37, 8, "Cease from anger, and forsake wrath..."),
        ]
    },
];

/** Search topics by natural language query. Returns matching topics ranked by relevance. */
export function searchTopics(query: string): TopicEntry[] {
    const norm = query.toLowerCase().trim();
    const scored = TOPIC_INDEX.map(topic => {
        let score = 0;
        if (norm.includes(topic.topic.toLowerCase())) score += 10;
        for (const alias of topic.aliases) { if (norm.includes(alias)) score += 5; }
        return { topic, score };
    });
    return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.topic);
}

/** Detect if a query is topic-based (vs verse reference). */
export function isTopicQuery(query: string): boolean {
    const patterns = [
        /(?:verses?|scriptures?|passages?|bible)\s+(?:about|on|for|regarding)\s+/i,
        /(?:what|where)\s+(?:does|did|do)\s+(?:the\s+)?bible\s+(?:say|teach)\s+(?:about|on)/i,
        /(?:tell me|show me|find|search)\s+(?:about|for)\s+/i,
    ];
    return patterns.some(p => p.test(query));
}

/** Extract the topic keyword from a natural language query. */
export function extractTopicKeyword(query: string): string {
    return query
        .replace(/(?:verses?|scriptures?|passages?|bible)\s+(?:about|on|for|regarding)\s+/i, '')
        .replace(/(?:what|where)\s+(?:does|did|do)\s+(?:the\s+)?bible\s+(?:say|teach)\s+(?:about|on)\s+/i, '')
        .replace(/(?:tell me|show me|find|search)\s+(?:about|for)\s+/i, '')
        .replace(/[?.!]/g, '').trim();
}
