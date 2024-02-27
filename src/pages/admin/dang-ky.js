import {
  Table,
  Space,
  Popconfirm,
  notification,
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Radio,
  DatePicker,
  Row,
  Col,
  Image,
  Upload,
  Select,
} from "antd";
import { useEffect, useState, useRef, useCallback, React } from "react";
import {
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import UserStore from "../../stores/UserStore";
import { Colors, Images } from "../../utils/index";
import { observer } from "mobx-react";
import moment from "moment";
import { useHistory } from "react-router-dom";
// import { UploadImages } from "@components";
import { sendEmail, toDateString } from "../../utils/Common";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import VideoStore from "@stores/VideoStore";
// import NamStore from "../../stores/NamStore";
// import AddImageUri from "@components/AddImageUri";
import { toJS } from "mobx";
import { FileModel, LopModel, SinhvienModel } from "../../models";
import { async } from "@firebase/util";
import DangkyStore from "../../stores/DangkyStore";
import SinhvienStore from "../../stores/SinhvienStore";
import CanboStore from "../../stores/CanboStore";
import LopStore from "../../stores/LopStore";
import { all } from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import diacritics from "diacritics";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text, Link } = Typography;
const MAX_IMAGE_SIZE = 100 * 1000;

const Dangky = () => {
  const formRef = useRef(null);
  const dangkyRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [dangky, setDangky] = useState({});
  const [dangkyList, setDangkyList] = useState([]);
  const [svDDKList, setSvDDKList] = useState([]);
  const [svCDKList, setSvCDKList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sinhvien, setSinhvien] = useState({});
  const [sinhvienList, setSinhvienList] = useState([]);
  const [lop, setLop] = useState({});
  const [canbo, setCanbo] = useState({});
  const [tableType, setTableType] = useState("ddk");
  const [notify, contextHolder] = notification.useNotification();
  const history = useHistory();
  const ckediter = useRef(null);

  useEffect(() => {
    if (UserStore.userInfo) {
      console.log("kkkkk getData", UserStore.userInfo);
      getData();
    }
  }, [UserStore.userInfo]);

  useEffect(() => {
    console.log("kkkkk isModalOpen isEdit", isModalOpen, isEdit);
    if (isModalOpen && isEdit) {
      formRef.current?.setFieldsValue({
        ...dangky,
        Massv: sinhvien.Massv || dangky.Massv,
        Hoten: sinhvien.Hoten || dangky.Hoten,
        Tengvhd: canbo.Tencb || dangky.Tengvhd,
        // Ngaythuctap: dangky.Ngaythuctap
        //   ? dayjs(new Date(dangky.Ngaythuctap))
        //   : dayjs(),
        // Ngayketthuc: dangky.Ngayketthuc
        //   ? dayjs(new Date(dangky.Ngayketthuc))
        //   : dayjs(),
        ThoiGianthuctap: [dayjs(dangky.Ngaythuctap), dayjs(dangky.Ngayketthuc)],
      });
    } else {
      formRef.current?.setFieldsValue({
        Massv: sinhvien.Massv || dangky.Massv,
        Hoten: sinhvien.Hoten || dangky.Hoten,
        Noidungtt: "",
        Ngaythuctap: "",
        Ngayketthuc: "",
        Sobuoitt: "",
        Tendn: "",
        Email: "",
        Tennguoihd: "",
        Sodtnghd: "",
        Tengvhd: canbo.Tencb,
        Sotc: "",
        Diachi: "",
        Ghichu: "",
        Trangthai: "Chờ duyệt",
      });
    }
  }, [isModalOpen, isEdit, formRef]);

  // useEffect(() => {
  //   const col =
  //   if (UserStore.userInfo?.role == "sv") {
  //     const _action = columns.find((c) => c.title == "Action");
  //     if (!_action) {
  //       const data = [...getColums(), col];
  //       setColumns(data);
  //       console.log("kkkk col", data);
  //     }
  //   }
  //   console.log("kkkk user", UserStore.userInfo);
  // }, [UserStore.userInfo]);

  const getSV = async () => {
    if (UserStore.userInfo?.email) {
      console.log("kkkk UserStore.userInfo?.email", UserStore.userInfo?.email);
      const sv = await SinhvienStore.getByEmail(UserStore.userInfo.email);
      console.log("kkkk getSV", sv);
      if (sv) {
        setSinhvien(sv);
        getLopBySV(sv.Lop);
        return sv;
      } else {
        // email đang login ko nằm trong ds sv, báo lỗi không cho phép đăng ký
        notify.error({
          message: `Bạn không nằm trong danh sách sinh viên được phép đăng ký thực tập!`,
          placement: "topRight",
        });
      }
    }
    return;
  };

  // get lop
  const getLopBySV = async (id) => {
    const lop = await LopStore.getListById(id);
    console.log("kkkk getLopBySV", lop);
    if (lop) {
      setLop(lop);
      getCanboByLop(lop.Canbo);
    }
  };

  // get cán bộ
  const getCanboByLop = async (id) => {
    const cb = await CanboStore.getListById(id);
    console.log("kkkk getLopByCanbo", cb);
    if (cb) {
      setCanbo(cb);
    }
  };

  // get Canbo by email
  const getCanboByEmail = async (email) => {
    const cb = await CanboStore.getByEmail(email);
    console.log("kkkk getCanboByEmail", cb);
    if (cb) {
      setCanbo(cb);
      return cb;
    }
  };

  const getData = async () => {
    let list = [];
    if (["admin", "manager"].includes(UserStore.userInfo?.role)) {
      console.log("kkkk role admin");
      list = await DangkyStore.getList(true);
      await getsvCDKList(list);
    }
    if (UserStore.userInfo?.role === "sv") {
      const sv = Object.keys(sinhvien).length === 0 ? await getSV() : sinhvien;
      console.log("kkkk getData sv", sv);
      if (sv) {
        list = await DangkyStore.getList(true, [
          { key: "Sinhvien", logic: "==", value: sv.id },
        ]);
      }
    }
    if (UserStore.userInfo?.role === "gv") {
      const cb =
        Object.keys(canbo).length === 0
          ? await getCanboByEmail(UserStore.userInfo.email)
          : canbo;
      console.log("kkkk role=gv get canbo", cb);
      if (cb) {
        list = await DangkyStore.getList(true, [
          { key: "Canbo", logic: "==", value: cb.id },
        ]);
        const _lop = await LopStore.getByCanbo(cb.id);
        console.log("kkkk role=gv get lop", _lop);
        if (_lop) {
          await getsvCDKList(list, [
            { key: "Lop", logic: "==", value: _lop.id },
          ]);
        }
      }
    }

    console.log("list", list);
    if (list && list.length > 0) {
      setDangkyList(list);
    } else {
      setDangkyList([]);
      // notify.error({
      //   message: `Không có dữ liệu đăng ký!`,
      //   description: list,
      //   placement: "topRight",
      // });
    }
  };

  const getsvCDKList = async (ddkList = [], queries) => {
    const ddkIds = ddkList.map((_) => _.Sinhvien);
    console.log("kkkkk getsvCDKList ddkIds", ddkIds);
    const allSV = await SinhvienStore.getList(true, queries);
    console.log("kkkkk getsvCDKList all sv", allSV);
    const _ddkList = allSV.filter((sv) => ddkIds.includes(sv.id));
    setSvDDKList(_ddkList);
    const cdkList = allSV.filter((sv) => !ddkIds.includes(sv.id));
    console.log("kkkkk getsvCDKList cdkList", cdkList);
    setSvCDKList(cdkList);
    setSinhvienList(allSV);
  };

  const _sendEmail = () => {
    let emails = [];
    let title = "";
    let body = "";
    if (tableType === "ddk") {
      title = "Sinh viên đã đăng ký thực tập";
      body = "Bạn đã đăng ký thực tập! Vui lòng...";
      emails = svDDKList.map((_) => _.Email);
    } else {
      title = "Sinh viên chưa đăng ký thực tập";
      body = "Bạn chưa đăng ký thực tập! Vui lòng đăng ký sớm trước ngày...";
      emails = svCDKList.map((_) => _.Email);
    }
    sendEmail(title, body, emails);
  };

  const onAdd = () => {
    setIsEdit(false);
    showModal();
    dangkyRef.current?.clear();
    ckediter.current?.data?.set("");
    setDangky({
      Massv: sinhvien.Massv,
      Hoten: sinhvien.Hoten,
      Noidungtt: "",
      Ngaythuctap: "",
      Ngayketthuc: "",
      Sobuoitt: "",
      Tendn: "",
      Email: "",
      Tennguoihd: "",
      Sodtnghd: "",
      Tengvhd: canbo.Tencb,
      Sotc: "",
      Diachi: "",
      Ghichu: "",
      Trangthai: "Chờ duyệt",
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const onChange = (key, e) => {
    console.log("kkkkk ", e?.target?.value || e);
    let val = e?.target?.value || e;
    if (["Noidungtt", "Ghichu"].includes(key)) {
      val = e?.target?.value;
    }
    setDangky((prevValues) => ({
      ...prevValues,
      [key]: val,
    }));
  };

  const onRadioChange = (e) => {
    console.log("kkkkk onRadioChange", e?.target?.value);
    setTableType(e?.target?.value);
  };

  const onEdit = (id, event) => {
    const _dangkyList = dangkyList.find((k) => k.id === id);
    ckediter.current?.data?.set(_dangkyList.description);
    dangkyRef.current?.set(_dangkyList.images);
    setIsModalOpen(true);
    setIsEdit(true);
    setDangky({ ..._dangkyList });
    console.log("kkkkk _dangkyList", toJS(_dangkyList));
  };

  const onDelete = async (id, event) => {
    const _id = await DangkyStore.deleteList(id);
    if (_id) {
      await getData();
      notify.success({
        message: `Xóa dữ liệu đăng ký thành công!`,
        placement: "topRight",
      });

      // getData();
    } else {
      notify.error({
        message: `Lỗi xóa dữ liệu đăng ký!`,
        description: id,
        placement: "topRight",
      });
    }
  };

  const onFinish = async () => {
    console.log("kkkkk dangky", toJS(dangky));
    dangky.Ngaythuctap = dangky.ThoiGianthuctap?.[0] || dangky.Ngaythuctap;
    dangky.Ngayketthuc = dangky.ThoiGianthuctap?.[1] || dangky.Ngayketthuc;
    dangky.Sinhvien = sinhvien.id || dangky.Sinhvien;
    dangky.Canbo = canbo.id || dangky.Canbo;
    delete dangky.Massv;
    delete dangky.Hoten;
    delete dangky.Tengvhd;
    if (isEdit) {
      const _dangkyList = await DangkyStore.updateList(dangky);
      if (_dangkyList) {
        await getData();
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Cập nhật danh sách đăng ký thất bại",
          placement: "topRight",
        });
      }
    } else {
      const _dangkyList = await DangkyStore.addList(dangky);
      if (_dangkyList) {
        await getData();
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Thêm danh sách đăng ký thất bại",
          placement: "topRight",
        });
      }
    }
  };

  const exportDDKToPDF = () => {
    const pdf = new jsPDF();
    const _columns = [
      { title: "Mssv", dataKey: "Massv" },
      { title: "Ho ten", dataKey: "Hoten" },
      // { title: "Noi dung thuc tap", dataKey: "Noidungtt" },
      { title: "Ten doanh nghiep", dataKey: "Tendn" },
      { title: "Email", dataKey: "Email" },
      // { title: "Dia chi", dataKey: "Diachi" },
      // { title: "Nguoi huong dan", dataKey: "Tennguoihd" },
      // { title: "Sdt nguoi huong dan", dataKey: "Sodtnghd" },
      // { title: "So buoi thuc tap", dataKey: "Sobuoitt" },
      // { title: "Giao vien huong dan", dataKey: "Tengvhd" },
      // { title: "So tinh chi", dataKey: "Sotc" },
      // { title: "Ngay thuc tap", dataKey: "Ngaythuctap" },
      // { title: "Ngay ket thuc", dataKey: "Ngayketthuc" },
      // { title: "Ghi chu", dataKey: "Ghichu" },
      // { title: "Trang thai", dataKey: "Trangthai" },
    ];
    const _data = dangkyList.map((dk) => {
      return {
        Massv: dk.Massv,
        Hoten: diacritics.remove(dk.Hoten),
        // Noidungtt: diacritics.remove(dk.Noidungtt),
        Tendn: diacritics.remove(dk.Tendn),
        Email: dk.Email,
        // Diachi: diacritics.remove(dk.Diachi),
        // Tennguoihd: diacritics.remove(dk.Tennguoihd),
        // Sodtnghd: diacritics.remove(dk.Sodtnghd),
        // Sobuoitt: diacritics.remove(dk.Sobuoitt),
        // Tengvhd: diacritics.remove(dk.Tengvhd),
        // Sotc: dk.Sotc,
        // Ngaythuctap: dk.Ngaythuctap,
        // Ngayketthuc: dk.Ngayketthuc,
        // Ghichu: diacritics.remove(dk.Ghichu),
        // Trangthai: diacritics.remove(dk.Trangthai),
      };
    });
    console.log("kkkkk _data", _data);
    pdf.autoTable({
      head: [_columns.map((c) => c.title)],
      // body: _data,
      body: _data.map((row) => _columns.map((c) => row[c.dataKey])),
    });
    pdf.save("danh-sach-sinh-vien-dang-ky-thuc-tap.pdf");
  };

  const exportCDKToPDF = () => {
    const pdf = new jsPDF();
    const _columns = [
      { title: "Mssv", dataKey: "Massv" },
      { title: "Ho ten", dataKey: "Hoten" },
      // { title: "Noi dung thuc tap", dataKey: "Noidungtt" },
      // { title: "Ten doanh nghiep", dataKey: "Tendn" },
      { title: "Email", dataKey: "Email" },
      // { title: "Dia chi", dataKey: "Diachi" },
      // { title: "Nguoi huong dan", dataKey: "Tennguoihd" },
      // { title: "Sdt nguoi huong dan", dataKey: "Sodtnghd" },
      // { title: "So buoi thuc tap", dataKey: "Sobuoitt" },
      // { title: "Giao vien huong dan", dataKey: "Tengvhd" },
      // { title: "So tinh chi", dataKey: "Sotc" },
      // { title: "Ngay thuc tap", dataKey: "Ngaythuctap" },
      // { title: "Ngay ket thuc", dataKey: "Ngayketthuc" },
      // { title: "Ghi chu", dataKey: "Ghichu" },
      // { title: "Trang thai", dataKey: "Trangthai" },
    ];
    const _data = svCDKList.map((dk) => {
      return {
        Massv: dk.Massv,
        Hoten: diacritics.remove(dk.Hoten),
        // Noidungtt: diacritics.remove(dk.Noidungtt),
        // Tendn: diacritics.remove(dk.Tendn),
        Email: dk.Email,
        // Diachi: diacritics.remove(dk.Diachi),
        // Tennguoihd: diacritics.remove(dk.Tennguoihd),
        // Sodtnghd: diacritics.remove(dk.Sodtnghd),
        // Sobuoitt: diacritics.remove(dk.Sobuoitt),
        // Tengvhd: diacritics.remove(dk.Tengvhd),
        // Sotc: dk.Sotc,
        // Ngaythuctap: dk.Ngaythuctap,
        // Ngayketthuc: dk.Ngayketthuc,
        // Ghichu: diacritics.remove(dk.Ghichu),
        // Trangthai: diacritics.remove(dk.Trangthai),
      };
    });
    console.log("kkkkk _data", _data);
    pdf.autoTable({
      head: [_columns.map((c) => c.title)],
      // body: _data,
      body: _data.map((row) => _columns.map((c) => row[c.dataKey])),
    });
    pdf.save("danh-sach-sinh-vien-chua-dang-ky-thuc-tap.pdf");
  };

  const COLUMNS_DDK = [
    {
      title: "MSSV",
      dataIndex: "Massv",
      fixed: "left",
      width: 100,
    },
    {
      title: "Họ tên sinh viên",
      dataIndex: "Hoten",
      // fixed: "left",
      // width: 150,
    },
    {
      title: "Nội dung thực tập",
      dataIndex: "Noidungtt",
      // width: 150,
    },
    {
      title: "Tên doanh nghiệp",
      dataIndex: "Tendn",
      // width: 150,
    },
    {
      title: "Email doanh nghiệp",
      dataIndex: "Email",
      // width: 150,
    },
    {
      title: "Địa chỉ doanh nghiệp",
      dataIndex: "Diachi",
      // width: 150,
    },
    {
      title: "Tên người hướng dẫn",
      dataIndex: "Tennguoihd",
      // width: 150,
    },
    {
      title: "Số điện thoại người hướng dẫn",
      dataIndex: "Sodtnghd",
      // width: 150,
    },
    {
      title: "Số buổi thực tập trên tuần",
      dataIndex: "Sobuoitt",
      // width: 150,
    },

    {
      title: "Tên giao viên hướng dẫn",
      dataIndex: "Tengvhd",
      // width: 150,
    },
    {
      title: "Số tính chỉ",
      dataIndex: "Sotc",
      // width: 150,
    },
    {
      title: "Ngày bắt đầu thực tập",
      dataIndex: "Ngaythuctap",
      render: (val) => (
        <span>{val ? moment(val).format("DD/MM/YYYY") : ""}</span>
      ),
    },
    {
      title: "Ngày kết thúc thực tập",
      dataIndex: "Ngayketthuc",
      render: (val) => (
        <span>{val ? moment(val).format("DD/MM/YYYY") : ""}</span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "Ghichu",
    },
    {
      title: "Trạng thái",
      dataIndex: "Trangthai",
      // render: (val) => {
      //   return (
      //     <span color={val === 1 ? "success" : val === 2 ? "warning" : "error"}>
      //       {val === 1
      //         ? "Đã duyệt"
      //         : val === 2
      //         ? "Chờ duyệt"
      //         : "Không đủ điều kiện"}
      //     </span>
      //   );
      // },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      fixed: "right",
      // width: 120,
      render: (val) => (
        <Text>{moment(val?.toDate?.()).format("DD/MM/YYYY")}</Text>
      ),
    },
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, data) => {
        let _isEdit = false;
        let _isDel = false;
        if (UserStore?.userInfo?.role === "sv") {
          if (data.Trangthai !== "Đã duyệt") {
            _isEdit = true;
            _isDel = true;
          }
        }
        if (UserStore?.userInfo?.role === "gv") {
          _isEdit = true;
        }
        if (UserStore?.userInfo?.role === "admin") {
          _isEdit = true;
          _isDel = true;
        }
        return (
          <Space size="middle">
            <EditOutlined
              onClick={() => _isEdit && onEdit(data.id)}
              style={{
                color: _isEdit ? Colors.green : Colors.disabled,
                cursor: _isEdit ? "pointer" : "none",
              }}
            />
            <Popconfirm
              title="Chắc chắn xóa?"
              onConfirm={() => onDelete(data.id)}
              disabled={!_isDel}
            >
              <DeleteOutlined
                style={{
                  color: _isDel ? Colors.red : Colors.disabled,
                  cursor: _isDel ? "pointer" : "none",
                }}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const COLUMNS_CDK = [
    {
      title: "Mã số sinh viên",
      dataIndex: "Massv",
      fixed: "left",
    },
    {
      title: "Họ tên sinh viên",
      dataIndex: "Hoten",
    },
    {
      title: "Email",
      dataIndex: "Email",
    },
  ];
  return (
    <>
      {UserStore.userInfo?.role !== "sv" && (
        <Radio.Group
          defaultValue="ddk"
          buttonStyle="solid"
          onChange={onRadioChange}
        >
          <Radio.Button value="ddk">Đã đăng ký</Radio.Button>
          <Radio.Button value="cdk">Chưa đăng ký</Radio.Button>
        </Radio.Group>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 5,
        }}
      >
        {UserStore.userInfo?.role !== "sv" && (
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={tableType === "ddk" ? exportDDKToPDF : exportCDKToPDF}
          >
            Export to PDF
          </Button>
        )}
        {tableType === "ddk" &&
          UserStore.userInfo?.role === "sv" &&
          dangkyList.length === 0 &&
          Object.keys(sinhvien).length > 0 && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              Đăng ký
            </Button>
          )}
        {UserStore.userInfo?.role !== "sv" && (
          <Button
            type="primary"
            icon={<MailOutlined />}
            onClick={_sendEmail}
            style={{ marginLeft: 8 }}
          >
            Gửi mail
          </Button>
        )}
      </div>
      {tableType === "ddk" && (
        <Table
          rowKey="id"
          columns={COLUMNS_DDK}
          style={{ marginTop: 8 }}
          dataSource={dangkyList}
          scroll={dangkyList?.length > 0 ? { x: 1600 } : {}}
        />
      )}
      {tableType === "cdk" && (
        <Table
          rowKey="id"
          columns={COLUMNS_CDK}
          style={{ marginTop: 8 }}
          dataSource={svCDKList}
          // scroll={svCDKList?.length > 0 ? { x: 1600 } : {}}
        />
      )}
      <Modal
        title={`${isEdit ? "Edit" : "Đăng ký"}`}
        open={isModalOpen}
        footer={null}
        closeIcon={
          <div onClick={hideModal}>
            <CloseOutlined />
          </div>
        }
      >
        <Form
          layout="vertical"
          className="row-col"
          style={{ marginTop: 12 }}
          ref={formRef}
          onFinish={onFinish}
        >
          <Form.Item label="Mã số sinh viên" name="Massv">
            <Input
              placeholder="Mã số sinh viên"
              disabled
              onChange={(txt) => onChange("Massv", txt)}
            />
          </Form.Item>
          <Form.Item label="Họ tên sinh viên" name="Hoten">
            <Input
              placeholder="Họ tên sinh viên"
              disabled
              onChange={(txt) => onChange("Hoten", txt)}
            />
          </Form.Item>
          <Form.Item label="Nội dung thực tập" name="Noidungtt">
            <TextArea
              placeholder="Nội dung thực tập"
              onChange={(txt) => onChange("Noidungtt", txt)}
            />
          </Form.Item>
          <Form.Item label="Tên doanh nghiệp" name="Tendn">
            <Input
              placeholder="Tên doanh nghiệp"
              onChange={(txt) => onChange("Tendn", txt)}
            />
          </Form.Item>
          <Form.Item label="Email doanh nghiệp" name="Email">
            <Input
              placeholder="Email doanh nghiệp"
              onChange={(txt) => onChange("Email", txt)}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ doanh nghiệp" name="Diachi">
            <Input
              placeholder="Địa chỉ doanh nghiệp"
              onChange={(txt) => onChange("Diachi", txt)}
            />
          </Form.Item>
          <Form.Item label="Tên người hướng dẫn" name="Tennguoihd">
            <Input
              placeholder="Tên người hướng dẫn"
              onChange={(txt) => onChange("Tennguoihd", txt)}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại người hướng dẫn" name="Sodtnghd">
            <Input
              placeholder="Số điện thoại người hướng dẫn"
              onChange={(txt) => onChange("Sodtnghd", txt)}
              maxLength={10}
            />
          </Form.Item>
          <Form.Item
            label="Số buổi thực tập trên tuần (ít nhất 6 buổi)"
            name="Sobuoitt"
          >
            <Input
              placeholder="Số buổi thực tập trên tuần"
              onChange={(txt) => onChange("Sobuoitt", txt)}
            />
          </Form.Item>
          <Form.Item label="Tên giáo viên hướng dẫn" name="Tengvhd">
            <Input
              placeholder="Tên giáo viên hướng dẫn"
              disabled
              value={canbo?.Tencb}
            />
          </Form.Item>
          <Form.Item label="Số tính chỉ hiện tại" name="Sotc">
            <Input
              placeholder="Số tính chỉ hiện tại"
              onChange={(txt) => onChange("Sotc", txt)}
            />
          </Form.Item>
          <Form.Item label="Thời gian thực tập" name="ThoiGianthuctap">
            <RangePicker
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                onChange("ThoiGianthuctap", dateString)
              }
            />
          </Form.Item>
          {/* <Form.Item label="Ngày bắt đầu thực tập" name="Ngaythuctap">
            <DatePicker
              format={"DD/MM/YYYY"}
              defaultValue={dayjs()}
              style={{ width: "100%" }}
              placeholder="Ngày bắt đầu thực tập"
              onChange={(date, dateString) =>
                onChange("Ngaythuctap", dateString)
              }
              value={dangky.Ngaythuctap ? dayjs(dangky.Ngaythuctap) : dayjs()}
            />
            <Input
              placeholder="Ngày bắt đầu thực tập"
              onChange={(txt) => onChange("Ngaythuctap", txt)}
            />
          </Form.Item> */}

          {/* <Form.Item label="Ngày kết thúc thực tập" name="Ngayketthuc">
            <DatePicker
              format={"DD/MM/YYYY"}
              defaultValue={dayjs()}
              style={{ width: "100%" }}
              placeholder="Ngày kết thúc thực tập"
              onChange={(date, dateString) =>
                onChange("Ngayketthuc", dateString)
              }
              value={dangky.Ngayketthuc ? dayjs(dangky.Ngayketthuc) : dayjs()}
            />
            <Input
              placeholder="Ngày kết thúc thực tập"
              onChange={(txt) => onChange("Ngayketthuc", txt)}
            />
          </Form.Item> */}
          <Form.Item label="Ghi chú" name="Ghichu">
            <TextArea
              placeholder="Ghi chú"
              onChange={(txt) => onChange("Ghichu", txt)}
            />
          </Form.Item>
          <Form.Item label="Trạng thái" name="Trangthai">
            <Select
              disabled={UserStore.userInfo?.role === "sv"}
              defaultValue="Chờ duyệt"
              style={{
                width: 120,
              }}
              onChange={(txt) => onChange("Trangthai", txt)}
              options={[
                {
                  value: "Chờ duyệt",
                  label: "Chờ duyệt",
                },
                {
                  value: "Đã duyệt",
                  label: "Đã duyệt",
                },
                {
                  value: "Không đủ điều kiện",
                  label: "Không đủ điều kiện",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>
              {`${isEdit ? "Update" : "Đăng ký"}`}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};
export default observer(Dangky);
