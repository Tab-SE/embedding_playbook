import { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import Categories from './components/categories/categories'
import { useCategoricalFilter } from '../../../tableau/tableau'
import { useQuery, } from "@tanstack/react-query"
import filterList from '../filters/components/filterList'
import axios from 'axios'


function FiltersBtn(props) {
  return (
    <button 
    className="btn bg-sf-indigo btn-circle border-none outline-none text-white hover:text-sf-indigo" 
    onClick={()=>props.modal.showModal()}>
      <FontAwesomeIcon icon={faFilter} size='2xl' />
    </button>
  )
}

function Filters(props) {
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  const modal = ref.current;
  const [dashboard, setDashboard] = useState(null);
  
  const result = useQuery({
    queryKey: ['viz', 'filters', dashboard?.name],
    queryFn: async () => await syncFilters(dashboard)
  });

  const users = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      return axios.get('https://randomuser.me/api/?gender=female');
    }
  })

  useEffect(() => {
    function getDashboard() {
      if (props.viz) {
        // Make the Overview dashboard the active sheet
        setDashboard(props.viz.workbook.activeSheet);
      }
    }

    if (!dashboard && props.interactive) {
      getDashboard();
    }
  }, [props.viz, props.interactive, dashboard]);

  // const result = useCategoricalFilter(dashboard);

  async function syncFilters(sheet) {
    console.log('sheet', sheet);
    let categoricalFilters;
    // For more information, see https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_filter.html
    if (sheet) {
      try {
        // const dashFilters = await sheet.getFiltersAsync();
        // console.log(dashFilters);
        // show # and names of categorical filters in the Console
        // categoricalFilters = dashFilters.filter((df) => df.filterType === FilterType.Categorical);

        // console.log(`The number of categorical filters: ${categoricalFilters.length}
        // Filters: ${categoricalFilters.map((s) => s.fieldName)}`);
        // console.log('Available categorical dashboard filters:', categoricalFilters);
        
        categoricalFilters = filterList;
      } catch (e) {
        console.error(e.toString());
      };
    } else {
      categoricalFilters = filterList;
    }
    console.log(categoricalFilters);
    return categoricalFilters;
  };

// <button className="btn btn-outline btn-secondary w-32 justify-self-end">Reset</button>
// <button 
//   className="btn btn-outline btn-primary w-32 justify-self-end"
// >
//   Apply All
// </button>

  return (
    <>
      <FiltersBtn modal={modal} />
      <dialog id="my_modal_2" className="modal" ref={ref}>
        <div className="modal-box md:max-w-xl lg:max-w-3xl xl:max-w-5xl bg-sf-white dark:bg-sf-neutral-80">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost absolute right-2 top-2 outline-none">
              <FontAwesomeIcon icon={faCircleXmark} size='2xl' />
            </button>
          </form>
          <div className='grid grid-flow-col grid-cols-3 auto-rows-max mr-10'>
            <h3 className="font-bold text-3xl mb-9">
              <FontAwesomeIcon icon={faFilter} size='lg' />
              <span className='p-4'>Filters</span>
            </h3>
          </div>
          <Categories viz={props.viz} interactive={props.interactive} />
          <p className="pt-6 text-sm">(Press <kbd className="kbd">ESC</kbd> key or click outside to close)</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default Filters;
