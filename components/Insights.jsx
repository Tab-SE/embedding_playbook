import { useInsights } from '../hooks';
import { parseDetail } from '../utils/parse';
import { VegaLiteViz } from './VegaLiteViz';
import { Carousel } from './Carousel';

// Insights modal
export const Insights = (props) => {
  const { metric, stats } = props;

  return (
    <>
      <div className='flex items-end p-4'>
        <h1 className='flex-0 font-bold text-4xl text-stone-600'>
          {metric.name}:
        </h1>
        <p className='flex-1 font-bold text-4xl text-stone-800 mx-2'>{stats.value}</p>
      </div>
      <div className='my-8' >
        <Detail 
          metric={metric}
        />
      </div>
    </>
  )
}

// Insights displayed inside a carousel
function Detail(props) {
  const { metric } = props;
  let details;

  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useInsights(metric);

  if (isError) {
    console.debug(error);
  }
  if (isSuccess) {
    // main data found in insight groups
    details = parseDetail(data);
  }

  return (
    <div className="flex justify-center">
      <Carousel> 
        {!details ? null : details.map((insight, index) => {
          const { id, type, markup, viz, fact, characterization, question, score } = insight;
          return type !== 'ban' ? (
            <div key={id} className="mx-4 w-full">
              <p className="text-orange-400 italic text-2xl font-semibold my-4">
                Insight
                <span className="text-slate-100 italic text-2xl font-semibold my-4 ml-4" >{question}</span>
              </p>
              {Object.entries(viz).length === 0 ? <></> : <VegaLiteViz height={104} width={900} spec={viz}></VegaLiteViz>}
              <p className="text-slate-100 flex text-lg my-4" >{markup}</p>
            </div>
          ) : null
        })}
      </Carousel>
    </div>
  ) 
}
