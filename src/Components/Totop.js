import React from 'react'
import { BackTop } from 'antd';

const style = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
};


export default function Totop() {
    return (
        // <div style={{ height: '600vh', padding: 8 }}>
        <BackTop>
            <div style={style}>UP</div>
        </BackTop>
        // </div> 
    )
}
