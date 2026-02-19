import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

interface VerseData {
    reference: string;
    text: string;
    translation: string;
    verseNumber: number;
}

interface HymnData {
    title: string;
    number: number;
    verse: string;
    verseIndex: number;
    author: string;
    chorus?: string;
}

type DisplayData = VerseData | HymnData;

/**
 * OBS Studio View
 * 
 * Designed as a browser source for OBS Studio.
 * - Transparent/chroma-key background
 * - Receives verse/hymn updates via BroadcastChannel
 * - URL parameters for customization:
 *   ?bg=transparent|green|black (default: transparent)
 *   ?fontSize=48 (default: 48)
 *   ?position=bottom|center|top (default: center)
 *   ?theme=gold|white|cream (default: gold)
 *   ?showRef=true|false (default: true)
 */
const OBSView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [currentData, setCurrentData] = useState<DisplayData | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const channelRef = useRef<BroadcastChannel | null>(null);

    // Parse URL params
    const bgColor = searchParams.get('bg') || 'transparent';
    const fontSize = parseInt(searchParams.get('fontSize') || '48', 10);
    const position = searchParams.get('position') || 'center';
    const theme = searchParams.get('theme') || 'gold';
    const showRef = searchParams.get('showRef') !== 'false';

    const themeColors: Record<string, { text: string; accent: string; ref: string }> = {
        gold: { text: '#FFFFFF', accent: '#D4AF37', ref: '#D4AF37' },
        white: { text: '#FFFFFF', accent: '#FFFFFF', ref: '#CCCCCC' },
        cream: { text: '#FFF8E7', accent: '#E8D5A3', ref: '#D4C5A0' },
        blue: { text: '#FFFFFF', accent: '#5B9BD5', ref: '#5B9BD5' },
    };

    const colors = themeColors[theme] || themeColors.gold;

    const bgStyles: Record<string, string> = {
        transparent: 'transparent',
        green: '#00FF00', // Chroma key green
        black: '#000000',
        blue: '#0000FF',  // Chroma key blue
    };

    // Listen for verse updates via BroadcastChannel
    useEffect(() => {
        const channel = new BroadcastChannel('voicebible-obs');
        channelRef.current = channel;

        channel.onmessage = (event) => {
            const data = event.data;
            if (data.type === 'verse-update' || data.type === 'hymn-update') {
                setIsVisible(false);
                setTimeout(() => {
                    setCurrentData(data.payload);
                    setIsVisible(true);
                }, 300); // Smooth transition
            } else if (data.type === 'clear') {
                setIsVisible(false);
                setTimeout(() => setCurrentData(null), 500);
            }
        };

        return () => {
            channel.close();
        };
    }, []);

    // Also listen for localStorage events (fallback for cross-tab)
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'voicebible-obs-data' && e.newValue) {
                try {
                    const data = JSON.parse(e.newValue);
                    setIsVisible(false);
                    setTimeout(() => {
                        setCurrentData(data);
                        setIsVisible(true);
                    }, 300);
                } catch { /* ignore */ }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const positionStyles: Record<string, React.CSSProperties> = {
        top: { alignItems: 'flex-start', paddingTop: '5vh' },
        center: { alignItems: 'center' },
        bottom: { alignItems: 'flex-end', paddingBottom: '5vh' },
    };

    const isVerse = (data: DisplayData): data is VerseData => 'reference' in data;

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                backgroundColor: bgStyles[bgColor] || 'transparent',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                ...positionStyles[position],
                padding: '2rem 4rem',
                fontFamily: "'Crimson Text', 'Georgia', serif",
                overflow: 'hidden',
            }}
        >
            {currentData ? (
                <div
                    style={{
                        textAlign: 'center',
                        maxWidth: '90vw',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                >
                    {isVerse(currentData) ? (
                        <>
                            {/* Verse Number */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: fontSize * 1.5,
                                        height: fontSize * 1.5,
                                        borderRadius: '50%',
                                        backgroundColor: colors.accent,
                                        color: '#000',
                                        fontWeight: 'bold',
                                        fontSize: fontSize * 0.6,
                                        boxShadow: `0 4px 20px ${colors.accent}40`,
                                    }}
                                >
                                    {currentData.verseNumber}
                                </span>
                            </div>

                            {/* Verse Text */}
                            <p
                                style={{
                                    fontSize: `${fontSize}px`,
                                    lineHeight: 1.6,
                                    color: colors.text,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                                    fontWeight: 400,
                                    marginBottom: '2rem',
                                }}
                            >
                                {currentData.text}
                            </p>

                            {/* Reference */}
                            {showRef && (
                                <div>
                                    <p
                                        style={{
                                            fontSize: `${fontSize * 0.7}px`,
                                            fontWeight: 'bold',
                                            color: colors.ref,
                                            letterSpacing: '2px',
                                        }}
                                    >
                                        {currentData.reference}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: `${fontSize * 0.35}px`,
                                            color: `${colors.text}66`,
                                            letterSpacing: '4px',
                                            textTransform: 'uppercase',
                                            marginTop: '0.5rem',
                                        }}
                                    >
                                        {currentData.translation}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Hymn Display */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span
                                    style={{
                                        fontSize: fontSize * 0.5,
                                        color: colors.accent,
                                        fontWeight: 'bold',
                                        letterSpacing: '3px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Sacred Songs & Solos • #{(currentData as HymnData).number}
                                </span>
                            </div>

                            <h2
                                style={{
                                    fontSize: `${fontSize * 0.8}px`,
                                    fontWeight: 'bold',
                                    color: colors.accent,
                                    marginBottom: '2rem',
                                }}
                            >
                                {(currentData as HymnData).title}
                            </h2>

                            <p
                                style={{
                                    fontSize: `${fontSize}px`,
                                    lineHeight: 1.8,
                                    color: colors.text,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                                    fontWeight: 400,
                                    whiteSpace: 'pre-line',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                {(currentData as HymnData).verse}
                            </p>

                            {(currentData as HymnData).chorus && (
                                <p
                                    style={{
                                        fontSize: `${fontSize * 0.85}px`,
                                        lineHeight: 1.6,
                                        color: colors.accent,
                                        fontStyle: 'italic',
                                        whiteSpace: 'pre-line',
                                        textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {(currentData as HymnData).chorus}
                                </p>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div
                    style={{
                        textAlign: 'center',
                        color: `${colors.text}33`,
                        fontSize: '1.5rem',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                    }}
                >
                    VoiceBible • OBS Ready
                </div>
            )}
        </div>
    );
};

export default OBSView;
