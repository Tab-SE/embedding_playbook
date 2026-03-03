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
    layouts,
    id
  } = props;

  let embed_token;

  // tanstack query hook to safely represent users on the client
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  if (isSessionError) {
    console.debug('Tableau Auth Error:', sessionError);
  }

  if (isSessionSuccess) {
    embed_token = user.embed_token;
  }
  console.log("token", embed_token)
  const jwtDecodeUrl = `https://jwt.io/#debugger-io?token=${embed_token}`;
  console.log('🔗 Link to decode JWT (Ctrl/Cmd+Click to open):');
  console.log(jwtDecodeUrl);
  console.log('💡 TIP: Type openJWT() in console to open in new tab');
  // Add helper function to window for easy access
  if (typeof window !== 'undefined') {
    window.openJWT = () => window.open(jwtDecodeUrl, '_blank');
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
