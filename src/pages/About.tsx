import React from 'react';
import Navigation from '@/components/Navigation';
import { Heart, Shield, Zap, WifiOff, Globe, BookOpen } from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Navigation />

            <div className="pt-24 px-4 max-w-6xl mx-auto pb-16">
                {/* Hero Section */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="text-accent text-sm uppercase tracking-widest font-bold mb-4 block">Our Mission</span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Crimson Text', serif" }}>
                        Scripture at the<br />Speed of <span className="text-accent">Voice</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        VoiceBible bridges the gap between spoken intent and written scripture, offering an immersive, offline-first experience for believers everywhere.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <FeatureCard
                        icon={<Zap className="w-6 h-6" />}
                        title="Instant Voice Search"
                        description='Speak natural phrases like "The Lord is my Shepherd" or references like "John 3:16" and get instant results.'
                    />
                    <FeatureCard
                        icon={<WifiOff className="w-6 h-6" />}
                        title="100% Offline"
                        description="The entire King James Bible is stored locally on your device. Zero latency, no internet connection required."
                    />
                    <FeatureCard
                        icon={<MonitorIcon />}
                        title="Presentation Mode"
                        description="Built for churches and groups. Project verses in a beautiful, distraction-free horizontal slide format."
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6" />}
                        title="Private & Secure"
                        description="Your voice processing happens on-device. We don't store your personal conversations or search history."
                    />
                    <FeatureCard
                        icon={<BookOpen className="w-6 h-6" />}
                        title="Full Bible Reader"
                        description="Navigate the entire Bible book by book, chapter by chapter, with a clean and modern reading interface."
                    />
                    <FeatureCard
                        icon={<Heart className="w-6 h-6" />}
                        title="Built by Believers"
                        description="Crafted with care to help you connect more deeply with the Word of God, distraction-free."
                    />
                </div>

                {/* Footer/Credits */}
                <div className="text-center border-t border-border pt-16">
                    <p className="text-muted-foreground mb-4">
                        VoiceBible v1.0 • King James Version
                    </p>
                    <div className="flex justify-center gap-6">
                        <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</a>
                        <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Terms of Service</a>
                        <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Component for Features
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="p-8 bg-card rounded-2xl border border-border hover:border-accent/50 hover:bg-secondary/50 transition-all duration-300 group shadow-sm hover:shadow-md">
        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 font-serif tracking-wide text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
            {description}
        </p>
    </div>
);

const MonitorIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
    >
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
)

export default AboutPage;
