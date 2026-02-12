import React from 'react';
import Navigation from '@/components/Navigation';
import DailyVerse from '@/components/DailyVerse';
import ReadingStats from '@/components/ReadingStats';
import { useSavedVerses } from '@/hooks/useSavedVerses';
import { useReadingStats } from '@/hooks/useReadingStats';
import { BookOpen, Sparkles, TrendingUp, Heart } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { savedVerses } = useSavedVerses();
    const { streak, totalChapters, totalSearches } = useReadingStats();

    return (
        <div className="min-h-screen bg-transparent transition-colors duration-500">
            <Navigation />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/20">
                                <Heart className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
                                    My Devotional
                                </h1>
                                <p className="text-sm text-muted-foreground">Your daily walk with the Word</p>
                            </div>
                        </div>
                    </div>

                    {/* Verse of the Day — Hero */}
                    <div className="mb-8">
                        <DailyVerse />
                    </div>

                    {/* Reading Stats */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4 text-accent" />
                            <h2 className="text-lg font-serif font-bold text-foreground">Your Progress</h2>
                        </div>
                        <ReadingStats savedCount={savedVerses.length} />
                    </div>

                    {/* Saved Verses Quick View */}
                    {savedVerses.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-4 h-4 text-accent" />
                                <h2 className="text-lg font-serif font-bold text-foreground">
                                    Recent Saves
                                    <span className="ml-2 text-sm text-muted-foreground font-normal">({savedVerses.length})</span>
                                </h2>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                {savedVerses.slice(0, 6).map((sv, i) => (
                                    <div key={i} className="lush-card p-4 group hover:scale-[1.01] transition-transform">
                                        <p className="text-sm text-foreground leading-relaxed line-clamp-2 mb-2">
                                            "{sv.verse_text}"
                                        </p>
                                        <p className="text-xs font-bold text-accent">
                                            {sv.book} {sv.chapter}:{sv.verse}
                                        </p>
                                        {sv.note && (
                                            <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">📝 {sv.note}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state when no saved verses */}
                    {savedVerses.length === 0 && (
                        <div className="lush-card p-8 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-accent" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-foreground mb-2">Start Your Journey</h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Search for verses using voice or text, save your favorites, and build your personal library.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
