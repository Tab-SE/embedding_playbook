'use client';
/*
  This file is only for testing the popup login.  Can be deleted.
*/

// eslint-disable-next-line no-unused-vars
import { tab_extension } from '../../libs';
import { useEffect, useState, useRef, forwardRef, useContext, useCallback } from 'react';
import { Button } from '../ui';
import { Demo, Metric } from '..';
import {
  Dashboard,
  Parameter,
  Worksheet,
  Filter,
  TableauEvent,
  CategoricalFilter,
  FilterChangedEvent,
} from '@tableau/extensions-api-types';

import { ExtensionDataContext } from 'components';
import { LoadMetricsOnly } from 'components';
import { useQueryClient } from '@tanstack/react-query';
import { useSession, getSession, signOut } from 'next-auth/react';
import { InsightsOnly } from '..';




export const PulseExtensionInsightsLogin
 = function Extension(props: any, ref) {

  console.log(`test`);

  const basePath = process.env.NEXT_PUBLIC_BASE_URL;
  const { status: session_status, data: session_data } = useSession();
  
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  let loginData = {
    tableauUrl: 'https://10az.online.tableau.com',
    site_id: 'rgdemosite',
    userName: 'rgoldin@salesforce.com',
    caClientId: '6b828aa5-dd31-4c35-9be9-fddf7e0b7933',
    caSecretId: 'd7949278-f28e-48cf-8313-765c17972961',
    caSecretValue: 'dwPRgqnLDAO4G5GOrgmnylkAK5ODXxKfS/hEhTyZtzA=',
    isDashboardExtension: 'true',
  }

  return (
    <div>
      {JSON.stringify(contextData, null, 2)}
      {contextData.debug === 'true' || true && (
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
        <LoadMetricsOnly
          loginData={loginData}
          metricCollection={contextData.metricCollection}
          setMetricCollection={updateContextData}
        />

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
