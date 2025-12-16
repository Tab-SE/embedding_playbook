"use client";

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

export const ProcurementDashboard = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-green-400" />
              Procurement Dashboard
            </h1>
            <p className="text-slate-300 mt-2">
              Comprehensive vendor management, cost analysis, and procurement optimization
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
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
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
              src='https://public.tableau.com/views/WorldIndicators/InternetUsers?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
              hideTabs={true}
              toolbar='hidden'
              isPublic={true}
              className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
              width='100%'
              height='100%'
            />
          </CardContent>
        </Card>

        {/* Procurement Insights & Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Procurement Insights
              </CardTitle>
              <CardDescription className="text-slate-300">
                AI-powered recommendations for procurement optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-900/20 rounded-lg border border-green-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-200">Cost Savings Identified</p>
                    <p className="text-xs text-green-300 mt-1">Consolidating electrical vendors could save $2.3M annually</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-200">Vendor Diversification</p>
                    <p className="text-xs text-blue-300 mt-1">Consider adding 2-3 new vendors in the plumbing category</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-200">Contract Renewal Alert</p>
                    <p className="text-xs text-yellow-300 mt-1">5 vendor contracts expire in the next 30 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-purple-400" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-slate-300">
                Common procurement tasks and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full text-left p-4 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Generate Procurement Report</p>
                    <p className="text-xs text-slate-300">Comprehensive vendor performance summary</p>
                  </div>
                  <Download className="h-4 w-4 text-slate-400" />
                </div>
              </button>
              <button className="w-full text-left p-4 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Schedule Vendor Review</p>
                    <p className="text-xs text-slate-300">Plan quarterly vendor assessment meeting</p>
                  </div>
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
              </button>
              <button className="w-full text-left p-4 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Update Vendor Contracts</p>
                    <p className="text-xs text-slate-300">Review and renew expiring agreements</p>
                  </div>
                  <Shield className="h-4 w-4 text-slate-400" />
                </div>
              </button>
              <button className="w-full text-left p-4 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Cost Analysis Report</p>
                    <p className="text-xs text-slate-300">Detailed financial performance breakdown</p>
                  </div>
                  <BarChart3 className="h-4 w-4 text-slate-400" />
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
