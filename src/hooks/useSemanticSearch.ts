import { useState, useCallback, useEffect } from 'react';
import { semanticSearch } from '@/services/SemanticSearch';
import { POPULAR_VERSES } from '@/utils/popularVerses';

export const useSemanticSearch = () => {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Lazy load the model
        const loadModel = async () => {
            try {
                await semanticSearch.init();
                setIsReady(true);
            } catch (e) {
                console.error("Model load failed", e);
            }
        };
        // Don't auto load immediately to save bandwidth, maybe wait for user interaction?
        // For 'Pewbeam Killer' speed, we should probably load in background.
        loadModel();
    }, []);

    const search = useCallback(async (query: string) => {
        if (!isReady) {
            await semanticSearch.init();
        }

        setIsLoading(true);
        try {
            const queryEmbedding = await semanticSearch.embed(query);

            // In a real full app, we would have pre-computed embeddings for all 31k verses.
            // For this version, we will search against a curated list of "Popular/Theologically Significant" verses
            // to demonstrate the capability without downloading a 100MB vector database.

            const results = await Promise.all(POPULAR_VERSES.map(async (item) => {
                // If we had pre-computed embeddings, we'd use them here.
                // Generating them on the fly is slow, so we cache them in the item if possible or accept the hit for this demo.
                // Optimization: We will actually compute embeddings for the popular verses ONCE on load or reuse cached if available.

                let embedding = item.embedding;
                if (!embedding) {
                    embedding = await semanticSearch.embed(item.text);
                    item.embedding = embedding; // Cache in memory
                }

                const score = semanticSearch.cosineSimilarity(queryEmbedding, embedding);
                return { ...item, score };
            }));

            // Sort by score
            const topResults = results.sort((a, b) => b.score - a.score).slice(0, 3);

            return topResults.filter(r => r.score > 0.25); // Threshold
        } catch (e) {
            console.error("Search failed", e);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [isReady]);

    return { search, isReady, isLoading };
};
