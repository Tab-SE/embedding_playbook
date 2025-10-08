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

  // Function to fetch workbooks using our session-based backend API
  const fetchWorkbooksViaREST = useCallback(async () => {
    if (!user?.user_id || !user?.site_id || !user?.rest_key) {
      return;
    }

    setRestApiLoading(true);
    setRestApiError(null);

    try {
      // Just call our backend API - it will handle authentication via session
      const response = await fetch('/api/tableau/workbooks?pageSize=100&page=1');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Backend API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Backend API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Backend API Response:', {
        workboosk: data.workbooks,
        workbooksCount: data.workbooks?.length || 0,
        totalAvailable: data.pagination?.totalAvailable || 0
      });

      // Transform workbooks into dashboard format
      const allDashboards = [];

      if (data.workbooks && data.workbooks.length > 0) {
        // For each workbook, we need to get its views/dashboards
        for (const workbook of data.workbooks) {
          console.log(`🔍 Getting views for workbook: ${workbook.name}`);

          try {
            const viewsResponse = await fetch(`/api/tableau/views?workbookId=${workbook.id}`);
            console.log("viewsResponse", viewsResponse)
            if (viewsResponse.ok) {
              const viewsData = await viewsResponse.json();
              console.log("viewsData", viewsData)

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
            console.error(`❌ Error getting views for workbook ${workbook.name}:`, viewError);
          }
        }
      }

      console.log('✅ All dashboards processed:', {
        totalDashboards: allDashboards.length
      });

      // Log dashboard names
      if (allDashboards.length > 0) {
        console.log('📋 Dashboard Names:');
        allDashboards.forEach((dash, index) => {
          console.log(`  ${index + 1}. ${dash.dashboard_name} (Workbook: ${dash.workbook_name})`);
        });
      }

      setRestApiData({
        workbooks: allDashboards,
        totalCount: allDashboards.length
      });

    } catch (error) {
      console.error('❌ REST API Error:', error);
      setRestApiError(error.message);
    } finally {
      setRestApiLoading(false);
    }
  }, [user?.user_id, user?.site_id, user?.rest_key]);

  // Fetch workbooks when user is authenticated
  useEffect(() => {
    if (user?.user_id && user?.site_id && user?.rest_key) {
      console.log('🎯 User authenticated, fetching workbooks...');
      fetchWorkbooksViaREST();
    } else {
      console.log('⏸️ User not authenticated yet, waiting...');
    }
  }, [fetchWorkbooksViaREST]);

  // Use the existing metadata hook to get workbooks and dashboards
  const {
    data: metadata,
    isLoading,
    isError,
    error
  } = useMetadata();


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
    // Helper function to refresh data
    refreshData: fetchWorkbooksViaREST
  };
};
