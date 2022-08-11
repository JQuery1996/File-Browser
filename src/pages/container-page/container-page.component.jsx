import React, { useEffect, useState } from "react";
import { withRouter, useParams } from "react-router-dom";
import ReactDOM from "react-dom";

import DContainer from "../../components/dcontainer/dcontainer.component";
import DSideBarContainer from "../../components/dside-bar-container/disde-bar-container.component";
import DWindowReport from "../../components/dwindow-report/dwindow-report.component";
import { buildSideBarMenu } from "../../dUtil/dSideBarUtil/util";

import { useAuth } from "../../contexts/AuthContext";

import { fetchMetaData } from "../../dUtil/dFetchData/dFetchMetaData";

import { unmountCompenentById } from "../../dUtil/dContainerPage/dContainerPageUtil";

// import DUpload from "../../components/dupload/duplaod.component";

import "./container-page.styles.css";

const ContainerPage = ({ handleShowGlobalNotification }) => {
    const [collapsed, setCollapsed] = useState({});
    const { auth } = useAuth();

    let { zoneId, appName } = useParams();
    const [object, setObject] = useState({});
    const [loading, setLoading] = React.useState(false);
    const [detailGridObject, setDetailGridObject] = useState({
        show: false,
    });

    useEffect(() => {
        let active = true;

        (async () => {
            setLoading(true);
            const _metaData = await fetchMetaData(appName);
            if (!active) {
                return;
            }

            if (`1`) {
                setObject({
                    app: _metaData,
                    groupId: null,
                    action: null,
                    sqlWhere: "",
                    selectedSideBarId: null,
                });
                setLoading(false);
            } else {
                handleShowGlobalNotification("Unknown error");
                setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [appName]);

    useEffect(() => {
        if (document.getElementById("loadingclass"))
            document.getElementById("loadingclass").style.display = "none";
        setDetailGridObject({
            show: false,
        });
    }, [collapsed]);

    const handleCancelWindowBtn = (id) => {
        unmountCompenentById(id);
    };

    const handleOpenWindowreport = () => {
        ReactDOM.render(
            <DWindowReport
                handleCancelWindowBtn={handleCancelWindowBtn}
                handleShowGlobalNotification={handleShowGlobalNotification}
                app={object.app}
                zoneId={zoneId}
            />,
            document.querySelector("#window-report"),
        );
    };

    const handleSideBarClick = (temp, groupId, selectedId) => {
        if (document.getElementById("loadingclass"))
            document.getElementById("loadingclass").style.display = "flex";
        setDetailGridObject({
            show: false,
        });
        setObject({
            ...object,
            groupId: groupId,
            action: temp,
            sqlWhere: "",
            selectedSideBarId: selectedId,
        });
    };

    if (!loading)
        return (
            <div className="container-page">
                <div className="explore-area">
                    <div className="menu-container">
                        <DSideBarContainer
                            data={object.app}
                            object={
                                object.app && object.app.groups
                                    ? buildSideBarMenu(
                                          object.app,
                                          auth.authorizationList,
                                      )
                                    : {}
                            }
                            handleSideBarClick={handleSideBarClick}
                            selected={object.selectedSideBarId}
                            setSelectedSideBarId={object.selectedSideBarId}
                            handleOpenWindowreport={handleOpenWindowreport}
                            collapsed={collapsed}
                            setCollapsed={setCollapsed}
                        />
                    </div>
                    <div
                        className="main-container"
                        style={
                            collapsed
                                ? { margin: "0 100px 0 0", width: "95%" }
                                : { margin: "0 250px 0 0", width: "82%" }
                        }
                    >
                        <div className="actiondescription"></div>
                        <DContainer
                            app={object.app}
                            action={object.action}
                            groupId={object.groupId}
                            detailGridObject={detailGridObject}
                            setDetailGridObject={setDetailGridObject}
                            handleShowGlobalNotification={
                                handleShowGlobalNotification
                            }
                        />
                        <div className="window-report" id="window-report"></div>
                        <div
                            className="window-report-detail"
                            id="window-report-detail"
                        ></div>
                    </div>
                </div>
            </div>
        );
    else return <div>Loading......</div>;
};

export default withRouter(ContainerPage);
