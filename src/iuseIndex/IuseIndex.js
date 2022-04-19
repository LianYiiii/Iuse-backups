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
import UploadFile from "../Components/uploadFile/UploadFile";
import { Spin, Button, Empty } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
var timeOut = null;
// 主页面组件
class IuseIndex extends React.Component {
  constructor(props) {
    super(props);
    const paths = localStorage.getItem('paths');
    this.state = {
      isLoading: 1,
      fileArr: [],
      filecount: 0,
      deleteCount: 0,
      visible: false,
      pathStack: [paths],
      // isGarbages 是1说明是回收站里的东西，显示“回收”按钮
      isGarbages: 0
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    // console.log(this.state.pathStack);
  }

  // ---------------------------------------  这中间都是自定义函数  ---------------------------------------------
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  handleCheckMenu = (renderArr, _this) => {
    // console.log(renderArr);
    axios({
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      method: "get",
      url:
        'http://10.0.1.119:8000/api/recyclebin/'
      // 'http://192.168.2.110:8000/api/recyclebin/',
    }).then(res => {
      // console.log(res);
      // console.log(_this);
      _this.setState({
        fileArr: res.data.garbages,
        isGarbages: 1
      })
    }).catch(err => {
      console.log(err);
    })
  }

  handleClick = (e, id, type) => {
    e.preventDefault();
    clearTimeout(timeOut);

    const _this = this;
    _this.state.pathStack.push(id);
    timeOut = setTimeout(function () {
      message.warning('双击进入文件夹或下载文件');
    }, 500);

    // 类型 2 是文件夹
    // if (type === 2) {
    //   clearTimeout(timeOut);

    //   const _this = this;
    //   _this.state.pathStack.push(id);
    //   timeOut = setTimeout(function () {
    //     console.log('click');
    //     _this.setState({
    //       isLoading: 1,
    //       fileArr: [],
    //     })
    //     _this.ajaxRequest(_this);
    //   }, 800);
    //   console.log(timeOut);

    // }
  };

  handleDoubleClick = (e, fileInfo) => {
    // 类型 1 是文件
    clearTimeout(timeOut);

    if (fileInfo.type === 1) {

      e.preventDefault();
      console.log('doubleclick');
      const source_id = this.state.pathStack.pop();
      this.state.pathStack.push(source_id);
      message.warning('下载中，请稍后...');

      axios({
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        method: "post",
        url:
          'http://10.0.1.119:8000/api/sources/'
          // 'http://192.168.2.110:8000/api/sources/'
          + source_id + '/download/',
        data: {
          "name": fileInfo.name
        },
        responseType: 'blob'
      }).then(res => {
        const content = res.data;
        const blob = new Blob([content])
        const fileName = '';
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileInfo.name
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink);
          message.success('下载成功');
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch(err => {
        console.log(err);
      })

    } else {
      clearTimeout(timeOut);

      const _this = this;
      _this.state.pathStack.push(fileInfo.id);
      timeOut = setTimeout(function () {
        _this.setState({
          isLoading: 1,
          fileArr: [],
        })
        _this.ajaxRequest(_this);
      }, 800);
      // console.log(timeOut);
    }
  }


  returnBack = () => {
    this.state.pathStack.pop();
    this.ajaxRequest(this);
    console.log(this.state.pathStack);
    message.success('请稍等...');
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
        'http://10.0.1.119:8000/api/sources/'
        // "http://192.168.2.110:8000/api/sources/"
        + userId + "/",
    })
      .then((res) => {
        _this.setState({
          isLoading: 0,
          fileArr: res.data.children,
          isGarbages: 0
        })
        this.state.pathStack.push(userId);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  handleDelete = (deleteInfo) => {
    console.log(deleteInfo);
    const deleteName = deleteInfo.name;
    const nowPath = this.state.pathStack.pop();
    this.state.pathStack.push(nowPath);
    console.log(deleteName, nowPath);
    axios({
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      method: "post",
      url:
        'http://10.0.1.119:8000/api/sources/'
        // 'http://192.168.2.110:8000/api/sources/'
        + nowPath + '/delete/',
      data: {
        "name": deleteName
      },
    }).then(res => {
      console.log(res.data);
      this.setState({

      })
      message.success('已删除');
    }).catch(err => {
      console.log(err);
    })

  }

  handleRecover = (item) => {
    console.log(item);
    axios({
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      method: "post",
      url:
        'http://10.0.1.119:8000/api/recyclebin/'
        // 'http://192.168.2.110:8000/api/recyclebin/'
        + item.id + '/recover/',
    }).then(res => {
      console.log(res.data);
      message.success('已恢复');
    }).catch(err => {
      console.log(err);
    })

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
        <>
          <Spin size="large" style={{ margin: '40px', textAlign: 'center', left: '50%', transform: 'translateX(-100%)', position: 'fixed' }} />
        </>
      )
    } else {

      const { collapsed } = this.state;
      const { visible } = this.state;
      return (

        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item key="1" icon={<FileOutlined />} onClick={() => this.ajaxRequest(this)}>
                文件
              </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />} onClick={() => this.handleCheckMenu(this.state.fileArr, this)}>
                回收站
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
              <Menu.Item key="9" icon={<PieChartOutlined />}>
                Files
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: '10px 30px', display: 'flex' }} >
              {
                this.state.isGarbages ?
                  null
                  :
                  <AddFile fileCount={this.state.filecount} ajaxRequest={this.ajaxRequest} _this={this} />

              }
              <UploadFile this={this} ajaxRequest={this.ajaxRequest} />
              {/* <input type='file'></input> */}
            </Header>
            <Content style={{ margin: "0 16px" }}>
              {this.state.pathStack.length === 1 ? <div style={{ height: '70px' }}></div> :
                <div style={{ height: '70px' }}>
                  <Button type="primary" onClick={this.returnBack}  >返回上一层</Button>
                </div>
              }
              <div
                className="site-layout-background"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  padding: '40px 40px 20px 70px',
                  minHeight: 360,
                }}
              >
                {/* http://10.0.1.119:8000/api/sources/id/create_dir/ 用post请求 代表文件夹名 这个id是当前文件夹的id */}
                {this.state.fileArr.map((item, index) => {
                  // console.log(item);
                  {
                    if (!item) {
                      return (
                        <>
                          <Empty />
                        </>
                      )
                    } else {
                      return (
                        <>
                          <div className="for-btn-div">
                            <div key={'div' + item.id} className="every-file"
                              onClick={(e) => this.handleClick(e, item.id, item.type)} onDoubleClick={(e) => this.handleDoubleClick(e, item)}
                            >
                              {!this.state.isGarbages ?
                                <PerFile
                                  key={item.id}
                                  fileName={item.name}
                                  fileType={item.type}
                                  createTime={'创建时间：' + item.update_at}
                                  fileId={item.id}
                                  isGarbages={this.state.isGarbages}
                                />
                                :
                                <PerFile
                                  key={item.id}
                                  fileName={item.source.name}
                                  fileType={item.source.type}
                                  createTime={'剩余时间：' + item.rest_time}
                                  fileId={item.source.id}
                                  isGarbages={this.state.isGarbages}
                                />
                              }
                            </div>
                            {this.state.isGarbages ?
                              <Button type="text" className="recover-btn"
                                onClick={() => this.handleRecover(item)}
                              >复原</Button>
                              :
                              <Button type="text" danger className="delete-btn" onClick={() => this.handleDelete(item)}>
                                删除
                              </Button>
                            }</div>
                        </>
                      )
                    }
                    // {
                    //   visible ?
                    //     <div ref={ref => { this.root = ref }} className="contextMenu">
                    //       <div></div>
                    //     </div> : null
                    // }
                  }
                }
                )
                }
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Iuse ©2022 Created by LHL
            </Footer>
          </Layout>
        </Layout >
      );
    }
  }
}

export default IuseIndex;
