import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui";

import { TableauViz } from 'components';

export const Customers = () => {
  return (
    <TabsContent value="customers" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-7 dark:bg-stone-900">
          <CardHeader>
            <CardTitle>Profitability Matrix</CardTitle>
            <CardDescription>
              Compares profit vs sales where each mark is an individual customer
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TableauViz 
              src='https://10ax.online.tableau.com/t/rcgsepulse/views/superstore/customer_scatter_plot'
              width={450}
              height={450}
              hideTabs={true}
              device='default'
              toolbar='hidden'
            />
          </CardContent>
        </Card>
        <Card className="col-span-5 dark:bg-stone-900">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SampleList />
          </CardContent>
        </Card>
      </div>
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Regional Performance</CardTitle>
          <CardDescription>
            A comparison of performance across North America
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <TableauViz 
            src='https://10ax.online.tableau.com/t/rcgsepulse/views/superstore/customer_region'
            width={800}
            height={218}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
      
    </TabsContent>
  )
}

const SampleList = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">
            olivia.martin@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jackson Lee</p>
          <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
          <p className="text-sm text-muted-foreground">
            isabella.nguyen@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">William Kim</p>
          <p className="text-sm text-muted-foreground">will@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sofia Davis</p>
          <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div>
    </div>
  )
}
