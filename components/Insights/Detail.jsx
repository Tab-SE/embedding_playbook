import { useEffect } from "react";
import VegaLiteViz from "../VegaLiteViz";
import { parseBan } from "../../utils/parse";
import Carousel from "../Carousel";
import bundle from "../../models/Insights/mocks/generate_detail_insight.json"

function Detail(props) {

  // returns a minimal representation for the UI
  const parsedBundles = parseBan(bundle);
  parsedBundles[0];
  
  // useEffect(() => {
  //   // the metric value is controlled in the parent component but set here
  //   props.pushQA(value);
  // }, [value]);

  const { value  } = parsedBundles[0];
  parsedBundles.pop(0);

  useEffect(() => {
    // the metric value is controlled in the parent component but set here
    props.setMetricValue(value);
  }, [value]);


  return (
    <div className="flex justify-center">
      <Carousel> 
      {parsedBundles.map((insight, index) => {
        const { viz, question, markup } = insight;
        if (insight.type !== 'popc') {
          return (
            <div key={index} className="max-w-2xl w-full mx-4">
              <p className="text-slate-100" dangerouslySetInnerHTML={{__html: question}} />
              {Object.entries(viz).length === 0 ? <></> : <VegaLiteViz height={104} spec={viz}></VegaLiteViz>}
              <p className="text-slate-100" dangerouslySetInnerHTML={{__html: markup}} />
            </div>
          );
        }
      })}
      </Carousel>
    </div>
  ) 
}

export default Detail;
