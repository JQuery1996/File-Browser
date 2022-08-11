export function buildSideBarMenu(application, privList) {
    let returnObj = {};
    if (application) {
        returnObj.title = application.arName;
        returnObj.name = application.name;
        returnObj.appName = application.appName;
        let menus = [];
        let status = true;
        let message = {};

        let isRequestValidation = process.env.NODE_ENV === "development" ? 
        window.REQUEST_PRIVILIGES_DEV : 
        window.REQUEST_PRIVILIGES_PROD;

        if(isRequestValidation) {
            application && application.groups && application.groups.map(g => {
                let t = privList && privList.find(x => x.COD === g.priv);
                if (t) {
                    if (g.visible === true) {
                        let obj = {};
                        let subMenus = [];
                        obj.name = g.name;
                        obj.path = g.path;
                        if (g.hasOwnProperty('arName')) {
                            status = true;
                            obj.title = g.arName;
                            g.actions.map(a => {
                                let tt = privList.find(x => x.COD === a.priv);
                                if (tt) {
                                    if (a.hasOwnProperty('visible')) {
                                        if (a.visible === true) {
                                            let subObj = {};
                                            subObj.name = a.name;
                                            subObj.title = a.arName;
                                            subMenus.push(subObj);
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            status = false;
                            message = obj.name + ' have no arName';
                        }
    
                        obj.subMenus = subMenus;
                        menus.push(obj);
                    }
                }
            });
        }
        else {
            application && application.groups && application.groups.map(g => {
                    if (g.visible === true) {
                        let obj = {};
                        let subMenus = [];
                        obj.name = g.name;
                        obj.path = g.path;
                        if (g.hasOwnProperty('arName')) {
                            status = true;
                            obj.title = g.arName;
                            g.actions.map(a => {
                                    if (a.hasOwnProperty('visible')) {
                                        if (a.visible === true) {
                                            let subObj = {};
                                            subObj.name = a.name;
                                            subObj.title = a.arName;
                                            subMenus.push(subObj);
                                        }
                                    }
                            });
                        }
                        else {
                            status = false;
                            message = obj.name + ' have no arName';
                        }
    
                        obj.subMenus = subMenus;
                        menus.push(obj);
                    }
            });
        }
        returnObj.status = status;
        returnObj.message = message
        returnObj.menus = menus;
    }

    return returnObj;

};