// eslint-disable-next-line no-unused-vars
import tab_embed from '../../../utils/embed_api/embed_api';
import { useState, useEffect } from 'react'

function Value(props) {
  const [checked, setChecked] = useState(true);
  const [count, setCount] = useState(0);
  const [dashboard, setDashboard] = useState(null);

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

  useEffect(() => {
    const applyFilter = async (updateType) => {
      if (dashboard && count > 0) {
        try {
          // For more information, see https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_filter.html
          await dashboard.applyFilterAsync(
            props.categoryName, // the name of the filter
            [props.text], // array of values
            updateType // default is FilterUpdateType.Replace other options Add, Remove or All
          )} catch (e) {
          console.error(e.toString());
        }
      }
    }

    let updateType = undefined;
    switch(checked) {
      case true:
        // setUpdateType('add'); // if checked by user, add to filters
        updateType = 'add';
        break;
      case false:
        // setUpdateType('remove'); // if unchecked by user, remove from filters
        updateType = 'remove';
        break;
      default:
        throw new Error('Filter Error: unrecognized updateType!');
    }

    applyFilter(updateType);
  }, [checked, count, dashboard, props.categoryName, props.text])

  const handleChecked = (e) => {
    setChecked(e.target.checked);
    setCount(count + 1);
  }

  return (
  <>
    <div key={`${props.categoryName}-${props.text}-${props.color}`} className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{props.text}</span> 
        {props.color === 'primary' ? (
          <input 
            type="checkbox"  
            className="checkbox checkbox-primary" 
            onChange={e => handleChecked(e)}
            checked={checked}
          />
        ) : (
          <input 
            type="checkbox"  
            className="checkbox checkbox-secondary" 
            onChange={e => handleChecked(e)}
            checked={checked}
          />
        )}
        
      </label>
    </div>
  </>
  )
}

function Segment(props) {
  return (
    <div>
      <ul className="menu m-4 bg-base-200 w-56 p-0 rounded">
        <li>
          <details>
            <summary className="text-xl text-sf-white font-semibold rounded bg-primary" >
              {props.categoryName}
            </summary>
            <ul>
              <Value text='Consumer' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} color={props.color} />
              <Value text='Corporate' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} color={props.color} />
              <Value text='Home Office' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} color={props.color} />
            </ul>
          </details>
        </li>
      </ul>
    </div>
  )
}

function Category(props) {
  return (
    <div>
      <ul className="menu m-4 bg-base-200 w-56 p-0 rounded">
        <li>
          <details>
            <summary className="text-xl text-sf-neutral-10 font-semibold rounded bg-secondary" >
              {props.categoryName}
            </summary>
            <ul>
              <Value text='Technology' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} color={props.color} />
              <Value text='Office Supplies' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} color={props.color} />
              <Value text='Furniture' categoryName={props.categoryName} viz={props.viz} interactive={props.interactive} color={props.color} />
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
        color='primary' 
        viz={props.viz}
        interactive={props.interactive}
      />
      <Category 
        categoryName='Category' 
        type='categorical' 
        color='secondary'
        viz={props.viz} 
        interactive={props.interactive}
      />
  </div>
  )
}

export default Categories;
