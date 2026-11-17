"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useTableauSession } from "@/hooks";

// <tableau-pulse> is registered by the Embedding API script loaded in app/layout.tsx.
// The component reports its real rendered size via `firstpulsemetricsizeknown` and
// `pulsemetricsizechanged` (event.detail.width/height), so we size the element from
// those instead of guessing a fixed height that crops or pads the metric.
const PulseEmbed = ({ src, token, layout, initialHeight }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onSize = (e) => {
      const h = Math.ceil(e?.detail?.height ?? 0);
      if (h > 0) setHeight(h);
    };
    el.addEventListener("firstpulsemetricsizeknown", onSize);
    el.addEventListener("pulsemetricsizechanged", onSize);
    return () => {
      el.removeEventListener("firstpulsemetricsizeknown", onSize);
      el.removeEventListener("pulsemetricsizechanged", onSize);
    };
  }, []);

  return (
    <tableau-pulse
      ref={ref}
      src={src}
      token={token}
      layout={layout}
      width="100%"
      height={`${height}px`}
      disable-explore-filter={layout !== "default" ? "true" : undefined}
    />
  );
};

// How many followed metrics show as headline BANs (big number only) before
// the rest switch to cards with the trend line.
const BAN_COUNT = 2;
// How many cards (KPI + trend) to show below the BANs.
const CARD_COUNT = 2;

// Followed metrics to leave out of this page.
// 1878bde9…: "AHT Average Handle Time" — no data for the current period.
const HIDDEN_METRIC_IDS = new Set(["1878bde9-bff5-43f7-99f7-8ba0a4d33902"]);

const MetricTile = ({ metric, token, layout, initialHeight, onOpen }) => (
  <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-stone-900">
    <PulseEmbed src={metric.src} token={token} layout={layout} initialHeight={initialHeight} />
    <button
      onClick={() => onOpen(metric)}
      className="flex items-center justify-between border-t px-5 py-3 text-sm font-medium text-primary hover:bg-muted/50"
      aria-label={`View details for ${metric.name}`}
    >
      View details
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
);

export const PulseMetrics = () => {
  const { data: session, isSuccess: sessionReady } = useTableauSession();
  const [selected, setSelected] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pinnacle", "pulse", "followed", session?.email],
    queryFn: async () => {
      const res = await fetch("/api/pulse/followed");
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
      return body.metrics;
    },
    enabled: sessionReady,
    staleTime: 5 * 60 * 1000,
  });

  const token = session?.embed_token;
  // First BAN_COUNT followed metrics render as BAN tiles; the next CARD_COUNT as cards.
  const shown = (data ?? []).filter((m) => !HIDDEN_METRIC_IDS.has(m.id));
  const bans = shown.slice(0, BAN_COUNT);
  const cards = shown.slice(BAN_COUNT, BAN_COUNT + CARD_COUNT);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pulse Metrics</h1>
          <p className="text-sm text-muted-foreground">
            The metrics you follow in Tableau Pulse. Open a metric for trends and AI insights.
          </p>
        </div>

        {isLoading || !sessionReady ? <p className="text-sm text-muted-foreground">Loading your metrics…</p> : null}
        {error ? <p className="text-sm text-red-600">Couldn&apos;t load your followed metrics: {error.message}</p> : null}
        {data && shown.length === 0 ? (
          <p className="text-sm text-muted-foreground">You aren&apos;t following any Pulse metrics yet.</p>
        ) : null}

        {shown.length > 0 && token ? (
          <>
            {/* Headline KPIs: big number only */}
            {bans.length > 0 ? (
              <div className="grid items-start gap-4 sm:grid-cols-2">
                {bans.map((m) => <MetricTile key={m.id} metric={m} token={token} layout="ban" initialHeight={140} onOpen={setSelected} />)}
              </div>
            ) : null}
            {/* Remaining metrics: KPI + trend */}
            {cards.length > 0 ? (
              <div className="grid items-start gap-6 sm:grid-cols-2">
                {cards.map((m) => <MetricTile key={m.id} metric={m} token={token} layout="card" initialHeight={320} onOpen={setSelected} />)}
              </div>
            ) : null}
          </>
        ) : null}
      </main>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && token ? (
            <PulseEmbed key={selected.id} src={selected.src} token={token} layout="default" initialHeight={800} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
