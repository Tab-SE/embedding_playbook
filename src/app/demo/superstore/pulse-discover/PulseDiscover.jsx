"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Activity } from "lucide-react";
import { TableauEmbedEACanada } from "@/components/TableauEmbed";

export const PulseDiscover = () => {
  const dashboardUrl = 'https://prod-ca-a.online.tableau.com/t/eacanada/views/PulseDiscoverPulseMCP/Dashboard1';
  const containerRef = useRef(null);

  useEffect(() => {
    const logSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        console.log('Pulse Discover container size:', rect.width, 'x', rect.height);
      }
    };
    logSize();
    window.addEventListener('resize', logSize);
    return () => window.removeEventListener('resize', logSize);
  }, []);

  return (
    <main className="flex-1 items-start gap-3 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-6">
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-blue-500" />
              <div>
                <CardTitle>Pulse Discover Dashboard</CardTitle>
                <CardDescription>
                  Explore insights and analytics from the Pulse Discover dashboard
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div ref={containerRef} className="w-full h-full min-h-[600px]">
              <TableauEmbedEACanada
                id="pulseDiscoverViz"
                src={dashboardUrl}
                hideTabs={true}
                toolbar="hidden"
                className="min-w-[1500px] min-h-[2500px] sm:min-w-[1500px] sm:min-h-[2500px] md:min-w-[1500px] md:min-h-[2500px] lg:min-w-[1500px] lg:min-h-[2500px] xl:min-w-[1500px] xl:min-h-[2500px] 2xl:min-w-[1500px] 2xl:min-h-[2500px]"
                layouts={{
                  'xs': { 'device': 'default', 'width': 1500, 'height': 500 },
                  'sm': { 'device': 'default', 'width': 1500, 'height': 500 },
                  'md': { 'device': 'default', 'width': 1500, 'height': 500 },
                  'lg': { 'device': 'default', 'width': 1500, 'height': 500 },
                  'xl': { 'device': 'default', 'width': 1500, 'height': 2500 },
                  'xl2': { 'device': 'default', 'width': 1500, 'height': 2500 },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

