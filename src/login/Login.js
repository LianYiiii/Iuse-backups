import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { render } from "@testing-library/react";

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFinish = (values) => {
    console.log("Received values of form: ", values);
    let inputInfo = {
      username: values.username,
      password: values.password,
    };

    // 发表单 axios

    axios
      .post(
        'http://10.0.1.119:8000/api/accounts/login/',
        // "http://192.168.2.110:8000/api/accounts/login/",
        inputInfo
      )
      .then((res) => {
        message.success("welcome");
        // 验证数据
        console.log(res.data);
        const user_id = res.data.user.id;
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("source_id", res.data.source_id);
        localStorage.setItem("paths", [res.data.source_id]);
        console.log(res.data.token);
        console.log(res.data.source_id);
        this.setState({ user: user_id });
      })
      .catch((err) => {
        message.error("error");
      });
  };

  onFinishFailed = (values) => {
    console.log("error", values);
  };

  render() {
    return (
      <>
        {this.state.user && <Navigate to="/" replace="true" />}
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="">
                    Forgot password
                </a>
            </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </>
    );
  }
}

export default NormalLoginForm;
// 192.168.2.110:8000
