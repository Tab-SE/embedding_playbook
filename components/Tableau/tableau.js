import { useState, useId, useRef, forwardRef } from 'react'
import View from './components/view'
import Model from './components/model'

// HOC following MVC pattern: https://medium.com/swlh/elements-of-mvc-in-react-9382de427c09, forwardRef HOC receives ref from parent
const Tableau = forwardRef(function Tableau(props) {
  const vizRef = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const [vizObj, setVizObj] = useState(null);
  const [localInteractive, setLocalInteractive] = useState(false);
  const id = `tableau-viz-${useId()}`; // creates a unique identifier for the embed
  const hideTabs = props.hideTabs === 'true' ? true : false; // converts to boolean saving default to false

  return (
    <View
      vizObj={props.vizObj ? props.vizObj : vizObj}
      setVizObj={props.setVizObj ? props.setVizObj : setVizObj}
      interactive={props.interactive ? props.interactive : localInteractive}
      setInteractive={props.setInteractive ? props.setInteractive : setLocalInteractive}
      ref={props.ref ? props.ref : vizRef}
      id={id}
      src={props.src}
      height={props.height}
      width={props.width}
      device={props.device}
      hideTabs={hideTabs}
      toolbar={props.toolbar}
    />
  );
});

export default Tableau;
