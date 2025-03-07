"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui";

import { TableauEmbed } from 'components';

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
          <CardContent className="flex items-center justify-center">
            <TableauEmbed
              src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/customer_scatter_plot'
              hideTabs={true}
              toolbar='hidden'
              className='
              min-w-[240px] min-h-[600px]
              sm:min-w-[480px] sm:min-h-[500px]
              md:min-w-[630px] md:min-h-[500px]
              lg:min-w-[300px] lg:min-h-[300px]
              xl:min-w-[400px] xl:min-h-[300px]
              2xl:min-w-[470px] 2xl:min-h-[300px]
              '
              layouts = {{
              '*': { 'device': 'default' }
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-5 sm:col-span-7 lg:col-span-5 dark:bg-stone-900">
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
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/customer_region'
            hideTabs={true}
            toolbar='hidden'
            className='
              min-w-[240px] min-h-[600px]
              sm:min-w-[510px] sm:min-h-[500px]
              md:min-w-[630px] md:min-h-[500px]
              lg:min-w-[570px] lg:min-h-[218px]
              xl:min-w-[720px] xl:min-h-[300px]
              2xl:min-w-[840px] 2xl:min-h-[300px]
              '
            layouts = {{
              '*': { 'device': 'default' }
            }}
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}

const SampleList = () => {
  return (
    <div className="flex flex-col space-y-8 overflow-hidden">
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
      </div>
    </div>
  )
}
