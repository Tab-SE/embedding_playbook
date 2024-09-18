"use client";

// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';
import { forwardRef, useRef } from 'react';

import { useTableauSession } from 'hooks';
import { TableauViz, TableauWebAuthor } from 'components';

// forwardRef HOC receives ref from parent and sets placeholder
export const TableauEmbed = forwardRef(function TableauEmbed(props, ref) {
  const {
    src,
    height,
    width,
    hideTabs,
    toolbar,
    isPublic,
    WebEdit = false,
    customToolbar = true,
    layouts
  } = props;

  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;

  return (
    <div>
      <AuthLayer
        src={src}
        ref={innerRef}
        height={height}
        width={width}
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        isPublic={isPublic}
        WebEdit={WebEdit}
        customToolbar={customToolbar}
        layouts={layouts}
      />
    </div>
  )
});

// handles rendering logic during authentication
const AuthLayer = forwardRef(function AuthLayer(props, ref) {
  const {
    src,
    height,
    width,
    hideTabs,
    toolbar,
    isPublic,
    WebEdit,
    customToolbar,
    layouts
  } = props;

  let embed_token;

  // tanstack query hook to manage embed sessions
  const {
    status,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession('a');

  if (isSessionError) {
    console.debug(sessionError);
  }

  if (isSessionSuccess) {
    embed_token = user.embed_token;
  }

  return (
    <div className='rounded' >
      {isSessionError ? <p>Authentication Error!</p> : null}
      {isSessionLoading ? <p>Authenticating the User...</p> : null}
      {isSessionSuccess ? !WebEdit ?
        <TableauViz
          src={src}
          ref={ref}
          jwt={embed_token}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          isPublic={isPublic}
          customToolbar={customToolbar}
          layouts={layouts}
        /> :
        <TableauWebAuthor
          src={src}
          ref={ref}
          jwt={embed_token}
          height={height}
          width={width}
          isPublic={isPublic}
        />
        : null}
    </div>
  )
})
