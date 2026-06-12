'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui';
import { DemoGuide } from './DemoGuide';

// Modal shown when an AE/SE clicks "Highlights" or "Demo Script" on a gallery
// card. `open`/`onOpenChange` are controlled by the parent Gallery so the same
// modal serves both links; `defaultTab` selects which tab opens first.
export const DemoGuideModal = ({ id, guide, open, onOpenChange, defaultTab = 'highlights' }) => {
  // Track the active tab so "Open full guide" lands on the same tab the user is
  // currently viewing — not always Highlights. Re-seed whenever the modal is
  // (re)opened from a specific link.
  const [tab, setTab] = useState(defaultTab);
  useEffect(() => {
    if (open) setTab(defaultTab);
  }, [open, defaultTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{guide?.title ?? 'Demo Guide'}</DialogTitle>
          {guide?.tagline ? <DialogDescription>{guide.tagline}</DialogDescription> : null}
        </DialogHeader>

        <DemoGuide guide={guide} value={tab} onValueChange={setTab} />

        <div className="mt-2 flex justify-end">
          <Link
            href={`/demos/${id}/guide?tab=${tab}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[hsl(199,99%,39%)] hover:underline"
          >
            Open full guide
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};
