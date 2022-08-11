
import React, { useState, useEffect } from 'react';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';
import JqxPanel from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel';
import moment from 'moment';

import DSelect2 from '../dselect2/dselect2.component';
import DDateTime from '../ddatetime-input/ddatetime-input.component';
import DBasicFilter from '../dbasic-filter/dbasic-filter.component';
import DDateTimeFilter from '../ddatetime-filter/ddatetime-filter.component';
import DDropDownFilter from '../ddropdown-filter/ddropdown-filter.component';

import './dlov-filter-container.styles.css';


const DLovFilterContainer = ({ filters, gridcols, app, action, searchClick, clearClick }) => {
    const [filterValues, setFilterValues] = useState({})
    const [select2Clear, setSelect2Clear] = useState(false)
    const [datetimeClear, setDatetimeClear] = useState(false)
    const [dateClear, setDateClear] = useState({});
    const [filterslov, setFilterslov] = useState([]);
    const [sqlWhereStatement, setSqlWhereStatement] = useState('');
    useEffect(() => {
        let array = []
        if (action) {
            action.grid.datafields.map(itm => {
                if (itm.isFilterBy) {
                    let obj = {
                        ...itm,
                        value: itm.name,
                        label: itm.text,
                    }
                    array.push(obj);
                }
            })
            setFilterslov(array);
        }
    }, [action])

    useEffect(() => {
        searchClick(sqlWhereStatement);
    }, [sqlWhereStatement])


    useEffect(() => {
        let obj = {};
        action.grid.datafields.filter(fltr => fltr.isFilterBy).map(f => {
            if (f.filterType === 'date') {
                obj[f.name] = null
            }
            else if (f.filterType === 'dropdown') {
                handleSelect2Clear(f.name)
            }
            else
                obj[f.name] = null
        }
        );
        setFilterValues(obj)
    }, [action])

    const clearFilter = (fltr) => {

        if (fltr.filterType === 'date')
            setFilterValues({
                ...filterValues,
                [fltr.name]: null,
            })

        else if (fltr.filterType === 'dropdown')
            setFilterValues({
                ...filterValues,
                [fltr.name]: handleSelect2Clear(fltr.name),
            })

        else
            setFilterValues({
                ...filterValues,
                [fltr.name]: null,

            })
    }

    const searchBtn = () => {
        handleSearchClick(filters);
    };

    const clearBtn = () => {
        handleClearClick(filters);
    };

    const sleep = ms =>
        new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });

    const handleSearchClick = async (filters) => {
        setSqlWhereStatement('');
        let whereStatement = '';

        action.grid.datafields.filter(fltr => fltr.isFilterBy).map(itm => {
            switch (itm.filterType) {
                case 'string':
                    if (itm.isFilterBy) {
                        let val = filterValues[itm.name] ? filterValues[itm.name] : ''; val.length > 0 ?
                            whereStatement = whereStatement + " AND " +
                            (itm.hasOwnProperty('fromAction') ? itm.fromAction.tbl + "." + itm.fromAction.col
                                : itm.name) + " LIKE '%" + val + "%'"
                            : whereStatement = whereStatement
                    }
                    break;
                case 'int':
                    if (itm.isFilterBy) {
                        let val = filterValues[itm.name] ? filterValues[itm.name] : ''; val.length > 0 ?
                            whereStatement = whereStatement + " AND " +
                            (itm.hasOwnProperty('fromAction') ? itm.fromAction.tbl + "." + itm.fromAction.col
                                : itm.name) + " = " + val
                            : whereStatement = whereStatement
                    }
                    break;
                case 'date':
                    if (itm.isFilterBy) {
                        let val = filterValues[itm.name] ? filterValues[itm.name] : null;
                        if (typeof val === 'object' && val && val.from && val.to) {
                            let datefrom = moment(val.from).format("MM/DD/YYYY");
                            let dateto = moment(val.to).format("MM/DD/YYYY");
                            if (dateto < datefrom) {
                                let min = dateto
                                dateto = datefrom
                                datefrom = min
                                if (itm.hasOwnProperty('fromAction')) {
                                    whereStatement = whereStatement + " AND " + itm.fromAction.tbl + "." + itm.fromAction.col + " BETWEEN to_date('" + datefrom + "','MM/DD/YYYY')" +
                                        " AND to_date('" + dateto + "','MM/DD/YYYY')"
                                }
                                else {
                                    whereStatement = whereStatement + " AND " + itm.name + " BETWEEN to_date('" + datefrom + "','MM/DD/YYYY')" +
                                        " AND to_date('" + dateto + "','MM/DD/YYYY')"
                                }
                            }
                            else
                                if (itm.hasOwnProperty('fromAction')) {
                                    whereStatement = whereStatement + " AND " + itm.fromAction.tbl + "." + itm.fromAction.col + " BETWEEN to_date('" + datefrom + "','MM/DD/YYYY')" +
                                        " AND to_date('" + dateto + "','MM/DD/YYYY')"
                                }
                                else {
                                    whereStatement = whereStatement + " AND " + itm.name + " BETWEEN to_date('" + datefrom + "','MM/DD/YYYY')" +
                                        " AND to_date('" + dateto + "','MM/DD/YYYY')"
                                }
                        }
                    }
                    else
                        whereStatement = whereStatement;
                    break;
                case 'dropdown':
                    if (itm.isFilterBy) {
                        let value = filterValues[itm.name] != null ? filterValues[itm.name] : null;
                        if ((value != null ||
                            value != undefined) &&
                            value.length != 0) {
                            whereStatement = whereStatement + " AND ";
                            if (itm.hasOwnProperty('fromAction')) {
                                itm.fromAction.hasOwnProperty('alias')
                                    ? whereStatement = whereStatement + itm.fromAction.alias + "." + itm.fromAction.col
                                    : whereStatement = whereStatement + itm.fromAction.tbl + "." + itm.fromAction.col;
                            }
                            else {
                                whereStatement = whereStatement + itm.name;
                            }
                            if (itm.type === "int")
                                whereStatement = whereStatement + " = " + value;
                            else if (itm.type === "string")
                                whereStatement = whereStatement + " LIKE '%" + value + "%'";
                        }
                        else { whereStatement = whereStatement; }
                    }
                    break;
                default:
                    break;
            }
        });
        setSqlWhereStatement(whereStatement);
    }

    const handleSelect2Change = (name, value) => {
        setSelect2Clear(false)
        setFilterValues({
            ...filterValues, [name]: value ? value.value : ''
        })
    };

    const handleDateTimeChange = (name, value, id) => {
        setDatetimeClear(false);
        setFilterValues({
            ...filterValues,
            [name]: {
                ...filterValues[name],
                [id]: value,
            }
        })
    };

    const handleDateTimeClear = (name) => {
        setDateClear(true);
        setFilterValues({
            ...filterValues,
            [name]: null,
        })
    }

    const handleSelect2Clear = (name) => {
        setSelect2Clear(true)
        setFilterValues({
            ...filterValues, [name]: ''
        })
    };


    const handleClearClick = (filters) => {
        setSqlWhereStatement('');
        let whereStatement = '';
        let obj = {};
        action.grid.datafields.filter(fltr => fltr.isFilterBy).map(f => {
            if (f.filterType === 'date') {
                obj[f.name] = null
            }
            else if (f.filterType === 'dropdown') {
                handleSelect2Clear(f.name)
            }
            else {
                obj[f.name] = ''
            }

        });
        setFilterValues(obj)
        setSqlWhereStatement(whereStatement);
    };


    const lovfilters = () => {
        let lovfilters = [];
        if (gridcols) {
            action.grid.datafields.filter(fltr => fltr.isFilterBy).map((filter) => {

                {
                    gridcols.map(gridcol => {
                        if (filter.name === gridcol.name && gridcol.isFilterBy) {
                            lovfilters.push(filter);
                        }
                    }
                    )
                }
            }
            );
        }
        else {
            lovfilters = action.grid.datafields.filter(fltr => fltr.isFilterBy);
        }
        return lovfilters;
    }
    return (
        <div className='lov-filter-section'>
            <div className='filter-area'>
                {
                    lovfilters().filter((itm) => (itm.isFilterBy))
                        .map((filter, idx) => (
                            <div className='filter' key={idx}>
                                <div className='value'>
                                    {(filter.filterType === 'string' || filter.filterType === 'int') &&
                                        <div className='dbasicfilter'>
                                            <DBasicFilter
                                                filter={filter}
                                                filterValues={filterValues}
                                                setFilterValues={setFilterValues}
                                                isDynamic={false}
                                                /* handleDeleteFilter={handleDeleteFilter}  *//>
                                        </div>
                                    }
                                    {(filter.filterType === 'date') &&
                                        <div className='ddatetimefilter'>
                                            <DDateTimeFilter
                                                filter={filter}
                                                filterValue={filterValues[filter.name]}
                                                clear={dateClear}
                                                handleDateTimeClear={handleDateTimeClear}
                                                handleDateTimeChange={handleDateTimeChange}
                                                isDynamic={false}
                                                /* handleDeleteFilter={handleDeleteFilter}  *//>
                                        </div>
                                    }
                                    {(filter.filterType === 'dropdown') &&
                                        <div className='ddropdownfilter'>
                                            <DDropDownFilter
                                                app={app}
                                                action={action}
                                                filter={filter}
                                                clear={select2Clear}
                                                handleSelect2Change={handleSelect2Change}
                                                handleClearSelect2={handleSelect2Clear}
                                                isDynamic={false}
                                                /* handleDeleteFilter={handleDeleteFilter}  *//>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
            </div>
            <div className='filter-action'>
                <JqxButton template={'success'} onClick={() => searchBtn()} theme={'light'}> بحث </JqxButton>
                <JqxButton template={'danger'} onClick={() => clearBtn()} theme={'light'}> إلغاء </JqxButton>
            </div>
        </div>
    )
};

export default DLovFilterContainer;