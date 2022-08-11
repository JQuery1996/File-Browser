import DWindowModal from "../../components/dwindow-modal/dwindow-modal.component";
import DWindowModalGrid from "../../components/dwindow-modal-grid/dwindow-modal-grid.component";
import PartyComplete from "../../pages/party-complete-page/party-complete-page.component";

export const openModal = (
    elementId,
    app,
    action,
    masterAction,
    handleCancelWindowBtn,
    array,
    settings,
    lovContainerId,
    FILE_BROWSER_ROOT_DIRECTORY,
) => {
    const deepClone = JSON.parse(JSON.stringify(settings.params));
    return (
        <DWindowModal
            elementId={elementId ? elementId : "window-container"}
            app={app}
            settings={settings}
            array={array}
            deepClone={deepClone}
            handleCancelBtn={handleCancelWindowBtn}
            action={action}
            masterAction={masterAction ? masterAction : null}
            lovContainerId={
                lovContainerId ? lovContainerId : "lovwindow-container"
            }
            FILE_BROWSER_ROOT_DIRECTORY={FILE_BROWSER_ROOT_DIRECTORY}
        />
    );
};

export const openExpandModal = (
    app,
    action,
    handleCancelWindowBtn,
    array,
    columns,
) => {
    return (
        <DWindowModalGrid
            action={action}
            array={array}
            columns={columns}
            handleCancelBtn={handleCancelWindowBtn}
        />
    );
};

export const openModalPartyComplete = (
    app,
    action,
    handleCancelWindowBtn,
    array,
    settings,
    rowDataObj,
    cancel,
) => {
    const deepClone = JSON.parse(JSON.stringify(settings.params));
    return (
        <PartyComplete
            app={app}
            settings={settings}
            array={array}
            deepClone={deepClone}
            rowData={rowDataObj}
            action={action}
            isShow={false}
            cancel={cancel}
            handleCancelBtn={handleCancelWindowBtn}
            lovContainerId={"lovwindow-container"}
        />
    );
};
