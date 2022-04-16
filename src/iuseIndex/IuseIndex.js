import React, { useState, useEffect, Fragment, useRef, useId } from "react";
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
    const paths = localStorage.getItem('paths');
    this.state = {
      isLoading: 1,
      fileArr: [],
      filecount: 0,
      visible: false,
      pathStack: [paths]
    };
    this.handleClick = this.handleClick.bind(this);
  }

  // ---------------------------------------  这中间都是自定义函数  ---------------------------------------------
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  handleClick = (id) => {
    const _this = this;
    _this.state.pathStack.push(id)
    _this.setState({
      isLoading: 1,
      fileArr: [],
    })
    this.ajaxRequest(_this);
  };

  returnBack = () => {
    this.state.pathStack.pop();
    this.ajaxRequest(this);
  }

  ajaxRequest = (_this) => {
    const token = localStorage.getItem('token');
    const userId = _this.state.pathStack.pop();
    axios({
      headers: {
        Authorization: token,
      },
      method: "get",
      url:
        //  'http://10.0.1.119:8000/api/sources/'
        "http://192.168.2.110:8000/api/sources/"
        + userId + "/",
    })
      .then((res) => {
        _this.setState({
          isLoading: 0,
          fileArr: res.data.children
        })
        this.state.pathStack.push(userId);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // --------------------------------------------  页面加载  ----------------------------------------------
  componentDidMount() {
    // 发送请求
    const _this = this;
    const token = localStorage.getItem("token");
    this.ajaxRequest(_this);
  }

  componentDidUpdate() {
    // console.log("重新render");
  }

  //  -------------------------------------------  渲染组件 ---------------------------------------------
  render() {
    if (this.state.isLoading) {
      return (
        <>isLoading...</>
      )
    } else {
      const { collapsed } = this.state;
      const { visible } = this.state;
      return (
        <Layout style={{ minHeight: "100vh" }}>
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
              <AddFile fileCount={this.state.filecount} ajaxRequest={this.ajaxRequest} _this={this} />
            </Header>
            <Content style={{ margin: "0 16px" }}>
              {this.state.pathStack.length === 1 ? <div style={{ height: '70px' }}></div> :
                <button onClick={this.returnBack}>返回上一层</button>
              }
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
                  return (
                    <div key={'div' + item.id} className="every-file" onClick={() => this.handleClick(item.id)} >
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
                {visible ?
                  <div ref={ref => { this.root = ref }} className="contextMenu">
                    <div></div>
                  </div> : null}
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Iuse ©2022 Created by LHL
            </Footer>
          </Layout>
        </Layout>
      );
    }
  };
}

export default IuseIndex;
