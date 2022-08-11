import React from 'react';
import DSelect2 from '../dselect2/dselect2.component';
const DDropDownFilter = ({ app, action, clear, filter, isDynamic, handleSelect2Change, handleDeleteFilter }) => {

    return (
        <DSelect2
            data={{
                application: app,
                action: action,
                name: action.name,
                clear: clear,
                filter: filter,
                filterName: filter.name,
                tblName: filter.fromAction.tbl,
                txtVal: filter.fromAction.txt,
                idVal: filter.fromAction.col,
                placeholder: filter.placeholder,
            }}
            isDynamic={isDynamic}
            handleSelect2Change={handleSelect2Change}
            handleDeleteFilter={handleDeleteFilter}
        />
    )
}
export default DDropDownFilter;