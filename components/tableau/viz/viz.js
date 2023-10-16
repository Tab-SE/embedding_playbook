import { useEffect, useState, useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import tab_embed from '../api/embed_api'

function Viz(props) {
  const vizRef = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const [isClient, setIsClient] = useState(false); // can elevate load state to other components
  const [jwt, setJWT] = useState(''); // not yet in use, just referenced

  useEffect(() => {
    handleIsClient();
    handleVizObj();
    handleFirstInteractive();
  }, [props.vizObj, isClient]);


  const handleIsClient = () => {
    // sets isClient to true once per component mount
    // sets it to isClient upon unmount with return statement
    setIsClient(true);
    return () => {
      setIsClient(false);
    };
  };

  const handleVizObj = () => {
    // if the component has mounted and there is a valid viz object
  // then set vizRef to the viz object. State is  nullified on unmount
    if (isClient && !props.vizObj) {
      props.setVizObj(vizRef.current);
    }
    return () => {
      if (props.vizObj) {
        props.setVizObj(null);
      }
    };
  };

  const handleFirstInteractive = () => {
    if (props.vizObj) { // if state has an initialized Tableau viz
      props.vizObj.addEventListener('firstinteractive', async (event) => { // add the custom event listener to <tableau-viz>
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
        />  : <></>
      }
    </>
  );
};

export default Viz;
