// import React, { createContext, useState, useEffect } from 'react';

// export const authContext = createContext({});

// const AuthProvider = ({ children }) => {
//     const [auth, setAuth] = useState({ loading: true, data: null, authorizationList: null });
//     // we will use loading later


//     const setAuthData = (data, list) => {
//         setAuth({ data: data, authorizationList: list });
//     };
//     // a function that will help us to add the user data in the auth;

//     useEffect(() => {
//         setAuth({
//             loading: false, data: JSON.parse(window.localStorage.getItem('authData')),
//             authorizationList: JSON.parse(window.localStorage.getItem('authList'))
//         });
//     }, []);
//     //2. if object with key 'authData' exists in localStorage, we are putting its value in auth.data and we set loading to false. 
//     //This function will be executed every time component is mounted (every time the user refresh the page);

//     useEffect(() => {
//         window.localStorage.setItem('authData', JSON.stringify(auth.data));
//     }, [auth.data]);
//     // 1. when **auth.data** changes we are setting **auth.data** in localStorage with the key 'authData'.


//     useEffect(() => {
//         window.localStorage.setItem('authList', JSON.stringify(auth.authorizationList));
//     }, [auth.authorizationList]);
//     // 2. when **auth.authorizationList** changes we are setting **auth.authorizationList** in localStorage with the key 'authList'.


//     return (
//         <authContext.Provider value={{ auth, setAuthData }}>
//             {children}
//         </authContext.Provider>
//     );
// };

// export default AuthProvider;