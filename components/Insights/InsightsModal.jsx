import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Insights, TableauEmbed, Chat } from "components";

export const InsightsModal = (props) => {
  const { metric, stats } = props;

  return (
    <DialogContent className="max-w-[93vw] h-[93vh] dark:bg-stone-900">
      <Tabs defaultValue="insights">
        <DialogHeader className="ml-6">
          <DialogTitle className="text-3xl">
            <span className={`${stats.color} inline-block`}>{stats.direction}</span> <span className="text-stone-600 dark:text-stone-300">
              {metric.name}:
              <span className="text-xl ml-3">
                {metric.namePeriod} - {metric.nameFilters}
              </span>
            </span> <span className="font-bold ml-3">{stats.value}</span>
          </DialogTitle>
          <DialogDescription className='pt-3'>
            <span className={`text-2xl text-muted-foreground ${stats.color}`}>
              {stats.absolute}
            </span>
            <span className={`text-2xl text-muted-foreground ${stats.color}`}>
              &nbsp; △ {stats.relative ? `${stats.relative}` : null}
            </span>
{/*             <TabsList className='mx-6'>
              <TabsTrigger value="insights">
                Insights
              </TabsTrigger>
              <TabsTrigger value="dashboard">
                Dashboard
              </TabsTrigger>
            </TabsList> */}
          </DialogDescription>
        </DialogHeader>
        <InsightsChat metric={metric} stats={stats} />
        <Dashboards src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/DaystoShip' />
      </Tabs>
    </DialogContent>
  )
}

const InsightsChat = (props) => {
  const { metric, stats } = props;

  return (
    <TabsContent value="insights" className="space-y-4">
      <div className="grid grid-cols-12" value="insights">
        <section className="col-span-7">
          <Insights metric={metric} stats={stats} />
        </section>
        <section className="col-span-5">
          <Chat />
        </section>
      </div>
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
        layouts={{
          '*': { 'device': 'default', 'width': 1300, 'height': 540 }
        }}
      />
    </TabsContent>
  )
}
