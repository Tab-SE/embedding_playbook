// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';
import { useEffect, useState, useRef, forwardRef, useId } from 'react';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "components/ui";
import { TableauToolbar } from "../Toolbar/TableauToolbar"


// handles post authentication logic requiring an initialized <tableau-viz> object to operate
export const TableauViz = forwardRef(function Viz(props, ref) {
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
    <ContextMenu>
      <ContextMenuTrigger >
      <TableauToolbar src={src} ref={innerRef} />

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
          class='flex justify-center items-center rounded'
          data-viz={id}
        />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Bookmarks Bar
          <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
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
