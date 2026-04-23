"use client";

import dynamic from "next/dynamic";

const LocationTableMapInner = dynamic(() => import("./LocationTableMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[380px] w-full items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
      Loading map…
    </div>
  ),
});

export function LocationTableMap({ locations, title }) {
  if (!locations?.length) return null;

  return (
    <div className="my-6 rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900">
      {title ? (
        <h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
      ) : null}
      <LocationTableMapInner locations={locations} />
    </div>
  );
}
