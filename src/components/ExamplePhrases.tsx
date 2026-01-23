import React from 'react';

interface ExamplePhrasesProps {
  onPhraseClick: (phrase: string) => void;
}

const EXAMPLE_PHRASES = [
  { phrase: 'John 3:16', description: 'For God so loved the world...' },
  { phrase: 'Psalm 23', description: 'The Lord is my shepherd...' },
  { phrase: 'Romans 8:28', description: 'All things work together...' },
  { phrase: 'Philippians 4:13', description: 'I can do all things...' },
  { phrase: 'Proverbs 3:5', description: 'Trust in the Lord...' },
  { phrase: 'Isaiah 41:10', description: 'Fear not, for I am with you...' },
];

const ExamplePhrases: React.FC<ExamplePhrasesProps> = ({ onPhraseClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <h3 className="text-center text-white/60 text-sm uppercase tracking-wider mb-4">
        Try saying
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {EXAMPLE_PHRASES.map((item) => (
          <button
            key={item.phrase}
            onClick={() => onPhraseClick(item.phrase)}
            className="group p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/30 rounded-xl transition-all duration-300 text-left"
          >
            <p className="text-white font-medium group-hover:text-[#D4AF37] transition-colors">
              {item.phrase}
            </p>
            <p className="text-white/50 text-sm mt-1 truncate">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePhrases;
