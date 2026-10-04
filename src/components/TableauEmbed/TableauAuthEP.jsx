"use client";

import { forwardRef } from 'react';

import { useTableauSessionEP } from 'hooks';
import { TableauViz, TableauWebAuthor } from 'components';

export const TableauAuthEP = forwardRef(function AuthLayerEP(props, ref) {
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

  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSessionEP();

  if (isSessionError) {
    console.debug('Tableau EP Auth Error:', sessionError);
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
      {isSessionSuccess && !user ? <p>EP authentication not available. Please ensure EP credentials are configured.</p> : null}
      {isSessionSuccess && user && !embed_token ? <p>EP embed token not available.</p> : null}
    </div>
  )
})
