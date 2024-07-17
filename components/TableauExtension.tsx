// eslint-disable-next-line no-unused-vars
import { tab_extension } from '../libs';
import { forwardRef, useContext, useState, useEffect, useDebugValue } from 'react';
import { Metrics } from '../components';
import { InsightsOnly } from '../components';
import { useTableauSession } from '../hooks';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { getEmbed, tabSignOut } from '../libs';
import { ExtensionDataContext } from '../components/ExtensionDataProvider';

// forwardRef HOC receives ref from parent and sets placeholder
export const TableauExtension = forwardRef(function TableauViz(props: any, ref) {
  const {
    src,
    height,
    width,
    device,
    hideTabs,
    toolbar,
    isPublic,
    tableauUrl,
    siteName,
    userName,
    caClientId,
    caSecretId,
    caSecretValue,
    showMetrics = true,
    showInsights = true,
    isDashboardExtension,
  } = props;
  const { contextData, updateContextData } = useContext(ExtensionDataContext);

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
    <div className="rounded" style={containerStyle}>
      {contextData.debug === 'true' && (
        <div>
          TableauExtension
          <br></br>
          ----------------
          <br />
          {JSON.stringify(props)}
          <br />
          {/* tableauUrl: {tableauUrl}   */}
        </div>
      )}
      <AuthLayer
        src={src}
        ref={ref}
        height={height}
        width={width}
        device={device}
        hide-tabs={hideTabs ? true : false}
        toolbar={toolbar}
        isPublic={isPublic}
        tableauUrl={tableauUrl}
        siteName={siteName}
        userName={userName}
        caClientId={caClientId}
        caSecretId={caSecretId}
        caSecretValue={caSecretValue}
        showMetrics={showMetrics}
        showInsights={showInsights}
        isDashboardExtension={isDashboardExtension}
      />
      {contextData.debug === 'true' ? (
        <div>
          End TableauExtension
          <br></br>
          --------------------
        </div>
      ) : null}
    </div>
  );
});

// handles rendering logic during authentication
const AuthLayer = forwardRef(function AuthLayer(props: any, ref) {
  const {
    userName,
    tableauUrl,
    siteName,
    caClientId,
    caSecretId,
    caSecretValue,
    showMetrics,
    showInsights,
  } = props;
  const { contextData } = useContext(ExtensionDataContext);

  let loginData = {
    userName,
    tableauUrl,
    siteName,
    caClientId,
    caSecretId,
    caSecretValue,
    isDashboardExtension: props.isDashboardExtension,
  };

  const {
    status,
    data: jwt,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading,
  } = useTableauSession(userName, loginData);

  return (
    <div className="rounded">
      {contextData.debug === 'true' && (
        <div>
          TableauExtension.jsx Authlayer
          <br />
          ------------------------------
          <br />
          props: {JSON.stringify(props)}
          <br />
          jwt: {jwt}
          <br />
          isSessionError={isSessionError ? 'true' : 'false'}
          <br />
          isSessionLoading={isSessionLoading ? 'true' : 'false'}
          <br />
          isSessionSuccess={isSessionSuccess ? 'true' : 'false'}
          <br />
          {isSessionSuccess && 'Authenticated!'}
        </div>
      )}
      {isSessionError && <p>Authentication Error: {sessionError.message}</p>}
      {isSessionLoading && <p>Authenticating the User...</p>}
      {isSessionSuccess && contextData.companionMode !== 'target' && (
        <Metrics showMetrics={showMetrics} showInsights={showInsights} />
      )}
      {isSessionSuccess && contextData.companionMode === 'target' && <InsightsOnly />}
      {contextData.debug === 'true' && (
        <div>
          <br />
          End TableauExtension.jsx Authlayer
          <br />
          ------------------------------
        </div>
      )}
    </div>
  );
});