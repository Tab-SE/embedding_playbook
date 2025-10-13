"use client";
import { forwardRef, useRef } from 'react';

import { TableauAuth } from 'components';

// forwardRef HOC receives ref from parent and sets placeholder
export const TableauEmbed = forwardRef(function TableauEmbed(props, ref) {
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
    id
  } = props;

  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;

  return (
    <div className={className}>
      <TableauAuth
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
        id={id}
      />
    </div>
  )
});
