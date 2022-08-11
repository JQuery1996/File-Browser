import React, { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';

import DModalContainer from '../../components/dmodal-container/dmodal-container.component';
import EnhancedTable from '../ddata-table/ddata-table.component';

import { openModal } from '../../dUtil/dWindowModal/dWindowModalUtil';
import { buildHeadCellsArr } from '../../dUtil/dTableHead/dTableHeadUtil';

import { downloadReport } from '../../dUtil/dDownloadReportUtil/dDownloadReportUtil';
import configData from "../../config.json";
import { fetchData } from '../../dUtil/dFetchData/dFetchData';
import './dwindow-report.styles.css';


async function getDataByRepId(app, rowId) {
    
    const actionParam = app.groups.find(group => group.name === "Indexs").actions.find(action => action.name === "ZREPORT_PARAMS");
    let requestData = {}
    requestData.paramsCollection = actionParam.procedures.find(procedure => procedure.id === 'ZPARAMS_BYREP_SELECT_PROC').paramsCollection;
    requestData.paramsCollection.find(obj => obj.dbName === 'P_REPID').value = rowId;
    requestData.baseParams = {
        _g: '_1',
        _pac: 'PRIVS',
        _pr: 'SELECT_PROC',
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
    return fetch(commandUrl, requestOptions).then(res => {
        return res.json();
    })

}

const DWindowReport = ({ app, handleCancelWindowBtn, handleShowGlobalNotification, zoneId }) => {
    const [data, setData] = useState(null)

    // let showAddCircleIcon = action && action.procedures.findIndex(proc => proc.id === 'INSERT_PROC') != -1;
    // // set this variable to false if you dont want to showDeleteIcon
    // // and set it to action.procedures.findIndex(proc => proc.id === 'DELETE_PROC') != -1 if you want 
    // // to check from description
    // let showDeleteIcon = false;

    const [headCells, setHeadCells] = React.useState([]);
    const [pageInfo, setPageInfo] = React.useState({
        pagenum: 0,
        pagesize: 10,
    });
    const [rows, setRows] = React.useState([]);
    const [rowsCount, setRowsCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [isSelectable, setIsSelectable] = React.useState(false);
    let rowData;

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            let appResponse = await fetch('../data/DMANAGER/application.json')

            if (!active) {
                return;
            }

            if(appResponse && appResponse.ok){
                let managerApp = await appResponse.json();
                let basiccommandResponse = await fetch('../data/DMANAGER/basiccommand.json')

                if(basiccommandResponse && basiccommandResponse.ok){
                    let basiccommand = await basiccommandResponse.json();
                    managerApp.basicCommand = basiccommand
                    let groupsResponse = await fetch('../data/DMANAGER/groups.json')

                    if(groupsResponse && groupsResponse.ok){
                        let groups = await groupsResponse.json();
                        managerApp.groups = groups
                        setData({
                            app: managerApp,
                            action: groups.find(group => group.name === "Indexs").actions.find(action => action.name === "ZREPORT"),
                            sqlWhere: " AND  PROGNAME = '" + app.name + "'",
                        });
                    }
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [])

    useEffect(() => {
        setPageInfo({
            ...pageInfo,
            pagenum: 0,
        })
    }, [data])

    useEffect(() => {
        if(data){
            const { app, action, sqlWhere } = data;
            let active = true;
            if (app && action) {
                let currentHeadCellsArr = buildHeadCellsArr(action.grid.datafields);
                setHeadCells(currentHeadCellsArr);
                // let currentContextMenuArr = buildContextMenuArr(auth.data.username, action.contextMenu, auth.authorizationList);
                // setContextMenuItms(currentContextMenuArr);
                setRows([]);

                (async () => {
                    setLoading(true);
                    const newRows = await fetchData(app, action, null, sqlWhere, null, pageInfo.pagenum, pageInfo.pagesize);

                    if (!active) {
                        return;
                    }

                    if (newRows && newRows.status === "succeeded") {
                        setRows(newRows.result);
                        setRowsCount(newRows.record_count);
                        setLoading(false);
                    }
                    else if (newRows.status === "faild" && newRows.exceptionMessage) {
                        handleShowGlobalNotification(newRows.exceptionMessage);
                        setLoading(false);
                    }
                    else {
                        handleShowGlobalNotification("Unknown error");
                        setLoading(false);
                    }
                    

                })();

                return () => {
                    active = false;
                };
            }
        }
    }, [pageInfo])

    const handleRowClick = async (rowID) => {
        rowData = rows.find(row => row.ID === rowID);
        
        return await getDataByRepId(data.app, rowID).then(response => {
            let newArray = [];
            if (response.result.length > 0) {
                let reportObj = {
                    cancelBtn: handleCancelWindowBtn,
                    saveBtn: handleSaveBtn,
                };
                reportObj.title = 'حقول التقرير';
                reportObj.params = {};
                if (response.status === 'succeeded') {
                    response.result.map(data => {
                        let obj, arrayObj;
                        (data.DATATYP === 'LOV') ?
                            arrayObj = {
                                name: data.NAME,
                                text: data.ARNAME,
                                value: null,
                                visible: true,
                                isNull: (data.ISREQ === 'نعم' ? false : true),
                                type: 'int',
                                validateOnChange: true,
                                fillFrom: {
                                    tbl: data.LOVTBL,
                                    idVal: data.IDFLD,
                                    txtVal: data.NAMEFLD,
                                    type: 'grid',
                                    displayFrom: data.NAMEFLD,
                                    text: data.ARNAME,
                                    condQuery: "",
                                }
                            }
                            : arrayObj = {
                                name: data.NAME,
                                text: data.ARNAME,
                                value: null,
                                visible: true,
                                isNull: (data.ISREQ === 'نعم' ? false : true),
                                type: (data.DATATYP === 'string' ? 'string' : data.DATATYP === 'NUMBER' ? 'int'
                                    : data.DATATYP === 'DATE' ? 'date' : null),
                                validateOnChange: true,
                            }
                        newArray.push(arrayObj)

                        if (data.DATATYP === 'LOV') {
                            obj = {
                                id: data.REPID,
                                name: data.NAME,
                                idVal: data.IDFLD,
                                txtVal: data.NAMEFLD,
                                tbl: data.LOVTBL,
                                value: null,
                                displayText: data.ARNAME,
                                error: '',
                                validateOnChange: true,
                                type: 'int',
                                isNull: data.ISREQ === 'نعم' ? false : true,
                            }
                        }
                        else {
                            obj = {
                                id: data.REPID,
                                name: data.NAME,
                                value: null,
                                error: '',
                                validateOnChange: true,
                                type: (data.DATATYP === 'string' ? 'string' : data.DATATYP === 'NUMBER' ? 'int'
                                    : data.DATATYP === 'DATE' ? 'date' : null),
                                isNull: data.ISREQ === 'نعم' ? false : true,
                            }
                        }
                        reportObj.params[`${data.NAME}`] = obj;
                    })
                }
                let newObject = {
                    name: 'type',
                    text: 'نمط التقرير',
                    value: null,
                    visible: true,
                    isNull: false,
                    type: 'select2',
                }
                newArray.push(newObject)
                ReactDOM.render(
                    openModal('window-report-params', app, data.action, null, handleCancelWindowBtn, newArray, reportObj, "lovreport-window-container")
                    , document.querySelector('#window-report-params')
                );
            }
        }
        )
    }

    const handleSaveBtn = (object) => {

        handleShowGlobalNotification("يتم توليد التقرير");
        let params = {}
        Object.keys(object).map(itm => {
            params[itm] = object[itm].value
        })
        if (!object.hasOwnProperty('type'))
            params['type'] = 'pdf'
        const reportObject = {
            arName: rowData ? rowData.ARNAME : "تقرير",
            name: rowData ? rowData.FILENAME : "undefined",
            type: (object.type? object.type :'pdf'),
            appName: app.name,
            parameters: params,
        }

        downloadReport(reportObject);
        handleCancelWindowBtn('window-report-params')
    }

    if (data)
        return (
            <div>
                <DModalContainer
                    divId={'window-report'}
                    title={'التقارير'}
                    handleClose={handleCancelWindowBtn}
                >
                    <div className='dwindow-report-container' id='dwindow-report-container'>
                        {data && <EnhancedTable
                            app={data.app}
                            action={data.action}
                            headCells={headCells}
                            rows={rows}
                            rowsCount={rowsCount}
                            pageInfo={pageInfo}
                            setPageInfo={setPageInfo}
                            // contextMenuItms={contextMenuItms}
                            type='master'
                            selectable={isSelectable}
                            handleRowClick={handleRowClick}
                            // showAddCircleIcon={showAddCircleIcon}
                            // showDeleteIcon={showDeleteIcon}
                            // handleAddCircleIconBtn={handleAddCircleIconBtn}
                            // handleDeleteIconBtn={handleDeleteIconBtn}
                            // handleItemClickBtn={handleItemClickBtn}
                            // handleMouseOverRow={handleMouseOverRow}
                            // handleContextMenuOpen={handleContextMenuOpen}
                            // setDetailGridObject={setDetailGridObject}
                        />
                        }
                        <input className="Cansleclass"
                            value={"إلغاء"}
                            type={"button"}
                            id={"Cancle"}
                            style={{ margin: '10px' }}
                            theme={'light'}
                            onClick={() => handleCancelWindowBtn('window-report')}
                            width={50}
                            height={20}
                            template={'danger'} />

                        <div className='window-report-params' id='window-report-params'></div>
                        <div className='lovwindow-container' id='lovreport-window-container'></div>
                    </div>
                </DModalContainer>
            </div >
        )
    else
        return (
            <div>...Loading</div>
        )
}
export default DWindowReport;
