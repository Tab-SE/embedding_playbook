import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  BrainCircuit,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Shield,
  Users,
  AlertTriangle,
  BarChart3,
  FileText,
  Download
} from 'lucide-react';

export const AgentDashboard = () => {
  const sampleQuestions = [
    "Show me contractors with safety compliance issues",
    "What's our overall risk score across all contractors?",
    "Which contractors need certification renewals?",
    "List all procurement metrics for this quarter",
    "Show me the compliance dashboard for safety team",
    "Generate a report on high-risk vendors",
    "What are the trends in safety incidents?",
    "Which contractors have the best performance scores?"
  ];

  const recentInsights = [
    {
      id: 1,
      type: "Safety",
      title: "Safety Incident Trend Analysis",
      description: "Incidents have decreased by 23% this quarter compared to last quarter",
      confidence: "High",
      action: "Continue current safety protocols"
    },
    {
      id: 2,
      type: "Compliance",
      title: "Certification Renewal Alert",
      description: "47 contractors have certifications expiring in the next 30 days",
      confidence: "High",
      action: "Schedule renewal reminders"
    },
    {
      id: 3,
      type: "Procurement",
      title: "Vendor Performance Insight",
      description: "ABC Construction shows 15% improvement in performance metrics",
      confidence: "Medium",
      action: "Consider expanding contract scope"
    }
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-blue-600" />
              AI Assistant
            </h1>
            <p className="text-slate-600 mt-2">
              Get instant insights and answers about your contractor risk management data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">AI Active</span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Chat with AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about your contractor data and get intelligent insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chat Messages */}
                <div className="space-y-4 h-96 overflow-y-auto">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <BrainCircuit className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-slate-900">
                          Hello! I'm your AI assistant for contractor risk management. I can help you analyze compliance data, identify trends, and answer questions about your contractor network. What would you like to know?
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 justify-end">
                    <div className="flex-1 max-w-xs">
                      <div className="bg-slate-100 rounded-lg p-3">
                        <p className="text-sm text-slate-900">
                          Show me contractors with safety compliance issues
                        </p>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-200 rounded-full">
                      <Users className="h-4 w-4 text-slate-600" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <BrainCircuit className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-slate-900 mb-2">
                          I found 23 contractors with safety compliance issues. Here's a breakdown:
                        </p>
                        <ul className="text-xs text-slate-700 space-y-1">
                          <li>• ABC Construction: 3 workers with expired certifications</li>
                          <li>• XYZ Electric: 12 workers need training renewal</li>
                          <li>• DEF Plumbing: 1 overdue incident report</li>
                        </ul>
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                          Would you like me to generate a detailed report or show you the safety dashboard?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask about your contractor data..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Send
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sample Questions */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Sample Questions
                </CardTitle>
                <CardDescription>
                  Try asking these questions to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sampleQuestions.slice(0, 4).map((question, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 text-xs text-slate-700 hover:bg-slate-50 rounded transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Insights */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Recent Insights
                </CardTitle>
                <CardDescription>
                  AI-generated insights from your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentInsights.map((insight) => (
                  <div key={insight.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-900">{insight.title}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        insight.confidence === 'High' ? 'bg-green-100 text-green-800' :
                        insight.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {insight.confidence}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{insight.description}</p>
                    <p className="text-xs text-blue-600 font-medium">{insight.action}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and data exploration options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                <Shield className="h-6 w-6 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Safety Analysis</p>
                  <p className="text-xs text-slate-600">Analyze safety metrics</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all">
                <Users className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Vendor Performance</p>
                  <p className="text-xs text-slate-600">Review vendor metrics</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Risk Assessment</p>
                  <p className="text-xs text-slate-600">Evaluate contractor risk</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all">
                <FileText className="h-6 w-6 text-purple-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Generate Report</p>
                  <p className="text-xs text-slate-600">Create custom reports</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
