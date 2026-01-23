import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface MicrophoneButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  onClick: () => void;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isListening,
  isProcessing,
  isSupported,
  onClick
}) => {
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center cursor-not-allowed">
          <MicOff className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Voice search is not supported in your browser. Please try Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings when listening */}
      {isListening && (
        <>
          <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent/20 mic-pulse" />
          <div className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full bg-accent/10 mic-pulse" style={{ animationDelay: '0.5s' }} />
        </>
      )}

      {/* Main button */}
      <button
        onClick={onClick}
        disabled={isProcessing}
        className={`
          relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full 
          flex items-center justify-center
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-4 focus:ring-accent/30
          ${isListening
            ? 'bg-accent shadow-lg shadow-accent/40 scale-110'
            : 'bg-gradient-to-br from-accent to-accent/80 hover:scale-105 hover:shadow-lg hover:shadow-accent/30'
          }
          ${isProcessing ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
        `}
        aria-label={isListening ? 'Stop listening' : 'Start voice search'}
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-accent-foreground animate-spin" />
        ) : (
          <Mic className={`w-8 h-8 md:w-10 md:h-10 text-accent-foreground transition-transform ${isListening ? 'scale-110' : ''}`} />
        )}
      </button>

      {/* Waveform visualization when listening */}
      {isListening && (
        <div className="absolute -bottom-12 flex items-end gap-1 h-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-accent rounded-full wave-bar"
              style={{
                height: '100%',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MicrophoneButton;
