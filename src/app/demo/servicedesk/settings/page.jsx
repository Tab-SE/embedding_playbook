"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Settings } from 'lucide-react';
import { settings } from '../config';

const SettingsContent = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <Card className="bg-slate-800 shadow-lg border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5 text-blue-400" />
              System Configuration
            </CardTitle>
            <CardDescription className="text-slate-300">
              Manage platform settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Service Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-sm text-slate-400">Receive alerts for critical cases</p>
                    </div>
                    <input type="checkbox" checked className="h-5 w-5" readOnly />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Auto-Assignment</p>
                      <p className="text-sm text-slate-400">Automatically route cases to available agents</p>
                    </div>
                    <input type="checkbox" checked className="h-5 w-5" readOnly />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">SLA Monitoring</p>
                      <p className="text-sm text-slate-400">Track service level agreement compliance</p>
                    </div>
                    <input type="checkbox" checked className="h-5 w-5" readOnly />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Dashboard Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Default View</p>
                      <p className="text-sm text-slate-400">Home Dashboard</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Change</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Refresh Interval</p>
                      <p className="text-sm text-slate-400">5 minutes</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Change</button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Demo settings={settings} pageName="Settings">
      <SettingsContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
