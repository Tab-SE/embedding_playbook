// eslint-disable-next-line no-unused-vars
import tab_embed from '../../../../../embed_api/embed_api'
import { useRef, useState, useEffect } from 'react'
import FilterList from '../filterList'

function Value(props) {
  const [checked, setChecked] = useState(true);

  // useEffect(() => {
  //   if (props.interactive) {
  //     console.log('interactive', props.interactive);
  //   }
  // }, [props.interactive]);

  useEffect(() => {
    if (props.viz && props.interactive) {
      console.log('interactive', props.interactive);
      async function handleFilters() {
        // Make the Overview dashboard the active sheet
        const dashboard = await props.viz.workbook.activateSheetAsync('Profitability (E)');
        let updateType = 'replace';

        try {
          switch(checked) {
            case true:
              updateType = 'add'; // if checked by user, add to filters
              break;
            case false:
              updateType = 'remove'; // if unchecked by user, remove from filters
              break;
            default:
              throw new Error('Filter Error: input state deteriorated!');
          }

          // For more information, see https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_filter.html
          await dashboard.applyFilterAsync(
            props.categoryName, // the name of the filter
            [props.text], // array of values
            updateType // default is FilterUpdateType.Replace other options Add, Remove or All
          );
        } catch (e) {
          console.error(e.toString());
        }
      }
      handleFilters();
    }

  }, [props.interactive, props.viz, checked]);


  const handleChecked = (e) => {
    setChecked(e.target.checked);
  }

  return (
  <>
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{props.text}</span> 
        <input 
          type="checkbox"  
          className={`checkbox checkbox-error`} 
          onChange={e => handleChecked(e)}
          checked={checked}
        />
      </label>
    </div>
  </>
  )
}

function Segment(props) {
  return (
    <div>
      <ul className="menu m-4 bg-base-200 w-56 rounded-box">
        <li>
          <details>
            <summary className={`text-lg font-semibold text-error`} >
              {props.categoryName}
            </summary>
            <ul>
              <Value text='Consumer' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} />
              <Value text='Corporate' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} />
              <Value text='Home Office' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} />
            </ul>
          </details>
        </li>
      </ul>
    </div>
  )
}

function ProductCategory(props) {
  return (
    <div>
      <ul className="menu m-4 bg-base-200 w-56 rounded-box">
        <li>
          <details>
            <summary className={`text-lg font-semibold text-error`} >
              {props.categoryName}
            </summary>
            <ul>
              <Value text='Technology' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} />
              <Value text='Office Supplies' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} />
              <Value text='Furniture' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} />
            </ul>
          </details>
        </li>
      </ul>
    </div>
  )
}

function Categories(props) {
  return (
  <div className='grid grid-flow-col auto-cols-max auto-rows-max'>
      <Segment 
        categoryName='Segment' 
        type='categorical' 
        color='info' 
        viz={props.viz}
        interactive={props.interactive}
      />
      <ProductCategory 
        categoryName='Category' 
        type='categorical' 
        color='info'
        viz={props.viz} 
        interactive={props.interactive}
      />
  </div>
  )
}

export default Categories;
