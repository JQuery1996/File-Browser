import axios from "axios";
import { prepareData } from "./prepareData";

export function path(DEF_ORGANIZATION_ID) {
    return `http://localhost:4000/files?DEF_ORGANIZATION_ID=${DEF_ORGANIZATION_ID}`;
}

export async function getCurrentLevelTree(id) {
    const { data } = await axios.get(path(id));
    const preparedFiles = prepareData(data);
    return preparedFiles;
}
