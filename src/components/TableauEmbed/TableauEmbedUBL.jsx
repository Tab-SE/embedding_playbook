"use client";
import { forwardRef, useRef } from 'react';

import { TableauAuthUBL } from './TableauAuthUBL';

// forwardRef HOC receives ref from parent and sets placeholder for UBL server
export const TableauEmbedUBL = forwardRef(function TableauEmbedUBL(props, ref) {
  const {
    src,
    className,
    height,
    width,
    hideTabs,
    toolbar,
    isPublic,
    WebEdit = false,
    customToolbar = true,
    layouts,
    id
  } = props;

  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;

  return (
    <div className={className}>
      <TableauAuthUBL
        src={src}
        ref={innerRef}
        className={className}
        height={height}
        width={width}
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        isPublic={isPublic}
        WebEdit={WebEdit}
        customToolbar={customToolbar}
        layouts={layouts}
        id={id}
      />
    </div>
  )
});
