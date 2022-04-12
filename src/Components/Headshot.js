import { Avatar, Image } from 'antd';
import React from 'react'

export default function Headshot() {
    return (
        <> <Avatar
            src={
                <Image
                    src="https://joeschmoe.io/api/v1/random"
                    style={{
                        width: 32,
                    }}
                />
            }
        /></>
    )
}
