import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { TableauEmbed } from '@/components';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  Bell,
  Shield,
  Users,
  DollarSign
} from 'lucide-react';

export const AlertsDashboard = () => {
  const alertTypes = [
    {
      title: "Critical Alerts",
      value: "23",
      color: "red",
      icon: <XCircle className="h-4 w-4" />,
      description: "Require immediate attention"
    },
    {
      title: "Warning Alerts",
      value: "47",
      color: "yellow",
      icon: <AlertTriangle className="h-4 w-4" />,
      description: "Need attention soon"
    },
    {
      title: "Info Alerts",
      value: "89",
      color: "blue",
      icon: <Bell className="h-4 w-4" />,
      description: "For your information"
    },
    {
      title: "Resolved Today",
      value: "12",
      color: "green",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Successfully addressed"
    }
  ];

  const criticalAlerts = [
    {
      id: 1,
      type: "Safety",
      title: "Safety Certification Expired",
      contractor: "ABC Construction",
      severity: "Critical",
      time: "2 days overdue",
      description: "3 workers have expired safety certifications",
      action: "Renew certifications immediately"
    },
    {
      id: 2,
      type: "Compliance",
      title: "Incident Report Overdue",
      contractor: "DEF Plumbing",
      severity: "Critical",
      time: "1 day overdue",
      description: "Safety incident report not submitted",
      action: "Submit incident report"
    },
    {
      id: 3,
      type: "Procurement",
      title: "Contract Expiring",
      contractor: "XYZ Electric",
      severity: "Critical",
      time: "5 days remaining",
      description: "$2.3M contract expires soon",
      action: "Initiate renewal process"
    }
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              Compliance Alerts
            </h1>
            <p className="text-slate-300 mt-2">
              Monitor and manage compliance alerts with direct navigation to resolution
            </p>
          </div>
          <div className="flex items-center gap-3 pl-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
              <Filter className="h-4 w-4 text-slate-300" />
              <span className="text-sm font-medium text-slate-300">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
              <Search className="h-4 w-4 text-slate-300" />
              <span className="text-sm font-medium text-slate-300">Search</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Alert Summary Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {alertTypes.map((alert, index) => (
            <Card key={index} className="bg-slate-800 shadow-lg border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300">{alert.title}</p>
                    <p className="text-2xl font-bold text-white">{alert.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    alert.color === 'red' ? 'bg-red-100 text-red-600' :
                    alert.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    alert.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {alert.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Alerts Dashboard */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alert Analytics */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="h-5 w-5 text-blue-400" />
                Alert Analytics & Trends
              </CardTitle>
              <CardDescription className="text-slate-300">
                Visual analysis of alert patterns and resolution trends
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <TableauEmbed
                src='https://public.tableau.com/views/RegionalSampleWorkbook/Obesity?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                hideTabs={true}
                toolbar='hidden'
                isPublic={true}
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
                width='100%'
                height='100%'
              />
            </CardContent>
          </Card>

          {/* Critical Alerts List */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <XCircle className="h-5 w-5" />
                Critical Alerts
              </CardTitle>
              <CardDescription className="text-slate-300">
                Issues requiring immediate attention with direct navigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-red-900">{alert.title}</span>
                        <span className="px-2 py-1 text-xs font-medium bg-red-200 text-red-800 rounded">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-red-700 mb-1">{alert.contractor}</p>
                      <p className="text-xs text-red-600 mb-2">{alert.description}</p>
                      <p className="text-xs font-medium text-red-800">{alert.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-red-600">{alert.time}</p>
                      <button className="mt-2 px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Alert Categories */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Shield className="h-5 w-5" />
                Safety Alerts
              </CardTitle>
              <CardDescription className="text-slate-300">
                Safety compliance and certification issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-slate-700 rounded">
                <span className="text-sm text-slate-300">Certification Expired</span>
                <span className="text-xs text-red-400 font-medium">5</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-700 rounded">
                <span className="text-sm text-slate-300">Training Overdue</span>
                <span className="text-xs text-yellow-400 font-medium">12</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-700 rounded">
                <span className="text-sm text-slate-300">Incident Reports</span>
                <span className="text-xs text-orange-400 font-medium">3</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Users className="h-5 w-5" />
                Compliance Alerts
              </CardTitle>
              <CardDescription className="text-slate-300">
                General compliance and regulatory issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-slate-700 rounded">
                <span className="text-sm text-slate-300">Documentation Missing</span>
                <span className="text-xs text-red-400 font-medium">8</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-700 rounded">
                <span className="text-sm text-slate-300">Audit Findings</span>
                <span className="text-xs text-yellow-400 font-medium">6</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-700 rounded">
                <span className="text-sm text-slate-300">Policy Updates</span>
                <span className="text-xs text-blue-400 font-medium">4</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <DollarSign className="h-5 w-5" />
                Procurement Alerts
              </CardTitle>
              <CardDescription className="text-slate-300">
                Contract and vendor management issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-slate-700 rounded">
                <span className="text-sm text-slate-300">Contract Expiring</span>
                <span className="text-xs text-red-400 font-medium">7</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-700 rounded">
                <span className="text-sm text-slate-300">Performance Review</span>
                <span className="text-xs text-yellow-400 font-medium">9</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-700 rounded">
                <span className="text-sm text-slate-300">Risk Assessment</span>
                <span className="text-xs text-orange-400 font-medium">5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
