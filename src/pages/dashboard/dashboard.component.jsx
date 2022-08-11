import React from 'react';
import { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
// import { authContext } from '../../contexts/AuthContext';

import DCard from '../../components/dcard/dcard.component';
import './dashboard.styles.css';

const DashBoard = () => {
    // const { auth } = React.useContext(authContext);
    const [data, setData] = useState()
    let { zoneId } = useParams();
    const getData = async () => {
        return await fetch(`../data/TAXCODE/applications.json`)
            .then(response => {
                if (response.ok)
                    return response.json();
            }).then(jsonObj => {
                setData(jsonObj)
            })
    }

    useEffect(() => {
        getData()
    }, [])
    

    if (data)
        return (
            <div className='dashboard'>
                <div className="cards"><DCard applications={data ? data : null} /></div>
            </div>
        )
    else
        return (
            <div>
                Loading....
            </div>)
};

export default DashBoard;