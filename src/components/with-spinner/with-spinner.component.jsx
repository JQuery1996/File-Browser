import React from 'react';
import './with-spinner.styles.css';

const WithSpinner = WrappedComponent => {
    const Spinner = ({ isLoading , ...otherProps }) => {
    return isLoading ? (
        <div className='SpinnerOverlay'>
            <div className='SpinnerContainer' />
        </div>
    ) : (
        <WrappedComponent { ...otherProps} />
    );
};
return Spinner;
};
export default WithSpinner;