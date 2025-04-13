import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Insights, TableauEmbed, Chat } from "components";

export const InsightsModal = (props) => {
  const { metric, stats } = props;

  return (
    <DialogContent className="max-w-[93vw] h-[93vh] dark:bg-stone-900">
      <DialogHeader className="ml-6">
          <DialogTitle className="text-3xl">
            <span className={`${stats.color} inline-block`}>{stats.direction}</span> <span className="text-stone-600 dark:text-stone-300">{metric.name}:</span> <span className="font-bold ml-3">{stats.value}</span>
          </DialogTitle>
          <DialogDescription className='pt-3'>
            <div className="mb-12">
              <span className={`text-2xl text-muted-foreground ${stats.color}`}>
                {stats.absolute}
              </span>
              <span className={`text-2xl text-muted-foreground ${stats.color}`}>
                &nbsp; △ {stats.relative ? `${stats.relative}` : null}
              </span>
            </div>
            <Insights metric={metric} stats={stats} />
          </DialogDescription>
        </DialogHeader>
    </DialogContent>
  )
}

const InsightsChat = (props) => {
  const {metric, stats} = props;

  return (
    <TabsContent value="insights" className="space-y-4">
      <Insights metric={metric} stats={stats} />
    </TabsContent>
  )
}

const Dashboards = (props) => {
  const { src } = props;
  return (
    <TabsContent value="dashboard" className="space-y-4">
      <TableauEmbed
        src={src}
        width={1300}
        height={540}
        hideTabs={true}
        device='default'
        toolbar='hidden'
        customToolbar={false}
        layouts = {{
          '*': { 'device': 'default', 'width': 1300, 'height': 540 }
        }}
      />
    </TabsContent>
  )
}
