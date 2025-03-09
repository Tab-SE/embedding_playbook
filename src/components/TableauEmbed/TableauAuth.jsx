"use client";

import { forwardRef, useContext } from 'react';

import { useTableauSession } from 'hooks';
import { AuthenticatedUserContext } from 'context';
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
    layouts
  } = props;

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthenticatedUserContext);
  const { user_id, demo } =  authenticatedUser;

  let embed_token;

  // tanstack query hook to manage embed sessions
  const {
    status,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession(user_id, demo);

  if (isSessionError) {
    console.debug('Tableau Auth Error:', sessionError);
  }

  if (isSessionSuccess) {
    embed_token = user.embed_token;
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
