import VegaLiteViz from "./VegaLiteViz/VegaLiteViz";

function BAN(props) {
  const summaries = props.insights.ban.summaries[0].result;
  const insights = props.insights.ban.insights[0].result;
  const viz = summaries?.viz;
  const markup = insights?.markup;
  const value = insights?.facts?.target_period_value?.formatted;
  const label = insights?.facts?.target_period_value?.label;

  return (
    <>
    <div className='flex items-end p-4'>
      <h1 className='flex-0 nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100'>
        {props.title}
      </h1>
      <p className='flex-1 nx-text-4xl mx-4'>{value}</p>
    </div>
    <VegaLiteViz height={104} spec={viz}></VegaLiteViz>
    <p dangerouslySetInnerHTML={{__html: markup}} />
    </>
  )
}

export default BAN;
