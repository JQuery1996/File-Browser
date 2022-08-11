import * as React from "react";

import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { arSD } from "@mui/material/locale";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import moment from "moment";

import "./ddata-table.styles.css";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const {
        headCells,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        selectable,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {selectable && (
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={
                                numSelected > 0 && numSelected < rowCount
                            }
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                "aria-label": "select all desserts",
                            }}
                        />
                    </TableCell>
                )}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "center"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    headCells: PropTypes.array.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const {
        app,
        action,
        numSelected,
        showAddCircleIcon,
        showDeleteIcon,
        handleAddCircleIconBtn,
        handleDeleteIconBtn,
    } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity,
                        ),
                }),
            }}
        >
            {showAddCircleIcon && (
                <Tooltip title="إضافة">
                    <IconButton
                        onClick={() => handleAddCircleIconBtn(app, action)}
                    >
                        <AddCircleIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            )}

            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    محدد {numSelected}
                </Typography>
            ) : null}
            {numSelected > 1 && showDeleteIcon ? (
                <Tooltip title="حذف">
                    <IconButton
                        onClick={() => handleDeleteIconBtn(app, action)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : null}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
    const {
        app,
        action,
        headCells,
        rows,
        rowsCount,
        pageInfo,
        setPageInfo,
        contextMenuItms,
        type,
        selectable,
        setSelectedRowIDs,
        showAddCircleIcon,
        showDeleteIcon,
        handleAddCircleIconBtn,
        handleDeleteIconBtn,
        handleItemClickBtn,
        handleRowClick,
        handleRowDoubleclick,
        handleMouseOverRow,
        handleContextMenuOpen,
        setDetailGridObject,
    } = props;
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [selected, setSelected] = React.useState([]);
    const [selectedRowData, setSelectedRowData] = React.useState({});
    const [items, setItems] = React.useState(contextMenuItms);

    function getCustomCellStyle(idx, cellId) {
        let test,
            obj,
            color = "white";
        let rowData = rows.find((row) => row.ID === idx);

        if (action.hasOwnProperty("colorsRow")) {
            for (let i = 0; i < action.colorsRow.length; i++) {
                if (action.colorsRow[i].name === cellId) {
                    obj = action.colorsRow[i].name;
                    for (
                        let j = 0;
                        j < action.colorsRow[i].colorsValue.length;
                        j++
                    ) {
                        if (
                            action.colorsRow[i].colorsValue[j].value ===
                            rowData[obj]
                        ) {
                            test = action.colorsRow[i].colorsValue[j];
                            color = test.color;
                        }
                    }
                    return { background: color };
                }
            }
        }
        return;
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.ID);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        event.preventDefault();
        if (type === "master" && setDetailGridObject)
            setDetailGridObject({
                show: false,
            });
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectable) {
            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
                );
            }
        } else {
            newSelected = [id];
        }
        handleClose();
        setSelected(newSelected);
        if (setSelectedRowIDs) {
            setSelectedRowIDs(newSelected);
        }
        if (handleRowClick) {
            handleRowClick(id);
        }
    };

    const handleMousOver = (id) => {
        let rowData = rows.find((row) => row.ID === id);
        if (rowData.ID != selectedRowData.ID) {
            setSelectedRowData(rowData);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPageInfo({
            ...pageInfo,
            pagenum: newPage,
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setPageInfo({
            pagenum: 0,
            pagesize: parseInt(event.target.value, 10),
        });
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows =
    //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const theme = createTheme(
        {
            direction: "rtl",
            palette: {
                primary: { main: "#1976d2" },
            },
        },
        arSD,
    );

    const [contextMenu, setContextMenu] = React.useState(null);

    const handleContextMenu = (event, id) => {
        event.preventDefault();
        if (!selectable || selected.length <= 1) {
            let newSelected = [id];
            setSelected(newSelected);
            if (handleContextMenuOpen)
                handleContextMenuOpen(
                    event.clientX,
                    event.clientY,
                    selectedRowData,
                );
        }
        // if(contextMenu === null){
        //   setSelected(newSelected);
        //   setContextMenu({
        //     mouseX: event.clientX - 2,
        //     mouseY: event.clientY - 4,
        //   })
        // }
        // else{
        //   if(event.clientX !== contextMenu.mouseX && event.clientY !== contextMenu.mouseY){
        //     setSelected(newSelected);
        //     setContextMenu({
        //       mouseX: event.clientX - 2,
        //       mouseY: event.clientY - 4,
        //     })
        //   }
        //   else
        //     setContextMenu(null)
        // }
        // setContextMenu(
        //   contextMenu === null
        //     ? {
        //       mouseX: event.clientX - 2,
        //       mouseY: event.clientY - 4,
        //     }
        //     : (event.clientX !== contextMenu.mouseX && event.clientY !== contextMenu.mouseY)
        //     ? {
        //       mouseX: event.clientX - 2,
        //       mouseY: event.clientY - 4,
        //     }
        //     :
        //     // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
        //     // Other native context menus might behave different.
        //     // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
        //     null,
        // );
    };

    const handleClose = (e) => {
        setContextMenu(null);
    };

    const handleItemClick = async (event) => {
        let itmObj = event.target;
        // setTimeout(async () => { await handleItemClickBtn(app, action, itmObj, selectedRowData) }, 2000);
        await handleItemClickBtn(event, app, action, itmObj, selectedRowData);
        handleClose();
    };

    const handleCellDoubleClick = (e) => {
        navigator.clipboard.writeText(e.target.innerText);
        // handleShowGlobalNotification("تم النسخ")
    };

    return (
        <Box sx={{ width: "100%" }}>
            {/* <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {
          items.map((_contextMenu, idx) => (
            <MenuItem key={idx} id={_contextMenu.id} onClick={handleItemClick}>{_contextMenu.text}</MenuItem>
          ))
        }
      </Menu> */}
            <ThemeProvider theme={theme}>
                <Paper sx={{ width: "100%", mb: 4, pl: 3, pr: 3 }}>
                    <EnhancedTableToolbar
                        // className="border border-dark"
                        app={app}
                        action={action}
                        numSelected={selected.length}
                        showAddCircleIcon={showAddCircleIcon}
                        showDeleteIcon={showDeleteIcon}
                        handleAddCircleIconBtn={handleAddCircleIconBtn}
                        handleDeleteIconBtn={handleDeleteIconBtn}
                    />
                    <TableContainer>
                        <Table
                            className="table table-borderless"
                            style={{ color: "black" }}
                            //  className="border border-dark"
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size="small"
                            padding="none"
                        >
                            <EnhancedTableHead
                                className="thead-light"
                                style={{ color: "red" }}
                                // className="border border-dark"
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                headCells={headCells.filter(
                                    (hCell) => hCell.visible,
                                )}
                                rowCount={rows.length}
                                selectable={selectable}
                            />
                            <TableBody
                            // style={{ color: 'red'}}
                            >
                                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                                {/*
                                 */}
                                {stableSort(
                                    rows,
                                    getComparator(order, orderBy),
                                ).map((row, index) => {
                                    // here
                                    const isItemSelected = isSelected(row.ID);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onMouseOver={() =>
                                                handleMousOver(row.ID)
                                            }
                                            onClick={(event) =>
                                                handleClick(event, row.ID)
                                            }
                                            onDoubleClick={
                                                handleRowDoubleclick
                                                    ? (event) =>
                                                          handleRowDoubleclick(
                                                              event,
                                                          )
                                                    : null
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.ID}
                                            selected={isItemSelected}
                                            component="div"
                                            onContextMenu={(event) =>
                                                handleContextMenu(event, row.ID)
                                            }
                                            style={{
                                                cursor: "context-menu",
                                                height: 10,
                                            }}
                                        >
                                            {selectable && (
                                                <TableCell
                                                    padding="checkbox"
                                                    style={{
                                                        height: "auto !important",
                                                    }}
                                                >
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            "aria-labelledby":
                                                                labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                            )}
                                            {headCells
                                                .filter(
                                                    (hCell) => hCell.visible,
                                                )
                                                .map((hCell, idx) => {
                                                    let _columnIdintifier =
                                                        hCell.id;
                                                    var tempDate =
                                                        hCell.type === "date"
                                                            ? moment(
                                                                  row[
                                                                      _columnIdintifier
                                                                  ],
                                                              ).format(
                                                                  "MM/DD/YYYY",
                                                              )
                                                            : "";

                                                    return (
                                                        <Tooltip
                                                            key={idx}
                                                            title={
                                                                hCell.type ===
                                                                "date"
                                                                    ? tempDate
                                                                    : row[
                                                                          _columnIdintifier
                                                                      ]
                                                                    ? row[
                                                                          _columnIdintifier
                                                                      ]
                                                                    : ""
                                                            }
                                                            placement="top-end"
                                                        >
                                                            <TableCell
                                                                align="center"
                                                                type={
                                                                    hCell.type
                                                                }
                                                                style={{
                                                                    height: "auto !important",
                                                                    ...getCustomCellStyle(
                                                                        row.ID,
                                                                        hCell.id,
                                                                    ),
                                                                }}
                                                                onDoubleClick={(
                                                                    e,
                                                                ) =>
                                                                    handleCellDoubleClick(
                                                                        e,
                                                                    )
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        "textContainer"
                                                                    }
                                                                >
                                                                    {hCell.type ===
                                                                    "date"
                                                                        ? tempDate !=
                                                                          "Invalid date"
                                                                            ? tempDate
                                                                            : ""
                                                                        : row[
                                                                              _columnIdintifier
                                                                          ]}
                                                                </div>
                                                            </TableCell>
                                                        </Tooltip>
                                                    );
                                                })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={parseInt(rowsCount, 10)}
                            rowsPerPage={pageInfo.pagesize}
                            page={pageInfo.pagenum}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelDisplayedRows={({ from, to, count }) =>
                                `${to}-${from} من ${count}`
                            }
                        />
                    }
                </Paper>
            </ThemeProvider>
        </Box>
    );
}

EnhancedTable.propTypes = {
    type: PropTypes.oneOf(["master", "detail"]).isRequired,
};
