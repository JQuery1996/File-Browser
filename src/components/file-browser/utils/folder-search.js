export function folderSearch(data, folderChainTemp, currentFolder) {
    let filesTemp = [];
    for (let i = 0; i < data.length; i++) {
        const folder = data[i];
        folderChainTemp = [
            ...folderChainTemp,
            { id: folder.id, name: folder.name },
        ];

        if (folder.id === currentFolder) {
            if (folder?.files) {
                const currentFilesTemp = [];
                folder.files.forEach((file) => {
                    currentFilesTemp.push({
                        id: file.id,
                        name: file.name,
                        isDir: file.isDir ? true : false,
                        color: file.color,
                        childrenCount: file.childrenCount,
                    });
                });
                filesTemp = currentFilesTemp;
            }
            return [true, filesTemp, folderChainTemp];
        } else if (folder?.files) {
            let returnValues = folderSearch(
                folder.files,
                folderChainTemp,
                currentFolder,
            );

            if (returnValues[0]) {
                return returnValues;
            }
        }
        folderChainTemp = folderChainTemp.slice(0, folderChainTemp.length - 1);
    }
    return [0, null, null];
}

export const findFile = (data, fileId) => {
    for (let i = 0; i < data.length; i++) {
        const folder = data[i];
        if (folder.id === fileId) {
            return folder;
        } else if (folder?.files) {
            let returnValues = findFile(folder.files, fileId);
            if (returnValues) {
                return returnValues;
            }
        }
    }
    return null;
};
