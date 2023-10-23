import { useRef, useState, useEffect } from 'react'
import FilterList from './filterList'

function Value(props) {
  const [checked, setChecked] = useState(true);

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
          className={`checkbox checkbox-${props.color}`} 
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
            <summary className={`text-lg font-semibold text-${props.color}`} >
              {props.categoryName}
            </summary>
            <ul>
              <Value text='All' color={props.color} />
              <Value text='Consumer' color={props.color} />
              <Value text='Corporate' color={props.color} />
              <Value text='Home Office' color={props.color} />
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
            <summary className={`text-lg font-semibold text-${props.color}`} >
              {props.categoryName}
            </summary>
            <ul>
              <Value text='All' color={props.color} />
              <Value text='Technology' color={props.color} />
              <Value text='Office Supplies' color={props.color} />
              <Value text='Furniture' color={props.color} />
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
        color='error' 
      />
      <ProductCategory 
        categoryName='Product Category' 
        type='categorical' 
        color='info' 
      />
  </div>
  )
}

export default Categories;
