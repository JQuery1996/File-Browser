import React,{useState , useEffect} from 'react';

import DCard from '../../components/dcard/dcard.component';

import './main-dashboard.styles.css';
const MainDashboard = () => {

    const [data, setData] = useState();
    const getData = async () => {
        return await fetch(`${process.env.PUBLIC_URL}/data/zones.json`)
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
}

export default MainDashboard;