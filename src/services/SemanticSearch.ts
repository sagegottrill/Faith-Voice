import { pipeline, env } from '@xenova/transformers';

// Configure to use local models if possible or cache heavily
// env.allowLocalModels = false; // We want to download from HF for first time
// env.useBrowserCache = true;

interface SearchResult {
    text: string;
    score: number;
    metadata?: any;
}

class SemanticSearchService {
    private static instance: SemanticSearchService;
    private extractor: any = null;
    private isInitialized = false;

    private constructor() { }

    public static getInstance(): SemanticSearchService {
        if (!SemanticSearchService.instance) {
            SemanticSearchService.instance = new SemanticSearchService();
        }
        return SemanticSearchService.instance;
    }

    public async init() {
        if (this.isInitialized) return;

        try {
            // Use a quantization-friendly model
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            this.isInitialized = true;
            console.log('Semantic Search Model Initialized');
        } catch (error) {
            console.error('Failed to initialize semantic search:', error);
            throw error;
        }
    }

    public async embed(text: string): Promise<number[]> {
        if (!this.extractor) await this.init();

        const output = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    public cosineSimilarity(vecA: number[], vecB: number[]): number {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}

export const semanticSearch = SemanticSearchService.getInstance();
