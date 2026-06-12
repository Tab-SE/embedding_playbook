'use client';

import { Sparkles, MousePointerClick, UserRound, ExternalLink } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { Badge } from '@/components/ui';

// Shared presentational guide. Used both inside the card modal (compact) and on
// the full guide page (roomier). `defaultTab` sets the initial tab (uncontrolled).
// Pass `value` + `onValueChange` to drive the tabs from a parent (the modal does
// this so it can carry the current tab into the "Open full guide" link).
export const DemoGuide = ({ guide, defaultTab = 'highlights', value, onValueChange }) => {
  if (!guide) {
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400">
        No demo guide available yet for this demo.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {guide.persona ? (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            <UserRound className="h-3.5 w-3.5" />
            Persona
          </div>
          <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">
            {guide.persona.title}
            {guide.persona.context ? (
              <span className="font-normal text-stone-500 dark:text-stone-400"> — {guide.persona.context}</span>
            ) : null}
          </p>
          {guide.persona.scenario ? (
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{guide.persona.scenario}</p>
          ) : null}
        </div>
      ) : null}

      <Tabs
        defaultValue={value === undefined ? defaultTab : undefined}
        value={value}
        onValueChange={onValueChange}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="highlights">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Feature Highlight
          </TabsTrigger>
          <TabsTrigger value="clickPath">
            <MousePointerClick className="mr-1.5 h-3.5 w-3.5" />
            Demo Script
          </TabsTrigger>
        </TabsList>

        <TabsContent value="highlights">
          <ul className="space-y-2">
            {(guide.highlights ?? []).map((h, i) => (
              <li key={i} className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(199,99%,39%)]" />
                <div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-stone-900 dark:text-stone-100">
                    {h.icon ? <span className="inline-flex shrink-0">{h.icon}</span> : null}
                    {h.capability}
                  </span>
                  {h.blurb ? (
                    <span className="text-sm text-stone-600 dark:text-stone-400"> — {h.blurb}</span>
                  ) : null}
                  {h.docUrl ? (
                    <a
                      href={h.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 inline-flex items-center gap-0.5 text-sm font-medium text-[hsl(199,99%,39%)] hover:underline"
                    >
                      Docs
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="clickPath">
          <ol className="space-y-3">
            {(guide.clickPath ?? []).map((step, i) => (
              <li key={i} className="flex gap-3">
                <Badge className="h-6 w-6 shrink-0 justify-center rounded-full p-0 text-xs">{i + 1}</Badge>
                <div>
                  <p className="inline-flex items-center gap-1 text-sm font-medium text-stone-900 dark:text-stone-100">
                    {step.icon ? <span className="inline-flex shrink-0">{step.icon}</span> : null}
                    {step.action}
                  </p>
                  {step.shows ? (
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      <span className="font-medium text-stone-600 dark:text-stone-300">Demonstrates: </span>
                      {step.shows}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </div>
  );
};
