import React, { useState } from 'react';
import { X, BookOpen, Trash2, Edit3, Check, MessageSquare } from 'lucide-react';
import { SavedVerse } from '@/hooks/useSavedVerses';

interface SavedVersesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  savedVerses: SavedVerse[];
  isLoading: boolean;
  onDeleteVerse: (verseId: string) => Promise<boolean>;
  onUpdateNote: (verseId: string, note: string) => Promise<boolean>;
  onVerseClick: (book: string, chapter: number, verse: number) => void;
}

const SavedVersesPanel: React.FC<SavedVersesPanelProps> = ({
  isOpen,
  onClose,
  savedVerses,
  isLoading,
  onDeleteVerse,
  onUpdateNote,
  onVerseClick
}) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEditNote = (verse: SavedVerse) => {
    setEditingNoteId(verse.id);
    setNoteText(verse.note || '');
  };

  const handleSaveNote = async (verseId: string) => {
    const success = await onUpdateNote(verseId, noteText);
    if (success) {
      setEditingNoteId(null);
      setNoteText('');
    }
  };

  const handleDelete = async (verseId: string) => {
    setDeletingId(verseId);
    await onDeleteVerse(verseId);
    setDeletingId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0F1629] border-l border-white/10 z-50 shadow-2xl flex flex-col fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Crimson Text', serif" }}>
                My Saved Verses
              </h2>
              <p className="text-xs text-white/50">
                {savedVerses.length} verse{savedVerses.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto verse-scroll p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : savedVerses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-white/50 mb-2">No saved verses yet</p>
              <p className="text-white/30 text-sm">
                Tap the bookmark icon on any verse to save it here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedVerses.map((verse) => (
                <div
                  key={verse.id}
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/30 transition-colors"
                >
                  {/* Verse header */}
                  <div className="flex items-center justify-between p-3 bg-white/5">
                    <button
                      onClick={() => onVerseClick(verse.book, verse.chapter, verse.verse)}
                      className="text-[#D4AF37] font-medium hover:underline"
                      style={{ fontFamily: "'Crimson Text', serif" }}
                    >
                      {verse.book} {verse.chapter}:{verse.verse}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditNote(verse)}
                        className="p-1.5 text-white/40 hover:text-[#D4AF37] hover:bg-white/10 rounded transition-colors"
                        title="Add/Edit note"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(verse.id)}
                        disabled={deletingId === verse.id}
                        className="p-1.5 text-white/40 hover:text-red-400 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Verse text */}
                  <div className="p-3">
                    <p 
                      className="text-white/80 text-sm leading-relaxed cursor-pointer hover:text-white transition-colors"
                      onClick={() => onVerseClick(verse.book, verse.chapter, verse.verse)}
                      style={{ fontFamily: "'Crimson Text', serif" }}
                    >
                      {verse.verse_text}
                    </p>
                  </div>

                  {/* Note section */}
                  {editingNoteId === verse.id ? (
                    <div className="p-3 border-t border-white/10 bg-white/5">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add your personal note..."
                        className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#D4AF37] resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(verse.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#D4AF37] text-[#0F1629] rounded-lg hover:bg-[#E8D48A] transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : verse.note ? (
                    <div 
                      className="p-3 border-t border-white/10 bg-[#D4AF37]/5 cursor-pointer hover:bg-[#D4AF37]/10 transition-colors"
                      onClick={() => handleEditNote(verse)}
                    >
                      <div className="flex items-start gap-2">
                        <Edit3 className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                        <p className="text-white/70 text-sm italic">{verse.note}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedVerses.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-white/5">
            <p className="text-xs text-white/40 text-center">
              Tap a verse reference to view it with context
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SavedVersesPanel;
