import moment from "moment";

export function columnsnames(object) {
  let colums = [];
  object.map((itm) => {
    if (itm.visible) {
      let obj = {
        text: itm.text,
        datafield: itm.name,
        align: "center",
        cellsalign: "center",
        cellsformat: itm.type === "date" ? "MM/dd/yyyy" : "",
        // width:"15%",
      };
      colums.push(obj);
    }
  });
  return colums;
}

export function allcolumnNames(array) {
  let columns = [];
  array.map((itm) => {
    if (itm.extend) {
      let obj = {
        text: itm.text,
        name: itm.name,
        type: itm.type,
      };
      columns.push(obj);
    }
  });
  return columns;
}

export function jsondata(object) {
  let colums = [];
  object.map((itm) => {
    let colum = {
      name: itm.name,
      text: itm.text,
      placeholder: itm.placeholder,
      type: itm.type,
      ordr: itm.ordr,
      fromAction: itm.fromAction,
      isFilterBy: itm.isFilterBy,
      filterType: itm.filterType,
      isQuired: itm.isQuired,
      visible: itm.visible,
    };
    colums.push(colum);
  });
  return colums;
}

export const fillRequestData = (array, objOfValues) => {
  let paramsArr = [];
  array
    .map((itm) => {
      let obj = {};
      switch (itm.type) {
        case "date":
          obj = {
            "name": itm.name,
            "value": itm.value = moment(objOfValues[itm.name].value).format("MM/DD/YYYY")
          };
          paramsArr.push(obj);
          break;
        case "float":
          obj = {
            "name": itm.name,
            "value": itm.value = parseFloat(objOfValues[itm.name].value)
          };
          paramsArr.push(obj);
          break;
        case "int":
          obj = {
            "name": itm.name,
            "value": itm.value = parseInt(objOfValues[itm.name].value)
          };
          paramsArr.push(obj);
          break;
        case "string":
          obj = {
            "name": itm.name,
            "value": itm.value = objOfValues[itm.name].value
          };
          paramsArr.push(obj);
          break;
        default:
          return null;
      }
    });
  return paramsArr;
};
