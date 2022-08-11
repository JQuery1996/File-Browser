import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';

import DModalContainer from '../dmodal-container/dmodal-container.component';
import DWindowLovModal from '../dwindow-lov-modal/dwindow-lov-modal.component';
import DModalGrid from '../dmodal-grid/dmodal-grid.component';
import './dwindow-modal-grid.styles.css';
import moment from 'moment';

const DWindowModalGrid = ({ handleCancelBtn, array, columns, action }) => {
    return (
        <div className='dwindow-modal'>
            <DModalGrid
                divId={'window-container'}
                handleClose={handleCancelBtn}
                title={action.arName}
            >
                {
                    array.map((itm, idx) => (
                        <div className='cell' key={idx}>
                            <label className='rowname'>{itm.text}{":"} </label>
                            <br />
                            <label className='rowvalue'>
                                {itm.type === 'date' ?
                                    moment(columns[itm.name]).format("MM/DD/YYYY") === 'Invalid date' ?
                                        moment(columns[itm.name]).format("MM/DD/YYYY") == null
                                        : moment(columns[itm.name]).format("MM/DD/YYYY")
                                    :
                                    columns[itm.name]}</label>
                        </div>
                    ))
                }
            </DModalGrid>
        </div>
    );
};

export default DWindowModalGrid;