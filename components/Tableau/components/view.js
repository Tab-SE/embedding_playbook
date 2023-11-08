// eslint-disable-next-line no-unused-vars
import tab_embed from '../../embed_api/embed_api'
import { useEffect, useState, forwardRef } from 'react'
import TabScale from 'tabscale'

// forwardRef HOC receives ref from parent
const Viz = forwardRef(function Viz(props, ref) {
  const [isMounted, setisMounted] = useState(false); // prevents viz from initializing on node backends, only clients are supported
  let tabScale;

  useEffect(() => {
    setisMounted(true);
    handleVizObj();
    const viz = ref.current;
    if (viz) {
      tabScale = new TabScale.Scale(viz); // passing the viz DOM element to tabScale https://gitlab.com/jhegele/tabscale
      // tabScale.initialize(); // initializing tabScale
      viz.addEventListener('firstinteractive', async (event) => { // add the custom event listener to <tableau-viz>
        props.setInteractive(true); // update state to indicate that the Tableau viz is interactive
      });
    }

    // cleanup after effects
    return () => {
      if (viz) {
        viz.removeEventListener('firstinteractive', async (event) => {
          tabScale = undefined;
          props.setInteractive(false);
        });
      }
      setisMounted(false);
    }
  }, [ref, isMounted]);

  const handleVizObj = () => {
    // if the component has mounted and there is a valid viz object
    // then set vizRef to the viz object. State is  nullified on unmount
    if (ref) {
      props.setVizObj(ref.current);
    }
  };

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
          class='my-3'
          data-viz={props.id}
        />  : <></>}
    </>
  );
});

export default Viz;
