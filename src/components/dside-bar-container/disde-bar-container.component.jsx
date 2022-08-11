import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './dside-bar-container.styles.scss';

import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from 'react-pro-sidebar';
import { FaGripLines, FaMinus, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";

const DSideBarContainer = ({ collapsed, setCollapsed, data, object, handleSideBarClick, selected, handleOpenWindowreport }) => {
    // const { auth } = React.useContext(authContext);

    // const [collapsed, setCollapsed] = useState(false);
    const handleCollapsedChange = () => {
        setCollapsed(!collapsed);
    };

    const [toggled, setToggled] = useState(false);
    const handleToggleSidebar = (value) => {
        setToggled(value);
    };
    const [selecteindex, setSelecteindex] = useState(selected)
    function selectitem(arName, idx) {
        let id = arName + idx;
        setSelecteindex(id)
    }

    const [dimensions, setDimensions] = useState(window.innerWidth);
    const handleResize = () => {
        if (dimensions < 900) {
            setCollapsed(true)
            setDimensions(window.innerWidth)
        }
        else {
            setCollapsed(false)
            setDimensions(window.innerWidth)
        }
    }

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize);
        return (_) => {
            window.removeEventListener("resize", handleResize);
        };
    }, [dimensions]);

    useEffect(() => {
        setSelecteindex(selected);
    }, [selected])


    const changeAction = (sideBarObj) => {
        let action, groupId;
        for (let index = 0; index < data.groups.length; index++) {
            action = data.groups[index].actions.find(itm => itm.name === sideBarObj.name);
            if (action){
                groupId = data.groups[index].groupId;
                break;
            }
        };
        handleSideBarClick(action, groupId, selecteindex);
    };


    // let sideBarObject = data && data.group ? buildSideBarMenu(data, auth.authorizationList) : {};

    let sidebarbuild = () => {

        if (object && object.menus) {
            let menus = object.menus.map((element, jdx) => {
                let subMenus = element.subMenus;
                return (
                    <div key={jdx}>
                        <Menu>
                            

                            {subMenus.length !== 0 ?
                                <SubMenu
                                    suffix={<span className="badge gray aboAli" style={{color:"white"}}>{subMenus.length}</span>}
                                    icon={<FaGripLines style={{color:"#117a8b",float:"right",fontSize:"15px",paddingTop:"3px"}}/>}
                                    title={element.title}
                                >
                                    {subMenus.map((subElement, idx) => {
                                        return (
                                            <div id={element.title + idx} key={idx} className="ulItems" style={element.title + idx == selecteindex ? { color:"white",backgroundColor: "#3f6791", borderRadius: "8px" } : null}>
                                                <MenuItem >
                                                    <Link to={'#'} id={element.title + idx} 
                                                    style={{ fontFamily: 'bold', color:"#343a40",textDecoration:"none",fontSize:"17px"}}
                                                    onFocus={() => selectitem(element.title, idx)} onClick={() => changeAction(subElement)}>
                                                        {subElement.title}
                                                    </Link>
                                                </MenuItem>
                                            </div>)
                                    })}
                                </SubMenu> :
                                <MenuItem
                                 icon={<FaMinus />}
                                  >
                                    <Link to={"#"} onClick={handleOpenWindowreport}>
                                        {element.title}
                                    </Link>
                                </MenuItem>}
                        </Menu>
                    </div>)
            })
            return menus;
        }
        else
            return null
    }
    if (object)
        return (
            <ProSidebar
                rtl="rtl"
                collapsed={collapsed}
                toggled={toggled}
                onToggle={handleToggleSidebar}
                style={{ overflowY: "hidden" }}
            >
                <SidebarHeader>
                    <div
                        style={{ textAlign: 'center', minHeight: "10%" }}
                    >
                        {!collapsed ?
                            <h1>{object.title}</h1> : <h5>{object.tittle}</h5>}
                    </div>
                    <div style={{ float: "left", marginLeft: "5%" }}>
                        {collapsed ? <BsChevronLeft className="togllclass" style={{ height: " 25px", width: "25px" }} onClick={handleCollapsedChange} />
                            : <BsChevronRight className="togllclass" style={{ height: " 25px", width: "25px" }} onClick={handleCollapsedChange} />}
                    </div>
                </SidebarHeader>
                <div style={{ textAlign: "center",color:"#343a40", height: "80vh", overflowY: "auto", direction: "ltr",fontSize:"20px" }}>
                    <SidebarContent style={{ direction: "rtl",color:"#343a40" }} >
                        {sidebarbuild()}
                    </SidebarContent>
                </div>
                <SidebarFooter style={{ textAlign: 'center', height: "10vh" }}>
                    {object.title}
                </SidebarFooter>
            </ProSidebar>
        );
    else
        return null;
};

export default DSideBarContainer;
