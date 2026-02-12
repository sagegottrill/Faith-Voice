/**
 * Groq AI Bible Brain — The Intelligence Layer
 * 
 * Uses Groq's ultra-fast inference (Llama 3.3 70B) to understand
 * natural language Bible questions and return precise references.
 * 
 * This is what makes us DANGEROUS vs EasyWorship.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey(): string {
    return import.meta.env.VITE_GROQ_API_KEY || '';
}

export interface GroqBibleResponse {
    /** The AI's answer text */
    answer: string;
    /** Extracted Bible references (e.g., ["John 14:6", "Romans 8:28"]) */
    references: string[];
    /** The type of response */
    type: 'verse_lookup' | 'explanation' | 'topic' | 'navigation' | 'unknown';
    /** Confidence 0-1 */
    confidence: number;
}

const SYSTEM_PROMPT = `You are a Bible expert assistant integrated into a voice-powered Bible app. Your job is to understand what the user is asking and respond with precise Bible references.

RULES:
1. ALWAYS include exact Bible references in your response when relevant (e.g., "John 3:16", "Psalm 23:1-6")
2. Keep answers concise — max 2-3 sentences
3. When the user asks "where" something is, give the reference first
4. For topic questions, give the 3-5 most relevant verses
5. For "explain" requests, give a brief explanation + the reference
6. For navigation ("next chapter", "go back"), infer from context
7. Always use KJV-style book names (e.g., "Psalm" not "Psalms", "Revelation" not "Revelations")

RESPONSE FORMAT (JSON):
{
  "answer": "Brief answer text",
  "references": ["Book Chapter:Verse", ...],
  "type": "verse_lookup|explanation|topic|navigation",
  "confidence": 0.0-1.0
}

Examples:
- "Where did Jesus walk on water?" → {"answer": "Jesus walked on water on the Sea of Galilee.", "references": ["Matthew 14:25-33", "Mark 6:48-51"], "type": "verse_lookup", "confidence": 0.95}
- "Verses about anxiety" → {"answer": "Here are key verses about overcoming anxiety.", "references": ["Philippians 4:6-7", "1 Peter 5:7", "Matthew 6:25-34", "Isaiah 41:10", "Psalm 55:22"], "type": "topic", "confidence": 0.9}
- "Explain John 3:16" → {"answer": "John 3:16 declares God's love for the world — He gave His only Son so that whoever believes in Him shall not perish but have eternal life. It is the gospel in one verse.", "references": ["John 3:16"], "type": "explanation", "confidence": 1.0}
- "What did Paul write about love?" → {"answer": "Paul's most famous passage on love is the 'Love Chapter'.", "references": ["1 Corinthians 13:1-13", "Romans 13:10", "Ephesians 5:25"], "type": "topic", "confidence": 0.9}

ONLY respond with valid JSON. No markdown, no code blocks, just raw JSON.`;

interface ConversationMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

class GroqBibleService {
    private conversationHistory: ConversationMessage[] = [];
    private lastReferences: string[] = [];

    /**
     * Ask the AI Bible brain a question
     */
    async ask(query: string): Promise<GroqBibleResponse> {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.warn('Groq API key not configured');
            return { answer: '', references: [], type: 'unknown', confidence: 0 };
        }

        // Build context with conversation history for follow-ups
        const messages: ConversationMessage[] = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...this.conversationHistory.slice(-6), // Keep last 3 exchanges for context
            { role: 'user', content: query }
        ];

        // If we have previous references, add context for follow-ups
        if (this.lastReferences.length > 0) {
            const contextMsg = `[Context: The user was just reading ${this.lastReferences.join(', ')}]`;
            messages.splice(1, 0, { role: 'system', content: contextMsg });
        }

        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages,
                    temperature: 0.3,
                    max_tokens: 500,
                    top_p: 0.9,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Groq API error:', response.status, errorText);
                return { answer: '', references: [], type: 'unknown', confidence: 0 };
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content?.trim() || '';

            // Parse the JSON response
            try {
                const parsed = JSON.parse(content) as GroqBibleResponse;

                // Update conversation history
                this.conversationHistory.push(
                    { role: 'user', content: query },
                    { role: 'assistant', content: content }
                );

                // Keep history manageable
                if (this.conversationHistory.length > 10) {
                    this.conversationHistory = this.conversationHistory.slice(-6);
                }

                // Store references for follow-up context
                if (parsed.references.length > 0) {
                    this.lastReferences = parsed.references;
                }

                return parsed;
            } catch (parseErr) {
                // If JSON parsing fails, try to extract references from free text
                console.warn('Failed to parse Groq response as JSON, extracting manually:', content);
                const refs = extractReferencesFromText(content);
                return {
                    answer: content,
                    references: refs,
                    type: refs.length > 0 ? 'verse_lookup' : 'unknown',
                    confidence: refs.length > 0 ? 0.7 : 0.3,
                };
            }
        } catch (err) {
            console.error('Groq API request failed:', err);
            return { answer: '', references: [], type: 'unknown', confidence: 0 };
        }
    }

    /**
     * Check if a query is complex enough to need AI
     * (simple verse refs and known topics don't need it)
     */
    isComplexQuery(query: string): boolean {
        const q = query.toLowerCase().trim();

        // Questions that need AI reasoning
        const aiPatterns = [
            /^(where|what|who|when|why|how|which|tell me|explain|describe)/i,
            /did (jesus|god|paul|david|moses|peter|abraham)/i,
            /does the bible say/i,
            /what.*mean/i,
            /difference between/i,
            /compare/i,
            /should i read/i,
            /help me with/i,
            /pray(er|ing)?\s+(for|about)/i,
            /struggling with/i,
            /going through/i,
            /feeling\s+(sad|anxious|scared|alone|lost|angry|depressed)/i,
            /next chapter/i,
            /go back/i,
            /read more/i,
            /continue/i,
            /previous/i,
        ];

        return aiPatterns.some(p => p.test(q));
    }

    /**
     * Set the current reading context (for follow-ups like "next chapter")
     */
    setContext(references: string[]) {
        this.lastReferences = references;
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
        this.lastReferences = [];
    }
}

/**
 * Extract Bible references from free text using regex
 */
function extractReferencesFromText(text: string): string[] {
    const refPattern = /\b(\d?\s?[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(\d{1,3})(?::(\d{1,3})(?:\s*-\s*(\d{1,3}))?)?\b/g;
    const refs: string[] = [];
    let match;

    while ((match = refPattern.exec(text)) !== null) {
        const book = match[1].trim();
        const chapter = match[2];
        const verseStart = match[3];
        const verseEnd = match[4];

        // Validate it looks like a Bible book
        const bibleBooks = [
            'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
            'Joshua', 'Judges', 'Ruth', 'Samuel', 'Kings', 'Chronicles',
            'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalm', 'Proverbs',
            'Ecclesiastes', 'Song', 'Isaiah', 'Jeremiah', 'Lamentations',
            'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah',
            'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
            'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John',
            'Acts', 'Romans', 'Corinthians', 'Galatians', 'Ephesians',
            'Philippians', 'Colossians', 'Thessalonians', 'Timothy', 'Titus',
            'Philemon', 'Hebrews', 'James', 'Peter', 'Jude', 'Revelation'
        ];

        const isBook = bibleBooks.some(b => book.includes(b));
        if (isBook) {
            let ref = `${book} ${chapter}`;
            if (verseStart) ref += `:${verseStart}`;
            if (verseEnd) ref += `-${verseEnd}`;
            refs.push(ref);
        }
    }

    return [...new Set(refs)]; // dedupe
}

// Singleton
export const groqBible = new GroqBibleService();
