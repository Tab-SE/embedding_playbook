"use client";
import { useEffect, useState, useRef, forwardRef, useId } from 'react';

// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';

import { TableauToolbar } from 'components';


// handles post authentication logic requiring an initialized <tableau-viz> object to operate
export const TableauViz = forwardRef(function Viz(props, ref) {
  const {
    src,
    className,
    jwt,
    hideTabs,
    toolbar,
    isPublic,
    customToolbar,
    layouts,
    height,
    width,
    id: customId,
    demo = 'default'
  } = props;
  // creates a unique identifier for the embed
  const generatedId = `id-${useId()}`;
  const id = customId || generatedId;
  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;
  // most viz interactions must wait until interactive
  const [interactive, setInteractive] = useState(false);
  // the target of most viz interactions
  const [activeSheet, setActiveSheet] = useState(null);

  useEffect(() => {
    // Load the Tableau embedding library if not already loaded
    if (typeof window !== 'undefined' && !window.tableau) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (innerRef.current) {
      const viz = innerRef.current;
      // passing the viz DOM element to tabScale https://gitlab.com/jhegele/tabscale
      // const tabScale = new TabScale.Scale(innerRef.current);
      // apply a few inline styles to new iframe
      const iframe = viz.shadowRoot.querySelector('iframe');
      iframe.style.margin = "auto";
      iframe.style.position = "relative";

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
    <div>
      {customToolbar ? <TableauToolbar src={src} ref={innerRef} demo={demo} /> : null}
      <tableau-viz
        ref={innerRef}
        id={id}
        src={src}
        token={!isPublic ? jwt : null}
        height={height || "100%"}
        width={width || "100%"}
        device="desktop"
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        class={className}
        data-viz={id}
      />
    </div>
  )
})

const handleVizEventListeners = (viz, setInteractive) => {
  // define named handlers to simplify handling after effects
  const handleInteractive = async (event) => {
    // tabScale.initialize(); // initializing tabScale
    setInteractive(true); // update state to indicate that the Tableau viz is interactive
  }
  const handleVizLoadError = async (event) => {
    console.error('Viz Load Error:', event);
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
