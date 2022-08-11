import React, { useState } from 'react';
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';

const DBasicFilter = ({ filter, filterValues, setFilterValues, handleDeleteFilter, isDynamic }) => {
  return (
    <div className='input'>
      <div className='label'>
        <label>{filter.placeholder}</label>
      </div>
      <div className='jqxinput' style={{display:'flex'}}>
        <JqxInput
          onChange={(e) => setFilterValues({
            ...filterValues, [filter.name]: e.target.value
          })}
          value={filterValues && filterValues[filter.name] ? filterValues[filter.name] : ''}
          rtl={true}
          width={'214px'}
        />
        <button
          style={{
            backgroundColor: 'rgb(255, 253, 253)',
            height: '25px',
            borderRadius: '5px',
          }}
          onClick={(e) => setFilterValues({
            ...filterValues, [filter.name]: ''
          })}>X</button>

{isDynamic ?
        <button style={{
                      width: '25px',
                      borderRadius: '5px',
                      height: '25px',
                      backgroundColor: 'white',
                      textAlign: 'center',
                      borderColor: 'red',
                      color: 'red'
                    }}
                      onClick={() => { handleDeleteFilter(filter.value)}}>-</button>
          :
          null
      }
      </div>
    </div>
  )

}
export default DBasicFilter;