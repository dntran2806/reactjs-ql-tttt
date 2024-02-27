import {
  PieChartOutlined,
  TeamOutlined,
  DeliveredProcedureOutlined,
  SolutionOutlined,
  AudioOutlined,
  FileDoneOutlined,
  CarryOutOutlined,
  BarChartOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Button,
  Input,
  Space,
  notification,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { NavLink, useParams, useHistory, useLocation } from "react-router-dom";
import { PoweroffOutlined } from "@ant-design/icons";
import API from "../../utils/API";
import { observer } from "mobx-react";
import UserStore from "../../stores/UserStore";
import Images1 from "../../assets/images/li4.png";
import Images2 from "../../assets/images/logo1.png";
import Colors from "../../utils/Colors";
import { Themes } from "../../utils/index";
const { Search } = Input;
const { Header, Content, Sider, Footer } = Layout;

// const onSearch = (value) => console.log(value);

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

const onSearch = (value) => console.log(value);

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const ITEMS = [
  getItem(
    "Quy trình thực tập",
    "Quy trình thực tập",
    <NavLink to="/quy-trinh-tt">
      <DeliveredProcedureOutlined />
    </NavLink>
  ),
  getItem(
    "Đăng ký thực tập",
    "Đăng ký thực tập",
    <NavLink to="/dang-ky">
      <SolutionOutlined />
    </NavLink>
  ),

  getItem(
    "Năm",
    "Năm",
    <NavLink to="/nam">
      <CarryOutOutlined />
    </NavLink>

    //  [
    //   getItem("Khóa học", "4"),
    //   getItem("Đề cương", "5"),
    //   getItem("Biểu mẫu", "6"),
    // ]
  ),

  // getItem("Đơn vị", "5", <LineChartOutlined />),
  getItem(
    "Sinh viên",
    "Sinh viên",
    <NavLink to="/sinh-vien">
      <TeamOutlined />
    </NavLink>
  ),

  getItem(
    "Doanh nghiệp",
    "Doanh nghiệp",
    <NavLink to="/doanh-nghiep">
      <BarChartOutlined />
    </NavLink>
  ),

  // getItem(
  //   "Thông tin tiếp nhận",
  //   "Thông tin tiếp nhận",
  //   <NavLink to="/User">
  //     <FileDoneOutlined />
  //   </NavLink>
  // ),
  // getItem(
  //   "Danh sách sinh viên thực tập",
  //   "Danh sách sinh viên đi thực tập",
  //   <NavLink to="/dang-ky">
  //     <SolutionOutlined />
  //   </NavLink>
  // ),
];
const AppLayout = (props) => {
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const [loadings, setLoadings] = useState([]);
  const [nguoidungs, setNguoidungs] = useState([]);
  const [nguoidung, setNguoidung] = useState({});
  const [input, setInput] = useState("");
  const [notify, contextHolder] = notification.useNotification();
  const [menus, setMenus] = useState(ITEMS);

  useEffect(() => {
    const addColoumns = async () => {
      const _isLogin = await isLogin();
      console.log("kkkkk _isLogin", _isLogin, UserStore.userInfo);
      if (_isLogin) {
        const menubc = getItem(
          "Xem thống kê báo cáo",
          "Xem thống kê báo cáo",
          <NavLink to="/bao-cao">
            <PieChartOutlined />
          </NavLink>
        );
        const menucb = getItem(
          "Cán bộ",
          "Cán bộ",
          <NavLink to="/can-bo">
            <TeamOutlined />
          </NavLink>
        );
        const menulop = getItem(
          "Lớp",
          "Lớp",
          <NavLink to="/lop">
            <IdcardOutlined />
          </NavLink>
        );
        // const menuqt = getItem(
        //   "Quy trình thực tập",
        //   "Quy trình thực tập",
        //   <NavLink to="/quy-trinh-tt-admin">
        //     <DeliveredProcedureOutlined />
        //   </NavLink>
        // );
        if (["admin", "manager"].includes(UserStore.userInfo?.role)) {
          const _menubc = menus.find((n) => n.key === "Xem thống kê báo cáo");
          const _menucb = menus.find((n) => n.key === "Cán bộ");
          const _menulop = menus.find((n) => n.key === "Lớp");
          // const _menuqt = menus.find((n) => n.key === "Quy trình thực tập");
          if (!_menubc) {
            menus.splice(0, 0, menubc);
          }
          if (!_menucb) {
            menus.splice(4, 0, menucb);
          }
          if (!_menulop) {
            menus.splice(5, 0, menulop);
          }
          // if (!_menuqt) {
          //   menus.splice(1, 0, menuqt);
          // }
          console.log("kkkk admin, manager menus", menus);
          setMenus([...menus]);
        }
        if (["gv"].includes(UserStore.userInfo?.role)) {
          const _menubc = menus.find((n) => n.key === "Xem thống kê báo cáo");
          if (!_menubc) {
            menus.splice(0, 0, menubc);
          }
          // nếu role là gv thì lọc lại bỏ ra các menu sau
          const _menus = menus.filter(
            (m) => !["Cán bộ", "Lớp"].includes(m.key)
          );
          console.log("kkkk gv menus", _menus);
          setMenus([..._menus]);
        }
        if (["sv"].includes(UserStore.userInfo?.role)) {
          // nếu role là sv thì lọc lại bỏ ra các menu sau
          const _menus = menus.filter(
            (m) => !["Xem thống kê báo cáo", "Cán bộ", "Lớp"].includes(m.key)
          );
          console.log("kkkk sv menus", _menus);
          setMenus([..._menus]);
        }
      }
    };
    addColoumns();
  }, [UserStore.userInfo]);

  useEffect(() => {
    grantPermission();
  }, [location, history, UserStore.userInfo]);

  const isLogin = async () => {
    let _isLogin = UserStore.userInfo;
    if (!_isLogin) {
      const _user = await UserStore.loadUserInfo();
      if (_user) _isLogin = true;
    }
    return _isLogin;
  };

  //phân quyền
  const grantPermission = async () => {
    const _isLogin = await isLogin();
    if (_isLogin) {
      if (
        !location.pathname.includes("/signin") &&
        !location.pathname.includes("/")
      ) {
        if (!UserStore.userInfo) {
          return history.push("/signin");
        }
      }
      const gvRoutes = ["bao-cao"];
      const adminRoutes = ["lop", "can-bo"];

      for (let index = 0; index < gvRoutes.length; index++) {
        const value = gvRoutes[index];
        if (location.pathname.includes(value)) {
          if (UserStore.userInfo.role === "sv") {
            history.replace("/khong-co-quyen");
            return;
          }
        }
      }
      for (let index = 0; index < adminRoutes.length; index++) {
        const value = adminRoutes[index];
        if (location.pathname.includes(value)) {
          if (!["admin", "manager"].includes(UserStore.userInfo.role)) {
            history.replace("/khong-co-quyen");
            return;
          }
        }
      }
    } else {
      history.push("/signin");
    }
  };
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 400);
  };

  const onSigout = async () => {
    await UserStore.logout();
    history.replace("/signin");
  };

  // const getData = async () => {
  //   const rs = await API.get("nguoidung");
  //   console.log("kkkkk nguoidung", rs);
  //   if (rs && rs.length > 0) {
  //     setInput(rs);
  //   } else {
  //     notify.error({
  //       message: `Không có người dùng!`,
  //       description: rs,
  //       placement: "topRight",
  //     });
  //   }
  // };
  // const onSearch = async () => {
  //   history.push("/User");
  //   const rs = await API.get("nguoidung");
  //   if (rs) {
  //     // setIsModalOpen(false);
  //     getData();
  //   } else {
  //     notify.error({
  //       message: `Lỗi thêm người dùng!`,
  //       description: rs,
  //       placement: "topRight",
  //     });
  //   }
  // };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // const COLUMNS = [
  //   {
  //     dataIndex: "Ten",
  //   },
  // ];
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <div
          // style={{ color: "#FFFFFF", marginLeft: 5, marginTop: 25 }}
          style={{
            marginTop: 20,
          }}
        >
          <img
            src={Images2}
            alt="logo"
            style={{ width: 25, height: 25, borderRadius: 20 }}
          />
          <span
            className={`container ${collapsed ? "fade-out" : "fade-in"}`}
            style={{
              marginLeft: 9,
              color: "#FFFFFF",
              fontSize: 16,
              verticalAlign: "top",
            }}
          >
            Quản lý thực tập
          </span>
        </div>
        {/* <hr style={{ marginLeft: 7, marginRight: 7 }} /> */}
        <hr style={{ width: "77%" }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={menus}
        />
      </Sider>
      <Layout
        style={{
          justifyContent: "center",
          backgroundImage: `url(${Images1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Header
          style={{
            // padding: 0,
            // background: colorBgContainer,
            // minHeight: "100vh",
            backgroundColor: Colors.bgTransparent,
            // marginLeft: "100%",
            textAlign: "right",
          }}
        >
          {/* <div style={{ marginLeft: "58%", fontSize: 18 }}> */}
          {/* <a columns={COLUMNS} /> */}
          {/* <Space direction="vertical">
            <Search
              style={{ marginTop: 17 }}
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
            />
          </Space> */}
          <Button
            type="primary"
            icon={<PoweroffOutlined />}
            // loading={loadings[1]}
            onClick={() => onSigout()}
            // style={{ marginLeft: 15 }}
            // href="/"
          >
            Đăng Xuất!
          </Button>
          {/* </div> */}
        </Header>

        <Content>
          <div
            style={{
              padding: 24,
              // minHeight: 800,
              // background: colorBgContainer,
              minHeight: "100vh",
              // maxWidth: Themes.MAX_BODY_WIDTH,
              backgroundColor: Colors.bgTransparent,
            }}
          >
            {props.children}
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
            // maxWidth: Themes.MAX_BODY_WIDTH,
            backgroundColor: Colors.bgTransparent,
          }}
        >
          QLTTTT ©2023 Created by Ngọc Trân
        </Footer>
        {contextHolder}
      </Layout>
    </Layout>
  );
};
export default observer(AppLayout);
