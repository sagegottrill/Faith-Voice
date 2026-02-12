import { useState, useCallback, useEffect } from 'react';

interface DayEntry {
    date: string; // YYYY-MM-DD
    chaptersRead: number;
    versesViewed: number;
    searches: number;
}

interface ReadingStatsData {
    days: Record<string, DayEntry>;
    totalChapters: number;
    totalVerses: number;
    totalSearches: number;
}

const STORAGE_KEY = 'voicebible_reading_stats';

function getTodayKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadData(): ReadingStatsData {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error('Failed to load reading stats:', e);
    }
    return { days: {}, totalChapters: 0, totalVerses: 0, totalSearches: 0 };
}

function saveData(data: ReadingStatsData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function calculateStreak(days: Record<string, DayEntry>): number {
    let streak = 0;
    const today = new Date();
    const d = new Date(today);

    // Check if today has activity, if not start from yesterday
    const todayKey = getTodayKey();
    if (!days[todayKey]) {
        d.setDate(d.getDate() - 1);
    }

    while (true) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const entry = days[key];
        if (entry && (entry.chaptersRead > 0 || entry.versesViewed > 0 || entry.searches > 0)) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

function getHeatmapData(days: Record<string, DayEntry>): { date: string; level: number }[] {
    const result: { date: string; level: number }[] = [];
    const today = new Date();

    // Last 90 days
    for (let i = 89; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const entry = days[key];

        let level = 0;
        if (entry) {
            const total = entry.chaptersRead + entry.versesViewed + entry.searches;
            if (total >= 20) level = 4;
            else if (total >= 10) level = 3;
            else if (total >= 5) level = 2;
            else if (total > 0) level = 1;
        }

        result.push({ date: key, level });
    }

    return result;
}

export function useReadingStats() {
    const [data, setData] = useState<ReadingStatsData>(loadData);

    const trackChapter = useCallback(() => {
        setData(prev => {
            const today = getTodayKey();
            const updated = { ...prev };
            if (!updated.days[today]) {
                updated.days[today] = { date: today, chaptersRead: 0, versesViewed: 0, searches: 0 };
            }
            updated.days[today] = { ...updated.days[today], chaptersRead: updated.days[today].chaptersRead + 1 };
            updated.totalChapters++;
            saveData(updated);
            return updated;
        });
    }, []);

    const trackVerse = useCallback(() => {
        setData(prev => {
            const today = getTodayKey();
            const updated = { ...prev };
            if (!updated.days[today]) {
                updated.days[today] = { date: today, chaptersRead: 0, versesViewed: 0, searches: 0 };
            }
            updated.days[today] = { ...updated.days[today], versesViewed: updated.days[today].versesViewed + 1 };
            updated.totalVerses++;
            saveData(updated);
            return updated;
        });
    }, []);

    const trackSearch = useCallback(() => {
        setData(prev => {
            const today = getTodayKey();
            const updated = { ...prev };
            if (!updated.days[today]) {
                updated.days[today] = { date: today, chaptersRead: 0, versesViewed: 0, searches: 0 };
            }
            updated.days[today] = { ...updated.days[today], searches: updated.days[today].searches + 1 };
            updated.totalSearches++;
            saveData(updated);
            return updated;
        });
    }, []);

    return {
        streak: calculateStreak(data.days),
        totalChapters: data.totalChapters,
        totalVerses: data.totalVerses,
        totalSearches: data.totalSearches,
        heatmapData: getHeatmapData(data.days),
        trackChapter,
        trackVerse,
        trackSearch,
    };
}
