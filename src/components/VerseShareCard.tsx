import React, { useRef, useState, useCallback } from 'react';
import { Download, X, Palette } from 'lucide-react';

interface VerseShareCardProps {
    verseText: string;
    reference: string;
    isOpen: boolean;
    onClose: () => void;
}

const CARD_STYLES = [
    { name: 'Forest', bg: 'linear-gradient(135deg, #0d3320 0%, #1a5c3a 50%, #0f4429 100%)', text: '#e8f0e8', accent: '#7ec89b' },
    { name: 'Sunset', bg: 'linear-gradient(135deg, #4a1942 0%, #c94b4b 50%, #e8a87c 100%)', text: '#fff5ee', accent: '#ffd5b4' },
    { name: 'Ocean', bg: 'linear-gradient(135deg, #0c1445 0%, #1a3a6c 50%, #2e8bc0 100%)', text: '#e8f4ff', accent: '#a8d8ff' },
    { name: 'Minimal', bg: 'linear-gradient(135deg, #fafaf8 0%, #f0ede6 100%)', text: '#2a2a2a', accent: '#8b7355' },
    { name: 'Royal', bg: 'linear-gradient(135deg, #1a0a2e 0%, #3d1e6d 50%, #8b5cf6 100%)', text: '#f0e8ff', accent: '#c4b5fd' },
];

const VerseShareCard: React.FC<VerseShareCardProps> = ({ verseText, reference, isOpen, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedStyle, setSelectedStyle] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateImage = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsGenerating(true);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = 1080;
        const h = 1080;
        canvas.width = w;
        canvas.height = h;

        const style = CARD_STYLES[selectedStyle];

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        // Parse gradient colors from CSS
        if (selectedStyle === 3) { // Minimal
            gradient.addColorStop(0, '#fafaf8');
            gradient.addColorStop(1, '#f0ede6');
        } else if (selectedStyle === 0) { // Forest
            gradient.addColorStop(0, '#0d3320');
            gradient.addColorStop(0.5, '#1a5c3a');
            gradient.addColorStop(1, '#0f4429');
        } else if (selectedStyle === 1) { // Sunset
            gradient.addColorStop(0, '#4a1942');
            gradient.addColorStop(0.5, '#c94b4b');
            gradient.addColorStop(1, '#e8a87c');
        } else if (selectedStyle === 2) { // Ocean
            gradient.addColorStop(0, '#0c1445');
            gradient.addColorStop(0.5, '#1a3a6c');
            gradient.addColorStop(1, '#2e8bc0');
        } else { // Royal
            gradient.addColorStop(0, '#1a0a2e');
            gradient.addColorStop(0.5, '#3d1e6d');
            gradient.addColorStop(1, '#8b5cf6');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Decorative circle
        ctx.fillStyle = style.accent + '15';
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.2, 200, 0, Math.PI * 2);
        ctx.fill();

        // Quote marks
        ctx.fillStyle = style.accent + '30';
        ctx.font = 'bold 200px Georgia';
        ctx.fillText('"', 60, 250);

        // Verse text
        ctx.fillStyle = style.text;
        ctx.font = '36px Georgia';
        ctx.textAlign = 'left';

        // Word wrap
        const maxWidth = w - 160;
        const lineHeight = 52;
        const words = verseText.split(' ');
        let line = '';
        let y = 350;

        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), 80, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), 80, y);

        // Reference
        ctx.fillStyle = style.accent;
        ctx.font = 'bold 32px Georgia';
        ctx.fillText(`— ${reference}`, 80, y + 80);

        // Branding
        ctx.fillStyle = style.text + '60';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('VoiceBible', w - 60, h - 50);

        // Download
        const link = document.createElement('a');
        link.download = `voicebible-${reference.replace(/\s/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        setIsGenerating(false);
    }, [selectedStyle, verseText, reference]);

    if (!isOpen) return null;

    const style = CARD_STYLES[selectedStyle];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-card rounded-2xl border border-border/50 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
                    <h3 className="text-sm font-bold text-foreground">Share as Image</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Preview */}
                <div className="p-5">
                    <div
                        className="rounded-xl overflow-hidden aspect-square p-8 flex flex-col justify-center"
                        style={{ background: style.bg }}
                    >
                        <p className="text-3xl font-serif mb-2" style={{ color: style.accent + '40' }}>"</p>
                        <p className="text-sm leading-relaxed font-serif italic mb-4" style={{ color: style.text }}>
                            {verseText.length > 200 ? verseText.substring(0, 200) + '...' : verseText}
                        </p>
                        <p className="text-xs font-bold" style={{ color: style.accent }}>— {reference}</p>
                    </div>
                </div>

                {/* Style Picker */}
                <div className="px-5 pb-3">
                    <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Style</span>
                    </div>
                    <div className="flex gap-2">
                        {CARD_STYLES.map((s, i) => (
                            <button
                                key={s.name}
                                onClick={() => setSelectedStyle(i)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${i === selectedStyle
                                        ? 'ring-2 ring-accent bg-accent/10 text-accent'
                                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                                    }`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-2">
                    <button
                        onClick={generateImage}
                        disabled={isGenerating}
                        className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isGenerating ? 'Generating...' : 'Download Image'}
                    </button>
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
};

export default VerseShareCard;
