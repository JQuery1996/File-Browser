import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import DMap from "../../components/dmap/DMap";
import moment from "moment";

import EnhancedTable from "../ddata-table/ddata-table.component";
import DTab from "../dtab/dtab.component";
import { useAuth } from "../../contexts/AuthContext";

import DFilterDynamic from "../dfilter-dynamic/dfilter-dynamic.component";
import WindowDetails from "../../pages/window-details/window-details.component";
import { unmountCompenentById } from "../../dUtil/dContainerPage/dContainerPageUtil";
import {
    openModal,
    openExpandModal,
    openModalPartyComplete,
} from "../../dUtil/dWindowModal/dWindowModalUtil";
import { buildContextMenuArr } from "../../dUtil/dTableContextMenu/dTableContextMenuUtil";
import { buildHeadCellsArr } from "../../dUtil/dTableHead/dTableHeadUtil";
import DMenuContainer from "../dmenu-container/dmenu-container.component";
import JqxMenu from "jqwidgets-scripts/jqwidgets-react-tsx/jqxmenu";
import Load from "../../components/dloading/loading";

import { fillRequestData, allcolumnNames } from "../../dUtil/dGridUtil/util";
import { fetchData } from "../../dUtil/dFetchData/dFetchData";
import { downloadReport } from "../../dUtil/dDownloadReportUtil/dDownloadReportUtil";

import "./dcontainer.styles.css";
import DFilemanager from "../dfilemanager/dfilemanager.components";

import { FileBrowserContainer } from "../file-browser/file-browser-container";

const DContainer = ({
    app,
    action,
    groupId,
    detailGridObject,
    setDetailGridObject,
    handleShowGlobalNotification,
}) => {
    const { auth, setAuth } = useAuth();
    let showAddCircleIcon =
        action &&
        action.procedures.findIndex((proc) => proc.id === "INS_PROC") != -1;
    // set this variable to false if you dont want to showDeleteIcon
    // and set it to action.procedures.findIndex(proc => proc.id === 'DELETE_PROC') != -1 if you want
    // to check from description
    let showDeleteIcon = action && action.grid.selectionmode ? true : false;

    const [filters, setFilters] = useState([]);
    const [contextMenuItms, setContextMenuItms] = React.useState([]);
    const [headCells, setHeadCells] = React.useState([]);
    const [pageInfo, setPageInfo] = React.useState({
        pagenum: 0,
        pagesize: action?.name?.endsWith("_map_") ? 1000000 : 10,
    });
    const [rows, setRows] = React.useState([]);
    const [rowsCount, setRowsCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [sqlWhere, setSqlWhere] = React.useState("");
    const [isSelectable, setIsSelectable] = React.useState(
        action && action.grid.selectionmode ? true : false,
    );
    const [selectedRowIDs, setSelectedRowIDs] = React.useState([]);
    const menuRef = React.useRef(React.createRef(JqxMenu));

    useEffect(() => {
        let array = [];
        if (app && action) {
            action.grid.datafields.map((itm) => {
                if (itm.isFilterBy) {
                    let obj = {
                        ...itm,
                        value: itm.name,
                        label: itm.text,
                    };
                    array.push(obj);
                }
            });
            let selectionMode =
                action.grid.hasOwnProperty("selectionmode") &&
                action.grid.selectionmode === "checkbox"
                    ? true
                    : false;
            setIsSelectable(selectionMode);
            setFilters(array);
            setContextMenuItms([]);
        }
        if (sqlWhere != "") setSqlWhere("");
        else {
            setPageInfo({
                ...pageInfo,
                pagenum: 0,
            });
        }
    }, [action]);

    useEffect(() => {
        setPageInfo({
            ...pageInfo,
            pagenum: 0,
        });
    }, [sqlWhere]);

    useEffect(() => {
        let active = true;
        if (app && action) {
            let currentHeadCellsArr = buildHeadCellsArr(action.grid.datafields);
            setHeadCells(currentHeadCellsArr);
            let currentContextMenuArr = buildContextMenuArr(
                auth.user,
                action.contextMenu,
                auth.authorizationList,
            );
            setContextMenuItms(currentContextMenuArr);
            // setDetailGridObject({
            //     show: false,
            // });
            setRows([]);

            (async () => {
                setLoading(true);
                const newRows = await fetchData(
                    app,
                    action,
                    groupId,
                    null,
                    sqlWhere,
                    null,
                    pageInfo.pagenum,
                    pageInfo.pagesize,
                );

                if (!active) {
                    return;
                }

                try {
                    if (newRows && newRows.status === "succeeded") {
                        setRows(newRows.result);
                        setRowsCount(newRows.record_count);
                        setLoading(false);
                    } else if (newRows.status === "faild") {
                        if (newRows.cod == 401) {
                            handleShowGlobalNotification(newRows.msg);
                        } else if (newRows.exceptionMessage) {
                            handleShowGlobalNotification(
                                newRows.exceptionMessage,
                            );
                        }
                        setLoading(false);
                    } else {
                        handleShowGlobalNotification("Unknown error");
                        setLoading(false);
                    }
                } catch (ex) {
                    console.log(ex);
                }
            })();

            return () => {
                active = false;
            };
        }
    }, [pageInfo]);

    const handleSearchClick = (whereStatement) => {
        setSqlWhere(whereStatement);
    };

    const handleClearClick = (whereStatement) => {
        setSqlWhere(whereStatement);
    };

    const handleMouseOverRow = (app, action, rowData) => {
        // setTimeout(async () => { await handleItemClickBtn(app, action, itmObj, selectedRowData) }, 2000);
        let masterAction = action;
        let detailActionArray = [];
        let masterIds = {};

        masterAction.childs.map((child) => {
            if (
                detailActionArray.findIndex(
                    (p) => p.action === child.action,
                ) === -1
            )
                detailActionArray.push(child);
            if (!masterIds.hasOwnProperty(child.idVal))
                masterIds[child.idVal] = rowData[child.idVal];
        });
        setDetailGridObject({
            show: true,
            app: app,
            detailActionArray: detailActionArray,
            masterIds: masterIds,
            masterInfo: {
                action: action,
                row: rowData,
            },
        });
    };

    const handleContextMenuOpen = (clientX, clientY, rowData) => {
        ReactDOM.render(
            <DMenuContainer
                handleItemClick={handleItemClickBtn}
                row={rowData}
                contextMenu={contextMenuItms}
                ref={menuRef}
            />,
            document.getElementById("masterMenuContainer"),
        );
        if (menuRef.current) menuRef.current.open(clientX, clientY);

        return false;
    };

    const handleItemClickBtn = (e, rowData, ID) => {
        console.log(rowData);
        let id;
        if (!ID) id = e.args.id;
        else id = ID;

        let settObj = {
            saveBtn: handleSaveWindowBtn,
            cancelBtn: handleCancelWindowBtn,
            arrgroups: action.groups,
        };

        if (id === "edit") {
            // let paramsCollection = action.procedures.find(procedure => procedure.id === 'UP_PROC').paramsCollection;
            // let updateParamsArray = paramsCollection.filter(p => p.direction === 'IN');
            let updateParamsArray = action.procedures.find(
                (procedure) => procedure.id === "UP_PROC",
            ).paramsCollection;
            settObj.title = "تعديل";
            settObj.id = "update";
            settObj.params = {};
            let editRow = rowData;
            updateParamsArray.map((c) => {
                let obj;
                if (c.fillFrom) {
                    obj = {
                        name: c.name,
                        idVal: c.fillFrom.idVal,
                        txtVal: c.fillFrom.txtVal,
                        tbl: c.fillFrom.tbl,
                        value: editRow[c.name],
                        displayText: editRow[c.fillFrom.displayFrom]
                            ? editRow[c.fillFrom.displayFrom]
                            : c.fillFrom.text,
                        error: "",
                        validateOnChange: true,
                        isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                    };
                } else {
                    if (c.type === "date") {
                        obj = {
                            value: editRow[c.name]
                                ? moment(editRow[c.name]).format("YYYY-MM-DD")
                                : null,
                            name: c.name,
                            error: "",
                            validateOnChange: true,
                            isNull: c.hasOwnProperty("isNull")
                                ? c.isNull
                                : true,
                        };
                    } else {
                        obj = {
                            value: editRow[c.name],
                            name: c.name,
                            error: "",
                            validateOnChange: true,
                            isNull: c.hasOwnProperty("isNull")
                                ? c.isNull
                                : true,
                        };
                    }
                }
                settObj.params[`${c.name}`] = obj;
            });
            let masterAction =
                detailGridObject && detailGridObject.masterInfo
                    ? detailGridObject.masterInfo.action
                    : null;

            ReactDOM.render(
                openModal(
                    "window-container",
                    app,
                    action,
                    masterAction,
                    handleCancelWindowBtn,
                    updateParamsArray,
                    settObj,
                    "lovwindow-container",
                ),
                document.querySelector("#window-container"),
            );
        } else if (id === "delete") {
            // let paramsCollection = action.procedures.find(procedure => procedure.id === 'DEL_PROC').paramsCollection;
            if (!action.grid.selectionmode || selectedRowIDs.length === 1) {
                // let deleteParamsArray = paramsCollection.filter(p => p.direction === 'IN');
                let deleteParamsArray = action.procedures.find(
                    (procedure) => procedure.id === "DEL_PROC",
                ).paramsCollection;
                settObj.title = "حذف";
                settObj.id = "delete";
                settObj.params = {};
                let deleteRow = rowData;
                deleteParamsArray.map((c) => {
                    let obj = {
                        value: deleteRow[c.name],
                        name: c.name,
                        error: "",
                        validateOnChange: true,
                        isNull: c.isNull,
                    };
                    settObj.params[c.name] = obj;
                });

                let masterAction =
                    detailGridObject && detailGridObject.masterInfo
                        ? detailGridObject.masterInfo.action
                        : null;

                ReactDOM.render(
                    openModal(
                        "window-container",
                        app,
                        action,
                        masterAction,
                        handleCancelWindowBtn,
                        deleteParamsArray,
                        settObj,
                        "lovwindow-container",
                    ),
                    document.querySelector("#window-container"),
                );
            } else {
                // let deleteParamsArray = paramsCollection.filter(p => p.direction === 'IN');
                let deleteParamsArray = action.procedures.find(
                    (procedure) => procedure.id === "DEL_PROC",
                ).paramsCollection;
                settObj.title = "حذف";
                settObj.id = "delete";
                settObj.delete = "mult";
                settObj.params = {};
                let rowsobj = {};
                deleteParamsArray.map((c) => {
                    selectedRowIDs.map((idx) => {
                        let tempRowData = rows.find((row) => row.ID === idx);
                        let obj = {
                            value: tempRowData[c.name],
                            name: c.name,
                            error: "",
                            validateOnChange: true,
                            isNull: c.isNull,
                        };
                        rowsobj[c.name] = obj;
                        settObj.params[idx] = { ...rowsobj };
                    });
                });

                let masterAction =
                    detailGridObject && detailGridObject.masterInfo
                        ? detailGridObject.masterInfo.action
                        : null;

                ReactDOM.render(
                    openModal(
                        "window-container",
                        app,
                        action,
                        masterAction,
                        handleCancelWindowBtn,
                        deleteParamsArray,
                        settObj,
                        "lovwindow-container",
                    ),
                    document.querySelector("#window-container"),
                );
            }
        } else if (id === "expand") {
            let detailRow = rowData;
            let rowDataArray = allcolumnNames(action.grid.datafields);
            ReactDOM.render(
                openExpandModal(
                    app,
                    action,
                    handleCancelWindowBtn,
                    rowDataArray,
                    detailRow,
                ),
                document.querySelector("#window-container"),
            );
        } else if (id === "manage") {
            let masterAction = action;
            let detailActionArray = [];
            let masterIds = {};

            masterAction.childs.map((child) => {
                if (
                    detailActionArray.findIndex(
                        (p) => p.action === child.action,
                    ) === -1
                )
                    detailActionArray.push(child);
                if (!masterIds.hasOwnProperty(child.idVal))
                    masterIds[child.idVal] = rowData[child.idVal];
            });
            setDetailGridObject({
                show: true,
                app: app,
                detailActionArray: detailActionArray,
                masterIds: masterIds,
                masterInfo: {
                    action: action,
                    row: rowData,
                },
            });
        }
        // else if (itm.id === 'party_complete') {
        //     handleOpenWindowPartyComplete(rowData);
        // }
        // else if (itm.id === 'cancel_party_complete') {
        //     handleOpenWindowCancelPartyComplete(rowData);
        // }
        // else if (itm.id === 'expand_details') {
        //     handleOpenWindowDetails(rowData);
        // }
        else if (id === "print_report") {
            handleShowGlobalNotification("يتم توليد التقرير");
            let idParam = rowData.ID;
            let params = { P_ID: idParam };
            const reportObject = {
                arName: action.contextMenu.find(
                    (contMenu) => contMenu.id === "print_report",
                ).arName,
                name: action.contextMenu.find(
                    (contMenu) => contMenu.id === "print_report",
                ).name,
                type: "pdf",
                appName: app.appName,
                parameters: params,
            };

            downloadReport(reportObject);
        }
        // else if (itm.id === 'finish') {
        //     // let paramsCollection = action.procedures.find(procedure => procedure.id === 'FINISH_PROC').paramsCollection;
        //     // let deleteParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     let paramsArr = action.procedures.find(procedure => procedure.id === 'FINISH_PROC').paramsCollection;
        //     settObj.title = 'إنهاء حل خلاف';
        //     settObj.id = 'finish';
        //     settObj.params = {};
        //     let deleteRow = rowData;
        //     paramsArr.map(c => {
        //         let obj = {
        //             value: deleteRow[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })

        //     let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //         detailGridObject.masterInfo.action : null

        //     ReactDOM.render(
        //         openModal('window-container', app, action, masterAction, handleCancelWindowBtn, paramsArr, settObj, 'lovwindow-container')
        //         , document.querySelector('#window-container')
        //     );
        // }
        // else if (itm.id === 'cancel_share') {
        //     // let paramsCollection = action.procedures.find(procedure => procedure.id === 'CANCEL_SHARE_PROC').paramsCollection;
        //     // let cancel_shareParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     let paramsArr = action.procedures.find(procedure => procedure.id === 'CANCEL_SHARE_PROC').paramsCollection;
        //     settObj.title = 'ترقين';
        //     settObj.id = 'cancel_share';
        //     settObj.params = {};
        //     let editRow = rowData;
        //     paramsArr.map(c => {
        //         let obj = {
        //             value: editRow[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.hasOwnProperty('isNull') ? c.isNull : true,
        //         }
        //         settObj.params[`${c.name}`] = obj;
        //     })

        //     let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //         detailGridObject.masterInfo.action : null

        //     ReactDOM.render(
        //         openModal('window-container', app, action, masterAction, handleCancelWindowBtn, paramsArr, settObj, 'lovwindow-container')
        //         , document.querySelector('#window-container')
        //     );
        // }
        // else if (itm.id === 'end_proc') {
        //     // let paramsCollection = action.procedures.find(procedure => procedure.id === 'END_PROC').paramsCollection;
        //     // let end_procParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     let paramsArr = action.procedures.find(procedure => procedure.id === 'END_PROC').paramsCollection;
        //     settObj.title = 'انهاء العقد';
        //     settObj.id = 'end_proc';
        //     settObj.params = {};
        //     paramsArr.map(c => {
        //         let obj = {
        //             value: rowData[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })

        //     let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //         detailGridObject.masterInfo.action : null

        //     ReactDOM.render(
        //         openModal('window-container',app, action, masterAction, handleCancelWindowBtn, paramsArr, settObj, 'lovwindow-container')
        //         , document.querySelector('#window-container')
        //     );
        // }
        // else if (itm.id === 'cancel_print') {
        //     // let paramsCollection = action.procedures.find(procedure => procedure.id === 'CANCEL_PRINT_PROC').paramsCollection;
        //     // let cancel_printParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     let paramsArr = action.procedures.find(procedure => procedure.id === 'CANCEL_PRINT_PROC').paramsCollection;
        //     settObj.title = 'الغاء الطباعة';
        //     settObj.id = 'cancel_print';
        //     settObj.params = {};
        //     paramsArr.map(c => {
        //         let obj = {
        //             value: rowData[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })

        //     let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //         detailGridObject.masterInfo.action : null

        //     ReactDOM.render(
        //         openModal('window-container', app, action, masterAction, handleCancelWindowBtn, paramsArr, settObj, 'lovwindow-container')
        //         , document.querySelector('#window-container')
        //     );
        // }
        // else if (itm.id === 'delev_proc') {
        //     // let paramsCollection = action.procedures.find(procedure => procedure.id === 'DELEVERY_PROC').paramsCollection;
        //     // let delev_procParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     let paramsArr = action.procedures.find(procedure => procedure.id === 'DELEVERY_PROC').paramsCollection;
        //     settObj.title = 'تسليم العقد';
        //     settObj.id = 'delev_deed';
        //     settObj.params = {};
        //     paramsArr.map(c => {
        //         let obj = {
        //             value: rowData[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })

        //     let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //         detailGridObject.masterInfo.action : null

        //     ReactDOM.render(
        //         openModal('window-container',app, action, masterAction, handleCancelWindowBtn, paramsArr, settObj, 'lovwindow-container')
        //         , document.querySelector('#window-container')
        //     );
        // }
        // else if (itm.id === 'delev_nofinger_proc') {
        //     // let paramsCollection = action.procedures.find(procedure => procedure.id === 'DELEVERY_NOFINGER_PROC').paramsCollection;
        //     // let delev_nofinger_procParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     let paramsArr = action.procedures.find(procedure => procedure.id === 'DELEVERY_NOFINGER_PROC').paramsCollection;
        //     settObj.title = 'تسليم العقد';
        //     settObj.id = 'delev_nofinger_deed';
        //     settObj.params = {};
        //     paramsArr.map(c => {
        //         let obj = {
        //             value: rowData[c.name],
        //             name: c.name,
        //             error: '',
        //             validateOnChange: true,
        //             isNull: c.isNull,
        //         };
        //         settObj.params[c.name] = obj
        //     })

        //     let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //         detailGridObject.masterInfo.action : null

        //     ReactDOM.render(
        //         openModal('window-container',app, action, masterAction, handleCancelWindowBtn, paramsArr, settObj, 'lovwindow-container')
        //         , document.querySelector('#window-container')
        //     );
        // }
        // else if (itm.id === 'export') {
        //     // let paramsCollection = action.procedures.find(procedure => procedure.id === 'DEED_EXPORT_SELECT_PROC').paramsCollection;
        //     // let exportParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        //     let paramsArr = action.procedures.find(procedure => procedure.id === 'DEED_EXPORT_SELECT_PROC').paramsCollection;
        //     settObj.title = 'تصدير';
        //     settObj.id = 'export';
        //     settObj.params = {};
        //     let obj
        //     paramsArr.map(c => {
        //         if (c.name === 'SHARE_FINAL_ID') {
        //             obj = {
        //                 value: rowData.ID,
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

        //     let masterAction = detailGridObject && detailGridObject.masterInfo ?
        //         detailGridObject.masterInfo.action : null

        //     ReactDOM.render(
        //         openModal('window-container',app, action, masterAction, handleCancelWindowBtn, paramsArr, settObj, 'lovwindow-container')
        //         , document.querySelector('#window-container')
        //     );
        // }
    };

    const handleSaveWindowPartyComplete = (params, action) => {
        let requestParams;
        let requestData = {};
        let requestMethod;
        let procName;
        let commandUrl;
        let notificationMsg = "";

        requestParams = action.procedures.find(
            (procedure) => procedure.id === "PARTY_COMPLETE_PROC",
        ).paramsCollection;
        procName = action.procedures.find(
            (procedure) => procedure.id === "PARTY_COMPLETE_PROC",
        ).procedureName;
        commandUrl =
            process.env.NODE_ENV === "development"
                ? window.SERVER_URL_API_DEV +
                  app.basicCommand.find((command) => command.type === "UPDATE")
                      .url
                : window.SERVER_URL +
                  app.basicCommand.find((command) => command.type === "UPDATE")
                      .url;
        requestMethod = "POST";
        notificationMsg = "تم الاستكمال بنجاح";

        let paramsCollection = fillRequestData(requestParams, params);

        requestData.paramsCollection = paramsCollection;

        requestData.baseParams = {
            appName: app.name,
            packageName: action.packageName,
            procedureName: procName,
        };

        const requestOptions = {
            method: requestMethod,
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Bearer " + auth ? auth.data.token : ''
            },
            body: JSON.stringify({
                requestData: requestData,
            }),
        };

        fetch(commandUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "succeeded") {
                    handleShowGlobalNotification(notificationMsg);
                    let tempRows = JSON.parse(JSON.stringify(rows));
                    let temp = tempRows.map(
                        (obj) =>
                            data.result.find((o) => o.ID === obj.ID) || obj,
                    );
                    setRows(temp);
                } else if (data.status === "faild") {
                    handleShowGlobalNotification(
                        data.exceptionType + "::" + data.exceptionMessage,
                    );
                } else {
                    handleShowGlobalNotification("Unknown Exception");
                }
                handleCancelWindowBtn("window-container");
            });
    };

    const handleSaveWindowCancelPartyComplete = (params, action) => {
        let requestParams;
        let requestData = {};
        let requestMethod;
        let procName;
        let commandUrl;
        let notificationMsg = "";

        requestParams = action.procedures.find(
            (procedure) => procedure.id === "PARTY_CANCEL_COMPLETE_PROC",
        ).paramsCollection;
        procName = action.procedures.find(
            (procedure) => procedure.id === "PARTY_CANCEL_COMPLETE_PROC",
        ).procedureName;
        commandUrl =
            process.env.NODE_ENV === "development"
                ? window.SERVER_URL_API_DEV +
                  app.basicCommand.find((command) => command.type === "UPDATE")
                      .url
                : window.SERVER_URL +
                  app.basicCommand.find((command) => command.type === "UPDATE")
                      .url;
        requestMethod = "POST";
        notificationMsg = "تم إلغاء الاستكمال بنجاح";

        let paramsCollection = fillRequestData(requestParams, params);

        requestData.paramsCollection = paramsCollection;

        requestData.baseParams = {
            appName: app.name,
            packageName: action.packageName,
            procedureName: procName,
        };

        const requestOptions = {
            method: requestMethod,
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Bearer " + auth ? auth.data.token : ''
            },
            body: JSON.stringify({
                requestData: requestData,
            }),
        };

        fetch(commandUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "succeeded") {
                    handleShowGlobalNotification(notificationMsg);
                    let tempRows = JSON.parse(JSON.stringify(rows));
                    let temp = tempRows.map(
                        (obj) =>
                            data.result.find((o) => o.ID === obj.ID) || obj,
                    );
                    setRows(temp);
                } else if (data.status === "faild") {
                    handleShowGlobalNotification(
                        data.exceptionType + "::" + data.exceptionMessage,
                    );
                } else {
                    handleShowGlobalNotification("Unknown Exception");
                }
                handleCancelWindowBtn("window-container");
            });
    };

    const handleOpenWindowPartyComplete = (rowDataObj) => {
        let partyAction = {};
        for (let index = 0; index < app.groups.length; index++) {
            partyAction = app.groups[index].actions.find(
                (act) => act.name === "PARTY",
            );
            if (partyAction) break;
        }

        let settObj = {
            saveBtn: handleSaveWindowPartyComplete,
            cancelBtn: handleCancelWindowBtn,
            arrgroups: action.groups,
        };

        let paramsCollection = partyAction.procedures.find(
            (procedure) => procedure.id === "PARTY_COMPLETE_PROC",
        ).paramsCollection;
        let completeParamsArray = paramsCollection.filter(
            (p) => p.direction === "IN",
        );

        settObj.id = "update";
        settObj.params = {};

        completeParamsArray.map((c) => {
            let obj;
            if (c.hasOwnProperty("fillFrom")) {
                obj = {
                    name: c.name,
                    idVal: c.fillFrom.idVal,
                    txtVal: c.fillFrom.txtVal,
                    tbl: c.fillFrom.tbl,
                    value: null,
                    displayText: c.fillFrom.text,
                    error: "",
                    validateOnChange: true,
                    isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                };
            } else {
                if (c.type === "date") {
                    obj = {
                        value: null,
                        name: c.name,
                        error: "",
                        validateOnChange: true,
                        isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                    };
                } else {
                    obj = {
                        value: "",
                        name: c.name,
                        error: "",
                        validateOnChange: true,
                        isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                    };
                }
            }
            settObj.params[`${c.name}`] = obj;
        });
        if (
            settObj &&
            settObj.params &&
            settObj.params.hasOwnProperty("USERNAME")
        )
            settObj.params["USERNAME"].value =
                auth && auth.data ? auth.data.username : "";

        ReactDOM.render(
            openModalPartyComplete(
                app,
                partyAction,
                handleCancelWindowBtn,
                completeParamsArray,
                settObj,
                rowDataObj,
            ),
            document.querySelector("#window-container"),
        );
    };

    const handleOpenWindowCancelPartyComplete = (rowDataObj) => {
        let partyAction = {};
        for (let index = 0; index < app.groups.length; index++) {
            partyAction = app.groups[index].actions.find(
                (act) => act.name === "PARTY",
            );
            if (partyAction) break;
        }

        let settObj = {
            saveBtn: handleSaveWindowCancelPartyComplete,
            cancelBtn: handleCancelWindowBtn,
            arrgroups: action.groups,
        };

        let paramsCollection = partyAction.procedures.find(
            (procedure) => procedure.id === "PARTY_CANCEL_COMPLETE_PROC",
        ).paramsCollection;
        let completeParamsArray = paramsCollection.filter(
            (p) => p.direction === "IN",
        );

        settObj.id = "cancel_complet";
        settObj.params = {};

        completeParamsArray.map((c) => {
            let obj;
            if (c.hasOwnProperty("fillFrom")) {
                obj = {
                    name: c.name,
                    idVal: c.fillFrom.idVal,
                    txtVal: c.fillFrom.txtVal,
                    tbl: c.fillFrom.tbl,
                    value: null,
                    displayText: c.fillFrom.text,
                    error: "",
                    validateOnChange: true,
                    isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                };
            } else {
                if (c.type === "date") {
                    obj = {
                        value: null,
                        name: c.name,
                        error: "",
                        validateOnChange: true,
                        isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                    };
                } else {
                    obj = {
                        value: "",
                        name: c.name,
                        error: "",
                        validateOnChange: true,
                        isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                    };
                }
            }
            settObj.params[`${c.name}`] = obj;
        });
        if (
            settObj &&
            settObj.params &&
            settObj.params.hasOwnProperty("USERNAME")
        )
            settObj.params["USERNAME"].value =
                auth && auth.data ? auth.data.username : "";

        ReactDOM.render(
            openModalPartyComplete(
                app,
                partyAction,
                handleCancelWindowBtn,
                completeParamsArray,
                settObj,
                rowDataObj,
                "cancel",
            ),
            document.querySelector("#window-container"),
        );
    };

    const handleOpenWindowDetails = (rowData) => {
        ReactDOM.render(
            <WindowDetails
                auth={auth}
                app={app}
                rowId={rowData.ID}
                handleCancelBtn={handleCancelWindowBtn}
                handleShowGlobalNotification={handleShowGlobalNotification}
            ></WindowDetails>,
            document.querySelector("#window-container"),
        );
    };

    const handleSaveWindowBtn = (app, action, params, id) => {
        let requestParams;
        let requestData = {};
        let requestMethod;
        let procId;
        let commandUrl;
        let notificationMsg = "";
        if (id === "insert") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "INS_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "INS_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "INS_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "INS_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) => procedure.id === "INS_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تمت الإضافة بنجاح";
        } else if (id === "update") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "UP_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "UP_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "UP_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "UP_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) => procedure.id === "UP_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تم التعديل بنجاح";
        } else if (id === "delete") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "DEL_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "DEL_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "DEL_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "DEL_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) => procedure.id === "DEL_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تم الحذف بنجاح";
        } else if (id === "finish") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "FINISH_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "FINISH_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "FINISH_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "FINISH_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) => procedure.id === "FINISH_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تم إنهاء الخلاف بنجاح";
        } else if (id === "cancel_share") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "CANCEL_SHARE_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "CANCEL_SHARE_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id === "CANCEL_SHARE_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id === "CANCEL_SHARE_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) => procedure.id === "CANCEL_SHARE_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تم ترقين الاشارة";
        } else if (id === "cancel_print") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "CANCEL_PRINT_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "CANCEL_PRINT_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id === "CANCEL_PRINT_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id === "CANCEL_PRINT_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) => procedure.id === "CANCEL_PRINT_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تم الغاء الطباعة";
        } else if (id === "end_proc") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "END_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "END_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "END_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) => procedure.id === "END_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) => procedure.id === "END_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تم انهاء العقد";
        } else if (id === "delev_deed") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "DELEVERY_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "DELEVERY_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id === "DELEVERY_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id === "DELEVERY_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) => procedure.id === "DELEVERY_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تم تسليم السند";
        } else if (id === "delev_nofinger_deed") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "DELEVERY_NOFINGER_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "DELEVERY_NOFINGER_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id === "DELEVERY_NOFINGER_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id === "DELEVERY_NOFINGER_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) =>
                            procedure.id === "DELEVERY_NOFINGER_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تم تسليم السند";
        } else if (id === "export") {
            requestParams = action.procedures.find(
                (procedure) => procedure.id === "DEED_EXPORT_SELECT_PROC",
            ).paramsCollection;
            procId = action.procedures.find(
                (procedure) => procedure.id === "DEED_EXPORT_SELECT_PROC",
            ).id;
            commandUrl =
                process.env.NODE_ENV === "development"
                    ? window.SERVER_URL_API_DEV +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id ===
                                      "DEED_EXPORT_SELECT_PROC",
                              ).type,
                      ).url
                    : window.SERVER_URL +
                      app.basicCommand.find(
                          (command) =>
                              command.type ===
                              action.procedures.find(
                                  (procedure) =>
                                      procedure.id ===
                                      "DEED_EXPORT_SELECT_PROC",
                              ).type,
                      ).url;
            requestMethod = app.basicCommand.find(
                (command) =>
                    command.type ===
                    action.procedures.find(
                        (procedure) =>
                            procedure.id === "DEED_EXPORT_SELECT_PROC",
                    ).type,
            ).httpMethod;
            notificationMsg = "تم التصدير بنجاح";
        }

        let token = localStorage.getItem("token");
        let paramsCollection = fillRequestData(requestParams, params);

        requestData.paramsCollection = paramsCollection;

        requestData.baseParams = {
            _g: groupId,
            _pac: action.packageId,
            _pr: procId,
        };

        const requestOptions = {
            method: requestMethod,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
            },
            body: JSON.stringify({
                requestData: requestData,
            }),
        };

        fetch(commandUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "succeeded") {
                    handleShowGlobalNotification(notificationMsg);
                    let responseObj = data;
                    if (responseObj.hasOwnProperty("authList")) {
                        let responseValue = responseObj.response;
                        let tempRows = JSON.parse(JSON.stringify(rows));
                        let temp;
                        switch (id) {
                            case "insert":
                                if (tempRows.length === pageInfo.pagesize)
                                    tempRows.splice(tempRows.length - 1, 1);
                                tempRows.unshift(responseValue.result[0]);
                                setRows(tempRows);
                                setRowsCount(parseInt(rowsCount, 10) + 1);
                                break;
                            case "update":
                                temp = tempRows.map(
                                    (obj) =>
                                        responseValue.result.find(
                                            (o) => o.ID === obj.ID,
                                        ) || obj,
                                );
                                setRows(temp);
                                break;
                            case "delete":
                                setRows([]);

                                (async () => {
                                    setLoading(true);
                                    const newRows = await fetchData(
                                        app,
                                        action,
                                        groupId,
                                        null,
                                        sqlWhere,
                                        null,
                                        pageInfo.pagenum,
                                        pageInfo.pagesize,
                                    );

                                    if (newRows) {
                                        setRows(newRows.result);
                                        setRowsCount(newRows.record_count);
                                        setLoading(false);
                                    }
                                })();
                                break;
                            case "delev_nofinger_deed":
                                temp = tempRows.map(
                                    (obj) =>
                                        responseValue.result.find(
                                            (o) => o.ID === obj.ID,
                                        ) || obj,
                                );
                                setRows(temp);
                                break;
                            case "delev_deed":
                                temp = tempRows.map(
                                    (obj) =>
                                        responseValue.result.find(
                                            (o) => o.ID === obj.ID,
                                        ) || obj,
                                );
                                setRows(temp);
                                break;
                            case "finish":
                                setRows([]);

                                (async () => {
                                    setLoading(true);
                                    const newRows = await fetchData(
                                        app,
                                        action,
                                        groupId,
                                        null,
                                        sqlWhere,
                                        null,
                                        pageInfo.pagenum,
                                        pageInfo.pagesize,
                                    );

                                    if (newRows) {
                                        setRows(newRows.result);
                                        setRowsCount(newRows.record_count);
                                        setLoading(false);
                                    }
                                })();
                                break;
                            case "end_proc":
                                setRows([]);

                                (async () => {
                                    setLoading(true);
                                    const newRows = await fetchData(
                                        app,
                                        action,
                                        groupId,
                                        null,
                                        sqlWhere,
                                        null,
                                        pageInfo.pagenum,
                                        pageInfo.pagesize,
                                    );

                                    if (newRows) {
                                        setRows(newRows.result);
                                        setRowsCount(newRows.record_count);
                                        setLoading(false);
                                    }
                                })();
                                break;
                            case "cancel_print":
                                setRows([]);

                                (async () => {
                                    setLoading(true);
                                    const newRows = await fetchData(
                                        app,
                                        action,
                                        groupId,
                                        null,
                                        sqlWhere,
                                        null,
                                        pageInfo.pagenum,
                                        pageInfo.pagesize,
                                    );

                                    if (newRows) {
                                        setRows(newRows.result);
                                        setRowsCount(newRows.record_count);
                                        setLoading(false);
                                    }
                                })();
                                break;
                            case "cancel_share":
                                temp = tempRows.map(
                                    (obj) =>
                                        responseValue.result.find(
                                            (o) => o.ID === obj.ID,
                                        ) || obj,
                                );
                                setRows(temp);
                                break;
                            default:
                                break;
                        }
                        setAuth({
                            ...auth,
                            authorizationList: responseObj.authList,
                        });
                    } else {
                        let tempRows = JSON.parse(JSON.stringify(rows));
                        let temp;
                        switch (id) {
                            case "insert":
                                if (tempRows.length === pageInfo.pagesize)
                                    tempRows.splice(tempRows.length - 1, 1);
                                tempRows.unshift(data.result[0]);
                                setRows(tempRows);
                                setRowsCount(parseInt(rowsCount, 10) + 1);
                                break;
                            case "update":
                                temp = tempRows.map(
                                    (obj) =>
                                        data.result.find(
                                            (o) => o.ID === obj.ID,
                                        ) || obj,
                                );
                                setRows(temp);
                                break;
                            case "delete":
                                setRows([]);

                                (async () => {
                                    setLoading(true);
                                    const newRows = await fetchData(
                                        app,
                                        action,
                                        groupId,
                                        null,
                                        sqlWhere,
                                        null,
                                        pageInfo.pagenum,
                                        pageInfo.pagesize,
                                    );

                                    if (newRows) {
                                        setRows(newRows.result);
                                        setRowsCount(newRows.record_count);
                                        setLoading(false);
                                    }
                                })();
                                break;
                            case "delev_nofinger_deed":
                                temp = tempRows.map(
                                    (obj) =>
                                        data.result.find(
                                            (o) => o.ID === obj.ID,
                                        ) || obj,
                                );
                                setRows(temp);
                                break;
                            case "delev_deed":
                                temp = tempRows.map(
                                    (obj) =>
                                        data.result.find(
                                            (o) => o.ID === obj.ID,
                                        ) || obj,
                                );
                                setRows(temp);
                                break;
                            case "finish":
                                setRows([]);

                                (async () => {
                                    setLoading(true);
                                    const newRows = await fetchData(
                                        app,
                                        action,
                                        groupId,
                                        null,
                                        sqlWhere,
                                        null,
                                        pageInfo.pagenum,
                                        pageInfo.pagesize,
                                    );

                                    if (newRows) {
                                        setRows(newRows.result);
                                        setRowsCount(newRows.record_count);
                                        setLoading(false);
                                    }
                                })();
                                break;
                            case "end_proc":
                                setRows([]);

                                (async () => {
                                    setLoading(true);
                                    const newRows = await fetchData(
                                        app,
                                        action,
                                        groupId,
                                        null,
                                        sqlWhere,
                                        null,
                                        pageInfo.pagenum,
                                        pageInfo.pagesize,
                                    );

                                    if (newRows) {
                                        setRows(newRows.result);
                                        setRowsCount(newRows.record_count);
                                        setLoading(false);
                                    }
                                })();
                                break;
                            case "cancel_print":
                                setRows([]);

                                (async () => {
                                    setLoading(true);
                                    const newRows = await fetchData(
                                        app,
                                        action,
                                        groupId,
                                        null,
                                        sqlWhere,
                                        null,
                                        pageInfo.pagenum,
                                        pageInfo.pagesize,
                                    );

                                    if (newRows) {
                                        setRows(newRows.result);
                                        setRowsCount(newRows.record_count);
                                        setLoading(false);
                                    }
                                })();
                                break;
                            case "cancel_share":
                                temp = tempRows.map(
                                    (obj) =>
                                        data.result.find(
                                            (o) => o.ID === obj.ID,
                                        ) || obj,
                                );
                                setRows(temp);
                                break;
                            default:
                                break;
                        }
                    }
                    unmountCompenentById("window-container");
                } else if (data.status === "faild") {
                    if (data.cod == 401) {
                        handleShowGlobalNotification(data.msg);
                        unmountCompenentById("window-container");
                    } else {
                        handleShowGlobalNotification(
                            data.exceptionType + "::" + data.exceptionMessage,
                        );
                        unmountCompenentById("window-container");
                    }
                } else {
                    handleShowGlobalNotification("Unknown Exception");
                    unmountCompenentById("window-container");
                }
            });
    };

    const handleCancelWindowBtn = (id) => {
        unmountCompenentById(id);
    };

    // FILE_BROWSER_ROOT_DIRECTORY for FileBrowser Component
    const handleAddCircleIconBtn = async (
        app,
        action,
        FILE_BROWSER_ROOT_DIRECTORY,
    ) => {
        let settObj = {
            saveBtn: handleSaveWindowBtn,
            cancelBtn: handleCancelWindowBtn,
            arrgroups: action.groups,
        };
        // let paramsCollection = action.procedures.find(procedure => procedure.id === 'INS_PROC').paramsCollection;
        // let insertParamsArray = paramsCollection.filter(p => p.direction === 'IN');
        let paramsArr = action.procedures.find(
            (procedure) => procedure.id === "INS_PROC",
        ).paramsCollection;
        settObj.title = "إضافة جديد";
        settObj.id = "insert";
        settObj.params = {};
        paramsArr.map((c) => {
            let obj;
            if (c.fillFrom) {
                obj = {
                    name: c.name,
                    idVal: c.fillFrom.idVal,
                    txtVal: c.fillFrom.txtVal,
                    tbl: c.fillFrom.tbl,
                    value: null,
                    displayText: c.fillFrom.text,
                    error: "",
                    validateOnChange: true,
                    isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                };
            } else {
                if (c.type === "date") {
                    obj = {
                        value: null,
                        name: c.name,
                        error: "",
                        validateOnChange: true,
                        isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                    };
                } else {
                    obj = {
                        value: "",
                        name: c.name,
                        error: "",
                        validateOnChange: true,
                        isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                    };
                }
            }

            settObj.params[`${c.name}`] = obj;
        });

        let masterAction =
            detailGridObject && detailGridObject.masterInfo
                ? detailGridObject.masterInfo.action
                : null;
        ReactDOM.render(
            openModal(
                "window-container",
                app,
                action,
                masterAction,
                handleCancelWindowBtn,
                paramsArr,
                settObj,
                "lovwindow-container",
                FILE_BROWSER_ROOT_DIRECTORY,
            ),
            document.querySelector("#window-container"),
        );
    };

    const handleDeleteIconBtn = (app, action) => {
        let settObj = {
            saveBtn: handleSaveWindowBtn,
            cancelBtn: handleCancelWindowBtn,
            arrgroups: action.groups,
        };
        let paramsCollection = action.procedures.find(
            (procedure) => procedure.id === "DEL_PROC",
        ).paramsCollection;
        let deleteParamsArray = paramsCollection.filter(
            (p) => p.direction === "IN",
        );
        settObj.title = "حذف";
        settObj.id = "delete";
        settObj.delete = "mult";
        settObj.params = {};
        let rowsobj = {};
        deleteParamsArray.map((c) => {
            selectedRowIDs.map((idx) => {
                let tempRowData = rows.find((row) => row.ID === idx);
                let obj = {
                    value: tempRowData[c.name],
                    name: c.name,
                    error: "",
                    validateOnChange: true,
                    isNull: c.isNull,
                };
                rowsobj[c.name] = obj;
                settObj.params[idx] = { ...rowsobj };
            });
        });

        let masterAction =
            detailGridObject && detailGridObject.masterInfo
                ? detailGridObject.masterInfo.action
                : null;

        ReactDOM.render(
            openModal(
                "window-container",
                app,
                action,
                masterAction,
                handleCancelWindowBtn,
                deleteParamsArray,
                settObj,
                "lovwindow-container",
            ),
            document.querySelector("#window-container"),
        );
    };
    if (app && action) {
        return (
            <div className="dcontainer">
                <div className="abstract-container" style={{ padding: "10px" }}>
                    <h1 className="headertitle" style={{ color: "#5270ad" }}>
                        {action.arName}
                    </h1>
                </div>
                <div className="filter-container">
                    <div>
                        <DFilterDynamic
                            array={filters}
                            action={action}
                            app={app}
                            handleSearchClick={handleSearchClick}
                            setDetailGridObject={setDetailGridObject}
                        />
                    </div>
                </div>

                <div id="masterMenuContainer"></div>
                {!loading && !action.name.endsWith("_") && (
                    <EnhancedTable
                        app={app}
                        action={action}
                        headCells={headCells}
                        rows={rows}
                        rowsCount={rowsCount}
                        pageInfo={pageInfo}
                        setPageInfo={setPageInfo}
                        contextMenuItms={contextMenuItms}
                        type="master"
                        selectable={isSelectable}
                        setSelectedRowIDs={setSelectedRowIDs}
                        showAddCircleIcon={showAddCircleIcon}
                        showDeleteIcon={showDeleteIcon}
                        handleAddCircleIconBtn={handleAddCircleIconBtn}
                        handleDeleteIconBtn={handleDeleteIconBtn}
                        handleItemClickBtn={handleItemClickBtn}
                        handleMouseOverRow={handleMouseOverRow}
                        handleContextMenuOpen={handleContextMenuOpen}
                        setDetailGridObject={setDetailGridObject}
                    />
                )}
                {action?.name.endsWith("_FILEMNG_") && (
                    <div>
                        {/* <DFilemanager
                            app={app}
                            action={action}
                            rows={rows}
                            rowsCount={rowsCount}
                            handleDeleteIconBtn={handleDeleteIconBtn}
                            handleSaveWindowBtn={handleSaveWindowBtn}
                            handleAddCircleIconBtn={handleAddCircleIconBtn}
                            sqlWhere={sqlWhere}
                            setSqlWhere={setSqlWhere}
                        /> */}

                        <FileBrowserContainer
                            app={app}
                            action={action}
                            rows={rows}
                            rowsCount={rowsCount}
                            handleDeleteIconBtn={handleDeleteIconBtn}
                            handleSaveWindowBtn={handleSaveWindowBtn}
                            handleAddCircleIconBtn={handleAddCircleIconBtn}
                            handleItemClickBtn={handleItemClickBtn}
                            sqlWhere={sqlWhere}
                            setSqlWhere={setSqlWhere}
                            detailGridObject={detailGridObject}
                            setDetailGridObject={setDetailGridObject}
                        />
                        <div
                            className="window-container"
                            id="window-container"
                        ></div>
                        <div
                            className="lovwindow-container"
                            id="lovwindow-container"
                        ></div>
                    </div>
                )}
                {action?.name.endsWith("_map_") && (
                    <>
                        <DMap
                            rows={rows}
                            rowsCount={rowsCount}
                            handleItemClickBtn={handleItemClickBtn}
                        />
                    </>
                )}

                <div
                    className="grid-container"
                    id="detail-grid-container"
                    style={
                        detailGridObject.show
                            ? { display: "block", height: "35%" }
                            : { display: "none" }
                    }
                >
                    {detailGridObject.app
                        ? detailGridObject.show && (
                              <DTab
                                  app={app}
                                  detailGridObject={detailGridObject}
                                  handleShowGlobalNotification={
                                      handleShowGlobalNotification
                                  }
                                  handleAddCircleIconBtn={
                                      handleAddCircleIconBtn
                                  }
                                  handleDeleteIconBtn={handleDeleteIconBtn}
                                  handleItemClickBtn={handleItemClickBtn}
                                  groupId={groupId}
                              />
                          )
                        : ""}
                </div>
                {loading && <Load />}
                <div className="window-container" id="window-container"></div>
                <div
                    className="lovwindow-container"
                    id="lovwindow-container"
                ></div>
            </div>
        );
    } else {
        return <>ggggg</>;
    }
};

export default DContainer;
