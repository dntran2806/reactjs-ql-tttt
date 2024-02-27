import { Row, Col, Button, Space, Pagination, Input } from "antd";
import React, { useEffect, useState } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
// import UserStore from "../../stores/UserStore";
// import { observer } from "mobx-react";
// import { observer } from "mobx-react";
import { useHistory, NavLink } from "react-router-dom";
import API from "../../utils/API";
import BackgroundImage from "../../assets/images/li3.png";

const { Search } = Input;
const onSearch = (value) => console.log(value);

const UserLayout = (props) => {
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  const goToOrderDetail = () => {
    history.push("/OrderDetails");
  };

  const getCategories = async () => {
    const rs = await API.get("category");
    if (rs.code === 200) {
      setCategories(rs.data);
    }
    console.log("kkkkk categories", rs);
  };

  const getBrands = async () => {
    const rs = await API.get("brand");
    if (rs.code === 200) {
      setBrands(rs.data);
    }
    console.log("kkkkk brands", rs);
  };

  const onCategoryChange = (id) => {
    history.push(`/?category=${id}`);
  };

  const onBrandChange = (id) => {
    history.push(`/?brand=${id}`);
  };

  return (
    <>
      {/* <Row style={{ height: 160, width: "100%", backgroundColor: "#27a200" }}> */}
      <Row
        style={{
          height: 160,
          width: "100%",
          backgroundImage: `url(${BackgroundImage})`,
        }}
      >
        <Col span={2} />
        {/* <Col span={20}>
          <NavLink to="/">
            <img
              src="https://cdn.haitrieu.com/wp-content/uploads/2021/11/Logo-The-Gioi-Di-Dong-MWG-Y-H.png"
              style={{ width: 400, height: 70, marginTop: 15 }}
            />
          </NavLink>
          <Space wrap>
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              style={{
                width: 200,
                marginLeft: 500,
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                marginLeft: 5,
              }}
            >
              <ShoppingCartOutlined
                style={{ fontSize: 40, color: "white" }}
                onClick={() => goToOrderDetail()}
              />
              <span
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  padding: "0px 8px 0px 8px",
                  borderRadius: 20,
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                {UserStore.productsInCart.length}
              </span>
            </div>
          </Space>
          <Space wrap style={{ marginTop: 20 }}>
            {brands.map((item) => {
              return (
                <Button key={item.id} onClick={() => onBrandChange(item.id)}>
                  {item.name}
                </Button>
              );
            })}
          </Space>
        </Col> */}
        <Col span={2} />
      </Row>
      <Row>
        <Col span={2} />
        <Col span={20}>{props.children}</Col>
        <Col span={2} />
      </Row>
    </>
  );
};

export default UserLayout;
// export default observer(UserLayout);
