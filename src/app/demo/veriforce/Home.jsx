import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Metrics, TableauEmbed } from '@/components';
import Image from 'next/image';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  XCircle,
  Clock
} from 'lucide-react';

export const description = "Veriforce Contractor Risk Management - Comprehensive safety and compliance tracking dashboard with real-time alerts and self-service analytics";

export const Home = () => {

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-300">
              Comprehensive safety and compliance tracking for your contractor network
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">System Healthy</span>
            </div>
          </div>
        </div>

        {/* Pulse Metrics */}
        <Metrics
          basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5'
        />


        {/* Main Dashboard */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Compliance Overview */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 shadow-lg border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Compliance Overview
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Real-time compliance tracking across all contractors and safety metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <TableauEmbed
                  src='https://public.tableau.com/views/ConstructionDashboard_16557576575100/Dashboard1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
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

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <Card className="bg-slate-800 shadow-lg border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Alerts
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Issues requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-900/20 rounded-lg border border-red-800">
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-red-200">Safety Certification Expired</p>
                    <p className="text-xs text-red-300">ABC Construction - 3 workers</p>
                    <p className="text-xs text-red-400 mt-1">2 days overdue</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                  <Clock className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-yellow-200">Training Due Soon</p>
                    <p className="text-xs text-yellow-300">XYZ Electric - 12 workers</p>
                    <p className="text-xs text-yellow-400 mt-1">5 days remaining</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-900/20 rounded-lg border border-orange-800">
                  <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-orange-200">Incident Report Pending</p>
                    <p className="text-xs text-orange-300">DEF Plumbing - Site A</p>
                    <p className="text-xs text-orange-400 mt-1">1 day overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800 shadow-lg border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                  <p className="text-sm font-medium text-white">Generate Compliance Report</p>
                  <p className="text-xs text-slate-300">Export current status</p>
                </button>
                <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                  <p className="text-sm font-medium text-white">View Risk Assessment</p>
                  <p className="text-xs text-slate-300">Analyze contractor risk</p>
                </button>
                <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                  <p className="text-sm font-medium text-white">Schedule Training</p>
                  <p className="text-xs text-slate-300">Plan upcoming sessions</p>
                </button>
                <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                  <p className="text-sm font-medium text-white">Create Custom Report</p>
                  <p className="text-xs text-slate-300">Use self-service tools</p>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
