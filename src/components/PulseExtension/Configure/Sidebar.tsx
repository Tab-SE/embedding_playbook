'use client';

import * as React from 'react';
import { useState } from 'react';

import {
  ChevronDown,
  Database,
  Gauge,
  CaseLower,
  FileSliders,
  Waypoints,
  Paintbrush,
  Bug,
  Image as Img,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/Sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <h2 className="text-lg font-semibold">Tableau Pulse Dashboard Extension</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Options</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveTab('connection')}
                    isActive={activeTab === 'connection'}
                    data-state={activeTab === 'connection' ? 'active' : 'inactive'}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    <span>Connection</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveTab('metrics')}
                    isActive={activeTab === 'metrics'}
                    data-state={activeTab === 'metrics' ? 'active' : 'inactive'}
                  >
                    <Gauge className="mr-2 h-4 w-4" />
                    <span>Metrics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              {/* </SidebarMenu>
                </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Options</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>*/}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveTab('style')}
                    isActive={activeTab === 'style'}
                    data-state={activeTab === 'style' ? 'active' : 'inactive'}
                  >
                    <Img className="mr-2 h-4 w-4" />
                    <span>Style</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === 'interactivity'}
                    onClick={() => setActiveTab('interactivity')}
                    data-state={activeTab === 'interactivity' ? 'active' : 'inactive'}
                  >
                    <Waypoints className="mr-2 h-4 w-4" />
                    <span>Interactivity</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === 'fonts'}
                    onClick={() => setActiveTab('fonts')}
                    data-state={activeTab === 'fonts' ? 'active' : 'inactive'}
                  >
                    <CaseLower className="mr-2 h-2  w-4" />
                    <span>Fonts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === 'color'}
                    onClick={() => setActiveTab('color')}
                    data-state={activeTab === 'color' ? 'active' : 'inactive'}
                  >
                    <Paintbrush className="mr-2 h-2  w-4" />
                    <span>Color</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === 'debug'}
                    onClick={() => setActiveTab('debug')}
                    data-state={activeTab === 'debug' ? 'active' : 'inactive'}
                  >
                    <Bug className="mr-2 h-2  w-4" />
                    <span>Debug</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <span className="text-sm text-gray-500">© 2024 Tableau</span>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
