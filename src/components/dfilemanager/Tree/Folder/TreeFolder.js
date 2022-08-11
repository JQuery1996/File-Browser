import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import DWindowLovModal from "../../../dwindow-lov-modal/dwindow-lov-modal.component";
import {
  AiOutlineFolderAdd,
  AiOutlineFileAdd,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import { MdFolder, MdFolderOpen } from "react-icons/md";
import { ActionsWrapper, Collapse, StyledName } from "../Tree.style";
import { StyledFolder } from "./TreeFolder.style";
import { v4 } from "uuid";
import { FILE, FOLDER } from "../state/constants";
import { useTreeContext } from "../state/TreeContext";
import { PlaceholderInput } from "../TreePlaceholderInput";

const FolderName = ({ isOpen, name, handleClick,  handleSaveWindowBtn,
  app,
  action,
  handleAddCircleIconBtn }) => (
  <StyledName onClick={handleClick}>
    {isOpen ? (
      <MdFolderOpen size="30" color="#ffc107" />
    ) : (
      <MdFolder size="30" color="#ffc107" />
    )}
    &nbsp;&nbsp;{name}
  </StyledName>
);

const Folder = ({
  id,
  name,
  children,
  node,
  row,
  handleAddCircleIconBtn,
  handleSaveWindowBtn,
  app,
  action,
  sqlWhere,
  setSqlWhere
}) => {
  const { dispatch, isImparative, onNodeClick } = useTreeContext();
  const [isOpen, setIsOpen] = useState(false);
  const [childs, setChilds] = useState([]);
  const [className, setclassName] = useState(
    "Treestyle__ActionsWrapper-sc-1ekehjf-1 bvUUZM"
  );
  useEffect(() => {
    setChilds([children]);
  }, [children]);

  const commitFolderCreation = (name) => {
    // name
    // handleSaveWindowBtn(app, action, sssss, "insert");
  };
  const commitFileCreation = (name) => {
    dispatch({ type: FOLDER.CREATE, payload: { id, name } });
  };
  const commitDeleteFolder = () => {
    let sssss = {
      ID: {
        value: 5,
        name: "ID",
        error: "",
        validateOnChange: true,
        isNull: false,
      },
    };
    handleSaveWindowBtn(app, action, sssss, "delete");
  };
  const commitFolderEdit = (name) => {
    console.log(name);
    //dispatch({ type: FOLDER.EDIT, payload: { id, name } });
    //setEditing(false);
  };

  const handleCancel = () => {
    // setEditing(false);
    setChilds([children]);
  };

 

  const handleFileCreation = (event) => {
    event.stopPropagation();
    setIsOpen(true);
    handleClick();
    setChilds([
      ...childs,
      <PlaceholderInput
        type="file"
        onSubmit={commitFileCreation}
        onCancel={handleCancel}
      />,
    ]);
  };

  const handleFolderCreation = () => {
    console.log( row.item.ID)
    setIsOpen(true);
    handleAddCircleIconBtn(app, action);
  
  };

  const handleFolderRename = () => {
    setIsOpen(true);
    handleClick();
  };
  const clearActionsWrapper = () => {
    if (className) {
      let classes = document.getElementsByClassName(className);
      if (classes.length > 0) {
        Object.keys(classes).map((index) => {
          classes[index].style.display = "none";
        });
      }
    }
  };
  const handleClick = (e) => {
    if (e) {
      e.preventDefault();
      clearActionsWrapper();
      if (e.type === "contextmenu") {
        setclassName(e.currentTarget.children[1].className);
        if (e.currentTarget.children[1].style.display === "flex")
          e.currentTarget.children[1].style.display = "none";
        else e.currentTarget.children[1].style.display = "flex";
      } else {
        setIsOpen(!isOpen);
        clearActionsWrapper();
      }
    } else {
      clearActionsWrapper();
    }
  };
  return (
    <StyledFolder id={id}   className="tree__folder" handleAddCircleIconBtn={handleAddCircleIconBtn} app={app} action={action}>
      <div id={v4} onContextMenu={handleClick} style={{ position: "relative" }}>
        <FolderName name={name} isOpen={isOpen} handleClick={handleClick} handleAddCircleIconBtn={handleAddCircleIconBtn} app={app} action={action} />
        <ActionsWrapper style={{ display: "none" }} onClick={handleClick}>
          <div className="actions">
            <div className="actiondiv">
              <AiOutlineEdit size={30} onClick={handleFolderRename} />
              <h6>تعديل</h6>
            </div>
            <div className="actiondiv" onClick={handleFileCreation}>
              <AiOutlineFileAdd size={30} />
              <h6>إضافة ملف</h6>
            </div>
            <div className="actiondiv" onClick={handleFolderCreation}>
              <AiOutlineFolderAdd size={30} />
              <h6>إضافة مجلد</h6>
            </div>
            <div className="actiondiv" onClick={commitDeleteFolder}>
              <AiOutlineDelete size={30} />
              <h6>حذف المسار</h6>
            </div>
          </div>
        </ActionsWrapper>
      </div>
      <Collapse className="tree__folder--collapsible" isOpen={isOpen}>
        {childs}
      </Collapse>
    </StyledFolder>
  );
};

export { Folder, FolderName };
