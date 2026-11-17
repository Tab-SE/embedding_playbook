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
      disable-explore-filter={layout === "card" ? "true" : undefined}
    />
  );
};

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
        {data && data.length === 0 ? (
          <p className="text-sm text-muted-foreground">You aren&apos;t following any Pulse metrics yet.</p>
        ) : null}

        {data && data.length > 0 && token ? (
          <div className="grid items-start gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((m) => (
              <div key={m.id} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-stone-900">
                <PulseEmbed src={m.src} token={token} layout="card" initialHeight={320} />
                <button
                  onClick={() => setSelected(m)}
                  className="flex items-center justify-between border-t px-5 py-3 text-sm font-medium text-primary hover:bg-muted/50"
                  aria-label={`View details for ${m.name}`}
                >
                  View details
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
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
