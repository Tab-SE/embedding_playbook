import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Insights, Pulse } from "components";

export const InsightsModal = (props) => {
  const { metric, stats } = props;
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const site = process.env.NEXT_PUBLIC_ANALYTICS_SITE;
  const src = `${domain}/site/${site}/pulse/metrics/${metric.id}`;

  return (
    <DialogContent className="max-w-full w-[1250px] h-[700px] dark:bg-stone-900">
      <Tabs defaultValue="pulse" className="">
        <TabsList className="mb-6">
          <TabsTrigger value="pulse">Pulse Metric</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="pulse">
            <Pulse 
              src={src}
              height='600px'
              width='1000px'
            />
        </TabsContent>

        <TabsContent value="insights">
          <DialogHeader className="ml-6 mb-6">
            <DialogTitle className="text-3xl">
              <span className="text-stone-600 dark:text-stone-300">{metric.name}:</span> <span className="font-bold ml-3">{stats.value}</span>
            </DialogTitle>
            <DialogDescription>
              <span className={`text-2xl text-muted-foreground ${stats.color}`}>
                {stats.direction} {stats.absolute}
              </span>
              <span className={`text-2xl text-muted-foreground ${stats.color}`}>
                &nbsp; △ {stats.relative ? `${stats.relative}` : null}
              </span>
            </DialogDescription>
          </DialogHeader>
          <Insights metric={metric} stats={stats} />
        </TabsContent>
        
      </Tabs>
    </DialogContent>
  )
}


