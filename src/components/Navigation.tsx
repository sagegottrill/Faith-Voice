import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Keyboard, Bookmark, Menu, X, Mic, MicOff, Command, Heart } from 'lucide-react';

interface NavigationProps {
    onManualSearchClick?: () => void;
    onSavedVersesClick?: () => void;
    savedCount?: number;
    sermonMode?: boolean;
    onSermonModeToggle?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
    onManualSearchClick,
    onSavedVersesClick,
    savedCount = 0,
    sermonMode = false,
    onSermonModeToggle
}) => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for glass header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    return (
        <header
            className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 py-3
        ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm' : 'bg-transparent'}
      `}
        >
            <div className={`
        max-w-6xl mx-auto flex items-center justify-between
        ${scrolled ? 'py-1' : 'py-3'}
        transition-all duration-500
      `}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-accent blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
                        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform duration-300">
                            <BookOpen className="w-5 h-5 text-accent-foreground" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Crimson Text', serif" }}>
                            VoiceBible
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase opacity-70">
                            Speak • Find • Read
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-sm p-1.5 rounded-full border border-white/10 shadow-sm">
                    <NavLink to="/" label="Search" active={isActive('/')} icon={<Search className="w-4 h-4" />} />
                    <NavLink to="/read" label="Read" active={isActive('/read')} icon={<BookOpen className="w-4 h-4" />} />
                    <NavLink to="/dashboard" label="Devotional" active={isActive('/dashboard')} icon={<Heart className="w-4 h-4" />} />
                    <NavLink to="/about" label="About" active={isActive('/about')} />
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <ThemeToggle />

                    {/* ⌘K Shortcut */}
                    <button
                        onClick={() => {
                            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
                        }}
                        className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 text-xs"
                        title="Command Palette (Ctrl+K)"
                    >
                        <Command className="w-3 h-3" />
                        <span className="font-mono">K</span>
                    </button>

                    {/* Sermon Mode Toggle */}
                    {onSermonModeToggle && (
                        <button
                            onClick={onSermonModeToggle}
                            className={`p-3 rounded-full transition-all duration-300 ${sermonMode
                                ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/30'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                }`}
                            title={sermonMode ? 'Sermon Mode (Always Listening)' : 'Normal Mode (Tap to Talk)'}
                        >
                            {sermonMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>
                    )}

                    {onManualSearchClick && (
                        <button
                            onClick={onManualSearchClick}
                            className="p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all duration-300"
                            title="Type to search"
                        >
                            <Keyboard className="w-5 h-5" />
                        </button>
                    )}

                    {onSavedVersesClick && (
                        <button
                            onClick={onSavedVersesClick}
                            className="relative p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all duration-300 group"
                            title="Saved Verses"
                        >
                            <Bookmark className="w-5 h-5 group-hover:fill-current transition-colors" />
                            {savedCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm ring-2 ring-background">
                                    {savedCount > 99 ? '99+' : savedCount}
                                </span>
                            )}
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 rounded-xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 right-4 w-64 bg-card/95 backdrop-blur-xl border border-white/20 rounded-3xl p-2 flex flex-col gap-1 shadow-2xl animate-in fade-in zoom-in-95 origin-top-right">
                    <div className="flex justify-between items-center px-4 py-2">
                        <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                        <ThemeToggle />
                    </div>
                    <div className="h-px bg-border/50 my-1 mx-2" />

                    <MobileNavLink to="/" label="Search" active={isActive('/')} onClick={() => setMobileMenuOpen(false)} icon={<Search className="w-4 h-4" />} />
                    <MobileNavLink to="/read" label="Read" active={isActive('/read')} onClick={() => setMobileMenuOpen(false)} icon={<BookOpen className="w-4 h-4" />} />
                    <MobileNavLink to="/dashboard" label="Devotional" active={isActive('/dashboard')} onClick={() => setMobileMenuOpen(false)} icon={<Heart className="w-4 h-4" />} />
                    <MobileNavLink to="/about" label="About" active={isActive('/about')} onClick={() => setMobileMenuOpen(false)} />

                    <div className="h-px bg-border/50 my-1 mx-2" />

                    {onManualSearchClick && (
                        <button
                            onClick={() => {
                                onManualSearchClick();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-2xl transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <Keyboard className="w-4 h-4" />
                            </div>
                            Type to Search
                        </button>
                    )}

                    {onSavedVersesClick && (
                        <button
                            onClick={() => {
                                onSavedVersesClick();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-2xl transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center relative">
                                <Bookmark className="w-4 h-4" />
                                {savedCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border border-background" />
                                )}
                            </div>
                            My Verses ({savedCount})
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

const NavLink = ({ to, label, active, icon }: { to: string; label: string; active: boolean; icon?: React.ReactNode }) => (
    <Link
        to={to}
        className={`
      relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
      ${active
                ? 'text-accent-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }
    `}
    >
        {active && (
            <span className="absolute inset-0 bg-accent rounded-full -z-10 animate-in fade-in zoom-in-95 duration-300" />
        )}
        {icon}
        {label}
    </Link>
);

const MobileNavLink = ({ to, label, active, onClick, icon }: { to: string; label: string; active: boolean; onClick: () => void; icon?: React.ReactNode }) => (
    <Link
        to={to}
        className={`
      flex items-center gap-3 p-3 text-sm font-medium rounded-2xl transition-all
      ${active
                ? 'bg-accent/10 text-accent'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }
    `}
        onClick={onClick}
    >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-accent text-accent-foreground' : 'bg-secondary'}`}>
            {icon || <div className="w-2 h-2 rounded-full bg-current" />}
        </div>
        {label}
    </Link>
);

export default Navigation;
