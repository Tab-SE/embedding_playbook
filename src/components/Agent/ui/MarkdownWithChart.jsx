"use client";
import { useState, useMemo } from "react";
import { MarkdownText } from "./markdown-text";
import { SmartChart, parseMarkdownTable } from "./SmartChart";

/**
 * Simple wrapper that adds a chart ABOVE the markdown
 * Does NOT modify or split the markdown content
 */
export function MarkdownWithChart({ text }) {
  const [showChart, setShowChart] = useState(true);

  // Parse table data once
  const tableData = useMemo(() => {
    if (!text) return null;
    return parseMarkdownTable(text);
  }, [text]);

  const hasTable = tableData && tableData.length > 0;

  return (
    <>
      {/* Chart toggle and visualization - BEFORE the markdown */}
      {hasTable && (
        <div className="mb-4">
          {/* Toggle */}
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <div className="relative">
              <input
                type="checkbox"
                checked={showChart}
                onChange={(e) => setShowChart(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-blue-600"></div>
            </div>
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              📊 Show chart
            </span>
          </label>

          {/* Chart */}
          {showChart && (
            <SmartChart
              data={tableData}
              title="Data Visualization"
            />
          )}
        </div>
      )}

      {/* Original markdown - UNCHANGED */}
      <MarkdownText text={text} />
    </>
  );
}
