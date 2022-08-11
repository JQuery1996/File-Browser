import { useEffect } from "react";
import { folderSearch } from "../utils";

export function useFileBrowserSearch({
    currentFolder,
    filesData,
    setFolderChain,
    setFiles,
}) {
    useEffect(() => {
        let folderChainTemp = [];
        let filesTemp = [];

        const [found, targetFilesTemp, targetFolderChainTemp] = folderSearch(
            filesData,
            folderChainTemp,
            currentFolder,
        );
        if (found) {
            filesTemp = targetFilesTemp;
            folderChainTemp = targetFolderChainTemp;
        }
        setFolderChain(folderChainTemp);
        setFiles(filesTemp);
    }, [filesData, currentFolder, setFolderChain, setFiles]);
}
