"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Maximize2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useTableauSession } from "@/hooks";

// <tableau-pulse> is registered by the Embedding API script loaded in app/layout.tsx.
// token = the user's Connected App embed JWT (includes tableau:insights:embed).
const PulseEmbed = ({ src, token, layout, height }) => (
  <tableau-pulse
    src={src}
    token={token}
    layout={layout}
    width="100%"
    height={height}
  />
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Pulse Metrics</CardTitle>
            <CardDescription>
              The Tableau Pulse metrics you follow. Open any card for the full metric with AI insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || !sessionReady ? <p className="text-sm text-muted-foreground">Loading your metrics…</p> : null}
            {error ? <p className="text-sm text-red-600">Couldn&apos;t load your followed metrics: {error.message}</p> : null}
            {data && data.length === 0 ? (
              <p className="text-sm text-muted-foreground">You aren&apos;t following any Pulse metrics yet.</p>
            ) : null}
            {data && data.length > 0 && token ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((m) => (
                  <div key={m.id} className="relative rounded-lg border bg-background">
                    <PulseEmbed src={m.src} token={token} layout="card" height="260" />
                    <button
                      onClick={() => setSelected(m)}
                      className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow hover:opacity-90"
                      aria-label={`Open ${m.name} full view`}
                    >
                      <Maximize2 className="h-3.5 w-3.5" /> Details
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && token ? (
            <PulseEmbed key={selected.id} src={selected.src} token={token} layout="default" height="800" />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
