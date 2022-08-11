import React from 'react';
import ReactDOM from 'react-dom';

import JqxMenu from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxmenu';

import DModalContainer from '../../components/dmodal-container/dmodal-container.component';
import DMenuContainer from '../../components/dmenu-container/dmenu-container.component';
import EnhancedTable from '../../components/ddata-table/ddata-table.component';
import { buildContextMenuArr } from '../../dUtil/dTableContextMenu/dTableContextMenuUtil';
import { buildHeadCellsArr } from '../../dUtil/dTableHead/dTableHeadUtil';
import { fetchData } from '../../dUtil/dFetchData/dFetchData';
import configData from '../../config.json';
import { CollectionsBookmarkOutlined } from '@material-ui/icons';
import './window-details.styles.css';


const WindowDetails = ({ auth, app, rowId, handleCancelBtn, children, handleShowGlobalNotification }) => {
    const action = app.groups.find(group => group.name === "RegulatoryStock").actions.find(action => action.name === "SHARE_SIGN");
    const parentInfo = action.parents.find(parent => parent.action === "SHARE_FINAL");

    let showAddCircleIcon = action && action.procedures.findIndex(proc => proc.id === 'INSERT_PROC') != -1;
    // set this variable to false if you dont want to showDeleteIcon
    // and set it to action.procedures.findIndex(proc => proc.id === 'DELETE_PROC') != -1 if you want 
    // to check from description
    let showDeleteIcon = false;
    const [filters, setFilters] = React.useState([]);
    const [contextMenuItms, setContextMenuItms] = React.useState([]);
    const [headCells, setHeadCells] = React.useState([]);
    const [pageInfo, setPageInfo] = React.useState({
        pagenum: 0,
        pagesize: 10,
    });
    const [rows, setRows] = React.useState([]);
    const [rowsCount, setRowsCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [sqlWhere, setSqlWhere] = React.useState(" AND " + parentInfo.refCol + " = " + rowId);
    const [isSelectable, setIsSelectable] = React.useState(false);
    const menuRef = React.useRef(React.createRef(JqxMenu));

    React.useEffect(() => {

        let active = true;
        if (app && action) {
            let currentHeadCellsArr = buildHeadCellsArr(action.grid.datafields);
            setHeadCells(currentHeadCellsArr);
            let currentContextMenuArr = buildContextMenuArr(auth.data.username, action.contextMenu, auth.authorizationList);
            setContextMenuItms(currentContextMenuArr);
            // setDetailGridObject({
            //     show: false
            // })
            setRows([]);

            (async () => {
                setLoading(true);
                const newRows = await fetchData(app, action, sqlWhere, pageInfo.pagenum, pageInfo.pagesize);

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
    }, [pageInfo])

    const handleContextMenuOpen = (clientX, clientY, rowData) => {
        ReactDOM.render(
            <DMenuContainer handleItemClick={handleItemClickBtn} row={rowData} contextMenu={contextMenuItms} ref={menuRef} />
            , document.getElementById('windoDetailMenuContainer')
        )
        if(menuRef.current)
            menuRef.current.open(clientX, clientY);

        return false;
    }

    const handleAddCircleIconBtn = (app, action) => {
        // let settObj = {
        //     saveBtn: handleSaveWindowBtn,
        //     cancelBtn: handleCancelWindowBtn,
        //     arrgroups: action.groups
        // };
        // let paramsCollection = action.procedures.find(procedure => procedure.id === 'INSERT_PROC').paramsCollection;
        // let insertParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        // settObj.title = 'إضافة جديد';
        // settObj.id = 'insert';
        // settObj.params = {};
        // insertParamsArray.map(c => {
        //     let obj;
        //     if (c.hasOwnProperty('fillFrom')) {
        //         obj = {
        //             name: c.name,
        //             idVal: c.fillFrom.idVal,
        //             txtVal: c.fillFrom.txtVal,
        //             tbl: c.fillFrom.tbl,
        //             value: null,
        //             displayText: c.fillFrom.text,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //         }
        //     }
        //     else {
        //         if (c.type === 'date') {
        //             obj = {
        //                 value: null,
        //                 name: c.name,
        //                 error: '',
        //                 validateOnChange: true,
        //                 isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //             };
        //         }
        //         else {
        //             obj = {
        //                 value: '',
        //                 name: c.name,
        //                 error: '',
        //                 validateOnChange: true,
        //                 isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //             };
        //         }
        //     }
        //     settObj.params[`${c.name}`] = obj;
        // });

        // let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //     detailGridObject.masterInfo.action : null

        // ReactDOM.render(
        //     openModal(app, action, masterAction, handleCancelWindowBtn, insertParamsArray, settObj)
        //     , document.querySelector('#window-container')
        // );
    }

    const handleDeleteIconBtn = (app, action) => {
        console.log("Deleted");
    }

    const handleMouseOverRow = (app, action, rowData) => {
        // setTimeout(async () => { await handleItemClickBtn(app, action, itmObj, selectedRowData) }, 2000);
        // let masterAction = action;
        // let detailActionArray = [];
        // let masterIds = {};

        // masterAction.childs.map(child => {
        //     if (detailActionArray.findIndex(p => p.action === child.action) === -1)
        //         detailActionArray.push(child);
        //     if (!masterIds.hasOwnProperty(child.idVal))
        //         masterIds[child.idVal] = rowData[child.idVal];
        // })
        // setDetailGridObject({
        //     show: true,
        //     app: app,
        //     detailActionArray: detailActionArray,
        //     masterIds: masterIds,
        //     masterInfo: {
        //         action: action,
        //         row: rowData,
        //     }
        // })
    }

    const handleItemClickBtn = (e, rowData) => {
        // let itm = e.args;
        // let settObj = {
        //     saveBtn: handleSaveWindowBtn,
        //     cancelBtn: handleCancelWindowBtn,
        //     arrgroups: action.groups
        // };

        // if (itm.id === "edit") {
        //     let paramsCollection = action.procedures.find(procedure => procedure.id === 'UPDATE_PROC').paramsCollection;
        //     let updateParamsArray = paramsCollection.filter(p => p.direction === 'IN');

        //     settObj.title = 'تعديل';
        //     settObj.id = 'update';
        //     settObj.params = {};
        //     let editRow = rowData;
        //     updateParamsArray.map(c => {
        //         let obj;
        //         if(c.name === "USERNAME"){
        //             obj = {
        //                 value: c.name === "USERNAME" ? auth && auth.data ? auth.data.username: "" : editRow[c.name],
        //                 name: c.name,
        //                 error: '',
        //                 validateOnChange: true,
        //                 isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //             };
        //         }
        //         else
        //         {

        //             if (c.hasOwnProperty('fillFrom')) {
        //                 obj = {
        //                     name: c.name,
        //                     idVal: c.fillFrom.idVal,
        //                     txtVal: c.fillFrom.txtVal,
        //                     tbl: c.fillFrom.tbl,
        //                     value: editRow[c.name],
        //                     displayText: editRow[c.fillFrom.displayFrom] ? editRow[c.fillFrom.displayFrom] : c.fillFrom.text,
        //                     error: '',
        //                     validateOnChange: true,
        //                     isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //                 }
        //             }
        //             else {
        //                 if (c.type === 'date') {
        //                     obj = {
        //                         value: editRow[c.name] ? moment(editRow[c.name]).format("YYYY-MM-DD") : null,
        //                         name: c.name,
        //                         error: '',
        //                         validateOnChange: true,
        //                         isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //                     };
        //                 }
        //                 else {
        //                     obj = {
        //                         value: editRow[c.name],
        //                         name: c.name,
        //                         error: '',
        //                         validateOnChange: true,
        //                         isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //                     };
        //                 }
        //             }
        //         }
        //         settObj.params[`${c.name}`] = obj;
        //     })
        //     let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //         detailGridObject.masterInfo.action : null

        //     ReactDOM.render(
        //         openModal(app, action, masterAction, handleCancelWindowBtn, updateParamsArray, settObj)
        //         , document.querySelector('#window-container')
        //     );
        // }
        // else if (itm.id === "delete") {
        //     let paramsCollection = action.procedures.find(procedure => procedure.id === 'DELETE_PROC').paramsCollection;
        //     let deleteParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     settObj.title = 'حذف';
        //     settObj.id = 'delete';
        //     settObj.params = {};
        //     let deleteRow = rowData;
        //     deleteParamsArray.map(c => {
        //         let obj;
        //         if(c.name === "USERNAME"){
        //             obj = {
        //                 value: c.name === "USERNAME" ? auth && auth.data ? auth.data.username: "" : deleteRow[c.name],
        //                 name: c.name,
        //                 error: '',
        //                 validateOnChange: true,
        //                 isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //             };
        //         }
        //         else{
        //             obj = {
        //                 value: deleteRow[c.name],
        //                 name: c.name,
        //                 error: '',
        //                 validateOnChange: true,
        //                 isNull: c.isNull,
        //         };
        //         }
        //         settObj.params[c.name] = obj
        //     })

        //     let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //         detailGridObject.masterInfo.action : null

        //     ReactDOM.render(
        //         openModal(app, action, masterAction, handleCancelWindowBtn, deleteParamsArray, settObj)
        //         , document.querySelector('#window-container')
        //     );
        // }
        // else if (itm.id === 'expand') {
        //     let detailRow = rowData;
        //     let rowDataArray = allcolumnNames(action.grid.datafields);
        //     ReactDOM.render(
        //         openExpandModal(app, action, handleCancelWindowBtn, rowDataArray, detailRow)
        //         , document.querySelector('#window-container')
        //     );
        // }
        // else if (itm.id === 'manage') {
        //     let masterAction = action;
        //     let detailActionArray = [];
        //     let masterIds = {};

        //     masterAction.childs.map(child => {
        //         if (detailActionArray.findIndex(p => p.action === child.action) === -1)
        //             detailActionArray.push(child);
        //         if (!masterIds.hasOwnProperty(child.idVal))
        //             masterIds[child.idVal] = rowData[child.idVal];
        //     })
        //     setDetailGridObject({
        //         show: true,
        //         app: app,
        //         detailActionArray: detailActionArray,
        //         masterIds: masterIds,
        //         masterInfo: {
        //             action: action,
        //             row: rowData,
        //         }
        //     })
        // }
        // else if (itm.id === 'party_complete') {
        //     handleOpenWindowPartyComplete(rowData);
        // }
        // else if (itm.id === 'cancel_party_complete') {
        //     handleOpenWindowCancelPartyComplete(rowData);
        // }
        // else if (args.id === 'expand_details') {
        //     handleOpenWindowDetails();
        // }
        // else if (args.id === 'print_report') {
        //     handleShowGlobalNotification("يتم توليد التقرير");
        //     let idParam = gridRowArgs.row.bounddata['ID'];
        //     let params = { P_ID: idParam }
        //     const reportObject = {
        //         arName: action.contextMenu.find(contMenu => contMenu.id === 'print_report').arName,
        //         name: action.contextMenu.find(contMenu => contMenu.id === 'print_report').name,
        //         type: 'pdf',
        //         appName: app.appName,
        //         parameters: params,
        //     }

        //     downloadReport(reportObject);
        // }
        // else if (args.id === 'finish') {
        //     let paramsCollection = action.procedures.find(procedure => procedure.id === 'FINISH_PROC').paramsCollection;
        //     let deleteParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     settObj.title = 'إنهاء حل خلاف';
        //     settObj.id = 'finish';
        //     settObj.params = {};
        //     let deleteRow = gridRowArgs.row;
        //     let rowDataArray = allcolumnNames(action.grid.datafields);
        //     deleteParamsArray.map(c => {
        //         let obj = {
        //             value: deleteRow.bounddata[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })
        //     handleOpenWindow(deleteParamsArray, settObj, action, deleteRow, rowDataArray);
        //     // let finishParamsArray = paramsCollection.filter(p => p.direction === 'IN');

        //     // settObj.title = 'إنهاء حل الخلاف';
        //     // settObj.id = 'finish';
        //     // settObj.params = {};
        //     // let finishRow = gridRowArgs.row;
        //     // let rowDataArray = allcolumnNames(action.grid.datafields);

        //     // finishParamsArray.map(c => {
        //     //     if (c.name === 'USERNAME') {
        //     //         let obj = {
        //     //             value: "T1",
        //     //             name: c.name,
        //     //             error: '',
        //     //             validateOnChange: true,
        //     //             isNull: c.isNull,
        //     //         };
        //     //         settObj.params[c.name] = obj
        //     //     }

        //     //     else if (c.name === 'CONFLICT_SESSION_GROUP_ID') {
        //     //         let obj = {
        //     //             value: finishRow.bounddata.ID,
        //     //             name: c.name,
        //     //             error: '',
        //     //             validateOnChange: true,
        //     //             isNull: c.isNull,
        //     //         };
        //     //         settObj.params[c.name] = obj
        //     //     }
        //     // })
        //     // /*             finishParamsArray.map(c => {
        //     //                 console.log(c.name,finishRow.bounddata[c.name],finishRow.bounddata)
        //     //                 let obj = {
        //     //                     value: finishRow.bounddata["ID"],
        //     //                     name: c.name,
        //     //                     error: '',
        //     //                     validateOnChange: true,
        //     //                     isNull: c.isNull,
        //     //                 };
        //     //                 console.log(obj )
        //     //                 settObj.params[c.name] = obj
        //     //             }) */


        //     // //handleFinish(settObj.params ,settObj.id)
        //     // handleOpe();
        //     // //settObj.params.ID.value  
        // }
        // else if (args.id === 'end_proc') {
        //     let paramsCollection = action.procedures.find(procedure => procedure.id === 'END_PROC').paramsCollection;
        //     let deleteParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     settObj.title = 'انهاء العقد';
        //     settObj.id = 'end_proc';
        //     settObj.params = {};
        //     let deleteRow = gridRowArgs.row;
        //     let rowDataArray = allcolumnNames(action.grid.datafields);
        //     deleteParamsArray.map(c => {
        //         let obj = {
        //             value: deleteRow.bounddata[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })
        //     handleOpenWindow(deleteParamsArray, settObj, action, deleteRow, rowDataArray);
        // }
        // else if (args.id === 'cancel_print') {
        //     let paramsCollection = action.procedures.find(procedure => procedure.id === 'CANCEL_PRINT_PROC').paramsCollection;
        //     let deleteParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     settObj.title = 'الغاء الطباعة';
        //     settObj.id = 'cancel_print';
        //     settObj.params = {};
        //     let deleteRow = gridRowArgs.row;
        //     let rowDataArray = allcolumnNames(action.grid.datafields);
        //     deleteParamsArray.map(c => {
        //         let obj = {
        //             value: deleteRow.bounddata[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })
        //     handleOpenWindow(deleteParamsArray, settObj, action, deleteRow, rowDataArray);
        // }
        // else if (args.id === 'delev_proc') {
        //     let paramsCollection = action.procedures.find(procedure => procedure.id === 'DELEVERY_PROC').paramsCollection;
        //     let deleteParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     settObj.title = 'تسليم العقد';
        //     settObj.id = 'delev_deed';
        //     settObj.params = {};
        //     let deleteRow = gridRowArgs.row;
        //     let rowDataArray = allcolumnNames(action.grid.datafields);
        //     deleteParamsArray.map(c => {
        //         let obj = {
        //             value: deleteRow.bounddata[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })

        //     handleOpenWindow(deleteParamsArray, settObj, action, deleteRow, rowDataArray);
        // }
        // else if (args.id === 'delev_nofinger_proc') {
        //     let paramsCollection = action.procedures.find(procedure => procedure.id === 'DELEVERY_NOFINGER_PROC').paramsCollection;
        //     let deleteParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     settObj.title = 'تسليم العقد';
        //     settObj.id = 'delev_nofinger_deed';
        //     settObj.params = {};
        //     let deleteRow = gridRowArgs.row;
        //     let rowDataArray = allcolumnNames(action.grid.datafields);
        //     deleteParamsArray.map(c => {
        //         let obj = {
        //             value: deleteRow.bounddata[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })

        //     handleOpenWindow(deleteParamsArray, settObj, action, deleteRow, rowDataArray);
        // }
        // else if (args.id === 'export') {
        //     let paramsCollection = action.procedures.find(procedure => procedure.id === 'DEED_EXPORT_SELECT_PROC').paramsCollection;
        //     let exportParamsArray = paramsCollection.filter(p => p.direction === 'IN');

        //     settObj.title = 'تصدير';
        //     settObj.id = 'export';
        //     settObj.params = {};
        //     let exportRow = gridRowArgs.row;
        //     let rowDataArray = allcolumnNames(action.grid.datafields);
        //     let obj
        //     exportParamsArray.map(c => {
        //         if (c.name === 'SHARE_FINAL_ID') {
        //             obj = {
        //                 value: exportRow.bounddata.ID,
        //                 name: c.name,
        //                 error: '',
        //                 validateOnChange: true,
        //                 isNull: c.isNull,
        //             };
        //         }
        //         else
        //             if (c.type === 'date') {
        //                 obj = {
        //                     value: null,
        //                     name: c.name,
        //                     error: '',
        //                     validateOnChange: true,
        //                     isNull: true,
        //                 };
        //             }
        //             else {
        //                 obj = {
        //                     value: '',
        //                     name: c.name,
        //                     error: '',
        //                     validateOnChange: true,
        //                     isNull: true,
        //                 };
        //             }
        //         settObj.params[`${c.name}`] = obj;
        //     });
        //     handleOpenWindow(exportParamsArray, settObj, action, exportRow, rowDataArray);
        // }
        // else if (args.id === 'cancel_share') {
        //     let paramsCollection = action.procedures.find(procedure => procedure.id === 'CANCEL_SHARE_PROC').paramsCollection;
        //     let updateParamsArray = paramsCollection.filter(p => p.direction === 'IN');

        //     settObj.title = 'ترقين';
        //     settObj.id = 'cancel_share';
        //     settObj.params = {};
        //     let editRow = gridRowArgs.row;
        //     updateParamsArray.map(c => {
        //         let obj;
        //         obj = {
        //             value: editRow.bounddata[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //         }
        //         settObj.params[`${c.name}`] = obj;
        //     })
        //     handleOpenWindow(updateParamsArray, settObj, action);
        // }
    }

    return (
        <div>
            <DModalContainer
                divId={'window-container'}
                title={'تفاصيل'}
                handleClose={handleCancelBtn}
            >
                <div className='window-detail-container'>
                    {children}
                    <div id="windoDetailMenuContainer"></div>
                    <EnhancedTable
                        app={app}
                        action={action}
                        headCells={headCells}
                        rows={rows}
                        rowsCount={rowsCount}
                        pageInfo={pageInfo}
                        setPageInfo={setPageInfo}
                        contextMenuItms={contextMenuItms}
                        type='master'
                        selectable={isSelectable}
                        showAddCircleIcon={showAddCircleIcon}
                        showDeleteIcon={showDeleteIcon}
                        handleAddCircleIconBtn={handleAddCircleIconBtn}
                        handleDeleteIconBtn={handleDeleteIconBtn}
                        handleItemClickBtn={handleItemClickBtn}
                        handleMouseOverRow={handleMouseOverRow}
                        // handleContextMenuOpen={handleContextMenuOpen}
                    />
                    {/* <JqxGrid
                        ref={ref}
                        onPagechanged={handlePageChange}
                        pageable={true}
                        pagesizeoptions={['5', '10', '20']}
                        pagesize={'10'}
                        rtl={true}
                        width={'100%'}
                        height={'300'}
                        source={dataAdapter}
                        virtualmode={true}
                        rendergridrows={function (obj) {
                            return obj.data;
                        }}
                        columns={columnsnames(action.grid.datafields)}
                        columnsmenu={false}
                        theme={'material'}
                        columnsresize={true}
                        resizable={true}
                        altrows={true}
                    /> */}
                    <input className="Cansleclass"
                        value={"إلغاء"}
                        type={"button"}
                        id={"Cancle"}
                        style={{ margin: '10px' }}
                        theme={'light'}
                        onClick={() => handleCancelBtn('window-container')}
                        width={50}
                        height={20}
                        template={'danger'} />
                </div>
            </DModalContainer>
        </div>
    )
}
export default WindowDetails;