// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';
import { forwardRef } from 'react';

import { useTableauSession } from 'hooks';
import { TableauViz, TableauWebAuthor, AuthoringModal } from 'components';

// forwardRef HOC receives ref from parent and sets placeholder
export const TableauEmbed = forwardRef(function TableauViz(props, ref) {
  const { src, height, width, device, hideTabs, toolbar, isPublic, WebEdit } = props;

  // size of parent div placeholder
  let containerHeight = height;
  let containerWidth = width;
  if (toolbar === 'hidden') {
    containerHeight = height;
  }
  const containerStyle = {
    height: containerHeight + 'px',
    width: containerWidth + 'px',
  };

  return (
    <div
      className='rounded'
      style={containerStyle}
    >
      <AuthLayer
        src={src}
        ref={ref}
        height={height}
        width={width}
        device={device}
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        isPublic={isPublic}
        WebEdit={WebEdit}
      />
    </div>
  )
});

// handles rendering logic during authentication
const AuthLayer = forwardRef(function AuthLayer(props, ref) {
  const { src, height, width, device, hideTabs, toolbar, isPublic, WebEdit } = props;

  // tanstack query hook to manage embed sessions
  const {
    status,
    data: jwt,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession('a');

  if (isSessionError) {
    console.debug(sessionError);
  }

  if (isSessionSuccess) {
  }

  return (
    <div className='rounded'>
      {isSessionError ? <p>Authentication Error!</p> : null}
      {isSessionLoading ? <p>Authenticating the User...</p> : null}
      {isSessionSuccess ? !WebEdit ?
        <TableauViz
          src={src}
          ref={ref}
          jwt={jwt}
          height={height}
          width={width}
          device={device}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          isPublic={isPublic}
        /> :
        <TableauWebAuthor
          src={src}
          height={height}
          width={width}
          ref={ref}
          jwt={jwt}
          isPublic={isPublic}
        />
        : null}
    </div>
  )
})
