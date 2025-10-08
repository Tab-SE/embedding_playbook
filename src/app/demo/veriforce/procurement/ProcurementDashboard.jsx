import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { TableauEmbed } from '@/components';
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  Filter,
  Search,
  BarChart3,
  Target,
  AlertTriangle
} from 'lucide-react';

export const ProcurementDashboard = () => {

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-blue-400" />
              Procurement Dashboard
            </h1>
            <p className="text-slate-300 mt-2">
              Assess contractor performance, manage vendor relationships, and optimize procurement decisions
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


        {/* Main Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Vendor Performance Overview */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Vendor Performance Overview
              </CardTitle>
              <CardDescription className="text-slate-300">
                Comprehensive vendor performance metrics and risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <TableauEmbed
                src='https://public.tableau.com/views/RegionalSampleWorkbook/Flights?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                hideTabs={true}
                toolbar='hidden'
                isPublic={true}
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
                width='100%'
                height='100%'
              />
            </CardContent>
          </Card>

          {/* Cost Analysis & Savings */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 text-green-400" />
                Cost Analysis & Savings
              </CardTitle>
              <CardDescription className="text-slate-300">
                Track procurement costs, savings opportunities, and budget performance
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <TableauEmbed
                src='https://public.tableau.com/views/WorldIndicators/CO2Emissions?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
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

        {/* Risk Assessment Matrix */}
        <Card className="bg-slate-800 shadow-lg border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-orange-400" />
              Vendor Risk Assessment Matrix
            </CardTitle>
            <CardDescription className="text-slate-300">
              Comprehensive risk evaluation across all vendor categories and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
            <TableauEmbed
              src='https://public.tableau.com/views/WorldIndicators/EnergyUse?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
              hideTabs={true}
              toolbar='hidden'
              isPublic={true}
              className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
              width='100%'
              height='100%'
              layouts={{
                '*': { 'device': 'desktop', 'width': 800, 'height': 600 }
              }}
            />
          </CardContent>
        </Card>

        {/* Action Items & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Procurement Alerts
              </CardTitle>
              <CardDescription className="text-slate-300">
                Critical issues requiring procurement team attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-900/20 rounded-lg border border-red-800">
                <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-red-200">Contract Expiring Soon</p>
                  <p className="text-xs text-red-300">ABC Construction - $2.3M contract</p>
                  <p className="text-xs text-red-400 mt-1">15 days remaining - Renewal needed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                <Clock className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-yellow-200">Performance Review Due</p>
                  <p className="text-xs text-yellow-300">XYZ Electric - Q4 review</p>
                  <p className="text-xs text-yellow-400 mt-1">7 days remaining</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-900/20 rounded-lg border border-orange-800">
                <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-orange-200">High Risk Vendor</p>
                  <p className="text-xs text-orange-300">DEF Plumbing - Risk score 4.2</p>
                  <p className="text-xs text-orange-400 mt-1">Review required</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <FileText className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <p className="text-sm font-medium text-white">Generate Vendor Report</p>
                <p className="text-xs text-slate-300">Export performance data</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <p className="text-sm font-medium text-white">Schedule Vendor Review</p>
                <p className="text-xs text-slate-300">Plan performance meetings</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <p className="text-sm font-medium text-white">Create RFP Template</p>
                <p className="text-xs text-slate-300">Start new procurement process</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <p className="text-sm font-medium text-white">Analyze Cost Trends</p>
                <p className="text-xs text-slate-300">Identify savings opportunities</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
