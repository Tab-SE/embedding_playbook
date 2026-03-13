"use client";
import { memo, useEffect, useRef } from "react";
import { useProgress } from "../ProgressContext";

/**
 * Progress Indicator for Agent Thinking
 * Shows step-by-step progress like e-bikes demo
 */
export const ProgressIndicator = memo(() => {
  const { progressSteps, isStreaming } = useProgress();
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new steps appear
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [progressSteps.length]);

  if (!isStreaming && progressSteps.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            🤖 Initializing...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
        {isStreaming ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
            <span>🤖 MCP Analysis in Progress</span>
          </>
        ) : (
          <span>✅ Analysis Complete</span>
        )}
      </div>
      <div
        ref={containerRef}
        className="space-y-2 max-h-64 overflow-y-auto"
      >
        {progressSteps.map((step, index) => (
          <div
            key={`${step.timestamp}-${index}`}
            className="flex items-start gap-2 text-sm animate-in fade-in slide-in-from-left-2 duration-300"
          >
            <span className="text-lg flex-shrink-0">{step.icon}</span>
            <div className="flex-1">
              <span className="text-blue-800 dark:text-blue-200">{step.message}</span>
              {step.iteration && (
                <span className="ml-2 px-2 py-0.5 bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 rounded-full text-xs font-medium">
                  {step.iteration}/{step.maxIterations}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ProgressIndicator.displayName = "ProgressIndicator";
