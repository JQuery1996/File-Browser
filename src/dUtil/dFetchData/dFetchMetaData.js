
export const fetchMetaData = async (appName) => {

    let commandUrl = process.env.NODE_ENV === "development" ? window.FETCH_META_DATA_DEV 
    + appName + "/FetchMetaData"
    : window.FETCH_META_DATA_PROD + appName + "/FetchMetaData";
    let requestMethod = "POST";

    let token = localStorage.getItem("token");
    const requestOptions = {
        method: requestMethod,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${JSON.parse(token)}`:''
        },
        body: JSON.stringify({
            appName: appName
        }),
    };


    var data = await fetch(commandUrl, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(metaData => {
            return metaData
        })

    return data;
};