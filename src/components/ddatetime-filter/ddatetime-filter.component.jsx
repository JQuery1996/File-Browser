import React, { useState, useEffect } from 'react';

import DDateTime from '../ddatetime-input/ddatetime-input.component';
const DDateTimeFilter = ({ filter, filterValue, clear, handleDateTimeClear, handleDateTimeChange, handleDeleteFilter , isDynamic }) => {

    const [datetimeClear, setDatetimeClear] = useState(clear)
    const [values, setValues] = useState(filterValue);


    const handleDateChange = (name, value, id) => {
        setDatetimeClear(false);
        handleDateTimeChange(name, value, id);
    }

    const handleDateClear = (e, name) => {
        e.preventDefault();
        setDatetimeClear(true);
        setValues(null);
        handleDateTimeClear(name);
    }

    useEffect(() => {
        if (clear || filterValue === null) {
            setDatetimeClear(true);
            setValues(null);
        }
    }, [filterValue])



    return (
        <div className='ddatetime' >
            <div className='label'>
                <label>{filter.placeholder}</label>
                <button style={{ width: '25px', borderRadius: '5px', height: '25px', backgroundColor: 'white' }}
                    onClick={(e) => handleDateClear(e, filter.name)} >X</button>
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
                    onClick={() => handleDeleteFilter(filter.value)}>-</button>
                    : 
                    null
            }
             </div>
            <div className='calender'>
                <div className='ddate'>
                    <label className='lab'> من</label>
                    <DDateTime
                        id={'from'}
                        name={filter.name}
                        clear={datetimeClear}
                        width={'200px'}
                        initialValue={values}
                        handleOnChange={handleDateChange}
                    />
                </div>
                <div className='ddate'>
                    <label className='lab'>إلى</label>
                    <DDateTime
                        id={'to'}
                        name={filter.name}
                        clear={datetimeClear}
                        width={'200px'}
                        initialValue={values}
                        handleOnChange={handleDateChange}
                    />
                </div>
            </div>
        </div>
    )
}
export default DDateTimeFilter;