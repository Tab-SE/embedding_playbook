"use client";

import { useEffect, useState, useRef, forwardRef, useId } from 'react';

// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';

import { TableauToolbar, XSLayout, SMLayout, MDLayout, LGLayout, XLLayout, XL2Layout } from 'components';


// handles post authentication logic requiring an initialized <tableau-viz> object to operate
export const TableauViz = forwardRef(function Viz(props, ref) {
  const {
    src,
    jwt,
    hideTabs,
    toolbar,
    isPublic,
    customToolbar,
    layouts
  } = props;
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
    <div>
      <XSLayout>
        <div
          style={{
            height: layouts.xs.height + 60,
            width: layouts.xs.width,
          }}
        >
          {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
          <tableau-viz
            ref={innerRef}
            id="tableauViz"
            src={src}
            token={!isPublic ? jwt : null}
            height={`${layouts.xs.height}px`}
            width={`${layouts.xs.width}px`}
            device={layouts.xs.device}
            hide-tabs={hideTabs ? true : false}
            toolbar={toolbar}
            class='flex justify-center items-center rounded'
            data-viz={id}
          />
        </div>
      </XSLayout>

      <SMLayout>
        <div
          style={{
            height: layouts.sm.height + 60,
            width: layouts.sm.width,
          }}
        >
          {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
          <tableau-viz
            ref={innerRef}
            id="tableauViz"
            src={src}
            token={!isPublic ? jwt : null}
            height={`${layouts.sm.height}px`}
            width={`${layouts.sm.width}px`}
            device={layouts.sm.device}
            hide-tabs={hideTabs ? true : false}
            toolbar={toolbar}
            class='flex justify-center items-center rounded'
            data-viz={id}
          />
        </div>
      </SMLayout>

      <MDLayout>
        <div
          style={{
            height: layouts.md.height + 60,
            width: layouts.md.width,
          }}
        >
          {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
          <tableau-viz
            ref={innerRef}
            id="tableauViz"
            src={src}
            token={!isPublic ? jwt : null}
            height={`${layouts.md.height}px`}
            width={`${layouts.md.width}px`}
            device={layouts.md.device}
            hide-tabs={hideTabs ? true : false}
            toolbar={toolbar}
            class='flex justify-center items-center rounded'
            data-viz={id}
          />
        </div>
      </MDLayout>

      <LGLayout>
        <div
          style={{
            height: layouts.lg.height + 60,
            width: layouts.lg.width,
          }}
        >
          {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
          <tableau-viz
            ref={innerRef}
            id="tableauViz"
            src={src}
            token={!isPublic ? jwt : null}
            height={`${layouts.lg.height}px`}
            width={`${layouts.lg.width}px`}
            device={layouts.lg.device}
            hide-tabs={hideTabs ? true : false}
            toolbar={toolbar}
            class='flex justify-center items-center rounded'
            data-viz={id}
          />
        </div>
      </LGLayout>

      <XLLayout>
        <div
          style={{
            height: layouts.xl.height + 60,
            width: layouts.xl.width,
          }}
        >
          {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
          <tableau-viz
            ref={innerRef}
            id="tableauViz"
            src={src}
            token={!isPublic ? jwt : null}
            height={`${layouts.xl.height}px`}
            width={`${layouts.xl.width}px`}
            device={layouts.xl.device}
            hide-tabs={hideTabs ? true : false}
            toolbar={toolbar}
            class='flex justify-center items-center rounded'
            data-viz={id}
          />
        </div>
      </XLLayout>

      <XL2Layout>
        <div
          style={{
            height: layouts.xl2.height + 60,
            width: layouts.xl2.width,
          }}
        >
          {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
          <tableau-viz
            ref={innerRef}
            id="tableauViz"
            src={src}
            token={!isPublic ? jwt : null}
            height={`${layouts.xl2.height}px`}
            width={`${layouts.xl2.width}px`}
            device={layouts.xl2.device}
            hide-tabs={hideTabs ? true : false}
            toolbar={toolbar}
            class='flex justify-center items-center rounded'
            data-viz={id}
          />
        </div>
      </XL2Layout>

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
