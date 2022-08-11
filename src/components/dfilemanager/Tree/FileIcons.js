import React from "react";
import {
  DiJavascript1,
  DiCss3Full,
  DiHtml5,
  DiReact,
  DiSass,
  IoMdVideocam,
} from "react-icons/di";
import { FileIcon, defaultStyles } from "react-file-icon";
const FILE_ICONS = {
  jsx: (
    <div style={{ width: "30px" }}>
      <FileIcon extension="jsx" {...defaultStyles.jsx}/>
    </div>
  ),
  js: (
    <div style={{ width: "30px" }}>
      <FileIcon extension="js" {...defaultStyles.js}/>
    </div>
  ),
  css: (
    <div style={{ width: "30px" }}>
       <FileIcon extension="css" {...defaultStyles.css}/>
    </div>
  ),
  mp4: (
    <div style={{ width: "30px" }}>
      <FileIcon extension="mp4" {...defaultStyles.mp4} />
    </div>
  ),
  docx: (
    <div style={{ width: "30px" }}>
      <FileIcon {...defaultStyles.docx} extension="docx" />
    </div>
  ),
  doc: (
    <div style={{ width: "30px" }}>
       <FileIcon {...defaultStyles.doc} extension="doc" />
    </div>
  ),
  html: (
    <div style={{ width: "30px" }}>
      <FileIcon {...defaultStyles.html} extension="html" />
    </div>
  ),
  zip: (
    <div style={{ width: "30px" }}>
      <FileIcon {...defaultStyles.zip} extension="zip" />
    </div>
  ),
  txt: (
    <div style={{ width: "30px" }}>
      <FileIcon type="code" extension="txt" />
    </div>
  ),
  pdf: (
    <div style={{ width: "30px" }}>
      <FileIcon extension="pdf" {...defaultStyles.pdf} />
    </div>
  ),
  mp4: (
    <div style={{ width: "30px" }}>
      <FileIcon extension="mp4" type="video" />
    </div>
  ),
};

export default FILE_ICONS;
