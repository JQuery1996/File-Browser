import React, { useReducer, useLayoutEffect } from "react";
import { v4 } from "uuid";
import { ThemeProvider } from "styled-components";

import { useDidMountEffect } from "../utils";
import { TreeContext, reducer } from "./state";

import { StyledTree } from "./Tree.style";
import { Folder } from "./Folder/TreeFolder";
import { File } from "./File/TreeFile";
import { Button } from "@mui/material";

const Tree = ({
  children,
  data,
  handleAddCircleIconBtn,
  app,
  action,
  sqlWhere,
  setSqlWhere
}) => {
  const [state, dispatch] = useReducer(reducer, data);
  useLayoutEffect(() => {
    dispatch({ type: "SET_DATA", payload: data });
  }, [data]);
  const isImparative = data && !children;
  return (
    <ThemeProvider theme={{ indent: 40 }}>
      <TreeContext.Provider
        value={{
          isImparative,
          state,
          dispatch,
        }}
      >
        <StyledTree>
          {isImparative ? (
            <>
              <Button>ADD</Button>
              <TreeRecusive
                data={state}
                parentNode={state}
                handleAddCircleIconBtn={handleAddCircleIconBtn}
                app={app}
                action={action}
                sqlWhere={sqlWhere}
                setSqlWhere={setSqlWhere}
              />
            </>
          ) : (
            children
          )}
        </StyledTree>
      </TreeContext.Provider>
    </ThemeProvider>
  );
};

const TreeRecusive = ({
  data,
  parentNode,
  handleSaveWindowBtn,
  handleAddCircleIconBtn,
  app,
  action, 
  sqlWhere,
  setSqlWhere
}) => {
  if (data)
    return data.map((item) => {
      item.parentNode = parentNode;
      if (!parentNode) {
        item.parentNode = data;
      }
      if (item.type === "folder") {
        return (
          <Folder
            key={item.id}
            id={item.id}
            name={item.NAME}
            node={item}
            row={item.row}
            handleAddCircleIconBtn={handleAddCircleIconBtn}
            handleSaveWindowBtn={handleSaveWindowBtn}
            app={app}
            action={action}
            sqlWhere={sqlWhere}
            setSqlWhere={setSqlWhere}
          >
            <TreeRecusive
              parentNode={item}
              data={item.files}
              handleAddCircleIconBtn={handleAddCircleIconBtn}
              handleSaveWindowBtn={handleSaveWindowBtn}
              app={app}
              action={action}
              sqlWhere={sqlWhere}
              setSqlWhere={setSqlWhere}
            />
          </Folder>
        );
      }
      if (item.type === "file") {
        return <File key={item.id} id={item.id} name={item.NAME} node={item} />;
      }
    });
  else {
    return <>{"لا يوجد بيانات"}</>;
  }
};

Tree.File = File;
Tree.Folder = Folder;

export default Tree;
