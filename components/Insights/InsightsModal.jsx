import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "components/ui";

import { Insights } from "components";

export const InsightsModal = (props) => {
  const { metric, stats } = props;

  return (
    <DialogContent className="max-w-full w-max dark:bg-stone-900">
      <DialogHeader className="ml-6">
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
    </DialogContent>
  )
}
