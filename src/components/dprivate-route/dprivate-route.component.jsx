import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { authContext } from '../../contexts/AuthContext';

import { useAuth } from '../../contexts/AuthContext';

const DPrivateRoute = ({ component: Component, masterInfo, handleSetMasterInfo, handleShowGlobalNotification, ...rest }) => {
    const {
        auth
      } = useAuth();

    if (auth.loading) {
        return (
            <Route
                {...rest}
                render={() => {
                    return <p>Loading...</p>;
                }}
            />
        );
    }
    // if loading is set to true (when our function useEffect(() => {}, []) is not executed), we are rendering a loading component;


    return (
        <Route
            {...rest}
            render={routeProps => {
                return auth.isAuthenticated ? (
                    <Component {...routeProps} masterInfo={masterInfo} handleSetMasterInfo={handleSetMasterInfo} handleShowGlobalNotification={handleShowGlobalNotification} />
                ) : (
                    <Redirect to="/sign-in" />
                );
            }}
        />
    );
    /*  we are spreading routeProps to be able to access this routeProps in the component. */
};

export default DPrivateRoute;