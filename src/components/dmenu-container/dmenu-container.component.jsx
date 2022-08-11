import React, { useEffect } from 'react';

import JqxMenu, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxmenu';

import './dmenu-container.styles.css';
import { BorderLeft } from '@mui/icons-material';

function buildContextMenu(row, items) {
    let result = [];

    items.map(_itm => {
        if(_itm.hasOwnProperty("when")){
          let tempWhenKeysArr = Object.keys(_itm.when);
          let isShow = true;
          for (let idx = 0; idx < tempWhenKeysArr.length; idx++) {
            if(row.hasOwnProperty(tempWhenKeysArr[idx]))
              if(_itm.when[tempWhenKeysArr[idx]] !== row[tempWhenKeysArr[idx]]){
                isShow = false;
                break;
              }
          }
          if(isShow)
            result.push(_itm);
        }
        else
          result.push(_itm);
      })

    return result;
  }

const DMenuContainer = React.forwardRef((props, ref) => {
    const { handleItemClick, row, contextMenu } = props;

    var dataSource = {};

    useEffect(() => {
        let source = {
            datafields: [
                { name: 'id' },
                { name: 'parentid' },
                { name: 'text' },
                { name: 'subMenuWidth' },
            ],
            datatype: 'json',
            id: 'uid',
            localdata: buildContextMenu(row, contextMenu)
        };
    
        let dataAdapter = new jqx.dataAdapter(source, { autoBind: true });
        dataSource = dataAdapter.getRecordsHierarchy('uid', 'parentid', 'items', [{ name: 'text', map: 'label' }])

        ref.current.setOptions
                ({
                    source: dataSource                   
                });
    }, [props])

    return (
        <div className='dmenu-container'>
            <JqxMenu
                className={"JqxMenu-class"}
                ref={ref}
                onItemclick={(e) => handleItemClick(e, row)}
                width={175}
                mode={'popup'}
                autoOpenPopup={false}
                rtl={true}
                source={dataSource}
                theme={'material'}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    borderColor: 'black',
                    // textAlign: 'center'
                    // boxShadow: '1px'


                }}
            >
            </JqxMenu>
        </div>
    )
});

export default DMenuContainer;