import React from 'react';

interface VoiceTranscriptProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  error: string | null;
}

const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({
  transcript,
  interimTranscript,
  isListening,
  error
}) => {
  const hasContent = transcript || interimTranscript;

  if (error) {
    return (
      <div className="mt-8 px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-xl max-w-md mx-auto">
        <p className="text-red-400 text-center text-sm md:text-base">{error}</p>
      </div>
    );
  }

  if (!hasContent && !isListening) {
    return null;
  }

  return (
    <div className="mt-8 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl max-w-lg mx-auto fade-in">
      {isListening && !hasContent && (
        <p className="text-white/60 text-center text-sm md:text-base italic">
          Listening... speak a Bible verse
        </p>
      )}
      
      {hasContent && (
        <p className="text-white text-center text-lg md:text-xl font-medium">
          {transcript}
          {interimTranscript && (
            <span className="text-white/50 italic">{interimTranscript}</span>
          )}
        </p>
      )}
    </div>
  );
};

export default VoiceTranscript;
