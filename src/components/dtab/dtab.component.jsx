import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import moment from "moment";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import EnhancedTable from "../ddata-table/ddata-table.component";
import Load from "../../components/dloading/loading";
import DMenuContainer from "../dmenu-container/dmenu-container.component";
import JqxMenu from "jqwidgets-scripts/jqwidgets-react-tsx/jqxmenu";
import { unmountCompenentById } from "../../dUtil/dContainerPage/dContainerPageUtil";
import {
    openModal,
    openExpandModal,
} from "../../dUtil/dWindowModal/dWindowModalUtil";
import { buildContextMenuArr } from "../../dUtil/dTableContextMenu/dTableContextMenuUtil";
import { buildHeadCellsArr } from "../../dUtil/dTableHead/dTableHeadUtil";
import { fillRequestData, allcolumnNames } from "../../dUtil/dGridUtil/util";
import { fetchData } from "../../dUtil/dFetchData/dFetchData";
import { useAuth } from "../../contexts/AuthContext";

import "./dtab.styles.css";

function DTabPanel(props) {
    const {
        app,
        action,
        sqlWhere,
        detailGridObject,
        handleShowGlobalNotification,
        groupId,
    } = props;
    const [contextMenuItms, setContextMenuItms] = React.useState([]);
    const [headCells, setHeadCells] = React.useState([]);
    const [pageInfo, setPageInfo] = React.useState({
        pagenum: 0,
        pagesize: 10,
    });
    const { auth } = useAuth();
    const menuContextRef = React.useRef(React.createRef(JqxMenu));
    const [rows, setRows] = React.useState([]);
    const [rowsCount, setRowsCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    let showAddCircleIcon =
        action.procedures.findIndex((proc) => proc.id === "INS_PROC") != -1;
    let showDeleteIcon =
        action.procedures.findIndex((proc) => proc.id === "DEL_PROC") != -1;

    React.useEffect(() => {
        setPageInfo({
            ...pageInfo,
            pagenum: 0,
        });
    }, [action, detailGridObject.masterInfo.row]);

    React.useEffect(() => {
        let active = true;
        let currentHeadCellsArr = buildHeadCellsArr(action.grid.datafields);
        setHeadCells(currentHeadCellsArr);
        let currentContextMenuArr = buildContextMenuArr(
            auth.user,
            action.contextMenu,
            auth.authorizationList,
        );
        setContextMenuItms(currentContextMenuArr);
        setRows([]);

        (async () => {
            // setLoading(true);
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

            if (newRows && newRows.status === "succeeded") {
                setRows(newRows.result);
                setRowsCount(newRows.record_count);
                setLoading(false);
            } else if (newRows.status === "faild" && newRows.exceptionMessage) {
                handleShowGlobalNotification(newRows.exceptionMessage);
                setLoading(false);
            } else {
                handleShowGlobalNotification("Unknown error");
                setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [pageInfo]);

    const handleContextMenuOpen = (clientX, clientY, rowData) => {
        ReactDOM.render(
            <DMenuContainer
                handleItemClick={handleItemClickBtn}
                row={rowData}
                contextMenu={contextMenuItms}
                ref={menuContextRef}
            />,
            document.getElementById("detailMenuContainer"),
        );

        if (menuContextRef.current)
            menuContextRef.current.open(clientX, clientY);

        return false;
    };

    const handleItemClickBtn = (e, rowData) => {
        let itm = e.args;
        let settObj = {
            saveBtn: handleSaveWindowBtn,
            cancelBtn: handleCancelWindowBtn,
            arrgroups: action.groups,
        };

        if (itm.id === "edit") {
            let paramsCollection = action.procedures.find(
                (procedure) => procedure.id === "UP_PROC",
            ).paramsCollection;
            let updateParamsArray = paramsCollection.filter(
                (p) => p.direction === "IN",
            );

            settObj.title = "تعديل";
            settObj.id = "update";
            settObj.params = {};
            let editRow = rowData;
            updateParamsArray.map((c) => {
                let obj;
                if (c.name === "USERNAME") {
                    obj = {
                        value:
                            c.name === "USERNAME"
                                ? auth && auth.data
                                    ? auth.data.username
                                    : ""
                                : editRow[c.name],
                        name: c.name,
                        error: "",
                        validateOnChange: true,
                        isNull: c.hasOwnProperty("isNull") ? c.isNull : true,
                    };
                } else {
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
                            isNull: c.hasOwnProperty("isNull")
                                ? c.isNull
                                : true,
                        };
                    } else {
                        if (c.type === "date") {
                            obj = {
                                value: editRow[c.name]
                                    ? moment(editRow[c.name]).format(
                                          "YYYY-MM-DD",
                                      )
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
        } else if (itm.id === "delete") {
            let paramsCollection = action.procedures.find(
                (procedure) => procedure.id === "DEL_PROC",
            ).paramsCollection;
            let deleteParamsArray = paramsCollection.filter(
                (p) => p.direction === "IN",
            );
            settObj.title = "حذف";
            settObj.id = "delete";
            settObj.params = {};
            let deleteRow = rowData;
            deleteParamsArray.map((c) => {
                let obj = {
                    value:
                        c.name === "USERNAME"
                            ? auth && auth.data
                                ? auth.data.username
                                : ""
                            : deleteRow[c.name],
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
        } else if (itm.id === "expand") {
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
        } else if (itm.id === "manage") {
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
        // else if (itm.id === 'party_complete') {
        //     handleOpenWindowPartyComplete(rowData);
        // }
        // else if (itm.id === 'cancel_party_complete') {
        //     handleOpenWindowCancelPartyComplete(rowData);
        // }
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
            requestMethod = "POST";
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
            requestMethod = "POST";
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
            requestMethod = "PUT";
            notificationMsg = "تم الحذف بنجاح";
        }

        let paramsCollection = fillRequestData(requestParams, params);

        let parentInfo = detailGridObject.masterInfo.action.childs.find(
            (itm) => itm.action === action.name,
        );
        paramsCollection.map((itm) => {
            if (itm.name === parentInfo.refCol)
                itm.value = detailGridObject.masterInfo.row[parentInfo.idVal];
        });

        requestData.paramsCollection = paramsCollection;

        requestData.baseParams = {
            _g: groupId,
            _pac: action.packageId,
            _pr: procId,
        };

        let token = localStorage.getItem("token");

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
                    let tempRows = JSON.parse(JSON.stringify(rows));

                    switch (id) {
                        case "insert":
                            if (tempRows.length === pageInfo.pagesize)
                                tempRows.splice(tempRows.length - 1, 1);
                            tempRows.unshift(data.result[0]);
                            setRows(tempRows);
                            setRowsCount(parseInt(rowsCount, 10) + 1);
                            break;
                        case "update":
                            let temp = tempRows.map(
                                (obj) =>
                                    data.result.find((o) => o.ID === obj.ID) ||
                                    obj,
                            );
                            setRows(temp);
                            break;
                        case "delete":
                            let active = true;
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
                        default:
                            break;
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
                }
            });
    };

    const handleCancelWindowBtn = (id) => {
        unmountCompenentById(id);
    };

    const handleAddCircleIconBtn = (app, action) => {
        let settObj = {
            saveBtn: handleSaveWindowBtn,
            cancelBtn: handleCancelWindowBtn,
            arrgroups: action.groups,
        };
        let paramsCollection = action.procedures.find(
            (procedure) => procedure.id === "INS_PROC",
        ).paramsCollection;
        let insertParamsArray = paramsCollection.filter(
            (p) => p.direction === "IN",
        );
        settObj.title = "إضافة جديد";
        settObj.id = "insert";
        settObj.params = {};
        insertParamsArray.map((c) => {
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
                insertParamsArray,
                settObj,
                "lovwindow-container",
            ),
            document.querySelector("#window-container"),
        );
    };

    const handleDeleteIconBtn = (app, action) => {};

    return (
        <div>
            <div id="detailMenuContainer"></div>
            {
                <EnhancedTable
                    app={app}
                    action={action}
                    sqlWhere={sqlWhere}
                    headCells={headCells}
                    rows={rows}
                    rowsCount={rowsCount}
                    pageInfo={pageInfo}
                    setPageInfo={setPageInfo}
                    contextMenuItms={contextMenuItms}
                    type="detail"
                    showAddCircleIcon={showAddCircleIcon}
                    showDeleteIcon={showDeleteIcon}
                    handleAddCircleIconBtn={handleAddCircleIconBtn}
                    handleDeleteIconBtn={handleDeleteIconBtn}
                    handleItemClickBtn={handleItemClickBtn}
                    handleContextMenuOpen={handleContextMenuOpen}
                />
            }
            {loading && <Load />}
        </div>
    );
}

DTabPanel.propTypes = {
    app: PropTypes.object.isRequired,
    action: PropTypes.object.isRequired,
    sqlWhere: PropTypes.string.isRequired,
    detailGridObject: PropTypes.object.isRequired,
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const DTab = ({
    groupId,
    app,
    detailGridObject,
    handleShowGlobalNotification,
    handleAddCircleIconBtn,
    handleDeleteIconBtn,
    handleItemClickBtn,
}) => {
    let array = [];
    let childAction;
    for (let i = 0; i < detailGridObject.detailActionArray.length; i++) {
        childAction = null;
        for (let idx = 0; idx < app.groups.length; idx++) {
            childAction = app.groups[idx].actions.find(
                (obj) =>
                    obj.name === detailGridObject.detailActionArray[i].action,
            );
            if (childAction) break;
        }
        if (childAction) array.push(childAction);
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    {array.map((action, idx) => {
                        return (
                            <Tab
                                key={idx}
                                label={action && action.arName}
                                {...a11yProps(idx)}
                            />
                        );
                    })}
                </Tabs>
            </Box>
            {array.map((action, idx) => {
                let childAction = detailGridObject.detailActionArray.find(
                    (itm) => itm.action === action.name,
                );
                return (
                    <TabPanel key={idx} value={value} index={idx}>
                        <DTabPanel
                            app={app}
                            action={action}
                            sqlWhere={
                                childAction
                                    ? " AND " +
                                      childAction.refCol +
                                      " = " +
                                      detailGridObject.masterIds[
                                          childAction.idVal
                                      ]
                                    : ""
                            }
                            detailGridObject={detailGridObject}
                            handleAddCircleIconBtn={handleAddCircleIconBtn}
                            handleDeleteIconBtn={handleDeleteIconBtn}
                            handleItemClickBtn={handleItemClickBtn}
                            handleShowGlobalNotification={
                                handleShowGlobalNotification
                            }
                            groupId={groupId}
                        />
                    </TabPanel>
                );
            })}
        </Box>
    );
};
export default DTab;
