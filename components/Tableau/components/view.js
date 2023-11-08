// eslint-disable-next-line no-unused-vars
import tab_embed from '../../embed_api/embed_api'
import { useEffect, useState, forwardRef } from 'react'
import TabScale from 'tabscale'

// forwardRef HOC receives ref from parent
const Viz = forwardRef(function Viz(props, ref) {
  const [isMounted, setisMounted] = useState(false); // prevents viz from initializing on node backends rather than clients
  let tabScale;

  useEffect(() => {
    handleisMounted();
    handleVizObj();
    handleFirstInteractive();
    
    return () => {
      handleisMounted();
      handleVizObj();
      handleFirstInteractive();
    }
  }, [props.vizObj, isMounted]);

  useEffect(() => {
    if (props.interactive) {
      console.log('interactive', props.interactive);
    }
  }, [props.interactive]);


  const handleisMounted = () => {
    // sets isMounted to true once per component mount
    setisMounted(true);
    // sets it to isMounted upon unmount with return statement
    return () => {
      setisMounted(false);
    };
  };

  const handleVizObj = () => {
    // if the component has mounted and there is a valid viz object
    // then set vizRef to the viz object. State is  nullified on unmount
    if (isMounted && !props.vizObj) {
      console.log('ref', ref);
      props.setVizObj(ref.current);
    }
    return () => {
      if (props.vizObj) {
        // when component unmounts reset viz objectss
        props.setVizObj(null);
        tabScale = undefined;
      }
    };
  };

  const handleFirstInteractive = () => {
    // passing the viz DOM element to tabScale https://gitlab.com/jhegele/tabscale
    if (!tabScale && isMounted && props.vizObj) {
      tabScale = new TabScale.Scale(ref.current);
    }
    if (props.vizObj && isMounted) { // if state has an initialized Tableau viz
      console.log('props.vizObj', props.vizObj.data);
      props.vizObj.addEventListener('firstinteractive', async (event) => { // add the custom event listener to <tableau-viz>
        // tabScale.initialize(); // initializing tabScale
        props.setInteractive(true); // update state to indicate that the Tableau viz is interactive
      });

      // return function removes listener on unmount to avoid memory leaks
      return () => props.vizObj.removeEventListener('firstinteractive', async (event) => {
        props.setInteractive(false);
      });
    };
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
