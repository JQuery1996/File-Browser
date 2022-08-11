import React, { useRef, useState } from "react";
import { AiOutlineFile, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FileIcon, defaultStyles } from "react-file-icon";
import { StyledFile } from "../File/TreeFile.style";
import { useTreeContext } from "../state/TreeContext";
import { ActionsWrapper, StyledName } from "../Tree.style";
import { PlaceholderInput } from "../TreePlaceholderInput";

import { FILE } from "../state/constants";
import FILE_ICONS from "../FileIcons";

const File = ({ name, id, node }) => {
  const { dispatch, isImparative, onNodeClick } = useTreeContext();
  const [isEditing, setEditing] = useState(false);
  const ext = useRef("");

  let splitted = name?.split(".");
  ext.current = splitted ? splitted[splitted.length - 1] : "";

  const toggleEditing = () => setEditing(!isEditing);
  const commitEditing = (name) => {
    dispatch({ type: FILE.EDIT, payload: { id, name } });
    setEditing(false);
  };
  const commitDelete = () => {
    dispatch({ type: FILE.DELETE, payload: { id } });
  };
  const handleNodeClick = React.useCallback(
    (e) => {
      if (e.type === 'click') {
        console.log('Left click');
      } else if (e.type === 'contextmenu') {
        console.log('Right click');
      }
      // console.log(e);
      // e.stopPropagation();
      // onNodeClick({ node });
    },
    [node, onNodeClick]
  );
  const handleCancel = () => {
    setEditing(false);
  };



  return (
    <StyledFile onClick={handleNodeClick} className="tree__file">
      {isEditing ? (
        <PlaceholderInput
          type="file"
          style={{ paddingRight: 60 }}
          defaultValue={name}
          onSubmit={commitEditing}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <StyledName>
            {FILE_ICONS[ext.current] ? (
              FILE_ICONS[ext.current]
            ) : (
              <defaultStyles />
            )}
            &nbsp;&nbsp;{name}
          </StyledName>
          <ActionsWrapper>
            {isImparative && (
              <div className="actions">
                <AiOutlineEdit onClick={toggleEditing} />
                <AiOutlineDelete onClick={commitDelete} />
              </div>
            )}
          </ActionsWrapper>
        </>
      )}
    </StyledFile>
  );
};

export { File };
