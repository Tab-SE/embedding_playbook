"use client";

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, BotMessageSquare } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { Metrics, TableauEmbed } from '@/components';

const TRINITY_BLUE = '#050742';
const TRINITY_TEAL = '#FF6150';

export const Home = () => {
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editableMessage, setEditableMessage] = useState('');
  const [embedWidth, setEmbedWidth] = useState(1200);
  const embedContainerRef = useRef(null);

  useEffect(() => {
    const el = embedContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      if (width > 0) setEmbedWidth(Math.floor(width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMarkSelectionChanged = (event) => {
      event.detail.getMarksAsync().then((marks) => {
        const table = marks.data?.[0];
        if (!table || !table.data?.length) { setSelectedMarks([]); return; }
        const columns = table.columns;
        const marksData = [];
        for (let i = 0; i < table.data.length; i++) {
          const obj = {};
          for (let j = 0; j < columns.length; j++) {
            obj[columns[j].fieldName] = table.data[i][j].formattedValue;
          }
          marksData.push(obj);
        }
        setSelectedMarks(marksData);
      }).catch(() => {});
    };

    const attach = (attempt = 0) => {
      // TableauViz renders one <tableau-viz> per responsive breakpoint; only some
      // get the passed id — the rest are hardcoded. Attach to all of them so the
      // visible one at the current breakpoint always fires markselectionchanged.
      const vizzes = Array.from(document.querySelectorAll('tableau-viz'));
      if (vizzes.length === 0) {
        if (attempt < 60) setTimeout(() => attach(attempt + 1), 250);
        return;
      }
      vizzes.forEach(viz => {
        viz.addEventListener('firstinteractive', () => {
          viz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
        });
        try { if (viz.workbook) viz.addEventListener('markselectionchanged', handleMarkSelectionChanged); } catch {}
      });
    };

    attach();
    return () => {
      document.querySelectorAll('tableau-viz').forEach(viz => {
        viz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
      });
    };
  }, []);

  const generateShareMessage = () => {
    if (selectedMarks.length === 0) return;
    const dataOnly = selectedMarks.map((mark, index) =>
      `Insight ${index + 1}:\n${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`
    ).join('\n\n');
    setEditableMessage(dataOnly);
    setShowShareModal(true);
  };

  return (
    <div className="flex flex-col w-full">
      <main className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">

        {/* Product engagement context banner */}
        <div className="shrink-0 rounded-lg px-4 py-3 flex items-center justify-between flex-wrap gap-3" style={{ backgroundColor: TRINITY_BLUE }}>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: TRINITY_TEAL }}>Active Engagement</p>
              <p className="text-white font-semibold text-sm">Avanex Therapeutics · GLP-1 Rx Program</p>
            </div>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
              Post-Approval Launch · Q3 2026
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedMarks.length > 0 && (
              <button
                onClick={generateShareMessage}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-400 text-white rounded-md transition-colors text-xs font-medium animate-pulse"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Share Insights ({selectedMarks.length})
              </button>
            )}
            <button
              onClick={async () => {
                const viz = document.getElementById('overviewViz') || document.querySelector('tableau-viz');
                if (viz?.launchAnalyticsAssistantAsync) await viz.launchAnalyticsAssistantAsync();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-xs font-medium hover:bg-white/10 border border-white/30 text-white"
            >
              <BotMessageSquare className="h-3.5 w-3.5" />
              Data Q&A
            </button>
          </div>
        </div>

        <div className="shrink-0">
          <Metrics basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5' />
        </div>

        <Card className='dark:bg-stone-900 shadow-xl w-full'>
          <CardHeader className="py-3">
            <CardTitle>Field Rep Performance</CardTitle>
            <CardDescription>Territory execution and prescriber engagement analytics</CardDescription>
          </CardHeader>
          <CardContent ref={embedContainerRef} className="p-0 overflow-hidden">
            <TableauEmbed
              id="overviewViz"
              src='https://10ax.online.tableau.com/t/cbsconnectors/views/AvanexTherapeutics-FieldRepPerformance/AvanexTherapeuticsFieldRepPerformance'
              hideTabs={true}
              toolbar='hidden'
              className='w-full'
              layouts={{
                '*': { device: 'desktop', width: embedWidth, height: 900 },
              }}
            />
          </CardContent>
        </Card>
      </main>


      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1e2a3a' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Share Insights
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-slate-400 mb-2 block">Message:</label>
                <textarea
                  value={editableMessage}
                  onChange={(e) => setEditableMessage(e.target.value)}
                  className="w-full h-48 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder="Add context or notes..."
                />
              </div>
              <div className="flex gap-3 justify-between pt-4 border-t border-slate-600">
                <button
                  onClick={() => { setShowShareModal(false); setSelectedMarks([]); setEditableMessage(''); }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!editableMessage.trim()) { alert('Please add a message before sending.'); return; }
                    alert(`Demo: Insights shared with team!\n\n${editableMessage}`);
                    setShowShareModal(false); setSelectedMarks([]); setEditableMessage('');
                  }}
                  className="px-4 py-2 text-white rounded-lg transition-colors font-semibold flex items-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: TRINITY_BLUE }}
                >
                  <MessageSquare className="h-4 w-4" />
                  Share with Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
