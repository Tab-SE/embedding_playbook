import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "components/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui"
import { Insights, TableauEmbed, Chat } from "components"

export const InsightsModal = (props) => {
  const { metric, stats } = props;

  return (
    <DialogContent className="w-fit min-w-[1325px] h-fit min-h-[750px] dark:bg-stone-900 overflow-hidden">
      <Tabs defaultValue="insights" className="flex flex-col h-full">
        <DialogHeader className="ml-6 flex-shrink-0">
          <DialogTitle className="text-3xl">
            <span className={`${stats.color} inline-block`}>{stats.direction}</span>{" "}
            <span className="text-stone-600 dark:text-stone-300">{metric.name}:</span>{" "}
            <span className="font-bold ml-3">{stats.value}</span>
          </DialogTitle>
          <DialogDescription className="pt-3">
            <span className={`text-2xl text-muted-foreground ${stats.color}`}>{stats.absolute}</span>
            <span className={`text-2xl text-muted-foreground ${stats.color}`}>
              &nbsp; △ {stats.relative ? `${stats.relative}` : null}
            </span>
            <TabsList className="mx-6">
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-auto">
          <InsightsChat metric={metric} stats={stats} />
          <Dashboards src="https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/DaystoShip" />
        </div>
      </Tabs>
    </DialogContent>
  )
}

const InsightsChat = (props) => {
  const {metric, stats} = props;

  return (
    <TabsContent value="insights" className="h-full overflow-auto">
      <Insights metric={metric} stats={stats} />
    </TabsContent>
  )
}

const Dashboards = (props) => {
  const { src } = props;
  return (
    <TabsContent value="dashboard" className="h-full overflow-auto">
      <TableauEmbed
        src={src}
        width={1300}
        height={540}
        hideTabs={true}
        device="default"
        toolbar="hidden"
        customToolbar={false}
        layouts={{
          "*": { device: "default", width: 1300, height: 540 },
        }}
      />
    </TabsContent>
  )
}
