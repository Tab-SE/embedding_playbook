// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';
import { forwardRef, useRef } from 'react';

import { useTableauSession } from 'hooks';
import { TableauViz, TableauWebAuthor, TableauToolbar } from 'components';

// forwardRef HOC receives ref from parent and sets placeholder
export const TableauEmbed = forwardRef(function TableauEmbed(props, ref) {
  const { src, height, width, device, hideTabs, toolbar, isPublic, WebEdit = false, customToolbar = true } = props;
  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;

  // size of parent div placeholder
  let containerHeight = height;
  if (!WebEdit) {
    containerHeight = containerHeight + 50;
  }
  let containerWidth = width;
  const containerStyle = {
    height: containerHeight,
    width: containerWidth,
  };

  return (
    <div
      style={containerStyle}
    >
      <AuthLayer
        src={src}
        ref={innerRef}
        height={height}
        width={width}
        device={device}
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        isPublic={isPublic}
        WebEdit={WebEdit}
        customToolbar={customToolbar}
        containerStyle={containerStyle}
      />
    </div>
  )
});

// handles rendering logic during authentication
const AuthLayer = forwardRef(function AuthLayer(props, ref) {
  const { src, height, width, device, hideTabs, toolbar, isPublic, WebEdit, customToolbar, containerStyle } = props;

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
    <div className='rounded' style={containerStyle} >
      {isSessionError ? <p>Authentication Error!</p> : null}
      {isSessionLoading ? <p>Authenticating the User...</p> : null}
      {isSessionSuccess ? customToolbar ? <TableauToolbar src={src} ref={ref} /> : null : null}
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
          ref={ref}
          jwt={jwt}
          height={height}
          width={width}
          isPublic={isPublic}
        />
        : null}
    </div>
  )
})
