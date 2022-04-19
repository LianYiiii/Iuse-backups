import React from "react";
import dictionaryAfterImg from "../Image/DictionaryBefore.svg";
import dictionaryBeforeImg from '../Image/DictionaryAfter.svg';
import "./PerFile.css";
import fileImg from "../Image/FileBefore.svg";


export default function PerFile(props) {
  // console.log(props);


  return (
    <>
      <div title={props.createTime}>
        <div className="file-type">
          {props.fileType === 1 && <img src={fileImg} ></img>}
          {props.fileType === 2 && <img src={dictionaryAfterImg} ></img>}
        </div>
        <span className="file-name">{props.fileName}</span>

      </div>
    </>
  );
}
