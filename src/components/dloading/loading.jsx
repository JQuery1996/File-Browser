import React from 'react'
import Loader from "react-loader-spinner";

import './loading.css'
function Load() {

    return (

        <div id="loadingclass" className='loadingclass'>
            <Loader type="BallTriangle" color="#b5abb6" height={100} width={100} style={{ margin: "auto" }} />
        </div>
    )
}

export default Load
