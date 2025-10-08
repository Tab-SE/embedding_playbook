"use client";
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  Folder,
  FileText,
  ChevronRight,
  ChevronDown,
  Search,
  Grid,
  List,
  RefreshCw
} from 'lucide-react';
import { useTableauSession } from '../../hooks';
import { useTableauDashboards } from '../../hooks/tableauHooks';

const TableauNavigationComponent = ({ onDashboardSelect, selectedDashboard }) => {
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  // Get Tableau session data
  const restToken = user?.rest_key;
  const embedToken = user?.embed_token;
  const siteId = user?.site_id;
  const isAuthenticated = isSessionSuccess && embedToken && siteId;

  const {
    dashboardsByFolder,
    allViews,
    isLoading,
    refreshDashboards,
    restApiData,
    restApiLoading,
    restApiError
  } = useTableauDashboards();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const preventBlurRef = useRef(false);

  // Memoized event handlers to prevent re-renders
  const handleInputFocus = useCallback((e) => {
    console.log('INPUT FOCUSED');
    e.stopPropagation();
    setIsSearchFocused(true);
  }, []);

  const handleInputBlur = useCallback((e) => {
    console.log('INPUT BLURRED');
    if (preventBlurRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsSearchFocused(false);
  }, []);

  const handleInputClick = useCallback((e) => {
    console.log('INPUT CLICKED');
    e.stopPropagation();
    preventBlurRef.current = true;
    setIsSearchFocused(true);
  }, []);

  const handleInputMouseDown = useCallback((e) => {
    e.stopPropagation();
    // Don't prevent default - allow focus
  }, []);

  // Maintain focus when search is focused
  useEffect(() => {
    if (isSearchFocused && searchInputRef.current) {
      // Use a timeout to ensure focus happens after any re-renders
      const timeoutId = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isSearchFocused]);

  // Use real Tableau data
  const dashboards = dashboardsByFolder;
  const views = allViews;

  // Debug logging removed to prevent re-renders

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const filteredDashboards = Object.entries(dashboards).filter(([folderName, workbooks]) => {
    if (!searchTerm) return true;
    return workbooks.some(workbook =>
      workbook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workbook.views.some(view =>
        view.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const filteredViews = views.filter(view =>
    view.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    view.workbookName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while session is being established or tokens are loading
  if (isSessionLoading || (isSessionSuccess && !restToken)) {
    return (
      <div className="w-80 bg-slate-800 border-r border-slate-700 h-full flex flex-col">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Loading Dashboards...</h3>
          <p className="text-slate-300">Preparing your Tableau content</p>
        </div>
      </div>
    );
  }

  // Show error state if there's a session error
  if (isSessionError) {
    return (
      <div className="w-80 bg-slate-800 border-r border-slate-700 h-full flex flex-col">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">Unable to Load Dashboards</h3>
          <p className="text-slate-300 mb-4">There was an error connecting to Tableau Cloud</p>
          <div className="text-sm text-slate-400">
            Please refresh the page or contact support if the issue persists
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show a simple message (user should be authenticated via SSO)
  if (!isAuthenticated) {
    return (
      <div className="w-80 bg-slate-800 border-r border-slate-700 h-full flex flex-col">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">No Dashboards Available</h3>
          <p className="text-slate-300 mb-4">No Tableau dashboards found for your account</p>
          <div className="text-sm text-slate-400">
            Contact your administrator if you believe this is an error
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">My Dashboards</h3>
            <p className="text-xs text-slate-400">{user?.name || user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshDashboards}
              disabled={isLoading}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Refresh dashboards"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3" onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            ref={searchInputRef}
            name='search'
            type="text"
            placeholder="Search dashboards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onClick={handleInputClick}
            onMouseDown={handleInputMouseDown}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-slate-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            Loading dashboards...
          </div>
        ) : searchTerm ? (
          // Search Results from REST API data
          <div className="p-2 h-full flex flex-col">
            {restApiData?.workbooks ? (
              <>
                <div className="text-xs text-slate-400 mb-2 px-2 flex-shrink-0">
                  {restApiData.workbooks.filter(dashboard =>
                    dashboard.dashboard_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    dashboard.workbook_name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length} result{restApiData.workbooks.filter(dashboard =>
                    dashboard.dashboard_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    dashboard.workbook_name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length !== 1 ? 's' : ''}
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                  {restApiData.workbooks
                    .filter(dashboard =>
                      dashboard.dashboard_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      dashboard.workbook_name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((dashboard) => (
                    <div
                      key={dashboard.dashboard_id}
                      onClick={() => onDashboardSelect({
                        id: dashboard.dashboard_id,
                        name: dashboard.dashboard_name,
                        workbookName: dashboard.workbook_name,
                        contentUrl: dashboard.content_url
                      })}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                        selectedDashboard?.id === dashboard.dashboard_id
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{dashboard.dashboard_name}</div>
                          <div className="text-xs text-slate-400 truncate">{dashboard.workbook_name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>No search results available</p>
              </div>
            )}
          </div>
        ) : (
          // Folder View
          <div className="p-2 h-full flex flex-col">
            {/* Show REST API dashboards as the primary content */}
            {restApiData?.workbooks && restApiData.workbooks.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="text-xs text-slate-400 mb-3 px-2 flex-shrink-0">
                  Available Dashboards ({restApiData.workbooks.filter(dashboard =>
                    dashboard.dashboard_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    dashboard.workbook_name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length})
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                  {restApiData.workbooks
                    .filter(dashboard =>
                      dashboard.dashboard_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      dashboard.workbook_name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((dashboard) => (
                    <div
                      key={dashboard.dashboard_id}
                      onClick={() => onDashboardSelect({
                        id: dashboard.dashboard_id,
                        name: dashboard.dashboard_name,
                        workbookName: dashboard.workbook_name,
                        contentUrl: dashboard.content_url
                      })}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                        selectedDashboard?.id === dashboard.dashboard_id
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{dashboard.dashboard_name}</div>
                          <div className="text-xs text-slate-400 truncate">{dashboard.workbook_name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                {restApiLoading ? (
                  <div className="space-y-2">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                    <p>Loading dashboards...</p>
                  </div>
                ) : restApiError ? (
                  <div className="space-y-2">
                    <p className="text-red-400">Error loading dashboards:</p>
                    <p className="text-xs">{restApiError}</p>
                  </div>
                ) : (
                  <p>No dashboards available</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const TableauNavigation = memo(TableauNavigationComponent);
