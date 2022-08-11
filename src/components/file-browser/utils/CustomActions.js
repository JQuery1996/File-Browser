import { defineFileAction, ChonkyIconName } from "chonky";

export const CREATE_NEW_FOLDER = defineFileAction({
    id: "create_file",
    button: {
        name: "جديد",
        toolbar: true,
        contextMenu: false,
        icon: ChonkyIconName.folderCreate,
    },
});

export const DELETE_FOLDER = defineFileAction({
    id: "delete_file",
    button: {
        name: "حذف",
        contextMenu: true,
        icon: ChonkyIconName.trash,
    },
});

export const EDIT_FOLDER = defineFileAction({
    id: "edit_file",
    button: {
        name: "تعديل",
        toolbar: false,
        contextMenu: true,
        icon: ChonkyIconName.config,
    },
});
