import React,{useEffect} from 'react';

import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import './dmodal-grid.styles.css';

const DModalGrid = ({ divId, handleClose, children, title }) => {
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
        <div className="dmodal-grid display-block">
            <section className="dmodal-grid-main">
                <div className='labelwindow'>
                <div className='closebtnClass' onClick={()=>handleClose(divId)}>  
                <IconButton style={{padding:"0"}} >
                   <CloseIcon style={{color:"#bbb5b5"}}  />
                </IconButton>
                </div>
                   <label>{title}</label>
                </div>
                <div className='gridchildren'>
                    {children}
                </div>
                <div className="footerdiv1">
                    <JqxButton
                        theme={'light'}
                        onClick={() => handleClose(divId)}
                        width={50}
                        height={20}
                        template={'danger'}>
                        إلغاء
                    </JqxButton>
                </div>
            </section>
        </div>
    );
};
export default DModalGrid;