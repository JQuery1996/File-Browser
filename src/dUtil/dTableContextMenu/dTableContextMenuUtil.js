
import {isAuthorized} from '../dGeneral/dGeneral';

export const buildContextMenuArr = (username, array, privList) => {
    let _data = [];
    let _tempObj = {};
    let requestPriviliges = process.env.NODE_ENV === "development" ? window.REQUEST_PRIVILIGES_DEV
    : window.REQUEST_PRIVILIGES_PROD

    array.map(_contextMenu => {
        if(requestPriviliges) {
            if(_contextMenu.hasOwnProperty("priv")) {
                if(isAuthorized(username, _contextMenu.priv, privList)){
                    if(_contextMenu.hasOwnProperty("when"))
                        _tempObj = {
                            id: _contextMenu.id,
                            text: _contextMenu.text,
                            priv: _contextMenu.priv,
                            icon: _contextMenu.icon,
                            when: _contextMenu.when,
                        }
                    else
                        _tempObj = {
                            id: _contextMenu.id,
                            text: _contextMenu.text,
                            priv: _contextMenu.priv,
                            icon: _contextMenu.icon,
                        }
                    _data.push(_tempObj);
                }
            }
        }
        else {
            if(_contextMenu.hasOwnProperty("when"))
                        _tempObj = {
                            id: _contextMenu.id,
                            text: _contextMenu.text,
                            priv: _contextMenu.priv,
                            icon: _contextMenu.icon,
                            when: _contextMenu.when,
                        }
                    else
                        _tempObj = {
                            id: _contextMenu.id,
                            text: _contextMenu.text,
                            priv: _contextMenu.priv,
                            icon: _contextMenu.icon,
                        }
            _data.push(_tempObj);
        }
    })

    return _data;
};