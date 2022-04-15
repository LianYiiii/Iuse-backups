import React, { useState, useRef } from "react";
import { Modal, Button } from 'antd';
import { message } from "antd";
import axios from "axios";

const AddFile = (props) => {
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [filename, setFilename] = useState('123');
    const filenameRef = useRef(null);
    // const [modalText, setModalText] = React.useState('Content of the modal');

    const showModal = () => {
        setVisible(true);
    };



    const handleOk = () => {
        // setModalText('请稍等...');
        if (!filenameRef.current.value) {
            message.error('输入值为空！');
        } else {
            setConfirmLoading(true);
            setTimeout(() => {
                setVisible(false);
                setConfirmLoading(false);
            }, 2000);

            // setFilename(filenameRef.current.value);
            const inputVal = filenameRef.current.value;
            const sourceId = localStorage.getItem('source_id');
            axios({
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
                method: "post",
                url: 'http://10.0.1.119:8000/api/sources/' + sourceId + '/create_dir/',
                data: {
                    "name": inputVal
                }
            }).then(res => {
                console.log(res);
                console.log(props);
                props = { fileCount: props.fileCount + 1 }
            }).catch(err => {
                console.log(err);
            })

            console.log(inputVal);

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
