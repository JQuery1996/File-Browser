import { useState } from "react";
import { Container } from "@mui/material";
import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { FileBrowser } from "./file-browser";

export function FileBrowserContainer({
    app,
    action,
    rows,
    rowsCount,
    handleDeleteIconBtn,
    handleSaveWindowBtn,
    handleAddCircleIconBtn,
    handleItemClickBtn,
    sqlWhere,
    setSqlWhere,
    detailGridObject,
    setDetailGridObject,
}) {
    const ROOT_DIRECTORY = "__root";
    const [filesData, setFilesData] = useState({
        id: ROOT_DIRECTORY,
        name: action.arName,
        isDir: true,
        files: [],
    });
    // initial config
    // see https://chonky.io/docs/2.x/installation-usage#basic-usage
    setChonkyDefaults({
        iconComponent: ChonkyIconFA,
        disableDragAndDrop: false,
    });

    return (
        <Container sx={{ direction: "ltr" }}>
            <FileBrowser
                ROOT_DIRECTORY={ROOT_DIRECTORY}
                filesData={[filesData]}
                setFilesData={setFilesData}
                rows={rows}
                setSqlWhere={setSqlWhere}
                app={app}
                action={action}
                handleAddCircleIconBtn={handleAddCircleIconBtn}
                handleDeleteIconBtn={handleDeleteIconBtn}
                handleItemClickBtn={handleItemClickBtn}
                detailGridObject={detailGridObject}
                setDetailGridObject={setDetailGridObject}
            />
        </Container>
    );
}
