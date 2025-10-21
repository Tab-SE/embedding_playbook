"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTableauSession } from '@/hooks';
import { useMetadata } from '@/hooks';

// Custom hook for managing Tableau dashboards
export const useTableauDashboards = () => {

  const {
    status: sessionStatus,
    data: user,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  // REST API state
  const [restApiData, setRestApiData] = useState(null);
  const [restApiLoading, setRestApiLoading] = useState(false);
  const [restApiError, setRestApiError] = useState(null);

  // Use the existing metadata hook to get workbooks and dashboards
  const {
    data: metadata,
    isLoading,
    isError,
    error
  } = useMetadata(user);

  // Function to fetch workbooks using our session-based backend API
  const fetchWorkbooksViaREST = useCallback(async () => {
    if (!user?.user_id || !user?.site_id || !user?.rest_key) {
      return;
    }

    setRestApiLoading(true);
    setRestApiError(null);

    try {
      const response = await fetch('/api/tableau/workbooks?pageSize=100&page=1');

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Transform workbooks into dashboard format
      const allDashboards = [];

      if (data.workbooks && data.workbooks.length > 0) {
        for (const workbook of data.workbooks) {
          try {
            const viewsResponse = await fetch(`/api/tableau/views?workbookId=${workbook.id}`);
            if (viewsResponse.ok) {
              const viewsData = await viewsResponse.json();
              if (viewsData.views) {
                for (const view of viewsData.views) {
                  allDashboards.push({
                    dashboard_name: view.name,
                    dashboard_id: view.id,
                    workbook_name: workbook.name,
                    content_url: view.contentUrl,
                    workbook_id: workbook.id
                  });
                }
              }
            }
          } catch (viewError) {
            console.error(`Error getting views for workbook ${workbook.name}:`, viewError);
          }
        }
      }

      setRestApiData({
        workbooks: allDashboards,
        totalCount: allDashboards.length
      });

    } catch (error) {
      console.error('❌ Error:', error);
      setRestApiError(error.message);
    } finally {
      setRestApiLoading(false);
    }
  }, [user?.user_id, user?.site_id, user?.rest_key]);

  // Fetch workbooks when user is authenticated
  useEffect(() => {
    if (user?.user_id && user?.site_id && user?.rest_key) {
      fetchWorkbooksViaREST();
    }
  }, [fetchWorkbooksViaREST, user?.user_id, user?.site_id, user?.rest_key]);

  // Process
  let dashboardsByFolder = {};
  let allViews = [];

  if (metadata && Array.isArray(metadata)) {

    metadata.forEach(item => {
      if (item.workbooks && Array.isArray(item.workbooks)) {
        item.workbooks.forEach(workbook => {
          if (workbook.views && Array.isArray(workbook.views)) {
            const folderName = item.name || 'Default';

            if (!dashboardsByFolder[folderName]) {
              dashboardsByFolder[folderName] = [];
            }

            dashboardsByFolder[folderName].push({
              ...workbook,
              views: workbook.views
            });

            // Add all views to the flat array
            allViews.push(...workbook.views);
          }
        });
      }
    });
  } else {
  }


  return {
    // Session data
    user,
    sessionStatus,
    isSessionSuccess,
    isSessionError,
    isSessionLoading,

    // Metadata-based data (GraphQL)
    dashboardsByFolder,
    allViews,
    metadata,
    isLoading,
    isError,
    error,

    // REST API data
    restApiData,
    restApiLoading,
    restApiError,
  };
};
