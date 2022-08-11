import React, { useState, useEffect } from "react";

import DModalContainer from "../dmodal-container/dmodal-container.component";
import DForm from "../dform/dform.component";

import "./dwindow-modal.styles.css";

const DWindowModal = ({
    elementId,
    app,
    settings,
    deepClone,
    array,
    handleCancelBtn,
    children,
    deleteRow,
    rowDataArray,
    action,
    masterAction,
    detailAction,
    lovContainerId,
    unselectallrow,
    FILE_BROWSER_ROOT_DIRECTORY,
}) => {
    const handleSaveBtn = (params) => {
        settings.saveBtn(app, action, params, settings.id);
    };

    useEffect(() => {
        try {
            var parentElement =
                document.getElementById("modal_element").children[0]
                    .children[1];
            if (parentElement.tagName === "INPUT") {
                parentElement.focus();
            } else {
                if (
                    parentElement.children[0] &&
                    parentElement.children[0].children[0].tagName === "INPUT"
                )
                    parentElement.children[0].children[0].focus();
            }
        } catch {}
    }, []);
    if (deepClone !== "error") {
        return (
            <div className="dwindow-modal">
                <DModalContainer
                    divId={elementId ? elementId : "window-container"}
                    handleClose={handleCancelBtn}
                    handleSave={handleSaveBtn}
                    title={settings.title}
                    action={action}
                >
                    {children}
                    <DForm
                        divId={elementId ? elementId : "window-container"}
                        handleClose={handleCancelBtn}
                        handleSave={handleSaveBtn}
                        array={array}
                        settings={settings}
                        app={app}
                        params={settings.params}
                        deepClone={deepClone}
                        deleteRow={deleteRow}
                        rowDataArray={rowDataArray}
                        action={action}
                        masterActionName={masterAction ? masterAction.name : ""}
                        lovContainerId={lovContainerId}
                        unselectallrow={unselectallrow}
                        FILE_BROWSER_ROOT_DIRECTORY={
                            FILE_BROWSER_ROOT_DIRECTORY
                        }
                    />
                </DModalContainer>
            </div>
        );
    } else {
        return (
            <div className="dwindow-modal">
                <DModalContainer
                    divId={"window-container"}
                    handleClose={handleCancelBtn}
                    handleSave={handleCancelBtn}
                    array={array}
                    settings={settings}
                    app={app}
                    params={settings ? settings.params : ""}
                    deepClone={deepClone}
                    deleteRow={deleteRow}
                    rowDataArray={rowDataArray}
                    action={action}
                    masterActionName={masterAction ? masterAction.name : ""}
                    lovContainerId={lovContainerId}
                    unselectallrow={unselectallrow}
                >
                    {children}
                    <DForm
                        divId={"window-container"}
                        deepClone={"erorr"}
                        handleClose={handleCancelBtn}
                    />
                </DModalContainer>
            </div>
        );
    }
};

export default DWindowModal;
