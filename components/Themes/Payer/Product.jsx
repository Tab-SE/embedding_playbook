import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Product = () => {
  return (
    <TabsContent value="product" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-6 dark:bg-stone-900">
          <CardHeader>
            <CardTitle>KPI</CardTitle>
            <CardDescription>
              Compares profit vs sales where each mark is an individual customer
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TableauEmbed
              src='https://us-west-2b.online.tableau.com/#/site/eacloud/views/AntoineExperiment/KPI'
              width={450}
              height={450}
              hideTabs={true}
              device='default'
              toolbar='hidden'
            />
          </CardContent>
        </Card>
        <Card className="col-span-6 dark:bg-stone-900">
          <CardHeader>
            <CardTitle>Volume of Claims by Denial Cause</CardTitle>
            <CardDescription>
              Compares profit vs sales where each mark is an individual customer
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TableauEmbed
              src='https://us-west-2b.online.tableau.com/#/site/eacloud/views/AntoineExperiment/VolumeofClaimsbyDenialCause'
              width={450}
              height={450}
              hideTabs={true}
              device='default'
              toolbar='hidden'
            />
          </CardContent>
        </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-6 dark:bg-stone-900">
          <CardHeader>
            <CardTitle>Hospital Scatter Plot</CardTitle>
            <CardDescription>
              Compares profit vs sales where each mark is an individual customer
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TableauEmbed
              src='https://us-west-2b.online.tableau.com/#/site/eacloud/views/AntoineExperiment/HospitalScatterPlot'
              width={450}
              height={450}
              hideTabs={true}
              device='default'
              toolbar='hidden'
            />
          </CardContent>
        </Card>
        <Card className="col-span-6 dark:bg-stone-900">
          <CardHeader>
            <CardTitle>Diagnostic Scatter Plot</CardTitle>
            <CardDescription>
              Compares profit vs sales where each mark is an individual customer
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TableauEmbed
              src='https://us-west-2b.online.tableau.com/#/site/eacloud/views/AntoineExperiment/DiagnosticScatterPlot'
              width={450}
              height={450}
              hideTabs={true}
              device='default'
              toolbar='hidden'
            />
          </CardContent>
        </Card>
        </div>


        <div>
        <Card className='dark:bg-stone-900'>
        <CardHeader>
          <CardTitle>
          trend Line</CardTitle>
          <CardDescription>
            Makana Health Test
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src='https://us-west-2b.online.tableau.com/#/site/eacloud/views/AntoineExperiment/trendLine'
            width={800}
            height={800}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
        </div>
    </TabsContent>
  )
}
