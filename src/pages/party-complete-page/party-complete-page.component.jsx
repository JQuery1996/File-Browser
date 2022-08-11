import React, { useState, useEffect } from 'react';

import DModalContainer from '../../components/dmodal-container/dmodal-container.component';
import DForm from '../../components/dform/dform.component';
import DSelect2 from '../../components/dselect2/dselect2.component';
import { validateFields } from '../../dUtil/dFormUtil/validation';
import classnames from 'classnames';
import configData from "../../config.json";

import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material-purple.css';
import JqxPopover, { IPopoverProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxpopover';

import './party-complete-page.styles.css';

async function getDataByIdentityNo(app, action, sqlWhere) {
    let requestData = {};

    requestData.paramsCollection = action.procedures.find(procedure => procedure.id === 'SELECT_PROC').paramsCollection
    requestData.paramsCollection.find(obj => obj.dbName === 'P_SQLWHERE').value = sqlWhere;
    requestData.paramsCollection.find(obj => obj.dbName === 'P_PAGE_INDEX').value = 0;
    requestData.paramsCollection.find(obj => obj.dbName === 'P_PAGE_SIZE').value = 10;
    requestData.baseParams = {
        appName: app.name,
        packageName: action.packageName,
        procedureName: action.procedures.find(procedure => procedure.id === 'SELECT_PROC').procedureName,
    };


    let commandUrl = configData.SERVER_URL + app.basicCommand.find((command) => command.type === 'SELECT').url;
    let requestMethod = "POST";

    const requestOptions = {
        method: requestMethod,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            requestData: requestData
        }),
    };
    return fetch(commandUrl, requestOptions)
        .then((response) => {
            return response.json()
        });
}

const PartyComplete = ({ cancel, app, settings, array, deepClone, handleCancelBtn, deleteRow, rowData, action, isShow ,lovContainerId }) => {
    const [select2Clear, setSelect2Clear] = useState(false);
    const [params, setParams] = useState(settings.params);
    const [data, setData] = useState({});
    const [isRerended, setIsRerended] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isResult,setIsResult] = useState(true);

    const handleSaveBtn = (params) => {
        if (params && params.hasOwnProperty("SHARE_FINAL_ID"))
            params["SHARE_FINAL_ID"].value = rowData["ID"];
        else if (params && params.hasOwnProperty("ID"))
            params["ID"].value = rowData["ID"];
        settings.saveBtn(params, action);
    };

    const handleChange = (validationFunc, evt) => {
        const field = evt.target.name;

        const fieldVal = evt.target.value;
        setParams({
            ...params,
            [field]: {
                ...params[field],
                value: fieldVal,
                error: params[field]['validateOnChange'] ? validationFunc(fieldVal) : '',
            }
        })
    }

    useEffect(() => {
        try {
            var parentElement = document.getElementById("modal_element").children[0].children[1];
            if (parentElement.tagName === "INPUT") {
                parentElement.focus();
            }
            else {
                if (parentElement.children[0] && parentElement.children[0].children[0].tagName === "INPUT")

                    parentElement.children[0].children[0].focus();
            }
        }
        catch {

        }
    }, [])

    const handleSearchBtn = async (obj) => {
        let whereStatement = " AND IDENT_DOC_NO ='" + obj['IDENT_DOC_NO'].value
            + "' AND DIDENTITY_TYPE_ID = " + obj['DIDENTITY_TYPE_ID'].value;
        return await getDataByIdentityNo(app, action, whereStatement)
            .then(response => {
                if (response && response.result && response.result.length === 1) {
                    setIsResult(true)
                    let tempParams = {}
                    array.map(c => {
                        let obj;
                        if (c.hasOwnProperty('fillFrom')) {
                            obj = {
                                name: c.name,
                                idVal: c.fillFrom.idVal,
                                txtVal: c.fillFrom.txtVal,
                                tbl: c.fillFrom.tbl,
                                value: response.result[0][c.name] ? response.result[0][c.name] : null,
                                displayText: response.result[0][c.name] ? response.result[0][c.fillFrom.displayFrom] : c.fillFrom.text,
                                error: '',
                                validateOnChange: true,
                            }
                        }
                        else {
                            if (c.type === 'date') {
                                obj = {
                                    value: response.result[0][c.name] ? response.result[0][c.name] : null,
                                    name: c.name,
                                    error: '',
                                    validateOnChange: true,
                                };
                            }
                            else {
                                obj = {
                                    value: response.result[0][c.name] ? response.result[0][c.name] : '',
                                    name: c.name,
                                    error: '',
                                    validateOnChange: true,
                                };
                            }
                        }
                        tempParams[`${c.name}`] = obj;
                    })
                    setParams(tempParams);
                    setIsDisabled(true);
                    setIsRerended(!isRerended);
                }
                else
                {
                    setIsResult(false)
                }
            })
    }

    const handleSelect2Change = (name, value) => {
        setSelect2Clear(false)
        setParams({
            ...params,
            [name]: {
                ...params[name],
                value: value ? value.value : '',
                error: params[name]['validateOnChange'],
            }
        })
    };
    return (
        <div className='party-complete-page'>
            <DModalContainer
                divId={'window-container'}
                handleClose={handleCancelBtn}
                title={settings.title}
                action={action}
            >
                { cancel !=="cancel" ?
                <div className='party-complete-filter'>
                    <span className='formlabel'>رقم الوثيقة</span>
                    <div className='frominput'>
                        <input
                            placeholder={""}
                            name={"IDENT_DOC_NO"}
                            rtl={'true'}
                            width={165}
                            height={30}
                            className={classnames(
                                'form-control',
                                { 'is-valid': params["IDENT_DOC_NO"].error === false },
                                { 'is-invalid': params["IDENT_DOC_NO"].error }
                            )}
                            onChange={evt => {
                                handleChange(validateFields.validateString, evt)
                            }}
                            value={params["IDENT_DOC_NO"] ?
                                params["IDENT_DOC_NO"].value ?
                                    params["IDENT_DOC_NO"].value
                                    : ''
                                : ''}
                        />
                        <div className="invalid-feedback" style={{ fontSize: "10px" }}>{params["IDENT_DOC_NO"].error}</div>
                    </div>
                    <span>نوع الوثيقة</span>
                    <div className='party-dselect2'>
                        <DSelect2
                            data={{
                                application: app,
                                action: action,
                                name: action.name,
                                clear: { select2Clear },
                                filterName: 'DIDENTITY_TYPE_ID',
                                tblName: 'DIDENTITY_TYPE',
                                txtVal: 'NAME',
                                idVal: 'ID',
                                placeholder: '',
                            }}
                            handleSelect2Change={handleSelect2Change}
                        />
                    </div>
                    {isShow && (
                        <div>
                            <span>نوع المالك</span>
                            <DSelect2
                                data={{
                                    application: app,
                                    action: action,
                                    name: action.name,
                                    clear: { select2Clear },
                                    filterName: 'DOWNERTYPE_ID',
                                    tblName: 'DOWNER_TYPE',
                                    txtVal: 'NAME',
                                    idVal: 'ID',
                                    placeholder: '',
                                }}
                                handleSelect2Change={handleSelect2Change}
                            />
                        </div>
                    )}

                    <input
                        style={
                            {
                                boxShadow: "rgb(153, 153, 153) 0px 2px 5px",
                                backgroundColor: " rgb(194, 214, 194)",
                                width: "100px",
                                height: "40px",
                            }
                        }
                        cl="inputbutton"
                        theme={'light'}
                        rtl={'true'}
                        width={150}
                        height={23}
                        type={'button'}
                        value={"بحث"}
                        onClick={() => (handleSearchBtn(params))}
                    />
                </div> : null}
                {
                    isResult ? 
                    <DForm
                    divId={'window-container'}
                    handleClose={handleCancelBtn}
                    handleSave={handleSaveBtn}
                    array={array}
                    settings={settings}
                    deepClone={deepClone}
                    app={app}
                    isRerended={isRerended}
                    params={params}
                    isDisabled={isDisabled}
                    deleteRow={deleteRow}
                    rowDataArray={rowData}
                    action={action}
                    lovContainerId={lovContainerId}
                />
            :
             <div style={{height:"300px"}}> لا يوجد نتائج مطابقة </div> 
            }
            </DModalContainer>
        </div>
    );
};

export default PartyComplete;