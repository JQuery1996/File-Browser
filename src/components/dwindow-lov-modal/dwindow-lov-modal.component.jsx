import React from "react";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import EnhancedTable from "../ddata-table/ddata-table.component";

import DModalContainer from "../dmodal-container/dmodal-container.component";
import DLovFilterContainer from "../dlov-filter-container/dlov-filter-container.component";

import { buildHeadCellsArr } from "../../dUtil/dTableHead/dTableHeadUtil";
import { fetchData } from "../../dUtil/dFetchData/dFetchData";

import "./dwindow-lov-modal.styles.css";

const DWindowLovModal = ({
    object,
    handleCancelBtn,
    handleLovSaveBtn,
    lovContainerId,
}) => {
    const [sqlWhere, setSqlWhere] = React.useState("");
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

    React.useEffect(() => {
        setPageInfo({
            ...pageInfo,
            pagenum: 0,
        });
    }, [sqlWhere]);

    React.useEffect(() => {
        let active = true;
        let currentHeadCellsArr = buildHeadCellsArr(
            object.action.grid.datafields,
        );
        setHeadCells(currentHeadCellsArr);
        setRows([]);

        (async () => {
            setLoading(true);
            const newRows = await fetchData(
                object.app,
                object.action,
                object.groupId,
                null,
                sqlWhere,
                null,
                pageInfo.pagenum,
                pageInfo.pagesize,
            );

            if (!active) {
                return;
            }

            /********************************************
             *  Editing Title: Adding Filter to rows     *
             *  Editing Descritption:                    *
             *  - if action.name =  DWD_ORGANIZTION      *
             *       meaning we are in component called  *
             *       (FileBrowserContainer.js)           *
             *  - else                                   *
             *       returns rows as it without          *
             *       without any editing or filtering    *
             **********************************************/

            if (newRows && newRows.status === "succeeded") {
                setRows(
                    // see comment above to see why filter function is add here ...
                    newRows.result.filter((row) =>
                        object.action.name === "DWD_ORGANIZTION"
                            ? row.DEF_ORG_TYPEID === 1
                            : true,
                    ),
                );
                setRowsCount(newRows.record_count);
                setLoading(false);
            } else if (newRows.status === "faild") {
                if (newRows.cod == 401) {
                } else if (newRows.exceptionMessage) {
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [pageInfo]);

    const handleSearchClick = (statement) => {
        setSqlWhere(statement);
    };

    const handleClearClick = (statement) => {
        setSqlWhere(statement);
    };

    const handleRowClick = (id) => {
        rowData = rows.find((row) => row.ID === id);
    };
    const handleRowDoubleclick = (e) => {
        e.preventDefault();
        handleSaveBtn(object.lovAction);
    };

    const handleSaveBtn = (lovValue) => {
        if (rowData) {
            lovValue.value = rowData[lovValue.idVal];
            lovValue.displayText = rowData[lovValue.txtVal];

            handleLovSaveBtn(lovValue);
        }
        handleCancelBtn(lovContainerId);
    };

    return (
        <div className="dwindow-lov-modal">
            <DModalContainer
                divId={lovContainerId}
                handleClose={handleCancelBtn}
                handleSave={() => handleSaveBtn(object.lovAction)}
                title={object.action.arName}
            >
                <div className="lov-filter-container">
                    <DLovFilterContainer
                        filters={object.action.grid.datafields.filter(
                            (fltr) => fltr.isFilterBy,
                        )}
                        gridcols={object.action.gridcol}
                        app={object.app}
                        action={object.action}
                        tblName={object.tblName}
                        idVal={object.idVal}
                        txtVal={object.txtVal}
                        isLovFilter={true}
                        searchClick={handleSearchClick}
                        clearClick={handleClearClick}
                    />
                </div>
                <div className="lov-grid-container">
                    {!loading && (
                        <EnhancedTable
                            app={object.app}
                            action={object.action}
                            headCells={headCells}
                            rows={rows}
                            rowsCount={rowsCount}
                            pageInfo={pageInfo}
                            setPageInfo={setPageInfo}
                            type="master"
                            selectable={isSelectable}
                            handleRowClick={handleRowClick}
                            handleRowDoubleclick={handleRowDoubleclick}
                        />
                    )}
                    <div className="footerdiv">
                        <JqxButton
                            style={{ marginTop: "10px" }}
                            theme={"light"}
                            onClick={() => handleSaveBtn(object.lovAction)}
                            width={50}
                            height={20}
                            template={"success"}
                        >
                            تأكيد
                        </JqxButton>
                        <JqxButton
                            style={{ marginTop: "10px", marginRight: "200px" }}
                            theme={"light"}
                            onClick={() => handleCancelBtn(lovContainerId)}
                            width={50}
                            height={20}
                            template={"danger"}
                        >
                            إلغاء
                        </JqxButton>
                    </div>
                </div>
            </DModalContainer>
        </div>
    );
};

export default DWindowLovModal;
