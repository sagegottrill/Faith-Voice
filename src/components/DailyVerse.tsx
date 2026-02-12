import React, { useState } from 'react';
import { getVerseOfTheDay, getGreeting } from '@/utils/dailyVerses';
import { Copy, Share2, Check, Sparkles } from 'lucide-react';

const GRADIENT_STYLES = [
    'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
    'from-emerald-500/20 via-teal-500/10 to-green-500/20',
    'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
    'from-rose-500/20 via-pink-500/10 to-fuchsia-500/20',
    'from-cyan-500/20 via-sky-500/10 to-blue-500/20',
];

const DailyVerse: React.FC = () => {
    const verse = getVerseOfTheDay();
    const greeting = getGreeting();
    const [copied, setCopied] = useState(false);

    // Deterministic gradient based on day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const gradient = GRADIENT_STYLES[dayOfYear % GRADIENT_STYLES.length];

    const handleCopy = async () => {
        const text = `"${verse.text}" — ${verse.reference}`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        const text = `"${verse.text}" — ${verse.reference}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Verse of the Day', text });
            } catch { /* user cancelled */ }
        } else {
            handleCopy();
        }
    };

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} border border-white/20 p-6 md:p-8 shadow-lg votd-card`}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                                Verse of the Day
                            </p>
                            <p className="text-xs text-muted-foreground">{greeting}</p>
                        </div>
                    </div>
                    <span className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full font-medium">
                        {verse.topic}
                    </span>
                </div>

                {/* Verse Text */}
                <blockquote className="text-lg md:text-xl leading-relaxed text-foreground font-serif mb-4 italic">
                    "{verse.text}"
                </blockquote>

                {/* Reference + Actions */}
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-accent tracking-wide">
                        — {verse.reference}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground transition-all duration-200"
                            title="Copy verse"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground transition-all duration-200"
                            title="Share verse"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyVerse;
