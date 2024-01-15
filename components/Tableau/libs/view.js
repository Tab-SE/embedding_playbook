// eslint-disable-next-line no-unused-vars
import { tab_embed } from '../../../libs'
import { useEffect, useState, forwardRef } from 'react'
import TabScale from '../utils/tabscale'

// forwardRef HOC receives ref from parent
const Viz = forwardRef(function Viz(props, ref) {

  const { interactive, setInteractive } = props;

  const [isMounted, setisMounted] = useState(false); // prevents viz from initializing on node backends, only clients are supported

  useEffect(() => {
    setisMounted(true);

    const viz = ref.current;
    // only runs if there is a mounted viz with interactive state at initial value of false
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
      if (viz) {
        viz.removeEventListener('firstinteractive', async (event) => {
          setInteractive(false);
        });
      }
      setisMounted(false);
    }
  }, [ref, isMounted, interactive, setInteractive]);


  return (
    <>
      {isMounted ? 
        <tableau-viz 
          ref={ref}
          id="tableauViz"       
          src={props.src}
          height={props.height}
          width={props.width}
          device={props.device}
          hide-tabs={props.hideTabs ? true : false}
          class='my-3 mx-6'
          data-viz={props.id}
        />  : <></>}
    </>
  );
});

export default Viz;
