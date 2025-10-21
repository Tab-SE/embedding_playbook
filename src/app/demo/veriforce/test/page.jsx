"use client";
import { useTableauSession } from '@/hooks';

export default function TestPage() {
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">JWT Token Test</h1>

        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Session Status</h2>
          <div className="space-y-2 text-slate-300">
            <p><strong>Status:</strong> {sessionStatus}</p>
            <p><strong>Loading:</strong> {isSessionLoading ? 'Yes' : 'No'}</p>
            <p><strong>Success:</strong> {isSessionSuccess ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {isSessionError ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {user && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">User Data</h2>
            <div className="space-y-2 text-slate-300">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Demo:</strong> {user.demo}</p>
              <p><strong>Has REST Key:</strong> {user.rest_key ? 'Yes' : 'No'}</p>
              <p><strong>Has Embed Token:</strong> {user.embed_token ? 'Yes' : 'No'}</p>
              <p><strong>Site ID:</strong> {user.site_id || 'Not available'}</p>
              <p><strong>Site:</strong> {user.site || 'Not available'}</p>
              <p><strong>User ID:</strong> {user.user_id || 'Not available'}</p>
            </div>
          </div>
        )}

        {user?.rest_key && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">REST Token (First 50 chars)</h2>
            <p className="text-slate-300 font-mono text-sm break-all">
              {user.rest_key.substring(0, 50)}...
            </p>
          </div>
        )}

        {user?.embed_token && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Embed Token (First 50 chars)</h2>
            <p className="text-slate-300 font-mono text-sm break-all">
              {user.embed_token.substring(0, 50)}...
            </p>
          </div>
        )}

        {sessionError && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Error</h2>
            <p className="text-red-200">{sessionError.message}</p>
          </div>
        )}

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
          <div className="text-slate-300 space-y-2">
            <p>1. Make sure you're signed in via the auth page</p>
            <p>2. Check if the JWT tokens are present above</p>
            <p>3. If tokens are missing, the authentication flow needs to be fixed</p>
            <p>4. If tokens are present, we can use them to fetch dashboards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
