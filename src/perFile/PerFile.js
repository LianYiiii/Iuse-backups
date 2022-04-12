import React from "react";
import fileImg1 from "../Image/peiqi.jpg";
import "./PerFile.css";
import fileImg2 from "../Image/cat.jpg";

export default function PerFile(props) {
  // console.log(props);

  return (
    <div title={props.createTime}>
      <div className="file-type">
        {props.fileType === 1 && <img src={fileImg1}></img>}
        {props.fileType === 2 && <img src={fileImg2}></img>}
      </div>
      <span className="file-name">{props.fileName}</span>
    </div>
  );
}
