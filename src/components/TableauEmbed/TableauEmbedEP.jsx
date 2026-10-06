"use client";
import { forwardRef, useRef } from 'react';

import { TableauAuthEP } from './TableauAuthEP';

export const TableauEmbedEP = forwardRef(function TableauEmbedEP(props, ref) {
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

  const localRef = useRef(null);
  const innerRef = ref || localRef;

  return (
    <div className={className}>
      <TableauAuthEP
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
