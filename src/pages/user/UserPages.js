import { Row, Col, Card, Pagination, Image, Button } from "antd";
import { useEffect, useState } from "react";
import API from "../../utils/API";
import _ from "lodash";
// import { SERVER_BASE_URL } from "../../utils/Constants";
import { useHistory, useLocation } from "react-router-dom";
// import Colors from "../../utils/Colors";

const UserPages = (props) => {
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");

  const onChange = (pageNumber) => {
    console.log("Page: ", pageNumber);
  };

  useEffect(() => {
    getData(1);
    console.log("kkkkk useEffect getData", category);
  }, []);

  const getData = async (page = 1, limit = 20) => {
    const url =
      `product?details=true&images=true&page=${page}&limit=${limit}` +
      (category ? `&category=${category}` : "") +
      (brand ? `&brand=${brand}` : "");
    console.log("kkkkk url", url);
    const rs = await API.get(url);
    if (rs.code === 200) {
      console.log("kkkkk rs.data", rs.data);
      _getSizesColors(rs.data);
      setProducts(_.chunk(rs.data, 4));
      console.log("kkkkk _.chunk(DATA, 4)", _.chunk(rs.data, 4));
    }
  };

  const _getSizesColors = (data) => {
    const _sizes = [];
    data.forEach((p) => {
      const _prod = {
        productId: p.id,
        sizes: [],
      };
      p.details?.forEach((d) => {
        const _color = {
          name: d.color.name,
          price: d.price,
        };
        const existed = _prod.sizes.find((s) => s.id === d.size.id);
        if (existed) {
          existed.colors.push(_color);
        } else {
          _prod.sizes.push({
            id: d.size.id,
            name: d.size.size,
            colors: [_color],
            selected: _prod.sizes.length === 0,
          });
        }
      });
      _sizes.push(_prod);
    });
    console.log("kkkkk _sizes", _sizes);
    setSizes(_sizes);
  };

  const _getImageUrl = (images) => {
    if (images?.length > 0) {
      // return `${SERVER_BASE_URL}/api/images?filename=${images[0].name}`;
    }
    return "";
  };

  const getDescription = (val) => {
    const arr = val?.split("\n") || [];
    return arr
      .filter((i) => !!i)
      .map((it) => (
        <span>
          ● {it} <br />
        </span>
      ));
  };

  const _onSizeChange = (productId, sizeId, e) => {
    e.stopPropagation();
    console.log("kkkkk _onSizeChange", productId, sizeId);
    const _prod = sizes.find((k) => k.productId === productId);
    _prod.sizes.forEach((s) => {
      if (s.id === sizeId) {
        s.selected = true;
      } else {
        s.selected = false;
      }
    });
    setProducts([...products]);
  };

  const showSizesColors = (productId) => {
    const _prod = sizes.find((k) => k.productId === productId);
    const _sizes = _prod?.sizes || [];
    const _colors = _sizes.find((k) => k.selected === true)?.colors || [];
    console.log("kkkkk showSizesColors", _sizes);
    const buttonsView = _sizes.map((item, idx) => {
      return (
        <Button
          style={{
            marginRight: 5,
            marginBottom: 8,
            color: item.selected ? "white" : null,
          }}
          key={idx}
          onClick={(e) => _onSizeChange(_prod.productId, item.id, e)}
        >
          {item.name}
        </Button>
      );
    });
    const colorsView = _colors.map((item, idx) => {
      return (
        <div
          style={{
            paddingLeft: 12,
            paddingRight: 12,
            color: "white",
            marginLeft: 5,
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 12,
          }}
          key={item.id}
        >
          <span>{item.name}</span>
          <span style={{ marginTop: -5 }}>{item.price.toLocaleString()}₫</span>
        </div>
      );
    });
    return (
      <>
        <Row>{buttonsView}</Row>
        <Row>{colorsView}</Row>
      </>
    );
  };

  const Item = ({ data }) => {
    return (
      <Col span={6} key={data.id} onClick={() => goToDetail(data)}>
        <Card
          hoverable
          style={{
            marginTop: 10,
            height: "100%",
            overflow: "hidden",
            margin: 2,
          }}
          cover={
            <Image
              height={350}
              src={_getImageUrl(data.images)}
              preview={false}
              style={{
                objectFit: "contain",
              }}
            />
          }
        >
          <div>
            <h2>{data.name}</h2>
            {showSizesColors(data.id)}
            <br />
            {getDescription(data.description)}
          </div>
        </Card>
      </Col>
    );
  };

  const goToDetail = (data) => {
    history.push("/ProductsDetails", { data });
  };
  return (
    <>
      {/* <Row>
        <Col span={24}>
          <Carousel images={DATA} />
        </Col>
      </Row> */}
      {products.map((group, idx) => {
        return (
          <Row key={idx}>
            {group[0] && <Item data={group[0]} />}
            {group[1] && <Item data={group[1]} />}
            {group[2] && <Item data={group[2]} />}
            {group[3] && <Item data={group[3]} />}
          </Row>
        );
      })}
      <Row style={{ display: "flex", justifyContent: "Center", marginTop: 10 }}>
        <Pagination defaultCurrent={1} total={50} onChange={onChange} />
      </Row>
    </>
  );
};

export default UserPages;

// const sizes = [
//   {
//       productId: 1,
//       sizes : [
//           {
//               id: 128,
//               colors: [
//                   {id: 1, name: 'Đen', price: 12000, },
//                   {id: 2, name: 'Đỏ', price: 13000},
//                   {id: 3, name: 'Vàng', price: 14000}
//               ],
//               selected: true,
//           },
//           {
//               id: 256,
//               colors: [
//                   {name: 'Đen', price: 12000},
//                   {name: 'Đỏ', price: 13000},
//                   {name: 'Vàng', price: 14000}
//               ],
//               selected: false,
//           },
//       ]
//   },
//   {
//       productId: 2,
//       sizes : [
//           {
//               id: 128,
//               colors: [
//                   {name: 'Đen', price: 12000},
//                   {name: 'Đỏ', price: 13000},
//                   {name: 'Vàng', price: 14000}
//               ],
//               selected: false,
//           },
//           {
//               id: 256,
//               colors: [
//                   {name: 'Đen', price: 12000},
//                   {name: 'Đỏ', price: 13000},
//                   {name: 'Vàng', price: 14000}
//               ],
//               selected: true,
//           },
//       ]
//   },

// ]
