import React from 'react';

interface VoiceTranscriptProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isProcessing?: boolean;
  error: string | null;
}

const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({
  transcript,
  interimTranscript,
  isListening,
  isProcessing,
  error
}) => {
  const hasContent = transcript || interimTranscript;

  if (error) {
    return (
      <div className="mt-8 px-6 py-4 bg-destructive/10 border border-destructive/30 rounded-xl max-w-md mx-auto">
        <p className="text-destructive text-center text-sm md:text-base">{error}</p>
      </div>
    );
  }

  if (!hasContent && !isListening) {
    return null;
  }

  return (
    <div className="mt-8 px-6 py-4 bg-card/60 backdrop-blur-sm border border-border rounded-xl max-w-lg mx-auto fade-in shadow-sm">
      {isListening && !hasContent && (
        <p className="text-muted-foreground text-center text-sm md:text-base italic">
          Listening... speak a Bible verse
        </p>
      )}

      {isProcessing && (
        <p className="text-accent text-center text-sm md:text-base animate-pulse font-medium">
          Transcribing audio...
        </p>
      )}

      {hasContent && (
        <p className="text-foreground text-center text-lg md:text-xl font-medium">
          {transcript}
          {interimTranscript && (
            <span className="text-muted-foreground/70 italic">{interimTranscript}</span>
          )}
        </p>
      )}
    </div>
  );
};

export default VoiceTranscript;
