"use client";
import { memo, useState } from "react";
import { MarkdownText } from "./markdown-text";
import { SmartChart, parseMarkdownTable } from "./SmartChart";

/**
 * Enhanced Markdown Text with automatic chart rendering
 * Detects tables in markdown and renders them with interactive charts
 */
export const EnhancedMarkdownText = memo(({ text }) => {
  const [showChart, setShowChart] = useState(true);

  if (!text) return null;

  // Try to extract table from markdown
  const tableData = parseMarkdownTable(text);
  const hasTable = tableData && tableData.length > 0;

  // Split content into table and non-table parts
  let beforeTable = text;
  let tableText = '';
  let afterTable = '';

  if (hasTable) {
    const tableRegex = /\|(.+)\|\s*\n\s*\|[\s\-\|:]+\|\s*\n((?:\s*\|.+\|\s*\n?)+)/;
    const match = text.match(tableRegex);

    if (match) {
      const tableStart = match.index;
      const tableEnd = tableStart + match[0].length;

      beforeTable = text.substring(0, tableStart);
      tableText = match[0];
      afterTable = text.substring(tableEnd);
    }
  }

  return (
    <div className="space-y-4">
      {/* Text before table */}
      {beforeTable && <MarkdownText text={beforeTable} />}

      {/* Table with chart toggle */}
      {hasTable && (
        <div className="my-6">
          {/* Toggle controls */}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showChart}
                  onChange={(e) => setShowChart(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                📊 Show chart
              </span>
            </label>
          </div>

          {/* Chart visualization */}
          {showChart && (
            <SmartChart
              data={tableData}
              title={getChartTitle(beforeTable, tableText)}
            />
          )}

          {/* Table */}
          <MarkdownText text={tableText} />
        </div>
      )}

      {/* Text after table */}
      {afterTable && <MarkdownText text={afterTable} />}
    </div>
  );
});

EnhancedMarkdownText.displayName = "EnhancedMarkdownText";

// Extract a meaningful chart title from surrounding text
function getChartTitle(beforeText, tableText) {
  // Try to find a heading or sentence before the table
  const lines = beforeText.split('\n').filter(l => l.trim());
  const lastLine = lines[lines.length - 1];

  if (lastLine) {
    // Remove markdown heading markers
    const cleaned = lastLine.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
    if (cleaned.length > 0 && cleaned.length < 100) {
      return cleaned;
    }
  }

  // Fallback: extract from table headers
  const headerMatch = tableText.match(/\|(.+)\|/);
  if (headerMatch) {
    const headers = headerMatch[1].split('|').map(h => h.trim()).filter(h => h);
    if (headers.length >= 2) {
      return `${headers[0]} vs ${headers[1]}`;
    }
  }

  return 'Data Visualization';
}
