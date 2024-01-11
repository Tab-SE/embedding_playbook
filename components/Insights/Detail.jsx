import { useEffect } from "react";
import VegaLiteViz from "../VegaLiteViz";
import { parseBan } from "../../utils/parse";
import Carousel from "../Carousel";
import bundle from "../../models/Insights/mocks/generate_detail_insight.json"

// returns a minimal representation for the UI
function Detail(props) {
  const parsedBundles = parseBan(bundle);
  const { value } = parsedBundles[0];


  return (
    <div className="flex justify-center">
      <Carousel> 
        {parsedBundles.map((insight, index) => {
          const { viz, question, markup, id } = insight;
          return insight.type !== 'popc' ? (
            <div key={id} className="mx-4">
              <p className="text-orange-400 italic text-2xl font-semibold my-4">
                Insight
                <span className="text-slate-100 italic text-2xl font-semibold my-4 ml-4" 
                  dangerouslySetInnerHTML={{__html: question}} 
                />
              </p>
              {Object.entries(viz).length === 0 ? <></> : <VegaLiteViz height={104} width={800} spec={viz}></VegaLiteViz>}
              <p className="text-slate-100 max-w-4xl flex text-lg my-4" dangerouslySetInnerHTML={{__html: markup}} />
            </div>
          ) : <span key={id} />
        })}
      </Carousel>
    </div>
  ) 
}

export default Detail;
