import React from 'react';

import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';

import './dlov-grid-container.styles.css';

const DGridLov = ({ datafields, columns, gridcols, id, url, paramsCollection, 
    appName, packageName, procedureName, sqlWhere, 
    handleRowSelect, handleRowdoubleclick }) => {
    const gridRef = React.createRef(JqxGrid);
    const viscols = () => {
        let cols = [];
        if (gridcols) {
            columns.map((column) => {

                {
                    gridcols.map(gridcol => {
                        if (column.datafield === gridcol.name) {
                            cols.push(column);
                        }
                    }
                    )
                }
            }
            );
        }
        else { cols = columns }
        return cols;
    }
    var source = {
        datafields: datafields,
        datatype: 'json',
        id: id,
        url: url,
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        root: 'result',
        cache: false,
        beforeprocessing: function (data) {
            if (data.status === 'succeeded') {
                source.totalrecords = data.record_count;
            }
            else if (data.status === 'faild')
                alert(data.exceptionMessage);
            else
                alert("Unknown Error");
        },
    };
    var dataAdapter = new jqx.dataAdapter(source, {
        formatData: function (data) {
            let requestData = {}
            requestData.paramsCollection = paramsCollection
            requestData.paramsCollection.find(obj => obj.dbName === 'P_SQLWHERE').value = sqlWhere;
            requestData.paramsCollection.find(obj => obj.dbName === 'P_PAGE_INDEX').value = data.pagenum;
            requestData.paramsCollection.find(obj => obj.dbName === 'P_PAGE_SIZE').value = data.pagesize;
            requestData.baseParams = {
                appName: appName,
                packageName: packageName,
                procedureName: procedureName,
            }
            return `{'requestData': ${JSON.stringify(requestData)}}`;
        },
        downloadComplete: function (data, textStatus, jqXHR) {

        },
    }, { autoBind: true });

    const rowSelect = (event) => {
        handleRowSelect(event.args);
    }
    const Rowdoubleclick = (event) => {
        handleRowdoubleclick(event.args);
    }

    const onBindingcomplete = (e) => {
        if (gridRef.current) {
            gridRef.current.updatebounddata('cells');
        }
    };

    return (
        <div className='dgrid-container'>
            <JqxGrid
                ref={gridRef}
                onBindingcomplete={onBindingcomplete}
                onRowselect={rowSelect}
                onRowdoubleclick={Rowdoubleclick}
                pageable={true}
                rtl={true}
                width={'99%'}
                height={'350px'}
                virtualmode={true}
                rendergridrows={function (obj) {
                    return obj.data;
                }}
                source={dataAdapter}
                columns={viscols()}
                autoheight={false}
                columnsmenu={false}
                scrollmode={'logical'}
                theme={'material'}
                style={{ padding: "1px", margin: "1px", width: "100%", height: "75%" }}
            />
        </div>
    );
};

export default DGridLov;