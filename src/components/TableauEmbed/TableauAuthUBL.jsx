"use client";

import { forwardRef } from 'react';

import { useTableauSessionUBL } from 'hooks';
import { TableauViz, TableauWebAuthor } from 'components';

// handles rendering logic during authentication for ubl server
// follows the same pattern as TableauAuth but uses ubl session
export const TableauAuthUBL = forwardRef(function AuthLayerUBL(props, ref) {
  const {
    src,
    className,
    height,
    width,
    hideTabs,
    toolbar,
    isPublic,
    WebEdit,
    customToolbar,
    layouts,
    id
  } = props;

  let embed_token;

  // tanstack query hook to safely represent users on the client for ubl
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSessionUBL();

  if (isSessionError) {
    console.debug('Tableau UBL Auth Error:', sessionError);
  }

  if (isSessionSuccess && user) {
    embed_token = user.embed_token;
  }

  return (
    <div>
      {isSessionError ? <p>Authentication Error!</p> : null}
      {isSessionLoading ? <p>Authenticating the User...</p> : null}
      {isSessionSuccess && user && embed_token ? !WebEdit ?
      <TableauViz
        src={src}
        ref={ref}
        className={className}
        jwt={embed_token}
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        isPublic={isPublic}
        customToolbar={customToolbar}
        layouts={layouts}
        id={id}
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
      {isSessionSuccess && !user ? <p>UBL authentication not available. Please ensure UBL credentials are configured.</p> : null}
      {isSessionSuccess && user && !embed_token ? <p>UBL embed token not available.</p> : null}
    </div>
  )
})
