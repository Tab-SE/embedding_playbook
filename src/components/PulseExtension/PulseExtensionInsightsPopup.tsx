'use client';
// eslint-disable-next-line no-unused-vars
import { useEffect, useState, useRef, forwardRef, useContext, useCallback } from 'react';

import { ExtensionDataContext } from '../Providers/ExtensionDataProvider';
import { InsightsOnlyPopup } from '../Insights';
import { useSession } from 'next-auth/react';

export const PulseExtensionInsightsPopup
 = function Extension(props: any, ref) {
  const { metricId } = props;
  const { status: session_status, data: session_data } = useSession();
  const { contextData, updateContextData } = useContext(ExtensionDataContext);

  return (
    <div>
      {contextData.debug === 'true' && (
        <div>
          pulseExtension.jsx
          <br />
          ------------------
          <br />

          <br />
           session status: {JSON.stringify(session_status)}
          <br />
          session data: {JSON.stringify(session_data)}
          <br />
          contextData: Too big to display. {/* {JSON.stringify(contextData, null, 2)}
          */}

        </div>
      )}
      <InsightsOnlyPopup  metricId={metricId} />
      {contextData.debug === 'true' && (
        <div>
          End pulseExtension.jsx
          <br />
          ----------------------
        </div>
      )}
    </div>
  );
};
