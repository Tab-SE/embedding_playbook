import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { GeneralSettings } from '@/components';

export const Settings = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your T-Mobile for Business account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GeneralSettings/>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
