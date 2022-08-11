import React, { useEffect, useState } from 'react';

import { AsyncPaginate } from "react-select-async-paginate";
import moment from "moment";

import './dselect2.styles.css';

const fillRequestData = (array, objOfValues) => {
    let paramsArr = [];
    array
      .map((itm) => {
        let obj = {};
        switch (itm.type) {
          case "date":
            obj = {
              "name": itm.name,
              "value": itm.value = moment(objOfValues[itm.name]).format("MM/DD/YYYY")
            };
            paramsArr.push(obj);
            break;
          case "float":
            obj = {
              "name": itm.name,
              "value": itm.value = parseFloat(objOfValues[itm.name])
            };
            paramsArr.push(obj);
            break;
          case "int":
            obj = {
              "name": itm.name,
              "value": itm.value = parseInt(objOfValues[itm.name])
            };
            paramsArr.push(obj);
            break;
          case "string":
            obj = {
              "name": itm.name,
              "value": itm.value = objOfValues[itm.name]
            };
            paramsArr.push(obj);
            break;
          default:
            return null;
        }
      });
    return paramsArr;
}

const DSelect2 = React.forwardRef((props, ref) => {

    const [value, onChange] = useState(null);

    useEffect(() => {
        if (props.data.clear === true)
            onChange(null)
    }, [props.data.clear])

    let options = [];
    let action, groupId;
    for (let index = 0; index < props.data.application.groups.length; index++) {
        action = props.data.application.groups[index].actions.find(itm => itm.name === props.data.tblName);
        if (action) {
            groupId = props.data.application.groups[index].groupId;
            break;
        }
    };
    
    // let paramsCollection = action && action.procedures.find(pro => pro.id === 'SELECT_PROC').paramsCollection;

    const handleClearSelect2 = () => {
        onChange(null)
        props.handleSelect2Change(props.data.filterName, null)
    }

    if (!action) {
        return (
            <div className='dselect2'>
                <AsyncPaginate
                    id={`filter${props.data.name}`}
                    selectRef={ref}
                    placeholder={props.data.placeholder}
                    value={value}
                    isRtl={true}
                />
            </div>)
    }
    const defaultAdditional = {
        page: 0
    };

    const loadPageOptions = async (q, prevOptions, { page }) => {
        const { options, hasMore } = await loadOptions(q, page);

        return {
            options,
            hasMore,

            additional: {
                page: page + 1
            }
        };
    };

    const fetchData = async (pageNo, pageSize, condition) => {
        let sqlWhere = '';
        let requestData = {}

        let requestParams = action && action.procedures.find(pro => pro.id === 'SELECT_PROC').paramsCollection;

        if (condition)
            sqlWhere = " AND " + props.data.tblName + "." + props.data.txtVal + " LIKE '%" + condition + "%'";

        let paramsObj = {
                ID: null,
                PAGE_INDEX: pageNo,
                PAGE_SIZE: pageSize,
                SQLWHERE: sqlWhere,
                SQLORDER: null
            };

        requestData.paramsCollection = fillRequestData(requestParams, paramsObj);

        requestData.baseParams = {
            _g: groupId,
            _pac: action.packageId,
            _pr: action.procedures.find(pro => pro.id === 'SELECT_PROC').id,
        };
        console.log(requestData)
        let token = localStorage.getItem("token");
        const requestOptions = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${JSON.parse(token)}`:''
            },
            body: JSON.stringify({
                requestData: requestData
            }),
        };

        let commandUrl = process.env.NODE_ENV === "development" ? window.SERVER_URL_API_DEV 
        + props.data.application.basicCommand.find((command) => command.type === action.procedures.find(procedure => procedure.id === 'SELECT_PROC').type).url
        : window.SERVER_URL + props.data.application.basicCommand.find((command) => command.type === action.procedures.find(procedure => procedure.id === 'SELECT_PROC').type).url;

        return fetch(commandUrl, requestOptions)
            .then((response) => response.json())
            .then(data => {
                return data;
            });
    }

    const sleep = ms =>
        new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });

    const optionsPerPage = 10;

    const fillOptions = (array) => {
        options = [];
        array.map(op => {
            options.push({
                value: op[props.data.idVal],
                label: op[props.data.txtVal],
            });
        });
    }

    const loadOptions = async (search, page) => {
        await sleep(1000);
        return fetchData(page, optionsPerPage, search).then(res => {
            fillOptions(res.result);
            let filteredOptions = options;

            const hasMore = Math.ceil(res.record_count / optionsPerPage) > page;

            return {
                options: filteredOptions,
                hasMore
            };
        });
    };


    return (
        <div className='dselect2'>
            <div className='label'>
                <label>{props.data.placeholder}</label>
            </div>
            <div className='dropdown'>
                <div className='drop'>
                    <AsyncPaginate
                        placeholder={''}
                        additional={defaultAdditional}
                        value={value}
                        loadOptions={loadPageOptions}
                        onChange={onChange}
                        onBlur={() => props.handleSelect2Change(props.data.filterName, value)}
                        isRtl={true}
                        minMenuHeight={'50px'}
                    />
                </div>
                <div className='down'>
                    <button className='cancelfilterbutton' onClick={handleClearSelect2}>X</button>
                    {props.isDynamic ?
                        <button style={{
                            width: '25px',
                            borderRadius: '5px',
                            height: '25px',
                            backgroundColor: 'white',
                            textAlign: 'center',
                            borderColor: 'red',
                            color: 'red'
                        }}
                            onClick={() => props.handleDeleteFilter(props.data.filter.value)}>-</button>
                        :
                        null
                    }
                </div>
            </div>
        </div>
    );
});

export default DSelect2;