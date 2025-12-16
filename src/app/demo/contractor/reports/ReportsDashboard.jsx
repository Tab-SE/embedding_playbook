import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { TableauEmbed } from '@/components';
import {
  FileText,
  Download,
  Plus,
  Edit,
  Copy,
  Trash2,
  Eye,
  Star,
  Clock,
  Users,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';

export const ReportsDashboard = () => {
  const reportTemplates = [
    {
      id: 1,
      name: "Compliance Summary Report",
      description: "High-level compliance overview across all contractors",
      type: "Executive",
      lastModified: "2 hours ago",
      createdBy: "Sarah Johnson",
      isTemplate: true,
      isStarred: true
    },
    {
      id: 2,
      name: "Safety Incident Analysis",
      description: "Detailed analysis of safety incidents and trends",
      type: "Safety",
      lastModified: "1 day ago",
      createdBy: "Mike Chen",
      isTemplate: true,
      isStarred: false
    },
    {
      id: 3,
      name: "Vendor Performance Review",
      description: "Comprehensive vendor performance metrics and scoring",
      type: "Procurement",
      lastModified: "3 days ago",
      createdBy: "Lisa Rodriguez",
      isTemplate: true,
      isStarred: true
    },
    {
      id: 4,
      name: "Q4 Risk Assessment - Custom",
      description: "Customized risk assessment for Q4 contractor review",
      type: "Management",
      lastModified: "1 week ago",
      createdBy: "You",
      isTemplate: false,
      isStarred: false
    },
    {
      id: 5,
      name: "Training Completion Report",
      description: "Worker training completion status and certification tracking",
      type: "Safety",
      lastModified: "2 weeks ago",
      createdBy: "David Kim",
      isTemplate: true,
      isStarred: false
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: "Monthly Compliance Dashboard",
      type: "Executive",
      generated: "Today",
      status: "Ready"
    },
    {
      id: 2,
      name: "Safety Metrics Q3",
      type: "Safety",
      generated: "Yesterday",
      status: "Ready"
    },
    {
      id: 3,
      name: "Vendor Risk Analysis",
      type: "Procurement",
      generated: "2 days ago",
      status: "Processing"
    }
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Self-Service Reports
            </h1>
            <p className="text-slate-300 mt-2">
              Create, customize, and manage reports with powerful self-service capabilities
            </p>
          </div>
          <div className="flex items-center gap-3 pl-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-300 rounded-lg hover:bg-slate-900 transition-colors">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-300 rounded-lg hover:bg-slate-900 transition-colors">
              <Search className="h-4 w-4" />
              <span className="text-sm font-medium">Search</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">New Report</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Total Reports</p>
                  <p className="text-2xl font-bold text-white">47</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Templates</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Custom Reports</p>
                  <p className="text-2xl font-bold text-white">35</p>
                </div>
                <Edit className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Generated Today</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Templates */}
        <Card className="bg-slate-800 shadow-lg border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Report Templates
            </CardTitle>
            <CardDescription>
              Pre-built report templates to get you started quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reportTemplates.map((template) => (
                <div key={template.id} className="p-4 border border-slate-700 rounded-lg hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{template.name}</h3>
                      {template.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <Eye className="h-4 w-4 text-slate-500" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <Copy className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="px-2 py-1 bg-slate-100 rounded">{template.type}</span>
                    <span>{template.lastModified}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Use Template
                    </button>
                    <button className="px-3 py-2 text-xs font-medium border border-slate-300 text-slate-700 rounded hover:bg-slate-900 transition-colors">
                      Customize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Recent Reports
              </CardTitle>
              <CardDescription>
                Your recently generated and scheduled reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border border-slate-700 rounded-lg hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{report.name}</p>
                      <p className="text-xs text-slate-500">{report.type} • {report.generated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Download className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                Report Analytics
              </CardTitle>
              <CardDescription>
                Usage patterns and popular report types
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <TableauEmbed
                src='https://public.tableau.com/views/WorldIndicators/Unemployment?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                hideTabs={true}
                toolbar='hidden'
                isPublic={true}
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
                width='100%'
                height='100%'
              />
            </CardContent>
          </Card>
        </div>

        {/* Self-Service Features */}
        <Card className="bg-slate-800 shadow-lg border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Self-Service Capabilities
            </CardTitle>
            <CardDescription>
              Powerful features that differentiate from PowerBI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4">
                <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Edit className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-white mb-2">Custom Templates</h3>
                <p className="text-xs text-slate-300">Create and customize report templates to fit your specific needs</p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Copy className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-white mb-2">Version Control</h3>
                <p className="text-xs text-slate-300">Track changes and maintain multiple versions of your reports</p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-white mb-2">Interactive Analytics</h3>
                <p className="text-xs text-slate-300">Drill down into data with interactive visualizations and filters</p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Download className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-sm font-medium text-white mb-2">Export Options</h3>
                <p className="text-xs text-slate-300">Export to Excel, PDF, and other formats with one click</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
