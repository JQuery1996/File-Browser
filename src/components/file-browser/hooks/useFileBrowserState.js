import { useState } from "react";

export function useFileBrowserState(initialCurrentFolder) {
    const [currentFolder, setCurrentFolder] = useState(initialCurrentFolder);
    const [files, setFiles] = useState(null);
    const [folderChain, setFolderChain] = useState(null);
    return [
        currentFolder,
        setCurrentFolder,
        files,
        setFiles,
        folderChain,
        setFolderChain,
    ];
}
