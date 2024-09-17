"use client";

import { useState, useRef, forwardRef, useId } from 'react';

// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';


// handles post authentication logic requiring an initialized <tableau-authoring-viz> object to operate
export const TableauWebAuthor = forwardRef(function Viz(props, ref) {
  const { src, jwt, height, width, isPublic } = props;
  // creates a unique identifier for the embed
  const id = `id-${useId()}`;
  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;
  // most viz interactions must wait until interactive
  const [interactive, setInteractive] = useState(false);

  return (
    <tableau-authoring-viz
      ref={innerRef}
      id="tableauViz"
      width={width}
      height={height}
      src={src}
      token={!isPublic ? jwt : null}
      class='rounded flex items-center justify-center'
      data-viz={id}
      hide-edit-in-desktop-button={true}
    />
  )
})
