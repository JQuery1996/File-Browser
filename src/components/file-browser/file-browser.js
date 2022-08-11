import { FullFileBrowser } from "chonky";
import {
    useFileBrowserState,
    useFileBrowserSearch,
    useFileBrowserActionsHandler,
    useFileBrowserControl,
} from "./hooks";

import { CREATE_NEW_FOLDER, DELETE_FOLDER, EDIT_FOLDER } from "./utils";

export function FileBrowser({
    ROOT_DIRECTORY,
    filesData,
    setFilesData,
    rows,
    setSqlWhere,
    app,
    action,
    handleAddCircleIconBtn,
    handleDeleteIconBtn,
    handleItemClickBtn,
    detailGridObject,
    setDetailGridObject,
}) {
    const [
        currentFolder,
        setCurrentFolder,
        files,
        setFiles,
        folderChain,
        setFolderChain,
    ] = useFileBrowserState(ROOT_DIRECTORY);

    useFileBrowserControl({
        action,
        currentFolder,
        ROOT_DIRECTORY,
        setSqlWhere,
        setFilesData,
        rows,
    });

    useFileBrowserSearch({
        currentFolder,
        filesData,
        setFolderChain,
        setFiles,
    });

    const handleActionWrapper = useFileBrowserActionsHandler({
        ROOT_DIRECTORY,
        filesData,
        setFilesData,
        currentFolder,
        setCurrentFolder,
        rows,
        setSqlWhere,
        app,
        action,
        handleAddCircleIconBtn,
        handleDeleteIconBtn,
        handleItemClickBtn,
    });

    const FileActions = [CREATE_NEW_FOLDER, DELETE_FOLDER, EDIT_FOLDER];

    return (
        <>
            <FullFileBrowser
                files={files}
                folderChain={folderChain}
                disableDefaultFileActions={false}
                fileActions={FileActions}
                onFileAction={handleActionWrapper}
            />
        </>
    );
}
