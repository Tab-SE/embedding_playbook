"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progressSteps, setProgressSteps] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const addProgressStep = useCallback((step) => {
    setProgressSteps(prev => [...prev, step]);
  }, []);

  const clearProgress = useCallback(() => {
    setProgressSteps([]);
    setIsStreaming(false);
  }, []);

  const startStreaming = useCallback(() => {
    setProgressSteps([]);
    setIsStreaming(true);
  }, []);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
  }, []);

  return (
    <ProgressContext.Provider value={{
      progressSteps,
      isStreaming,
      addProgressStep,
      clearProgress,
      startStreaming,
      stopStreaming
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    // Return no-op functions for SSR or when provider is missing
    return {
      progressSteps: [],
      isStreaming: false,
      addProgressStep: () => {},
      clearProgress: () => {},
      startStreaming: () => {},
      stopStreaming: () => {},
    };
  }
  return context;
}
