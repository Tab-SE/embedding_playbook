import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { demoGuides } from '@/components/Gallery/demoGuides';
import { DemoGuide } from '@/components/Gallery/DemoGuide';

// Full-page demo guide — the "open full guide" target from the gallery modal.
// Shares the same content (demoGuides) and presentational component as the modal.
const GuidePage = ({ params, searchParams }) => {
  const { id } = params;
  const guide = demoGuides[id];

  if (!guide) {
    notFound();
  }

  // Open to whichever tab the modal's "Open full guide" link carried, so a user
  // reading the Demo Script doesn't get bounced back to Highlights.
  const tab = searchParams?.tab === 'clickPath' ? 'clickPath' : 'highlights';

  return (
    <div className="h-full w-full overflow-y-auto bg-white dark:bg-stone-950">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/demos"
          className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to demo library
        </Link>

        <header className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{guide.title}</h1>
          {guide.tagline ? (
            <p className="mt-2 text-stone-600 dark:text-stone-400">{guide.tagline}</p>
          ) : null}
          <Link
            href={`/demo/${id}`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[hsl(199,99%,39%)] px-3 py-2 text-sm font-medium text-white shadow hover:opacity-90"
          >
            Launch this demo
            <ExternalLink className="h-4 w-4" />
          </Link>
        </header>

        <DemoGuide guide={guide} defaultTab={tab} />
      </div>
    </div>
  );
};

export default GuidePage;
