"use client";

import { useState, useRef, forwardRef, useId } from 'react';

// handles post authentication logic requiring an initialized <tableau-authoring-viz> object to operate
// tableau-authoring-viz requires /authoring/ path, not /views/.
const toAuthoringSrc = (src) => src?.replace('/views/', '/authoring/') ?? src;

export const TableauWebAuthor = forwardRef(function Viz(props, ref) {
  const { src, jwt, height, width, isPublic } = props;
  const authoringSrc = toAuthoringSrc(src);
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
      src={authoringSrc}
      token={!isPublic ? jwt : null}
      class='rounded flex items-center justify-center'
      data-viz={id}
      hide-edit-in-desktop-button={true}
    />
  )
})
