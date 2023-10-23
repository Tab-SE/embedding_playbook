const filters = [
  {
    "_worksheetName": "Profit Ratio Map",
    "_fieldName": "Segment",
    "_filterType": "categorical",
    "_fieldId": "[federated.1d5vk860twkhqd1bvit1i02ev3x0].[none:Country:nk]",
    "_registryId": 0,
    "_appliedValues": [
      {
        "_value": "Consumer",
        "_nativeValue": "Consumer",
        "_formattedValue": "Consumer"
      },
      {
        "_value": "Corporate",
        "_nativeValue": "Corporate",
        "_formattedValue": "Corporate"
      },
      {
        "_value": "Home Office",
        "_nativeValue": "Home Office",
        "_formattedValue": "Home Office"
      },
    ],
    "_isExcludeMode": false,
    "_isAllSelected": true
  },
  {
    "_worksheetName": "Profit Ratio Map",
    "_fieldName": "Product Category",
    "_filterType": "categorical",
    "_fieldId": "[federated.1d5vk860twkhqd1bvit1i02ev3x0].[none:Country:nk]",
    "_registryId": 0,
    "_appliedValues": [
      {
        "_value": "Technology",
        "_nativeValue": "Technology",
        "_formattedValue": "Technology"
      },
      {
        "_value": "Office Supplies",
        "_nativeValue": "Office Supplies",
        "_formattedValue": "Office Supplies"
      },
      {
        "_value": "Furniture",
        "_nativeValue": "Furniture",
        "_formattedValue": "Furniture"
      },
    ],
    "_isExcludeMode": false,
    "_isAllSelected": true
  }
]

function Value(props) {
  return (
  <>
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{props.text}</span> 
        <input type="checkbox" className={`checkbox checkbox-${props.color}`} />
      </label>
    </div>
  </>
  )
}

function Segment(props) {
  return (
    <ul className="menu m-4 bg-base-200 w-56 rounded-box">
      <li>
        <details open>
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
  )
}

function ProductCategory(props) {
  return (
    <ul className="menu m-4 bg-base-200 w-56 rounded-box">
      <li>
        <details open>
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
  )
}

function Categories(props) {
  return (
  <div>
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
