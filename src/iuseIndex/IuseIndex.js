import React, { useState, useEffect, Fragment } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
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

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
// var fileArr = [];

// 主页面组件
class IuseIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: 1,
      fileArr: []
    };
    this.handleClick = this.handleClick.bind(this);
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
        console.log(res.data.children);
        const oldPaths = localStorage.getItem('paths');
        if (res.data.type === 1) {
          localStorage.setItem('paths', oldPaths + ',' + res.data.id)
        }
        console.log(localStorage.getItem('paths'));
        _this.setState({
          isLoading: 0,
          fileArr: res.data.children
        })
      })
      .catch((err) => {
        console.log(err);
      });

  };


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
        console.log(res.data);
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
    console.log("重新render");
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
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                {/* 面包屑 */}
                {/* <Breadcrumb.Item></Breadcrumb.Item> */}
                {
                  this.state.fileArr.map((item, index) => {
                    const breadPaths = localStorage.getItem('paths');
                    console.log(breadPaths.split(','));
                    console.log(breadPaths.split(',')[index]);
                    return (
                      <div className="breadItem" style={{ display: 'inline-block' }}>
                        <Link to=''>
                          <Breadcrumb.Item>{breadPaths[index]}</Breadcrumb.Item>
                        </Link>
                      </div>
                    )
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
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      );
    }
  }
}

export default IuseIndex;
