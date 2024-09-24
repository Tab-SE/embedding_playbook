import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";
import { GeneralSettings } from 'components';

export const description = "A settings page. The settings page has a sidebar navigation and a main content area. The main content area has a form to update the store name and a form to update the plugins directory. The sidebar navigation has links to general, security, integrations, support, organizations, and advanced settings."

export const Settings = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <Tabs defaultValue="general" orientation="vertical">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
                <TabsList className="flex mt-6 md:flex-col md:items-start md:space-y-2 md:mt-12">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
            </nav>
            <div>
              <TabsContent value="general">
                <GeneralSettings />
              </TabsContent>

              <TabsContent value="billing">
              </TabsContent>

              <TabsContent value="security">
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
