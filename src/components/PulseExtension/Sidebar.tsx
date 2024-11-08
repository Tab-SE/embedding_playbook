import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <h2>Tableau Pulse Dashboard Extension</h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroup>Connection</SidebarGroup>
                    {/* Add connection items here */}
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroup>Metrics</SidebarGroup>
                    {/* Add metrics items here */}
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroup>Options</SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <span>Formatting</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <span>Interactivity</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <span>Font Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <span>Miscellaneous</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}