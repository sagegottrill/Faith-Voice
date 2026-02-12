import React from 'react';
import { useReadingStats } from '@/hooks/useReadingStats';
import { Flame, BookOpen, Search, BookmarkCheck } from 'lucide-react';

const HEATMAP_COLORS = [
    'bg-secondary/30',         // level 0 - no activity
    'bg-emerald-500/20',       // level 1 - light
    'bg-emerald-500/40',       // level 2 - medium
    'bg-emerald-500/60',       // level 3 - heavy
    'bg-emerald-500/90',       // level 4 - intense
];

interface ReadingStatsProps {
    savedCount?: number;
}

const ReadingStats: React.FC<ReadingStatsProps> = ({ savedCount = 0 }) => {
    const { streak, totalChapters, totalVerses, totalSearches, heatmapData } = useReadingStats();

    const stats = [
        { icon: <Flame className="w-4 h-4" />, value: streak, label: 'Day Streak', accent: streak > 0 },
        { icon: <BookOpen className="w-4 h-4" />, value: totalChapters, label: 'Chapters', accent: false },
        { icon: <Search className="w-4 h-4" />, value: totalSearches, label: 'Searches', accent: false },
        { icon: <BookmarkCheck className="w-4 h-4" />, value: savedCount, label: 'Saved', accent: false },
    ];

    return (
        <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="lush-card p-3 md:p-4 text-center group hover:scale-[1.02] transition-transform"
                    >
                        <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center mb-2 ${stat.accent ? 'bg-orange-500/20 text-orange-500' : 'bg-secondary text-muted-foreground'
                            } group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <p className={`text-xl md:text-2xl font-bold ${stat.accent && stat.value > 0 ? 'text-orange-500' : 'text-foreground'
                            }`}>
                            {stat.value}
                            {stat.accent && stat.value > 0 && <span className="ml-1">🔥</span>}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Heatmap */}
            <div className="lush-card p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Reading Activity</h3>
                    <p className="text-xs text-muted-foreground">Last 90 days</p>
                </div>
                <div className="grid grid-cols-[repeat(18,1fr)] gap-[3px] md:gap-1">
                    {heatmapData.map((day, i) => (
                        <div
                            key={day.date}
                            className={`aspect-square rounded-[3px] md:rounded-sm ${HEATMAP_COLORS[day.level]} transition-colors hover:ring-1 hover:ring-accent/50`}
                            title={`${day.date}: Level ${day.level}`}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-2">
                    <span className="text-[10px] text-muted-foreground mr-1">Less</span>
                    {HEATMAP_COLORS.map((color, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">More</span>
                </div>
            </div>
        </div>
    );
};

export default ReadingStats;
