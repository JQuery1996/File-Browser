
import React, { useRef, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import dontfound from "../dontfound/dnotfound"
import DashBoard from '../dashboard/dashboard.component';
import ContainerPage from '../container-page/container-page.component';
import DTopBar from '../../components/dtop-bar/dtop-bar.component';
import SignInSignUp from '../sign-in-sign-up/sign-in-sign-up.component';
import DPrivateRoute from '../../components/dprivate-route/dprivate-route.component';
import MainDashboard from '../main-dashboard/main-dashboard.component.jsx';


import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import './dlayout.styles.css';

function DLayout() {
    const [clicklogo, setclicklogo] = useState(false)
    const [openSnack, setOpenSnack] = React.useState(false);
    const [messageSnack, setMessageSnack] = React.useState('');

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenSnack(false);
      };

    const handleShowGlobalNotification = (notifyString) => {
        let trimMessage = notifyString.split("$");
        let errorMessage = ''
        if(trimMessage.length>0){
          for (let idx = 0; idx < trimMessage.length; idx++) {
            errorMessage += trimMessage[idx] + "\n";            
          }
        }
        else
          errorMessage = notifyString;
        setOpenSnack(true);
        setMessageSnack(errorMessage);
    }
    let logoclick = () => {
        setclicklogo(!clicklogo)
    }

    const actionSnack = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="warning"
            onClick={handleCloseSnack}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

    return (
        <div className="dlayoutclass">
            <DTopBar />
            <Snackbar
            // style={{color:"#117a8b"}}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={openSnack}
                autoHideDuration={4000}
                onClose={handleCloseSnack}
                message={messageSnack}
                action={actionSnack}
                severity="success"
            />

            <div className="bodydiv">
                <Switch>
                    <Route exact path='/sign-in' component={() => <SignInSignUp handleShowGlobalNotification={handleShowGlobalNotification} />} />
                    <DPrivateRoute exact path='/' component={DashBoard} />
                    <DPrivateRoute exact path={`/dashboard/:zoneId`} component={DashBoard} />
                    <DPrivateRoute exact path={`/:zoneId/:appName`} component={ContainerPage} handleShowGlobalNotification={handleShowGlobalNotification} />
                    <DPrivateRoute component={dontfound} />
                </Switch>

            </div>
        </div>
    )
}

export default DLayout;