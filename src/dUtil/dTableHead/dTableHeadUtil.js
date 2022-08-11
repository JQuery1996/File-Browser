

export const buildHeadCellsArr = (array) => {

    let _data = [];
    let _tempObj = {};

    array.map(_datafield => {
        let _numeric = false;
        if (_datafield.type === "int" || _datafield.type === "float")
            _numeric = true;
        _tempObj = {
            id: _datafield.name,
            numeric: _numeric,
            disablePadding: true,
            label: _datafield.text,
            visible: _datafield.visible,
            type: _datafield.type,
        }
        _data.push(_tempObj);
    })

    return _data;
};