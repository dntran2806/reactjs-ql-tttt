import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Typography,
  message,
  checked,
  Tabs,
  notification,
} from "antd";
import React from "react";
import { useEffect, useRef, useState } from "react";
import Css from "../../../src/index.css";

/////////////////
import API from "../../utils/API";
import { USER_INFO } from "../../utils/Constants";
import { useHistory } from "react-router-dom";
import UserStore from "../../stores/UserStore";
import LoginStore from "../../stores/LoginStore";
import logogg from "../../assets/images/logogg.png";

////////////////
const Login = () => {
  const formRef = useRef(null);
  const loginRef = useRef();
  const history = useHistory();
  const [checked, setChecked] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [loginList, setLoginList] = useState({
    isActive: true,
    isFavorite: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ckediter = useRef(null);
  const [notify, contextHolder] = notification.useNotification();

  const login = () => {
    message.success("Login Sucessful!!!");
  };
  // const onChange = (e) => {
  //     console.log(`checked = ${e.target.checked}`);
  // };

  const ggLogin = async () => {
    await UserStore.logout();
    const user = await UserStore.googleLogin();
    console.log("kkk login", user);
    if (user) {
      history.replace("/quy-trinh-tt");
    } else {
      notify.error({
        message: `Đăng nhập thất bại!`,
        placement: "topRight",
      });
    }
  };
  ///////////////////////////
  useEffect(() => {
    const isLogin = async () => {
      const _user = await UserStore.loadUserInfo();
      console.log("kkkkk _user", _user);
      if (_user) {
        history.push("/quy-trinh-tt");
      }
    };
    isLogin();
  }, []);

  useEffect(() => {
    console.log("kkkkk isModalOpen isEdit", isModalOpen, isEdit);
    if (isModalOpen && isEdit) {
      formRef.current?.setFieldsValue(loginList);
    } else {
      formRef.current?.setFieldsValue({
        Matk: "",
        Tentk: "",
        Matkhau: "",
        Quyen: "",
      });
    }
  }, [isModalOpen, isEdit, formRef]);

  const onFinish = () => {
    setIsEdit(false);
    showModal();
    loginRef.current?.clear();
    ckediter.current?.data?.set("");
    setLoginList({
      Matk: "",
      Tentk: "",
      Matkhau: "",
      Quyen: "",
    });
    history.replace("/UserPages");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  // const onFinish = async (values) => {
  //   const { Username, Password } = values;
  //   const rs = await API.post("auth/login", { Username, Password });
  //   console.log("kkkkk add nguoidung", rs);
  //   // return;
  //   if (rs) {
  //     history.push("/Dashboard");
  //     localStorage.setItem(USER_INFO, JSON.stringify(rs));
  //     UserStore.setUserInfo(rs);
  //   } else {
  //     console.error({
  //       message: `Login failed!`,
  //       description: rs,
  //       placement: "topRight",
  //     });
  //   }
  //   console.log("kkkkk rs", rs);
  // };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = () => {
    console.log("kkkkk checked", checked);
    setChecked(!checked);
  };

  ////////////////////////////

  return (
    <div className="login">
      <Form
        className="loginForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Typography.Title>Đăng nhập</Typography.Title>
        <img src={logogg} style={{ width: "110px", height: "50px" }} />

        <p>Đăng nhập bằng email trường Đại Học Cần Thơ</p>

        {/* <div className="socialLogin"> */}
        <Button
          className="buttongg"
          onClick={ggLogin}
          style={{ marginBottom: "20px" }}
        >
          <GoogleOutlined
            className="socialIcon"
            onClick={ggLogin}
            style={{
              color: "#00bf00",
              marginTop: "6px",
            }}
          />
          Đăng nhập với google
        </Button>
        {/* </div> */}
        {/* <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: "Sign in with google",
              key: "1",
              children: (
                
              ),
            },
            {
              label: "Đăng nhập bằng mật khẩu",
              key: "2",
              children: (
                <>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please enter valid username",
                      },
                    ]}
                    label="Usermane"
                    name="Tentk"
                  >
                    <Input placeholder="Enter your username" />
                  </Form.Item>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password",
                      },
                    ]}
                    label="Password"
                    name="Matkhau"
                  >
                    <Input.Password placeholder="Enter your Passwword" />
                  </Form.Item>
                  <Checkbox onChange={onChange} style={{ marginBottom: "5%" }}>
                    Remember Password
                  </Checkbox>

                  <Button type="primary" htmlType="submit" block>
                    Login
                  </Button>

                  <p className="forgotpassword">
                    <a href="/forgot-password">Forgot Password</a>
                  </p>
                </>
              ),
            },
          ]}
        /> */}
        {/* <Divider style={{ borderColor: "black" }}>or Login with</Divider> */}
      </Form>
      {contextHolder}
    </div>
  );
};

export default Login;
