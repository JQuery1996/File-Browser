export function prepareData(rows) {
    const result = [];
    for (const row of rows) {
        result.push({
            id: row.ID.toString(),
            name: row.NAME,
            isDir: row.DEF_ORG_TYPEID === 1,
            files: [],
            ...row,
        });
    }

    return result;
}

export function getFilesInCurrentDirectory(
    ROOT_DIRECTORY,
    currentDirectory,
    files,
) {
    return currentDirectory === ROOT_DIRECTORY
        ? files.filter((file) => !file.DEF_ORGANIZATION_ID)
        : files.filter(
              (file) =>
                  file.DEF_ORGANIZATION_ID &&
                  file.DEF_ORGANIZATION_ID.toString() === currentDirectory,
          );
}
