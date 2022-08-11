import { useState, createContext, useContext, useEffect } from 'react';
// import client from '../client';

// set auth session
const setSession = (token) => {
  if (token) {
    localStorage.setItem('token', JSON.stringify(token));
    // client.defaults.headers.token = token;
  } else {
    localStorage.removeItem('token');
    // delete client.defaults.headers.token;
  }
};

export const authContext = createContext([]);

export const useAuth = () => useContext(authContext);

export const AuthWrapper = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    isAuthenticated: false,
    loading: true,
    authorizationList: null
  });

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      setSession(JSON.parse(token));
          let commandUrl = process.env.NODE_ENV === "development" ? window.SERVER_URL_API_DEV 
                + "DWD_SECURITY/AuthorizeCommand"
                : window.SERVER_URL + "DWD_SECURITY/AuthorizeCommand";
                
          let requestMethod = "POST";

          let requestData = {
              baseParams: {
                  _g: "_2",
                  _pac: "SECURITY_API",
                  _pr: "AUTH_PROC",
              },
          }

          const requestOptions = {
              method: requestMethod,
              headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + JSON.parse(token)
              },
              body: JSON.stringify({
                  requestData: requestData
              }),
          };
          fetch(commandUrl, requestOptions).then(res => {
              return res.json();
          }).then(result => {
            if (result.cod == 401) {
              logout();
            }
            else if (result.status === 'succeeded') {
              setAuth({
                ...auth,
                user: result.userInfo.Username,
                loading: false,
                authorizationList: result.authList,
                isAuthenticated: true,
              });
            }
            else {
              logout();
            }
          }).catch((err) => {
            console.log(err);
          });
    } else {
      setAuth({
        ...auth,
        user: null,
        loading: false,
        authorizationList: null,
        isAuthenticated: false,
      });
    }
    // eslint-disable-next-line
  }, []);


  const logout = () => {
    setAuth((prevState) => ({
      ...prevState,
      user: null,
      loading: false,
      authorizationList: null,
      isAuthenticated: false,
    }));
    setSession(null);
  };

  return (
    <authContext.Provider value={{ auth, setAuth, logout, setSession }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthWrapper;
