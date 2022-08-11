import React, { useState, useEffect } from 'react';

import { AsyncPaginate } from "react-select-async-paginate";

import './dreport-type-select2.styles.css';

const DReportTypeSelect2 = ({ clear, setReportType }) => {

    const [value, onChange] = useState(null);

    useEffect(() => {
        if (clear)
            onChange(null)
    }, [clear])

    const array = [
        { label: "pdf", value: "pdf", },
        { label: "xlsx", value: "xlsx", },
        { label: "docx", value: "docx", },
    ];

    return (
        <div className='dreport-row-form'>
            <div className='dreport-input-caption'>
                نمط التقرير
            </div>
            <div className='dreport-input-form'>
                <div className='form-control' style={{ border: '0', padding: '0' }}>
                    <AsyncPaginate
                        id={1}
                        placeholder={'نمط التقرير'}
                        value={value}
                        isRtl={true}
                        options={array}
                        onChange={onChange}
                        onBlur={() => setReportType(value)}
                    />
                </div>
            </div>
        </div>)
}
export default DReportTypeSelect2;