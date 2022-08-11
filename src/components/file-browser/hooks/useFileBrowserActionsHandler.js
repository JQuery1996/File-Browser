import { ChonkyActions } from "chonky";
import { useCallback } from "react";
import {
    findFile,
    CREATE_NEW_FOLDER,
    DELETE_FOLDER,
    EDIT_FOLDER,
} from "../utils";

export function useFileBrowserActionsHandler({
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
    detailGridObject,
    setDetailGridObject,
}) {
    return useCallback(
        async (data) => {
            const currentFile = findFile(
                filesData,
                data?.payload?.files?.[0].id || currentFolder,
            );
            switch (data.id) {
                case ChonkyActions.OpenFiles.id:
                    if (currentFile?.isDir) {
                        setCurrentFolder(currentFile.id);
                    }
                    return;
                case CREATE_NEW_FOLDER.id:
                    handleAddCircleIconBtn(
                        app,
                        action,
                        currentFolder === ROOT_DIRECTORY
                            ? null
                            : +currentFolder,
                    );
                    return;
                case EDIT_FOLDER.id:
                    const editedFileId = data.state.contextMenuTriggerFile?.id;
                    if (!editedFileId) return;
                    const editedFile = findFile(filesData, editedFileId);
                    handleItemClickBtn(
                        { target: { id: "edit" } },
                        editedFile,
                        "edit",
                    );
                    return;
                case DELETE_FOLDER.id:
                    const deletedFileId = data.state.contextMenuTriggerFile?.id;
                    if (!deletedFileId) return;
                    const deletedFile = findFile(filesData, deletedFileId);

                    handleItemClickBtn(
                        { target: { id: "delete" } },
                        deletedFile,
                        "delete",
                    );
                    return;
                default:
                    return;
            }
        },
        [
            ROOT_DIRECTORY,
            action,
            app,
            currentFolder,
            filesData,
            handleAddCircleIconBtn,
            handleItemClickBtn,
            setCurrentFolder,
        ],
    );
}
