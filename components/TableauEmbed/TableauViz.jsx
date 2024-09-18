"use client";

import { useEffect, useState, useRef, forwardRef, useId } from 'react';

// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';

import {
  ContextMenu,
  ContextMenuTrigger,
} from "components/ui";

import { VizContextMenu } from './VizContextMenu';
import { XSLayout, SMLayout, MDLayout, LGLayout, XLLayout, XL2Layout } from 'components';


// handles post authentication logic requiring an initialized <tableau-viz> object to operate
export const TableauViz = forwardRef(function Viz(props, ref) {
  const { src, jwt, height, width, device, hideTabs, toolbar, isPublic, layouts } = props;
  // creates a unique identifier for the embed
  const id = `id-${useId()}`;
  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;
  // most viz interactions must wait until interactive
  const [interactive, setInteractive] = useState(false);
  // the target of most viz interactions
  const [activeSheet, setActiveSheet] = useState(null);

  useEffect(() => {
    if (innerRef.current) {
      const viz = innerRef.current;
      // passing the viz DOM element to tabScale https://gitlab.com/jhegele/tabscale
      // const tabScale = new TabScale.Scale(innerRef.current);
      // apply a few inline styles to new iframe
      const iframe = viz.shadowRoot.querySelector('iframe');
      iframe.style.margin = "auto";
      iframe.style.position = "relative";
      iframe.style.top = "-5px";
      iframe.style.left = "-5px";

      // handles all viz event listeners and clears them
      const eventListeners = handleVizEventListeners(viz, setInteractive);
      return eventListeners;
    }
  },[innerRef, setInteractive])

  useEffect(() => {
    if (interactive) {
      setActiveSheet(innerRef.current.workbook.activeSheet);
    }
  }, [interactive, innerRef, setActiveSheet])


  return (
    <ContextMenu>
      <ContextMenuTrigger >
        <tableau-viz
          ref={innerRef}
          id="tableauViz"
          src={src}
          token={!isPublic ? jwt : null}
          height={`${height}px`}
          width={`${width}px`}
          device={device}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          class='flex justify-center items-center rounded'
          data-viz={id}
        />
      </ContextMenuTrigger>
      <VizContextMenu/>
    </ContextMenu>
  )
})

const handleVizEventListeners = (viz, setInteractive) => {
  // define named handlers to simplify handling after effects
  const handleInteractive = async (event) => {
    // tabScale.initialize(); // initializing tabScale
    setInteractive(true); // update state to indicate that the Tableau viz is interactive
  }
  const handleVizLoadError = async (event) => {
    console.error('vizloaderror', event);
  }

   // event listeners can only be added after component mounts
  viz.addEventListener('firstinteractive', handleInteractive);
  viz.addEventListener('vizloaderror', handleVizLoadError);

  // cleanup after effects
  return () => {
    viz.removeEventListener('firstinteractive', handleInteractive);
    viz.removeEventListener('vizloaderror', handleVizLoadError);
  }
}

// tailwind CSS breakpoints used by the app
// https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints
// const breakpoints = {
//   'xs': '< 640px',
//   'sm': '640px',
//   'md': '768px',
//   'lg': '1204px',
//   'xl': '1280px',
//   '2xl': '> 1536px',
// }

// sample layouts prop
// const breakpoints = {
//   'xs': { 'device': 'phone', 'width': 360, 'height': 420 },
//   'sm': { 'device': 'tablet', 'width': 640, 'height': 420 },
//   'md': { 'device': 'tablet', 'width': 768, 'height': 540 },
//   'lg': { 'device': 'tablet', 'width': 1200, 'height': 700 },
//   'xl': { 'device': 'desktop', 'width': 1260, 'height': 700 },
//   '2xl': { 'device': 'desktop', 'width': 1530, 'height': 800},
// }

// DRY example of react-responsive hooks was the chosen pattern
// https://github.com/yocontra/react-responsive?tab=readme-ov-file#easy-mode
