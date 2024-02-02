// eslint-disable-next-line no-unused-vars
import { tab_embed } from '../libs';
import { useEffect, useState, useRef, forwardRef } from 'react';

// forwardRef HOC receives ref from parent
export const TableauViz = forwardRef(function TableauViz(props, ref) {
  const { src, height, width, device, hideTabs, id } = props;
  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // prevents viz from initializing on node backends, only clients are supported
  const [isMounted, setisMounted] = useState(false);
  // stores state from 'firstinteractive'
  const [interactive, setInteractive] = useState(false);

  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;

  
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
    }

    // cleanup after effects
    return () => {
      if (viz && isMounted) {
        viz.removeEventListener('firstinteractive', async (event) => {
          setInteractive(false);
        });
      }
      setisMounted(false);
    }
  }, [ref, isMounted, setisMounted, interactive, setInteractive]);

  return (
    <>
      {isMounted ? 
        <tableau-viz 
          ref={innerRef}
          id="tableauViz"       
          src={src}
          height={height}
          width={width}
          device={device}
          hide-tabs={hideTabs ? true : false}
          class='my-3 mx-6'
          data-viz={id}
        />  : <></>}
    </>
  )
});
