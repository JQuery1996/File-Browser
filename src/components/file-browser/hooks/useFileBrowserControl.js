import { useEffect } from "react";
import { prepareData, getFilesInCurrentDirectory, findFile } from "../utils";
export function useFileBrowserControl({
    action,
    currentFolder,
    ROOT_DIRECTORY,
    setSqlWhere,
    setFilesData,
    rows,
}) {
    useEffect(() => {
        async function getRootDirectories() {
            const query = ` AND ${action.packageId}.DEF_ORGANIZATION_ID ${
                currentFolder === ROOT_DIRECTORY
                    ? "is NULL"
                    : "=" + currentFolder
            }`;
            await setSqlWhere(query);
        }
        if (rows) {
            getRootDirectories();
            const filesInCurrentDirectory = getFilesInCurrentDirectory(
                ROOT_DIRECTORY,
                currentFolder,
                rows,
            );
            if (currentFolder === ROOT_DIRECTORY)
                setFilesData((data) => ({
                    ...data,
                    files: prepareData(filesInCurrentDirectory),
                }));
            else {
                setFilesData((data) => {
                    const currentFilesData = JSON.parse(JSON.stringify(data));
                    const currentDirectory = findFile(
                        [currentFilesData],
                        currentFolder,
                    );

                    if (!currentFolder) return currentFilesData;
                    currentDirectory.files = prepareData(
                        filesInCurrentDirectory,
                    );
                    return currentFilesData;
                });
            }
        }
    }, [
        ROOT_DIRECTORY,
        action.packageId,
        currentFolder,
        rows,
        setFilesData,
        setSqlWhere,
    ]);
}
