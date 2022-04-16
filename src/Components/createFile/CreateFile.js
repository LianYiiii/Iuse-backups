import React, { useState, useRef } from "react";
import { Modal, Button } from 'antd';
import { message } from "antd";
import axios from "axios";

const AddFile = (props) => {
    // console.log(props);
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [filename, setFilename] = useState('123');
    const filenameRef = useRef(null);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        if (!filenameRef.current.value) {
            message.error('输入值为空！');
        } else {
            setConfirmLoading(true);
            setTimeout(() => {
                setVisible(false);
                setConfirmLoading(false);
            }, 2000);

            const inputVal = filenameRef.current.value;
            const source_id = props._this.state.pathStack.pop();
            props._this.state.pathStack.push(source_id);
            axios({
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
                method: "post",
                url:
                    //  'http://10.0.1.119:8000/api/sources/'
                    'http://192.168.2.110:8000/api/sources/'
                    + source_id + '/create_dir/',
                data: {
                    "name": inputVal
                }
            }).then(res => {
                console.log(res);
                console.log(props);
                props.ajaxRequest(props._this);
            }).catch(err => {
                console.log(err);
            })
            // console.log(inputVal);
        }
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };


    return (
        <>
            <Button onClick={showModal} className='createfile'>
                新建文件夹
            </Button>
            <Modal
                title="新建文件夹"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <input style={{ width: '70%', height: '30px', margin: '5px auto' }} ref={filenameRef}></input>
            </Modal>
        </>
    );
};

export default AddFile
