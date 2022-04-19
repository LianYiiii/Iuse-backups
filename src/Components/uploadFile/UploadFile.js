import React, { useEffect, useRef, useState } from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';


const token = localStorage.getItem('token');
const manyNumber = {
    name: 'file',
    method: 'post',
    data: { file: [] },
    headers: {
        Authorization: token,
    },
    onChange(info) {
        console.log(info);
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`);
        }
    },
};
export default function UploadFile(props) {

    const _this = props.this;
    const source_id = props.this.state.pathStack.pop();
    props.this.state.pathStack.push(source_id);
    const ajaxRequest = props.ajaxRequest;
    const actionUrl =
        // 'http://192.168.2.110:8000/api/sources/'
        'http://10.0.1.119:8000/api/sources/'
        + source_id + '/upload/';
    const wantFile = {};
    return (
        <>
            <Upload
                {...manyNumber} m
                action={actionUrl}
            >
                <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
            {/* <input type='file' name='file' onChange={(e) => handleChange(e, wantFile)}></input>
            <input type='submit' onClick={(e) => handleSubmit(e, ajaxRequest, source_id, wantFile)}></input> */}
        </>
    )
}
