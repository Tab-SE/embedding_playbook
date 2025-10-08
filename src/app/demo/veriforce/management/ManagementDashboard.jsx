import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { TableauEmbed } from '@/components';
import {
  Users2,
  TrendingUp,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  Filter,
  Search,
  BarChart3,
  Target,
  AlertTriangle,
  PieChart
} from 'lucide-react';

export const ManagementDashboard = () => {

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users2 className="h-8 w-8 text-blue-400" />
              Executive Dashboard
            </h1>
            <p className="text-slate-300 mt-2">
              High-level overview of contractor risk management performance and strategic insights
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


        {/* Strategic Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contractor Portfolio Overview */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <PieChart className="h-5 w-5 text-blue-400" />
                Contractor Portfolio Overview
              </CardTitle>
              <CardDescription className="text-slate-300">
                Strategic view of contractor distribution, performance, and risk levels
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <TableauEmbed
                src='https://public.tableau.com/views/WorldIndicators/HealthExpenditure?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                hideTabs={true}
                toolbar='hidden'
                isPublic={true}
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
                width='100%'
                height='100%'
              />
            </CardContent>
          </Card>

          {/* Risk & Compliance Trends */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Risk & Compliance Trends
              </CardTitle>
              <CardDescription className="text-slate-300">
                Historical trends and predictive insights for risk management
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <TableauEmbed
                src='https://public.tableau.com/views/WorldIndicators/LifeExpectancy?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
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

        {/* Financial Impact Analysis */}
        <Card className="bg-slate-800 shadow-lg border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="h-5 w-5 text-green-400" />
              Financial Impact Analysis
            </CardTitle>
            <CardDescription className="text-slate-300">
              Cost savings, risk mitigation value, and ROI from contractor risk management initiatives
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
            <TableauEmbed
              src='https://public.tableau.com/views/WorldIndicators/EducationExpenditure?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
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

        {/* Strategic Insights & Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <BarChart3 className="h-5 w-5" />
                Strategic Insights
              </CardTitle>
              <CardDescription className="text-slate-300">
                Key insights and recommendations for executive decision-making
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Top Performing Contractors</h4>
                <p className="text-xs text-blue-700 mb-2">ABC Construction, XYZ Electric, and DEF Plumbing show consistently high compliance rates and low risk scores.</p>
                <p className="text-xs text-blue-600">Recommendation: Consider expanding contracts with these vendors.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-sm font-semibold text-green-900 mb-2">Cost Savings Opportunity</h4>
                <p className="text-xs text-green-700 mb-2">Consolidating similar contractor categories could reduce costs by an estimated $180K annually.</p>
                <p className="text-xs text-green-600">Recommendation: Review contractor portfolio for consolidation opportunities.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-semibold text-yellow-900 mb-2">Risk Mitigation</h4>
                <p className="text-xs text-yellow-700 mb-2">23 contractors require immediate attention due to compliance issues or high risk scores.</p>
                <p className="text-xs text-yellow-600">Recommendation: Implement targeted improvement plans for at-risk contractors.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-300">
                <FileText className="h-5 w-5" />
                Executive Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <p className="text-sm font-medium text-white">Generate Executive Report</p>
                <p className="text-xs text-slate-300">Comprehensive quarterly summary</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <p className="text-sm font-medium text-white">Review Risk Strategy</p>
                <p className="text-xs text-slate-300">Update risk management policies</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <p className="text-sm font-medium text-white">Schedule Board Meeting</p>
                <p className="text-xs text-slate-300">Present contractor risk findings</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <p className="text-sm font-medium text-white">Approve Budget Changes</p>
                <p className="text-xs text-slate-300">Allocate resources for improvements</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <p className="text-sm font-medium text-white">Set Strategic Goals</p>
                <p className="text-xs text-slate-300">Define next quarter objectives</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
