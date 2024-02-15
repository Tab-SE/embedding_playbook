import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui";

import { Insights } from "./Insights";

export const InsightsModal = (props) => {
  const { metric, stats } = props;

  return (
    <DialogContent className="max-w-full w-max">
      <DialogHeader className="ml-6">
        <DialogTitle className="text-3xl">
          <span className="text-stone-600">{metric.name}:</span> <span className="font-bold ml-3">{stats.value}</span>
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
