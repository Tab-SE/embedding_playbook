import { useEffect } from "react";
import VegaLiteViz from "../VegaLiteViz";
import { parseBan } from "../../utils/parse";
import bundle from "../../models/Insights/mocks/generate_springboard_insight.json"

function Springboard(props) {
   // returns a minimal representation for the UI
   const parsedBundle = parseBan(bundle);
   // const { value, question, markup, viz  } = parsedBundle[0];

   const viz = parsedBundle[1].viz;
   const markup = parsedBundle[1].markup;

  return (
    <>
    {/* <div className='flex items-end p-4'>
      <h1 className='flex-0 nx-mt-2 nx-text-2xl nx-tracking-tight'>
        {props.title}:
      </h1>
      <p className='flex-1 nx-text-2xl nx-font-bold nx-text-slate-900 dark:nx-text-slate-100 nx-tracking-tight mx-2'>{value}</p>
    </div> */}
    <VegaLiteViz height={104} spec={viz}></VegaLiteViz>
    <p dangerouslySetInnerHTML={{__html: markup}} />
    </>
  )
}

export default Springboard;
