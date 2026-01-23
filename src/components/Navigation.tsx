import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Keyboard, Bookmark, Menu, X } from 'lucide-react';

interface NavigationProps {
    onManualSearchClick?: () => void;
    onSavedVersesClick?: () => void;
    savedCount?: number;
}

const Navigation: React.FC<NavigationProps> = ({
    onManualSearchClick,
    onSavedVersesClick,
    savedCount = 0
}) => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1629]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8960C] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <BookOpen className="w-5 h-5 text-[#0F1629]" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Crimson Text', serif" }}>
                            VoiceBible
                        </h1>
                        <p className="text-xs text-white/50">Speak. Find. Read.</p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <nav className="flex items-center gap-6 mr-6 border-r border-white/10 pr-6">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-[#D4AF37]' : 'text-white/70 hover:text-white'}`}
                        >
                            Search
                        </Link>
                        <Link
                            to="/read"
                            className={`text-sm font-medium transition-colors ${isActive('/read') ? 'text-[#D4AF37]' : 'text-white/70 hover:text-white'}`}
                        >
                            Read
                        </Link>
                        <Link
                            to="/about"
                            className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-[#D4AF37]' : 'text-white/70 hover:text-white'}`}
                        >
                            About
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        {onManualSearchClick && (
                            <button
                                onClick={onManualSearchClick}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                title="Type to search"
                            >
                                <Keyboard className="w-4 h-4" />
                                <span className="hidden lg:inline">Type</span>
                            </button>
                        )}

                        {onSavedVersesClick && (
                            <button
                                onClick={onSavedVersesClick}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors relative"
                            >
                                <Bookmark className="w-4 h-4" />
                                <span className="hidden lg:inline">My Verses</span>
                                {savedCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#0F1629] text-xs font-bold rounded-full flex items-center justify-center">
                                        {savedCount > 99 ? '99+' : savedCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-white/70 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#0F1629] border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <Link
                        to="/"
                        className={`text-base font-medium p-2 rounded-lg ${isActive('/') ? 'bg-white/10 text-[#D4AF37]' : 'text-white/70 hover:bg-white/5'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Search
                    </Link>
                    <Link
                        to="/read"
                        className={`text-base font-medium p-2 rounded-lg ${isActive('/read') ? 'bg-white/10 text-[#D4AF37]' : 'text-white/70 hover:bg-white/5'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Read
                    </Link>
                    <Link
                        to="/about"
                        className={`text-base font-medium p-2 rounded-lg ${isActive('/about') ? 'bg-white/10 text-[#D4AF37]' : 'text-white/70 hover:bg-white/5'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        About
                    </Link>

                    <div className="h-px bg-white/10 my-2" />

                    <div className="flex gap-2">
                        {onManualSearchClick && (
                            <button
                                onClick={() => {
                                    onManualSearchClick();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Keyboard className="w-4 h-4" />
                                <span>Type</span>
                            </button>
                        )}

                        {onSavedVersesClick && (
                            <button
                                onClick={() => {
                                    onSavedVersesClick();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors relative"
                            >
                                <Bookmark className="w-4 h-4" />
                                <span>My Verses</span>
                                {savedCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#0F1629] text-xs font-bold rounded-full flex items-center justify-center">
                                        {savedCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navigation;
