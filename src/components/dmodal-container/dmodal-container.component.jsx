import React, { useEffect } from 'react';

import './dmodal-container.styles.css';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const DModalContainer = ({ divId, handleClose, children, title, action }) => {

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode == 27 && handleClose) {
                handleClose(divId)
            }
        }
        window.addEventListener('keydown', handleEsc); return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);
    return (
        <div className="modal-container"  >
            
            <section className="modal-main">
                <div className='labelwindow'><div className="closebtnClass" onClick={()=>handleClose(divId) }>                         
                 <IconButton style={{padding:"0"}} >
                            <CloseIcon style={{color:"#bbb5b5"}}  />
                                 
                     
                        </IconButton></div>
                    <label>{title} {(action) ? action.arName : null}</label>
                </div>
                <div className='scrolclass'>
                    {children}
                </div>
            </section>
        </div>
    );
};

export default DModalContainer;