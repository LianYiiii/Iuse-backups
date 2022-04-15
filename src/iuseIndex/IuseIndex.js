import React, { useState, useEffect, Fragment, useRef } from "react";
import { Layout, Menu, Breadcrumb, Divider, message } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./IuseIndex.css";
import PerFile from "../perFile/PerFile";
import axios from "axios";
import styled from 'styled-components'
import AddFile from "../Components/createFile/CreateFile";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
// 主页面组件
class IuseIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: 1,
      fileArr: [],
      filecount: 0
    };
    this.handleClick = this.handleClick.bind(this);
    this.addNewFile = this.addNewFile.bind(this);
  }

  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  handleClick = () => {
    const _this = this;
    _this.setState({
      isLoading: 1,
      fileArr: []
    })
    const token = localStorage.getItem("token");
    axios({
      headers: {
        Authorization: token,
      },
      method: "get",
      url: 'http://10.0.1.119:8000/api/sources/'
        // "http://192.168.2.110:8000/api/sources/"
        + 2 + "/",
    })
      .then((res) => {
        // 类型2是文件，1是文件夹
        console.log(res.data);

        if (res.data.type === 1) {
          const oldPaths = localStorage.getItem('paths');
          console.log(oldPaths);
          localStorage.setItem('paths', oldPaths + ',' + res.data.id);
          console.log(localStorage.getItem('paths'));
        } else {
          alert('是否下载？');
        }
        _this.setState({
          isLoading: 0,
          fileArr: res.data.children
        })
        console.log(this.state.fileArr);
      })
      .catch((err) => {
        console.log(err);
      });

  };

  // 添加一个提示框


  addHint = () => {

  }

  removeHint = () => {

  }

  addNewFile = () => {
  }


  componentDidMount() {
    // 发送请求
    const _this = this;

    const userId = localStorage.getItem("source_id");
    const token = localStorage.getItem("token");
    axios({
      headers: {
        Authorization: token,
      },
      method: "get",
      url: 'http://10.0.1.119:8000/api/sources/'
        // "http://192.168.2.110:8000/api/sources/"
        + userId + "/",
    })
      .then((res) => {
        // console.log(res.data);
        _this.setState({
          isLoading: 0,
          fileArr: res.data.children
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate() {
    // console.log("重新render");
  }

  render() {
    if (this.state.isLoading) {
      return (
        <>isLoading...</>
      )
    } else {

      const { collapsed } = this.state;
      return (
        <Layout style={{ minHeight: "100vh" }}>
          {/* <div className="hint">
            <span><CloseOutlined /></span>
            <input name="fileName" placeholder="请输入新建的文件夹名称"></input>
            <button>添加文件夹</button>
          </div> */}

          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                Option 1
              </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />}>
                Option 2
              </Menu.Item>
              <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="9" icon={<FileOutlined />}>
                Files
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: '10px 30px', display: 'flex' }} >
              <AddFile fileCount={this.state.filecount} />
            </Header>
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                {/* 面包屑 <Breadcrumb.Item></Breadcrumb.Item> */}
                {
                  this.state.fileArr.map((item, index) => {
                    // console.log('type = ' + item.type, 'id = ' + item.id, 'index = ' + index);
                    const breadPaths = localStorage.getItem('paths');
                    if (breadPaths) {
                      // console.log([breadPaths]);
                      if ([breadPaths].length > 1) {

                      }
                      return (
                        <Breadcrumb.Item key={index} className="breadItem">{breadPaths[index]}</Breadcrumb.Item>
                      )
                    }
                  })
                }
              </Breadcrumb>
              <div
                className="site-layout-background"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  padding: 24,
                  minHeight: 360,
                }}
              >
                {/* http://10.0.1.119:8000/api/sources/id/create_dir/ 用post请求 代表文件夹名 这个id是当前文件夹的id */}
                {this.state.fileArr.map((item, index) => {
                  // console.log(item);
                  // console.log(this.state);
                  return (
                    <div key={'div' + item.id} className="every-file" onClick={this.handleClick}>
                      <PerFile
                        key={item.id}
                        fileName={item.name}
                        fileType={item.type}
                        createTime={item.update_at}
                        fileId={item.id}
                      />
                    </div>

                  )
                })}
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Iuse ©2022 Created by LHL
            </Footer>
          </Layout>
        </Layout>
      );
    }
  }
}

export default IuseIndex;
