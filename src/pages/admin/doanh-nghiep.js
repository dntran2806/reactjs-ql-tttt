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
  Tooltip,
  Switch,
  Row,
  Col,
  Image,
  Upload,
  message,
  Select,
  InputNumber,
  Tag,
} from "antd";
import { useEffect, useState, useRef, useCallback, React } from "react";
import {
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  HeartFilled,
  HeartOutlined,
  CheckOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import UserStore from "../../stores/UserStore";
import { Colors, Images } from "../../utils/index";
import { observer } from "mobx-react";
import moment from "moment";
import { useHistory } from "react-router-dom";
// import { UploadImages } from "@components";
import { getBase64 } from "../../utils/Common";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import VideoStore from "@stores/VideoStore";
// import NamStore from "../../stores/NamStore";
// import AddImageUri from "@components/AddImageUri";
import { toJS } from "mobx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import diacritics from "diacritics";
import { TrangthaiModel, TTTiepnhanModel } from "../../models";
import { async } from "@firebase/util";
import DoanhnghiepStore from "../../stores/DoanhnghiepStore";

const { Option } = Select;
const { TextArea } = Input;
const { Text, Link } = Typography;
const MAX_IMAGE_SIZE = 100 * 1000;

const props = {
  name: "file",
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  headers: {
    authorization: "authorization-text",
  },
  // onChange(info) {
  //   if (info.file.status !== "uploading") {
  //     console.log(info.file, info.fileList);
  //   }
  //   if (info.file.status === "done") {
  //     message.success(`${info.file.name} file uploaded successfully`);
  //   } else if (info.file.status === "error") {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // },
};

const Doanhnghiep = () => {
  const formRef = useRef(null);
  const doanhnghiepRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [doanhnghiepList, setDoanhnghiepList] = useState({
    isActive: true,
    isFavorite: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const history = useHistory();
  const ckediter = useRef(null);
  const [trangthais, setTrangthais] = useState([]);
  const [tttiepnhans, setTTTiepnhans] = useState([]);

  useEffect(() => {
    getData();
    getTrangthais();
    // getTTTiepnhans();
  }, []);

  useEffect(() => {
    console.log("kkkkk isModalOpen isEdit", isModalOpen, isEdit);
    if (isModalOpen && isEdit) {
      formRef.current?.setFieldsValue(doanhnghiepList);
    } else {
      formRef.current?.setFieldsValue({
        iddn: "",
        Tendoanhnghiep: "",
        Diachi: "",
        Sodtdn: "",
        Email: "",
        Sodtnguoilh: "",
        Tennguoilh: "",
        Slsv: "",
        Ycchuyenmon: "",
        Trangthai: "",
      });
    }
  }, [isModalOpen, isEdit, formRef]);

  const getData = async () => {
    const list = await DoanhnghiepStore.getList();
    console.log("list", list);
    if (list && list.length > 0) {
      // setDuans(list);
    } else {
      // notify.error({
      //   message: `Không có dữ liệu doanh nghiệp!`,
      //   description: list,
      //   placement: "topRight",
      // });
    }
  };

  const getTrangthais = async () => {
    const rs = await TrangthaiModel.getAll();
    // const rs = await NganhStore.getList();
    console.log("kkkkk get trangthais", rs);
    if (rs) {
      setTrangthais(rs);
    }
  };

  // const getTTTiepnhans = async () => {
  //   const rs = await TTTiepnhanModel.add();
  //   console.log("kkkkk get tttiepnhans", rs);
  //   if (rs) {
  //     setTTTiepnhans(rs);
  //   }
  // };

  const onAdd = () => {
    setIsEdit(false);
    showModal();
    doanhnghiepRef.current?.clear();
    ckediter.current?.data?.set("");
    setDoanhnghiepList({
      iddn: "",
      Tendoanhnghiep: "",
      Diachi: "",
      Sodtdn: "",
      Email: "",
      Sodtnguoilh: "",
      Tennguoilh: "",
      Slsv: "",
      Ycchuyenmon: "",
      Trangthai: "",
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
    setDoanhnghiepList((prevValues) => ({
      ...prevValues,
      [key]: val,
    }));
  };

  const onEdit = (id, event) => {
    const _doanhnghiepList = DoanhnghiepStore.list.find((k) => k.id === id);
    ckediter.current?.data?.set(_doanhnghiepList.description);
    doanhnghiepRef.current?.set(_doanhnghiepList.images);
    setIsModalOpen(true);
    setIsEdit(true);
    setDoanhnghiepList({ ..._doanhnghiepList });
    console.log("kkkkk _doanhnghiepList", toJS(_doanhnghiepList));
  };

  const onDelete = (id, event) => {
    DoanhnghiepStore.deleteList(id);
    if (id) {
      notify.success({
        message: `Xóa dữ liệu doanh nghiệp thành công!`,
        placement: "topRight",
      });

      // getData();
    } else {
      notify.error({
        message: `Lỗi xóa dữ liệu doanh nghiệp!`,
        description: id,
        placement: "topRight",
      });
    }
  };

  const onFinish = async () => {
    console.log("kkkkk doanhnghiepList", toJS(doanhnghiepList));
    console.log("kkkkk doanhnghiepList lop", toJS(doanhnghiepList.lop));
    if (isEdit) {
      const _doanhnghiepList = await DoanhnghiepStore.updateList(
        doanhnghiepList
      );
      if (_doanhnghiepList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Cập nhật danh sách doanh nghiệp thất bại",
          placement: "topRight",
        });
      }
    } else {
      const _doanhnghiepList = await DoanhnghiepStore.addList(doanhnghiepList);
      if (_doanhnghiepList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Thêm danh sách doanh nghiệp thất bại",
          placement: "topRight",
        });
      }
    }
  };

  const handleExportToPDF = () => {
    const pdf = new jsPDF();
    const _columns = [
      { title: "Ten doanh nghiep", dataKey: "Tendoanhnghiep" },
      { title: "Dia chi", dataKey: "Diachi" },
      { title: "So dien thoai doanh nghiep", dataKey: "Sodtdn" },
      { title: "Email", dataKey: "Email" },
      { title: "So dien thoai nguoi lien he", dataKey: "Sodtnguoilh" },
      { title: "Ten nguoi lien he", dataKey: "Tennguoilh" },
      { title: "So luong sinh vien", dataKey: "Slsv" },
      { title: "Yeu cau chuyen mon", dataKey: "Ycchuyenmon" },
      { title: "Trang thai", dataKey: "Trangthai" },
    ];
    const _data = DoanhnghiepStore.list.map((dn) => {
      return {
        Tendoanhnghiep: diacritics.remove(dn.Tendoanhnghiep),
        Diachi: diacritics.remove(dn.Diachi),
        Sodtdn: dn.Sodtdn,
        Email: dn.Email,
        Sodtnguoilh: dn.Sodtnguoilh,
        Tennguoilh: diacritics.remove(dn.Tennguoilh),
        Slsv: dn.Slsv,
        Ycchuyenmon: diacritics.remove(dn.Ycchuyenmon),
        Trangthai: diacritics.remove(
          trangthais.find((_) => _.id === dn.Trangthai)?.Tentt
        ),
      };
    });
    console.log("kkkkk _data", _data);
    pdf.autoTable({
      head: [_columns.map((c) => c.title)],
      // body: _data,
      body: _data.map((row) => _columns.map((c) => row[c.dataKey])),
    });
    pdf.save("danh-sach-doanh-nghiep.pdf");
  };

  const COLUMNS = [
    {
      title: "Tên doanh nghiệp",
      dataIndex: "Tendoanhnghiep",
      fixed: "left",
    },
    {
      title: "Địa chỉ",
      dataIndex: "Diachi",
    },
    {
      title: "Số điện thoại doanh nghiệp",
      dataIndex: "Sodtdn",
    },
    {
      title: "Email doanh nghiệp",
      dataIndex: "Email",
    },
    {
      title: "Số điện thoại người liên hệ",
      dataIndex: "Sodtnguoilh",
    },
    {
      title: "Tên người liên hệ",
      dataIndex: "Tennguoilh",
    },
    {
      title: "Số lượng sinh viên thực",
      dataIndex: "Slsv",
      // render: (tttnsl) => (
      //   <span>{tttiepnhans.find((_) => _.id === tttnsl)?.Slsv}</span>
      // ),
    },
    {
      title: "Yêu cầu chuyên môn",
      dataIndex: "Ycchuyenmon",
      // render: (tttnyc) => (
      //   <span>{tttiepnhans.find((_) => _.id === tttnyc)?.Ycchuyenmon}</span>
      // ),
    },
    {
      title: "Trạng thái doanh nghiệp",
      dataIndex: "Trangthai",
      render: (tt) => {
        const _tt = trangthais.find((_) => _.id === tt)?.Tentt;
        return (
          <span
            style={{
              color: _tt === "Đang hoạt động" ? Colors.green : Colors.red,
            }}
          >
            {_tt}
          </span>
        );
      },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      // width: 120,
      render: (val) => (
        <Text>{moment(val?.toDate?.()).format("DD-MM-YYYY")}</Text>
      ),
    },
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, data) => {
        let _isEdit = false;
        let _isDel = false;
        // if (UserStore?.userInfo?.role === "sv") {
        //   if (data.Trangthai !== "Đã duyệt") {
        //     _isEdit = true;
        //     _isDel = true;
        //   }
        // }
        // if (UserStore?.userInfo?.role === "gv") {
        //   _isEdit = true;
        // }
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

  return (
    <>
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
            onClick={handleExportToPDF}
          >
            Export to PDF
          </Button>
        )}

        {UserStore.userInfo?.role === "admin" ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
            style={{ marginLeft: 8 }}
          >
            Add
          </Button>
        ) : null}
      </div>
      <Table
        rowKey="id"
        columns={COLUMNS}
        style={{ marginTop: 8 }}
        dataSource={DoanhnghiepStore.list}
        scroll={DoanhnghiepStore.list?.length > 0 ? { x: 1600 } : {}}
        // onRow={(record) => ({
        //   onClick: () => onRow(record),
        // })}
      />

      <Modal
        title={`${isEdit ? "Edit" : "Add"}`}
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
          <Form.Item label="Tên doanh nghiệp" name="Tendoanhnghiep">
            <Input
              placeholder="Tên doanh nghiệp"
              onChange={(txt) => onChange("Tendoanhnghiep", txt)}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="Diachi">
            <Input
              placeholder="Địa chỉ"
              onChange={(txt) => onChange("Diachi", txt)}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại doanh nghiệp" name="Sodtdn">
            <Input
              placeholder="Số điện thoại doanh nghiệp"
              onChange={(txt) => onChange("Sodtdn", txt)}
              maxLength={10}
            />
          </Form.Item>
          <Form.Item label="Email doanh nghiệp" name="Email">
            <Input
              placeholder="Email doanh nghiệp"
              onChange={(txt) => onChange("Email", txt)}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại người liên hệ" name="Sodtnguoilh">
            <Input
              placeholder="Số điện thoại người liên hệ"
              onChange={(txt) => onChange("Sodtnguoilh", txt)}
              maxLength={10}
            />
          </Form.Item>
          <Form.Item label="Tên người liên hệ" name="Tennguoilh">
            <Input
              placeholder="Tên người liên hệ"
              onChange={(txt) => onChange("Tennguoilh", txt)}
            />
          </Form.Item>
          <Form.Item label="Số lượng sinh viên thực tập" name="Slsv">
            <Input
              placeholder="Số lượng sinh viên thực tập"
              onChange={(txt) => onChange("Slsv", txt)}
            />
          </Form.Item>
          <Form.Item label="Yêu cầu chuyên môn" name="Ycchuyenmon">
            <Input
              placeholder="Yêu cầu chuyên môn"
              onChange={(txt) => onChange("Ycchuyenmon", txt)}
            />
          </Form.Item>
          <Form.Item label="Trạng thái doanh nghiệp" name="Trangthai">
            <Select
              placeholder="Trạng thái doanh nghiệp"
              onChange={(txt) => onChange("Trangthai", txt)}
            >
              {trangthais.map((tt) => {
                return (
                  <Option key={tt.id} value={tt.id}>
                    {tt.Tentt}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>
              {`${isEdit ? "Update" : "Add"}`}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};
export default observer(Doanhnghiep);
