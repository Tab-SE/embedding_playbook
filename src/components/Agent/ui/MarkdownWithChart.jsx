"use client";
import { useState, useMemo } from "react";
import { MarkdownText } from "./markdown-text";
import { StaticMarkdownText } from "./StaticMarkdownText";
import { SmartChart, parseMarkdownTable } from "./SmartChart";
import { LocationTableMap } from "./LocationTableMap";
import { mergeGeorgiaOfficeTableForMap } from "@/app/demo/morgan/morganGeorgiaMapLocations";

/** Split before the “Try next” prompt so the map sits under the roster table (no visible sentinel in markdown). */
const MAP_AFTER_TABLE_SPLIT = "\n\n**Try next:**";

/**
 * Georgia roster tables (`# | Name | Location`) render the map between the table and the **Try next** block.
 * Other parseable tables show SmartChart above the markdown.
 */
export function MarkdownWithChart({ text }) {
  const [showViz, setShowViz] = useState(true);

  const tableData = useMemo(() => {
    if (!text) return null;
    return parseMarkdownTable(text);
  }, [text]);

  const mapLocations = useMemo(() => {
    if (!tableData) return null;
    return mergeGeorgiaOfficeTableForMap(tableData);
  }, [tableData]);

  const mapMarkdownParts = useMemo(() => {
    if (!text || !mapLocations?.length) return null;
    const splitIdx = text.lastIndexOf(MAP_AFTER_TABLE_SPLIT);
    if (splitIdx === -1) return null;
    return {
      before: text.slice(0, splitIdx),
      after: text.slice(splitIdx + 2),
    };
  }, [text, mapLocations]);

  const hasTable = tableData && tableData.length > 0;
  const showMap = Boolean(mapLocations?.length);
  const mapBelowRecords = showMap && mapMarkdownParts !== null;
  const toggleLabel = showMap ? "Show map" : "Show chart";
  const mapTitle = "Georgia offices — expert witness coverage (internal records)";

  const chartBlock =
    hasTable && !mapBelowRecords ? (
      <div className="mb-4">
        <label className="mb-3 flex cursor-pointer items-center gap-2">
          <div className="relative">
            <input
              type="checkbox"
              checked={showViz}
              onChange={(e) => setShowViz(e.target.checked)}
              className="peer sr-only"
            />
            <div className="relative h-6 w-11 rounded-full bg-stone-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-stone-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-stone-600 dark:bg-stone-700 dark:peer-focus:ring-blue-800" />
          </div>
          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
            📊 {toggleLabel}
          </span>
        </label>
        {showViz ? <SmartChart data={tableData} title="Data Visualization" /> : null}
      </div>
    ) : null;

  const mapBlock =
    mapBelowRecords ? (
      <div className="mb-4 mt-2">
        <label className="mb-3 flex cursor-pointer items-center gap-2">
          <div className="relative">
            <input
              type="checkbox"
              checked={showViz}
              onChange={(e) => setShowViz(e.target.checked)}
              className="peer sr-only"
            />
            <div className="relative h-6 w-11 rounded-full bg-stone-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-stone-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-stone-600 dark:bg-stone-700 dark:peer-focus:ring-blue-800" />
          </div>
          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
            🗺️ {toggleLabel}
          </span>
        </label>
        {showViz ? <LocationTableMap locations={mapLocations} title={mapTitle} /> : null}
      </div>
    ) : null;

  if (mapBelowRecords) {
    return (
      <>
        <StaticMarkdownText text={mapMarkdownParts.before} />
        {mapBlock}
        <StaticMarkdownText text={mapMarkdownParts.after} />
      </>
    );
  }

  return (
    <>
      {chartBlock}
      <MarkdownText text={text} />
    </>
  );
}
