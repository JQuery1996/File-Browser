import React, { useState, useEffect } from 'react';

import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';

import './ddatetime-input.styles.css';

const DDateTime = ({ id, name, clear, handleOnChange, initialValue }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (clear) {
            setValue(null)
        }
    }, [clear])

    return (
        <div className='JqxDateTimeInput'>
            {/* <input
                type={'date'}
                // name={s.name}
                ltr={'true'}
                width={165}
                height={30}
                // validationType={s.type}
                // formatString={'d'}
                // className={classnames(
                //     'form-control',
                //     { 'is-valid': stateObj[s.name].error === false },
                //     { 'is-invalid': stateObj[s.name].error }
                // )}
                // onChange={evt =>
                //     handleChange(validateFields.validateDate, evt)
                // }
                onChange={(e) => handleOnChange(name, e.target.valueAsDate, id)}
                // onChange={(e) => setValue(e.target.valueAsDate)}
                // onSelect={(e) => console.log(e)}
                value={value}
            /> */}
            <JqxDateTimeInput
                value={value}
                onTextchanged={(e) => setValue(e.args.date)}
                onClose={(e) => handleOnChange(name, e.args.date, id)}
                rtl={true}
            />
        </div>
    )
};

export default DDateTime;