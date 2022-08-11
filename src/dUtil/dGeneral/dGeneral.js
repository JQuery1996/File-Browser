export const isAuthorized = (username, privToCheck, privList) => {
    if(username){
        let p = privList && privList.find(priv => priv.COD === privToCheck);
        if(p)
            return true;
    }

    return false;
}