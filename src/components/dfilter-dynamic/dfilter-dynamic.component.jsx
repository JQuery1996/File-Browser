import React, { useState, useEffect } from 'react';
import DBasicFilter from '../dbasic-filter/dbasic-filter.component';
import DDateTimeFilter from '../ddatetime-filter/ddatetime-filter.component';
import DDropDownFilter from '../ddropdown-filter/ddropdown-filter.component';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import moment from 'moment';
import './dfilter-dynamic.styles.css';

const DFilterDynamic = ({ array, action, app, handleSearchClick, setDetailGridObject }) => {
    const [filterValues, setFilterValues] = useState({});
    const [select2Clear, setSelect2Clear] = useState(false);
    const [dateClear, setDateClear] = useState({});
    const [filterObject, setFilterObject] = useState({
        options: array,
        filters: [],
    });

    const [sqlWhereStatement, setSqlWhereStatement] = useState('');

    useEffect(() => {
        let obj = {};
        array.map(f => {
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

    useEffect(() => {
        handleSearchClick(sqlWhereStatement);
    }, [sqlWhereStatement])

    useEffect(() => {
        setFilterObject({
            options: array,
            filters: [],
        })
    }, [array])

    const handleSelect2Clear = (name) => {
        setSelect2Clear(true)
        setFilterValues({
            ...filterValues, [name]: ''
        })
    };

    const handleDateTimeClear = (name) => {
        setDateClear(true);
        setFilterValues({
            ...filterValues,
            [name]: null,
        })
    }

    const handleDateTimeChange = (name, value, id) => {
        setDateClear(false);
        setFilterValues({
            ...filterValues,
            [name]: {
                ...filterValues[name],
                [id]: value,
            }
        })
    }

    const handleSelect2Change = (name, value) => {
        setSelect2Clear(false)
        setFilterValues({
            ...filterValues, [name]: value ? value.value : ''
        })
    };

    const handleAddFilter = () => {
        let filterSelector = document.getElementById('filterSelect');
        let fltr = filterObject.options.find(itm => itm.name === filterSelector.value);

        setFilterObject({
            options: filterObject.options.filter(itm => itm.name !== fltr.name),
            filters: [...filterObject.filters, fltr],
        });
    }

    const handleDeleteFilter = (id) => {
        let fltr = filterObject.filters.find(itm => itm.name === id);

        setFilterObject({
            options: [...filterObject.options, fltr],
            filters: filterObject.filters.filter(itm => itm.name !== fltr.name),
        });
        clearFilter(fltr)
    }

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

        // searchClick(filterObject.filters);
    }

    const searchBtn = () => {
        searchClick(filterObject.filters);
        setDetailGridObject({
            show: false,
            app: null,
            action: null,
        })
    };

    const clearBtn = () => {
        clearClick(filterObject.filters);
        setDetailGridObject({
            show: false,
            app: null,
            action: null,
        })
    };

    const searchClick = (filters) => {
        setSqlWhereStatement('');
        let whereStatement = '';

        filters.map(itm => {
            switch (itm.filterType) {
                case 'string':
                    if (itm.isFilterBy) {
                        let val = filterValues[itm.name] ? filterValues[itm.name] : '';
                        val.length > 0 ?
                            whereStatement = whereStatement + " AND " +
                            (itm.hasOwnProperty('fromAction')
                                ? (itm.fromAction.hasOwnProperty('alias'))
                                    ? itm.fromAction.alias + "." + itm.fromAction.col
                                    : itm.fromAction.tbl + "." + itm.fromAction.col
                                : itm.name) + " LIKE '%" + val + "%'"
                            : whereStatement = whereStatement
                    }
                    break;
                case 'int':
                    if (itm.isFilterBy) {
                        let val = filterValues[itm.name] ? filterValues[itm.name] : '';
                        val.length > 0 ?
                            whereStatement = whereStatement + " AND " +
                            (itm.hasOwnProperty('fromAction')
                                ? (itm.fromAction.hasOwnProperty('alias'))
                                    ? itm.fromAction.alias + "." + itm.fromAction.col
                                    : itm.fromAction.tbl + "." + itm.fromAction.col
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
                case 'float':
                    if (itm.isFilterBy) {
                        let val = filterValues[itm.name] ? filterValues[itm.name] : '';
                        val.length > 0 ?
                            whereStatement = whereStatement + " AND " +
                            (itm.hasOwnProperty('fromAction')
                                ? (itm.fromAction.hasOwnProperty('alias'))
                                    ? itm.fromAction.alias + "." + itm.fromAction.col
                                    : itm.fromAction.tbl + "." + itm.fromAction.col
                                : itm.name) + " = " + val
                            : whereStatement = whereStatement
                    }
                    break;

                default:
                    break;
            }
        });
        setSqlWhereStatement(whereStatement);
    }

    const clearClick = (filters) => {
        setSqlWhereStatement('');
        let whereStatement = '';
        let obj = {};
        filters.map(f => {
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

    return (
        <div className='dfilterdynamic'>
            <div className='f' style={{ display: "block ruby", }}>
                <span className='text'> محددات البحث </span>
                <div className='select-button' style={{ display: "flex"}}>
                    <select id='filterSelect'
                        style={{ width: "200px", display: filterObject.options.length > 0 ? "block" : "none"  }}>
                        {filterObject.options.map((op, idx) => (
                            <option value={op.value} key={idx} >
                                {op.label}
                            </option>

                        ))}
                    </select>
                    <button className='add-filter'
                        style={{ display: filterObject.options.length > 0 ? "block" : "none" }}
                        onClick={handleAddFilter}> + </button>
                </div>
            </div>
            <div className='filter-section'>
                <div className='filter-area'>
                    {filterObject.filters.filter((itm) => (itm.isFilterBy)).map((filter, idx) => (
                        <div className='filter' key={idx}>
                            {(filter.filterType === 'string' || filter.filterType === 'int' || filter.filterType === 'float') &&
                                <div className='dbasicfilter'>
                                    <DBasicFilter
                                        filter={filter}
                                        filterValues={filterValues}
                                        setFilterValues={setFilterValues}
                                        handleDeleteFilter={handleDeleteFilter}
                                        isDynamic={true} />
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
                                        handleDeleteFilter={handleDeleteFilter}
                                        isDynamic={true} />
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
                                        handleDeleteFilter={handleDeleteFilter}
                                        isDynamic={true} />
                                </div>}
                        </div>
                    ))}
                </div>

                <div className='filter-action'>
                    <JqxButton template={'success'} onClick={() => searchBtn()} theme={'light'}
                    // style={{ color: 'black'}}
                    className="icon"
                    > بحث </JqxButton>
                    <JqxButton template={'danger'} onClick={() => clearBtn()} theme={'light'}
                    > إلغاء </JqxButton>
                </div>
            </div>
        </div>
    )

}

export default DFilterDynamic;

