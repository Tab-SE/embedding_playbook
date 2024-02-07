// eslint-disable-next-line no-unused-vars
import { tab_embed } from '../libs';
import { useEffect, useState, useRef, forwardRef, useId } from 'react';
import { useTableauSession } from '../hooks';

// forwardRef HOC receives ref from parent
export const TableauViz = forwardRef(function TableauViz(props, ref) {
  const { src, height, width, device, hideTabs, toolbar, isPublic } = props;
  // creates a unique identifier for the embed
  const id = `id-${useId()}`; 
  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;
  // prevents viz from initializing on node backends, only clients are supported
  const [isMounted, setisMounted] = useState(false);
  // most viz interactions must wait until interactive
  const [interactive, setInteractive] = useState(false);
  // the target of most viz interactions
  const [activeSheet, setActiveSheet] = useState(null);
  // tanstack query hook to manage embed sessions
  const { status, data, error, isSuccess, isError, isLoading } = useTableauSession('a');
  // size of parent div placeholder
  let containerHeight = height+30;
  let containerWidth = width+10;
  if (toolbar === 'hidden') {
    containerHeight = height;
    containerWidth = width+10;
  }
  
  // handles event listeners upon mount
  useEffect(() => {
    setisMounted(true);
    // using ref forwarded from parent
    const viz = innerRef.current;
    // only runs if there is a mounted viz with interactive state
    if (viz && isMounted) {
      // apply a few inline styles to new iframe
      const iframe = viz.shadowRoot.querySelector('iframe');
      iframe.style.margin = "auto";
      // const tabScale = new TabScale.Scale(viz); // passing the viz DOM element to tabScale https://gitlab.com/jhegele/tabscale
      
      viz.addEventListener('firstinteractive', async (event) => { // add the custom event listener to <tableau-viz>
        // tabScale.initialize(); // initializing tabScale
        setInteractive(true); // update state to indicate that the Tableau viz is interactive
      });

      // after viz initialization, the 'firstinteractive' event fires and sets state in the component
      if (interactive) {
        setActiveSheet(viz.workbook.activeSheet);
      }
    }

    // cleanup after effects
    return () => {
      setisMounted(false);
      if (viz && isMounted) {
        viz.removeEventListener('firstinteractive', async (event) => {
          setInteractive(false);
        });
      }
    }
  }, [innerRef, isMounted, setisMounted, interactive, setInteractive]);

  if (isError) {
    console.debug(error);
    return (<div className={`h-${containerHeight}px w-${containerWidth}px mx-auto`}></div>)
  }

  if (isLoading) {
    return (<div className={`h-${containerHeight}px w-${containerWidth}px mx-auto`}></div>)
  }

  if (isSuccess) {
    return (
      <div className={`flex items-center justify-center h-${containerHeight}px w-${containerWidth}px mx-auto`} >
        {isMounted && data ? 
          <tableau-viz 
            ref={innerRef}
            id="tableauViz"       
            src={src}
            token={!isPublic ? data : null}
            height={`${height}px`}
            width={`${width}px`}
            device={device}
            hide-tabs={hideTabs ? true : false}
            toolbar={toolbar}
            class='my-3 mx-auto'
            data-viz={id}
          />  : <></>}
      </div >
    )
  }
});
