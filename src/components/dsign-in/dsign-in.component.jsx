import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import './dsign-in.styles.css';

import { useAuth } from '../../contexts/AuthContext';

// import background from "./logo Tax.jpg"
 
import Background from '../../components/logo Tax.jpg';


async function loginUser(credentials) {
    let requestParams = [
        {
            name: "login",
            value: credentials.username,
        },
        {
            name: "password",
            value: credentials.password,
        }
    ];

    let commandUrl = process.env.NODE_ENV === "development" ? window.SERVER_URL_API_DEV 
    + "DWD_SECURITY/LoginCommand"
    : window.SERVER_URL + "DWD_SECURITY/LoginCommand";
    let requestMethod = "POST";

    let requestData = {
        paramsCollection: requestParams,
        baseParams: {
            _g: "_2",
			_pac: "SECURITY_API",
			_pr: "LOGIN_PROC"
        },
    }

    const requestOptions = {
        method: requestMethod,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            requestData: requestData
        }),
    };

    return fetch(commandUrl, requestOptions)
        .then((response) => {
            return response
        });
}

const DSignIn = ({ handleShowGlobalNotification, history }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {
        setAuth,
        setSession
      } = useAuth();

    const signIn = async e => {
        e.preventDefault();
        return await loginUser({
            username,
            password
        }).then(data => {
            return {
                response: data.json(),
                responseStatusCode: data.status,
                responseStatusText: data.statusText,
                responseType: data.type,
                responseUrl: data.url,
            }
        }).then(result => {
            if (result.responseStatusCode === 200) {
                return result.response;
            }
            else if (result.responseStatusCode === 400) {
                handleShowGlobalNotification("خطأ في بيانات الدخول ");
                return null;
            }
        }).then(result => {
                setSession(result.userInfo.Token);
                setAuth((prevState) => ({
                    ...prevState,
                    user: result.userInfo.Username,
                    loading: false,
                    authorizationList: result.authList,
                    isAuthenticated: true,
                  }))
                handleShowGlobalNotification("تم تسجيل الدخول بنجاح ");
                history.replace('/');
                console.log(result.authList)
        }).catch((err) => {
            console.log(err);
        });
    }
    return (
             <div className='sign-in'
            //  style={{ backgroundImage: `url(${background})` }}
              style={{
                background: `url(${Background})`,
                // backgroundRepeat: `round`,
            
              }}
              >
                 <img
                   className="imag_bg_class"
                   src="images/Icon tax.jpg"  //Ruba update
                   alt=""
                 /> 
                 
                <form action="" className='signInform' autoComplete="off">
                    <div className='signInformdiv'>
                    <h2 className='signInh2'> البوابة الالكترونية للتصنيف الضريبي</h2>
                    <p className='signInp'></p>
                    </div>
               
                <div className='test2'>
                <div className='signInfloating-label'>
                <div className="signIncol">
                    <input className='signIninput' placeholder="اسم المستخدم" onChange={e => setUsername(e.target.value)} type="text" name="email" id="email" autoComplete="off" />
                    <span className="focus-border">
                    <i></i>
                    </span>
                </div>
                    <label className='signInlabel' htmlFor="email">اسم المستخدم</label>
                </div>
                <div className='signInfloating-label'>
                <div className="signIncol">
                    <input className='signIninput' placeholder="كلمة المرور" onChange={e => setPassword(e.target.value)} type="password" name="password" id="password" autoComplete="off" />
                    <span className="focus-border">
                    <i></i>
                    </span>
                    </div>
                    <label className='signInlabel' htmlFor="password">كلمة المرور</label>
                </div>
                </div>
                <div  className='signInformdiv'>
                <button className='signInbutton' type="submit" onClick={signIn}>تسجيل الدخول</button>
                </div>
            </form>
        </div>
    )


}

export default withRouter(DSignIn);