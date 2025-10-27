"use client";
import { useEffect, useState, useRef, forwardRef, useId } from 'react';

// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';

import { TableauToolbar, XSLayout, SMLayout, MDLayout, LGLayout, XLLayout, XL2Layout } from 'components';
import { getLayoutProps, parseClassNameForLayouts } from './vizUtils';


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
    id
  } = props;
  // creates a unique identifier for the embed if not provided
  const vizId = id || `id-${useId()}`;
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

  const layoutSpec = parseClassNameForLayouts(className, layouts);

  return (
    <div>
      <XSLayout>
        {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
        <tableau-viz
          ref={innerRef}
          id={vizId}
          src={src}
          token={!isPublic ? jwt : null}
          height={`${getLayoutProps(layoutSpec, 'xs').height}px`}
          width={`${getLayoutProps(layoutSpec, 'xs').width}px`}
          device={getLayoutProps(layoutSpec, 'xs').device}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          class='flex justify-center items-center rounded'
          data-viz={vizId}
        />
      </XSLayout>

      <SMLayout>
        {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
        <tableau-viz
          ref={innerRef}
          id="tableauViz"
          src={src}
          token={!isPublic ? jwt : null}
          height={`${getLayoutProps(layoutSpec, 'sm').height}px`}
          width={`${getLayoutProps(layoutSpec, 'sm').width}px`}
          device={getLayoutProps(layoutSpec, 'sm').device}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          class='flex justify-center items-center rounded'
          data-viz={vizId}
        />
      </SMLayout>

      <MDLayout>
        {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
        <tableau-viz
          ref={innerRef}
          id="tableauViz"
          src={src}
          token={!isPublic ? jwt : null}
          height={`${getLayoutProps(layoutSpec, 'md').height}px`}
          width={`${getLayoutProps(layoutSpec, 'md').width}px`}
          device={getLayoutProps(layoutSpec, 'md').device}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          class='flex justify-center items-center rounded'
          data-viz={vizId}
        />
      </MDLayout>

      <LGLayout>
        {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
        <tableau-viz
          ref={innerRef}
          id="tableauViz"
          src={src}
          token={!isPublic ? jwt : null}
          height={`${getLayoutProps(layoutSpec, 'lg').height}px`}
          width={`${getLayoutProps(layoutSpec, 'lg').width}px`}
          device={getLayoutProps(layoutSpec, 'lg').device}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          class='flex justify-center items-center rounded'
          data-viz={vizId}
        />
      </LGLayout>

      <XLLayout>
        {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
        <tableau-viz
          ref={innerRef}
          id="tableauViz"
          src={src}
          token={!isPublic ? jwt : null}
          height={`${getLayoutProps(layoutSpec, 'xl').height}px`}
          width={`${getLayoutProps(layoutSpec, 'xl').width}px`}
          device={getLayoutProps(layoutSpec, 'xl').device}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          class='flex justify-center items-center rounded'
          data-viz={vizId}
        />
      </XLLayout>

      <XL2Layout>
        {customToolbar ? <TableauToolbar src={src} ref={innerRef} /> : null}
        <tableau-viz
            ref={innerRef}
            id="tableauViz"
            src={src}
            token={!isPublic ? jwt : null}
            height={`${getLayoutProps(layoutSpec, 'xl2').height}px`}
            width={`${getLayoutProps(layoutSpec, 'xl2').width}px`}
            device={getLayoutProps(layoutSpec, 'xl2').device}
            hide-tabs={hideTabs ? true : false}
            toolbar={toolbar}
            class='flex justify-center items-center rounded'
            data-viz={id}
        />
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
