import React from 'react';
import './sign-in-sign-up.styles.css';
import DSignIn from '../../components/dsign-in/dsign-in.component';

 
const SignInSignUp = ({ handleShowGlobalNotification }) => (
    <div className='sign-in-sign-up'
    
    >
        <DSignIn 
        
        handleShowGlobalNotification={handleShowGlobalNotification} />
    </div>
);
export default SignInSignUp;
