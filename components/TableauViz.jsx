// eslint-disable-next-line no-unused-vars
import { tab_embed } from '../libs';
import { useEffect, useState, useRef, forwardRef, useId } from 'react';
import { useTableauSession } from '../hooks';

// forwardRef HOC receives ref from parent and sets placeholder
export const TableauViz = forwardRef(function TableauViz(props, ref) {
  const { src, height, width, device, hideTabs, toolbar, isPublic } = props; 

  // size of parent div placeholder
  let containerHeight = height;
  let containerWidth = width;
  if (toolbar === 'hidden') {
    containerHeight = height;
  }
  const containerStyle = {
    height: containerHeight + 'px',
    width: containerWidth + 'px',
  };

  return (
    <div
      className='rounded' 
      style={containerStyle}
    >
      <AuthLayer 
        src={src}
        ref={ref}
        height={height}
        width={width}
        device={device}
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        isPublic={isPublic}
      />
    </div>
  )
});

// handles rendering logic during authentication
const AuthLayer = forwardRef(function AuthLayer(props, ref) {
  const { src, height, width, device, hideTabs, toolbar, isPublic } = props;
  let jwt = null;

  // tanstack query hook to manage embed sessions
  const { 
    status, 
    data: token, 
    error: sessionError, 
    isSuccess: isSessionSuccess, 
    isError: isSessionError, 
    isLoading: isSessionLoading 
  } = useTableauSession('a');

  if (isSessionError) {
    console.debug(sessionError);
  }

  if (isSessionSuccess) {

  }

  return (
    <div className='rounded'>
      {isSessionError ? <p>Authentication Error!</p> : null}
      {isSessionLoading ? <p>Authenticating the User...</p> : null}
      {isSessionSuccess ? 
        <Viz  
          src={src}
          ref={ref}
          jwt={jwt}
          height={height}
          width={width}
          device={device}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          isPublic={isPublic}
          class=''
        /> : null}
    </div>
  )
})

// handles post authentication logic requiring an initialized <tableau-viz> object to operate
const Viz = forwardRef(function Viz(props, ref) {
  const { src, jwt, height, width, device, hideTabs, toolbar, isPublic } = props;
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
    <tableau-viz 
      ref={innerRef}
      id="tableauViz"       
      src={src}
      token={!isPublic ? jwt : null}
      height={`${height}px`}
      width={`${width}px`}
      device={device}
      hide-tabs={hideTabs ? true : false}
      toolbar={toolbar}
      class='rounded'
      data-viz={id}
    />
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
