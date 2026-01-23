import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface SavedVerse {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse: number;
  verse_text: string;
  note: string | null;
  created_at: string;
}

// Generate or retrieve a persistent user ID from localStorage
function getUserId(): string {
  const storageKey = 'voicebible_user_id';
  let userId = localStorage.getItem(storageKey);

  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(storageKey, userId);
  }

  return userId;
}

const STORAGE_KEY = 'voicebible_saved_verses';

export function useSavedVerses() {
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = getUserId();

  // Load from LocalStorage
  const fetchSavedVerses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: SavedVerse[] = JSON.parse(stored);
        // Filter for current user if we were to support multiple users, for now just load all
        setSavedVerses(parsed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } else {
        setSavedVerses([]);
      }
    } catch (err: any) {
      console.error("Error loading verses from local storage", err);
      setError("Failed to load saved verses.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);


  // Helper to persist to localStorage
  const persistVerses = (verses: SavedVerse[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verses));
    setSavedVerses(verses);
  };

  // Check if a verse is saved
  const isVerseSaved = useCallback((book: string, chapter: number, verse: number): boolean => {
    return savedVerses.some(
      v => v.book === book && v.chapter === chapter && v.verse === verse
    );
  }, [savedVerses]);

  // Get saved verse data
  const getSavedVerse = useCallback((book: string, chapter: number, verse: number): SavedVerse | undefined => {
    return savedVerses.find(
      v => v.book === book && v.chapter === chapter && v.verse === verse
    );
  }, [savedVerses]);

  // Save a verse
  const saveVerse = useCallback(async (
    book: string,
    chapter: number,
    verse: number,
    verseText: string,
    note?: string
  ): Promise<boolean> => {
    try {
      const newVerse: SavedVerse = {
        id: uuidv4(),
        user_id: userId,
        book,
        chapter,
        verse,
        verse_text: verseText,
        note: note || null,
        created_at: new Date().toISOString()
      };

      const updated = [newVerse, ...savedVerses];
      persistVerses(updated);
      return true;
    } catch (err: any) {
      console.error('Error saving verse:', err);
      setError(err.message || 'Failed to save verse');
      return false;
    }
  }, [userId, savedVerses]);

  // Update note for a saved verse
  const updateNote = useCallback(async (verseId: string, note: string): Promise<boolean> => {
    try {
      const updated = savedVerses.map(v =>
        v.id === verseId ? { ...v, note: note || null } : v
      );
      persistVerses(updated);
      return true;
    } catch (err: any) {
      console.error('Error updating note:', err);
      setError(err.message || 'Failed to update note');
      return false;
    }
  }, [userId, savedVerses]);

  // Delete a saved verse
  const deleteVerse = useCallback(async (verseId: string): Promise<boolean> => {
    try {
      const updated = savedVerses.filter(v => v.id !== verseId);
      persistVerses(updated);
      return true;
    } catch (err: any) {
      console.error('Error deleting verse:', err);
      setError(err.message || 'Failed to delete verse');
      return false;
    }
  }, [userId, savedVerses]);

  // Toggle save state for a verse
  const toggleSaveVerse = useCallback(async (
    book: string,
    chapter: number,
    verse: number,
    verseText: string
  ): Promise<boolean> => {
    const existing = getSavedVerse(book, chapter, verse);

    if (existing) {
      return deleteVerse(existing.id);
    } else {
      return saveVerse(book, chapter, verse, verseText);
    }
  }, [getSavedVerse, deleteVerse, saveVerse]);

  // Fetch saved verses on mount
  useEffect(() => {
    fetchSavedVerses();
  }, [fetchSavedVerses]);

  return {
    savedVerses,
    isLoading,
    error,
    isVerseSaved,
    getSavedVerse,
    saveVerse,
    updateNote,
    deleteVerse,
    toggleSaveVerse,
    refreshSavedVerses: fetchSavedVerses
  };
}
