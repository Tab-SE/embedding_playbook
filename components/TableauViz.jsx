// eslint-disable-next-line no-unused-vars
import { tab_embed } from '../libs';
import { useEffect, useState, useRef, forwardRef, useId } from 'react';
import { useTableauSession } from '../hooks';

// forwardRef HOC receives ref from parent
export const TableauViz = forwardRef(function TableauViz(props, ref) {
  const { src, height, width, device, hideTabs, toolbar } = props;
  const containerSize = `h-[${height}px] w-[${width+10}px]`;
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

  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useTableauSession('a');
  
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

  console.log('hideTabs', hideTabs);

  return (
    <div className={containerSize} >
      {isMounted ? 
        <tableau-viz 
          ref={innerRef}
          id="tableauViz"       
          src={src}
          token={data}
          height={`${height}px`}
          width={`${width}px`}
          device={device}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          class='my-3 mx-5'
          data-viz={id}
        />  : <></>}
    </div >
  )
});
