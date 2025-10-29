import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  Settings,
  Users,
  Bell,
  Shield,
  Database,
  Palette,
  Download,
  Upload,
  Save,
  RefreshCw
} from 'lucide-react';

export const SettingsDashboard = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-600" />
              System Settings
            </h1>
            <p className="text-slate-600 mt-2">
              Configure system settings, user management, and integration preferences
            </p>
          </div>
        </div>

        {/* Settings Categories */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Management */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Active Users</p>
                  <p className="text-xs text-slate-600">247 users across all teams</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Manage
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Role Assignments</p>
                  <p className="text-xs text-slate-600">Configure team-specific access levels</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                  Configure
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Contractor Access</p>
                  <p className="text-xs text-slate-600">Currently disabled - future feature</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-500 rounded cursor-not-allowed" disabled>
                  Coming Soon
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Alert Configuration */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Alert Configuration
              </CardTitle>
              <CardDescription>
                Configure compliance alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Critical Alerts</p>
                  <p className="text-xs text-slate-600">Immediate notification for urgent issues</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
                  Configure
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                  <p className="text-xs text-slate-600">Set up automated email alerts</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                  Setup
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Alert Thresholds</p>
                  <p className="text-xs text-slate-600">Customize alert trigger conditions</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                  Customize
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Data Encryption</p>
                  <p className="text-xs text-slate-600">AES-256 encryption enabled</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Session Timeout</p>
                  <p className="text-xs text-slate-600">8 hours of inactivity</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Audit Logging</p>
                  <p className="text-xs text-slate-600">Comprehensive activity tracking</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                  View Logs
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage data sources and integration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Data Sources</p>
                  <p className="text-xs text-slate-600">12 connected data sources</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                  Manage
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Data Refresh</p>
                  <p className="text-xs text-slate-600">Every 4 hours</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                  Schedule
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Backup Status</p>
                  <p className="text-xs text-slate-600">Last backup: 2 hours ago</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                  Backup Now
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Branding & Customization */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-pink-600" />
              Branding & Customization
            </CardTitle>
            <CardDescription>
              Customize the appearance and branding of your Veriforce instance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Company Logo</p>
                    <p className="text-xs text-slate-600">Upload your company logo</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                    <Upload className="h-3 w-3" />
                    Upload
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Color Scheme</p>
                    <p className="text-xs text-slate-600">Customize primary and accent colors</p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                    Customize
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Dashboard Layout</p>
                    <p className="text-xs text-slate-600">Configure default dashboard layout</p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Export Settings</p>
                    <p className="text-xs text-slate-600">Default export formats and options</p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Actions */}
        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-slate-900">System Actions</h3>
            <p className="text-xs text-slate-600">Perform system-wide operations and maintenance</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors">
              <Download className="h-4 w-4" />
              Export Config
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
