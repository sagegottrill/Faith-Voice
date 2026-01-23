import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface VerseData {
    reference: string;
    text: string;
    translation: string;
    verseNumber: number;
}

const ProjectorView: React.FC = () => {
    const [currentVerse, setCurrentVerse] = useState<VerseData | null>(null);

    useEffect(() => {
        // Listen for verse updates via IPC
        // @ts-expect-error - Electron bridge
        const removeListener = window.electronAPI?.onUpdateVerse((_event: unknown, verse: VerseData) => {
            setCurrentVerse(verse);
        });

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    if (!currentVerse) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/20 font-serif text-2xl tracking-widest uppercase">
                    VoiceBible Projection
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-16 cursor-none transition-all duration-700">
            <div className="max-w-[90vw] text-center">
                {/* Verse Number Bubble */}
                <div className="mb-12 flex justify-center animate-in zoom-in-50 duration-500">
                    <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#D4AF37] text-black font-serif font-bold text-4xl shadow-2xl shadow-[#D4AF37]/30">
                        {currentVerse.verseNumber}
                    </span>
                </div>

                {/* Verse Text */}
                <h1
                    className="font-serif font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100"
                    style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                >
                    {currentVerse.text}
                </h1>

                {/* Reference Footer */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37] font-serif tracking-wide">
                        {currentVerse.reference}
                    </h2>
                    <p className="text-white/40 mt-2 text-xl tracking-widest uppercase">
                        {currentVerse.translation}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProjectorView;
