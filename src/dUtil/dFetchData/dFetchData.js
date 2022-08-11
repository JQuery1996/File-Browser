import moment from "moment";

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


export const fetchData = async (app, action, groupId, id, sqlwhere, sqlOrder, pagenum, pagesize) => {
    let requestData = {}

    let paramsObj = {
        ID: id,
        PAGE_INDEX: pagenum,
        PAGE_SIZE: pagesize,
        SQLWHERE: sqlwhere,
        SQLORDER: sqlOrder
    };
    let requestParams = action.procedures.find(procedure => procedure.id === 'SELECT_PROC').paramsCollection;


    requestData.paramsCollection = fillRequestData(requestParams, paramsObj);
    requestData.baseParams = {
        _g: groupId,
        _pac: action.packageId,
        _pr: action.procedures.find(procedure => procedure.id === 'SELECT_PROC').id,
    };


    let commandUrl = process.env.NODE_ENV === "development" ? window.SERVER_URL_API_DEV 
    + app.basicCommand.find((command) => command.type === action.procedures.find(procedure => procedure.id === 'SELECT_PROC').type).url
    : window.SERVER_URL + app.basicCommand.find((command) => command.type === action.procedures.find(procedure => procedure.id === 'SELECT_PROC').type).url;
    let requestMethod = "POST";

    let token = localStorage.getItem("token");
    const requestOptions = {
        method: requestMethod,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${JSON.parse(token)}`:''
        },
        body: JSON.stringify({
            requestData: requestData
        }),
    };


    var data = await fetch(commandUrl, requestOptions)
        .then(res => {
          return res.json();
            // if (res.ok) {
            //     return res.json();
            // }
        })
        .then(rowData => {
            return rowData
        })

    return data;
};