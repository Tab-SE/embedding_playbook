// eslint-disable-next-line no-unused-vars
import tab_embed from '../../embed_api/embed_api'
import { useEffect, useState, useRef } from 'react'
import TabScale from 'tabscale';


function Viz(props) {
  const vizRef = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const [isClient, setIsClient] = useState(false); // can elevate load state to other components
  const [jwt, setJWT] = useState(''); // not yet in use, just referenced
  let tabScale;

  useEffect(() => {
    handleIsClient();
  }, [props.vizObj, isClient]);


  const handleIsClient = () => {
    // sets isClient to true once per component mount
    setIsClient(true);
    handleVizObj();
    // sets it to isClient upon unmount with return statement
    return () => {
      setIsClient(false);
    };
  };

  const handleVizObj = () => {
    // if the component has mounted and there is a valid viz object
    // then set vizRef to the viz object. State is  nullified on unmount
    if (isClient && !props.vizObj) {
      // passing the viz DOM element to tabScale https://gitlab.com/jhegele/tabscale
      tabScale = new TabScale.Scale(vizRef.current);
      props.setVizObj(vizRef.current);
      handleFirstInteractive();
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
    if (props.vizObj && isClient) { // if state has an initialized Tableau viz
      props.vizObj.addEventListener('firstinteractive', async (event) => { // add the custom event listener to <tableau-viz>
        tabScale.initialize(); // initializing tabScale
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
      {isClient ? 
        <tableau-viz 
          ref={vizRef}
          id="tableauViz"       
          src={props.vizUrl}
          height={props.height}
          width={props.width}
          device={props.device}
          hide-tabs={props.hideTabs ? true : false}
          token={jwt}
          class='my-3'
        />  : <></>
      }
    </>
  );
};

export default Viz;
