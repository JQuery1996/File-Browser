import {useState,useEffect}  from 'react'
import React from 'react'
import "./dcheckgroup.css"
import configData from "../../config.json";

const DChekgroup = ({s ,IDs,handleChange11}) => {
    const [IDsArray, setIDsArray] = useState(IDs ? (IDs.length >1? IDs.split(",") : [IDs]):[])
    let formatData= ()=> {
    let requestData = {}
    requestData.paramsCollection = s.action.procedures.find(procedure => procedure.type === 'SELECT').paramsCollection;
    requestData.paramsCollection.find(obj => obj.dbName === 'P_PAGE_INDEX').value = 0;
    requestData.paramsCollection.find(obj => obj.dbName === 'P_PAGE_SIZE').value = 500;
    requestData.baseParams = {
        appName:s.app.name,
        packageName: s.action.packageName,
        procedureName: s.action.procedures.find(procedure => procedure.type === 'SELECT').procedureName,
    }
 
    return `{'requestData': ${JSON.stringify(requestData)}}`;
}
const [Chckdgr, setChckgr] = useState([])
useEffect(() => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: formatData()
    };
    
    fetch( configData.SERVER_URL + s.app.basicCommand.find((command) => command.type === 'SELECT').url,requestOptions)
    .then(response => response.json())
    .then((data) => setChckgr(data.result) );
 
}, []);

useEffect(() => {
    handleChange11(IDsArray.toString(),s.chckAction.name)
},[IDsArray],);

const handleChange= (e)=>{
    if(IDsArray.includes(e.target.id)){
    setIDsArray(IDsArray.filter((IDsArray) =>(IDsArray !== e.target.id))) 
    }
    else { 
        setIDsArray(IDsArray => [...IDsArray, e.target.id]);
    }
}
return (
<fieldset className="fieldsetClass">
    <legend>{s.chckAction.displayText}</legend>
    {Chckdgr.map((Chckdg,INDX) => (<>
    <div className="rowclass">
        
    <label style={{width:"50%",textAlign:"center"}}>{Chckdg.NAME}</label>
    <input   type="checkbox" id={Chckdg.ID} onChange={(IDsArray)=>handleChange(IDsArray)} value={INDX}
      checked={IDsArray.includes(Chckdg.ID.toString())?true:false} 
    />
    
    </div>
    </>
    ))}
    </fieldset>
    )
}

export default DChekgroup
