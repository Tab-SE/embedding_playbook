"use client";
import { useEffect, useState } from 'react';

// Height for an embedded Tableau viz that fits the visible window instead of the view's full
// content height. Tableau Agent's side panel docks inside the viz frame and matches its height, so
// a frame taller than the window pushes the agent's question box off screen. Content taller than
// the frame scrolls inside the viz.
//
// `ref` is an element that sits where the embed renders. Returns null until measured.
export const useViewportEmbedHeight = (ref, { min = 640, toolbar = 56, gap = 24, maxTop = 240 } = {}) => {
  const [height, setHeight] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const next = Math.max(min, Math.floor(window.innerHeight - Math.min(top, maxTop) - toolbar - gap));
      // Ignore small jitters so the viz isn't re-rendered on every pixel of a window drag.
      setHeight((prev) => (prev && Math.abs(prev - next) < 40 ? prev : next));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ref, min, toolbar, gap, maxTop]);

  return height;
};

// Width of `ref`'s content box, for embeds whose dashboard sizes automatically (fills any width).
// Returns null until measured.
export const useEmbedWidth = (ref) => {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const cs = window.getComputedStyle(el);
      const inner = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const next = Math.max(300, Math.floor(inner));
      setWidth((prev) => (prev && Math.abs(prev - next) < 40 ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return width;
};
