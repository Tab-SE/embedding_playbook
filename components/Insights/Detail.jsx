import { useDetail } from "../../hooks";
import { parseDetail } from "../../utils/parse";
import VegaLiteViz from "../VegaLiteViz";
import Carousel from "../Carousel";

// returns a minimal representation for the UI
function Detail(props) {
  const { metric, stats } = props;
  let details;

  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useDetail(metric);

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

export default Detail;
