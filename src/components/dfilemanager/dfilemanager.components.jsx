import React, { useState, useEffect } from "react";
import "./dfilemanagar.component.css";
import Tree from "./Tree/Tree";

import { Container } from "@mui/material";

const DFilemanager = ({
    rows,
    handleItemClickBtn,
    handleAddCircleIconBtn,
    app,
    action,
    sqlWhere,
    setSqlWhere,
}) => {
    let [data, setData] = useState([]);

    useEffect(() => {
        if (rows) setData(buildtree(rows, null));
    }, [rows]);
    let buildtree = (rows, id) => {
        let structure = [];
        rows.map((item) => {
            if (item.DEF_ORGANIZATION_ID === id) {
                if (
                    item.DEF_ORG_TYPEID === 1 &&
                    item.DEF_ORGANIZATION_ID === id
                ) {
                    item.type = "folder";
                    item.files = [];
                    item.row = { item };
                    item.files = buildtree(rows, item.ID);
                } else {
                    item.row = { item };
                    item.type = "file";
                }
                structure.push(item);
            }
        });

        return structure;
    };

    return (
        <Container>
            <Tree
                data={data}
                handleAddCircleIconBtn={handleAddCircleIconBtn}
                app={app}
                action={action}
                sqlWhere={sqlWhere}
                setSqlWhere={setSqlWhere}
            />
        </Container>
    );
};
export default DFilemanager;
