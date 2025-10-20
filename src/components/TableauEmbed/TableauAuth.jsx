"use client";

import { forwardRef } from 'react';

import { useTableauSession } from 'hooks';
import { TableauViz, TableauWebAuthor } from 'components';

// handles rendering logic during authentication
export const TableauAuth = forwardRef(function AuthLayer(props, ref) {
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
    id
  } = props;

  let embed_token;

  // Check if this is a public.tableau.com URL that doesn't need authentication
  const isPublicTableauUrl = src && src.includes('public.tableau.com');

  // tanstack query hook to safely represent users on the client
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  if (isSessionSuccess) {
    embed_token = user.embed_token;
  }

  // Check if Mike is logged in
  const isMikeLoggedIn = isSessionSuccess && user?.email === 'jchen@superstore.com';

  // For public URLs, render immediately without authentication
  if (isPublicTableauUrl) {
    return (
      <div>
      <TableauViz
        src={src}
        ref={ref}
        className={className}
        jwt={null}
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        isPublic={isPublic}
        customToolbar={customToolbar && !isMikeLoggedIn}
        height={height}
        width={width}
        id={id}
      />
      </div>
    );
  }

  return (
    <div>
      {isSessionError ? <p>Authentication Error!</p> : null}
      {isSessionLoading ? <p>Authenticating the User...</p> : null}
      {isSessionSuccess ? !WebEdit ?
      <TableauViz
        src={src}
        ref={ref}
        className={className}
        jwt={embed_token}
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        isPublic={isPublic}
        customToolbar={customToolbar && !isMikeLoggedIn}
        height={height}
        width={width}
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
    </div>
  )
})
