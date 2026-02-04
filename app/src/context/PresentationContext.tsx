import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface PresentationContextType {
  isPresentationMode: boolean;
  enterPresentationMode: () => void;
  exitPresentationMode: () => void;
  togglePresentationMode: () => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const enterPresentationMode = useCallback(() => {
    setIsPresentationMode(true);
    // Try to enter fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen not supported or blocked
      });
    }
  }, []);

  const exitPresentationMode = useCallback(() => {
    setIsPresentationMode(false);
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        // Ignore errors
      });
    }
  }, []);

  const togglePresentationMode = useCallback(() => {
    if (isPresentationMode) {
      exitPresentationMode();
    } else {
      enterPresentationMode();
    }
  }, [isPresentationMode, enterPresentationMode, exitPresentationMode]);

  // Listen for Escape key to exit presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPresentationMode) {
        exitPresentationMode();
      }
      // F5 or Ctrl+Shift+P to toggle presentation mode
      if ((e.key === 'F5' || (e.ctrlKey && e.shiftKey && e.key === 'P')) && !e.repeat) {
        e.preventDefault();
        togglePresentationMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, exitPresentationMode, togglePresentationMode]);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isPresentationMode) {
        setIsPresentationMode(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isPresentationMode]);

  return (
    <PresentationContext.Provider
      value={{
        isPresentationMode,
        enterPresentationMode,
        exitPresentationMode,
        togglePresentationMode,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentationMode() {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentationMode must be used within a PresentationProvider');
  }
  return context;
}
