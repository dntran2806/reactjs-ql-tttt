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
} from "antd";
import { useEffect, useState, useRef, useCallback, React } from "react";
import {
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  OrderedListOutlined,
  HeartFilled,
  HeartOutlined,
  CheckOutlined,
  UploadOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import UserStore from "../../stores/UserStore";
import { Colors, Images } from "../../utils/index";
import { observer } from "mobx-react";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
// import { UploadImages } from "@components";
import { getBase64 } from "../../utils/Common";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import VideoStore from "@stores/VideoStore";
import NamStore from "../../stores/NamStore";
// import AddImageUri from "@components/AddImageUri";
import { toJS } from "mobx";
import {
  DonviModel,
  NganhModel,
  NhomModel,
  NamModel,
  CanboModel,
} from "../../models";
import { async } from "@firebase/util";
import LopStore from "../../stores/LopStore";
import NganhStore from "../../stores/NganhStore";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
import DonviStore from "../../stores/DonviStore";
import NhomStore from "../../stores/NhomStore";
import CanboStore from "../../stores/CanboStore";
import diacritics from "diacritics";

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

const Lop = () => {
  const formRef = useRef(null);
  const lopRef = useRef();
  const location = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const [lopRow, setLopRow] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const history = useHistory();
  const ckediter = useRef(null);
  const [nganhs, setNganhs] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [nhoms, setNhoms] = useState([]);
  const [nams, setNams] = useState([]);
  const [canbos, setCanbos] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const namId = searchParams.get("namid");

  useEffect(() => {
    getDatas();
  }, []);

  const getDatas = async () => {
    await getNganhs();
    await getDonvis();
    await getNhoms();
    await getNams();
    await getCanbos();
    await getLops();
  };

  useEffect(() => {
    console.log("kkkkk isModalOpen isEdit", isModalOpen, isEdit);
    if (isModalOpen && isEdit) {
      formRef.current?.setFieldsValue(lopRow);
    } else {
      formRef.current?.setFieldsValue({
        // Sttlop: "",
        Tenlop: "",
        Nhom: "",
        Donvi: "",
        Nganh: "",
        Nam: "",
        Canbo: "",
      });
    }
  }, [isModalOpen, isEdit, formRef]);

  const getLops = async () => {
    let _queries = [];
    if (namId) {
      _queries = [{ key: "Nam", logic: "==", value: namId }];
    }
    const list = await LopStore.getList(true, _queries);
    console.log("list", list);
    if (list && list.length > 0) {
      // setLopList(list);
    } else {
      // notify.error({
      //   message: `Không có dữ liệu lớp!`,
      //   description: list,
      //   placement: "topRight",
      // });
    }
  };

  const onAdd = () => {
    setIsEdit(false);
    showModal();
    lopRef.current?.clear();
    ckediter.current?.data?.set("");
    setLopRow({
      // Sttlop: "",
      Tenlop: "",
      Nhom: "",
      Donvi: "",
      Nganh: "",
      Nam: "",
      Canbo: "",
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
    setLopRow((prevValues) => ({
      ...prevValues,
      [key]: val,
    }));
  };

  const getNganhs = async () => {
    const rs = await NganhStore.getList();
    console.log("kkkkk get nganhs", rs);
    if (rs) {
      setNganhs(rs);
    }
  };

  const getDonvis = async () => {
    const rs = await DonviStore.getList();
    console.log("kkkkk get don vi", rs);
    if (rs) {
      setDonvis(rs);
    }
  };

  const getNhoms = async () => {
    const rs = await NhomStore.getList();
    console.log("kkkkk getNhom", rs);
    if (rs) {
      setNhoms(rs);
    }
  };

  const getNams = async () => {
    const rs = await NamStore.getList();
    console.log("kkkkk getNams", rs);
    if (rs) {
      setNams(rs);
    }
  };

  const getCanbos = async () => {
    const rs = await CanboStore.getList();
    console.log("kkkkk getCanbo", rs);
    if (rs) {
      setCanbos(rs);
    }
  };

  const onEdit = (id, event) => {
    const _lopList = LopStore.list.find((k) => k.id === id);
    ckediter.current?.data?.set(_lopList.description);
    lopRef.current?.set(_lopList.images);
    setIsModalOpen(true);
    setIsEdit(true);
    setLopRow({ ..._lopList });
    console.log("kkkkk _lopList", toJS(_lopList));
  };

  const onDelete = (id, event) => {
    LopStore.deleteList(id);
    if (id) {
      notify.success({
        message: `Xóa dữ liệu lớp thành công!`,
        placement: "topRight",
      });

      // getData();
    } else {
      notify.error({
        message: `Lỗi xóa dữ liệu lớp!`,
        description: id,
        placement: "topRight",
      });
    }
  };

  const onFinish = async () => {
    console.log("kkkkk lopRow", toJS(lopRow));
    console.log("kkkkk lopRow lop", toJS(lopRow.lop));
    if (isEdit) {
      const _lopList = await LopStore.updateList(lopRow);
      if (_lopList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Cập nhật danh sách lớp thất bại",
          placement: "topRight",
        });
      }
    }
    //   else {
    //     const _bieumau = await FileModel.upload(
    //       lopRow.Bieumau,
    //       FileModel.BIEUMAU_FOLDER
    //     );
    //     console.log("kkkbm", _bieumau);
    //     const _decuong = await FileModel.upload(
    //       lopRow.Decuong,
    //       FileModel.DECUONG_FOLDER
    //     );
    //     console.log("kkkdc", _decuong);
    //     // return;
    //     const _lopList = await NamStore.addList({
    //       ...lopRow,
    //       Bieumau: _bieumau,
    //       Decuong: _decuong,
    //     });
    //     if (_lopList) {
    //       setIsModalOpen(false);
    //     } else {
    //       notify.error({
    //         message: `Lỗi!`,
    //         description: "Thêm danh sách năm thất bại",
    //         placement: "topRight",
    //       });
    //     }
    //   }
    // };

    // const onFileChange = async (key, info) => {
    //   if (info.file.status !== "uploading") {
    //     console.log("kkkonfilechange", info.file, info.fileList);
    //     // const base64 = await getBase64(info.file);
    //     // console.log("kkkbase64", base64);
    //     if (key === "Bieumau") {
    //       setLopRow({ ...lopRow, Bieumau: info.file });
    //     } else {
    //       setLopRow({ ...lopRow, Decuong: info.file });
    //     }
    //   }
    //   if (info.file.status === "done") {
    //     message.success(`${info.file.name} file uploaded successfully`);
    //   } else if (info.file.status === "error") {
    //     message.error(`${info.file.name} file upload failed.`);
    //   }
    // };

    // const onDownloadFile = async (file) => {
    //   const url = await FileModel.getURL(file.fullPath);
    //   if (url) {
    //     FileModel.downloadFile(url);
    //   }
    else {
      const _lopList = await LopStore.addList(lopRow);
      if (_lopList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Thêm danh sách lớp thất bại",
          placement: "topRight",
        });
      }
    }
  };

  // const handleExportToPDF = () => {
  //   const pdf = new jsPDF();
  //   const _columns = [
  //     { title: "Nam", dataKey: "Nam" },
  //     { title: "Tenlop", dataKey: "Tenlop" },
  //     { title: "Nhom", dataKey: "Nhom" },
  //     { title: "Donvi", dataKey: "Donvi" },
  //     { title: "Nganh", dataKey: "Nganh" },
  //     { title: "Canbo", dataKey: "Canbo" },
  //   ];
  //   const _data = LopStore.list.map((l) => {
  //     return {
  //       Nam: nams.find((_) => _.id === l.Nam)?.Nam,
  //       Tenlop: l.Tenlop,
  //       Nhom: nhoms.find((_) => _.id === l.Nhom)?.Nhom,
  //       Donvi: donvis.find((_) => _.id === l.Donvi)?.Tendv,
  //       Nganh: diacritics.remove(
  //         nganhs.find((_) => _.id === l.Nganh)?.Tennganh || ""
  //       ),
  //       Canbo: diacritics.remove(
  //         canbos.find((_) => _.id === l.Canbo)?.Tencb || ""
  //       ),
  //     };
  //   });
  //   console.log("kkkkk _data", _data);
  //   pdf.autoTable({
  //     head: [_columns.map((c) => c.title)],
  //     // body: _data,
  //     body: _data.map((row) => _columns.map((c) => row[c.dataKey])),
  //   });
  //   pdf.save("table.pdf");
  // };

  const onsinhVien = (id) => {
    history.push(`/sinh-vien?lopid=${id}`);
  };

  const COLUMNS = [
    {
      title: "Năm",
      dataIndex: "Nam",
      render: (n) => <span>{nams.find((_) => _.id === n)?.Nam}</span>,
    },
    {
      title: "Tên lớp",
      dataIndex: "Tenlop",
    },
    {
      title: "Nhóm",
      dataIndex: "Nhom",
      render: (nh) => <span>{nhoms.find((_) => _.id === nh)?.Nhom}</span>,
    },
    {
      title: "Dơn vị",
      dataIndex: "Donvi",
      render: (dv) => <span>{donvis.find((_) => _.id === dv)?.Tendv}</span>,
    },
    {
      title: "Ngành",
      dataIndex: "Nganh",
      render: (n) => <span>{nganhs.find((_) => _.id === n)?.Tennganh}</span>,
    },
    {
      title: "Giáo viên cố vấn",
      dataIndex: "Canbo",
      render: (c) => <span>{canbos.find((_) => _.id === c)?.Tencb}</span>,
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
      // width: 50,
      render: (_, data) => {
        let _isEdit = UserStore.userInfo?.role === "admin";
        let _isDel = UserStore.userInfo?.role === "admin";
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
        {/* <Button
          type="primary"
          icon={<ExportOutlined />}
          onClick={handleExportToPDF}
        >
          Export to PDF
        </Button> */}
        {UserStore.userInfo?.role === "admin" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
            style={{ marginLeft: 8 }}
          >
            Add
          </Button>
        )}
      </div>
      <Table
        rowKey="id"
        columns={COLUMNS}
        style={{ marginTop: 8 }}
        dataSource={LopStore.list}
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
          <Form.Item label="Tên lớp" name="Tenlop">
            <Input
              placeholder="Tên lớp"
              onChange={(txt) => onChange("Tenlop", txt)}
            />
          </Form.Item>
          <Form.Item label="Nhóm" name="Nhom">
            <Select
              placeholder="Nhóm"
              onChange={(txt) => onChange("Nhom", txt)}
            >
              {nhoms.map((nh) => {
                return (
                  <Option key={nh.id} value={nh.id}>
                    {nh.Nhom}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Năm" name="Nam">
            <Select placeholder="Năm" onChange={(txt) => onChange("Nam", txt)}>
              {nams.map((n) => {
                return (
                  <Option key={n.id} value={n.id}>
                    {n.Nam}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Đơn vị" name="Donvi">
            <Select
              placeholder="Đơn vị"
              onChange={(txt) => onChange("Donvi", txt)}
            >
              {donvis.map((dv) => {
                return (
                  <Option key={dv.id} value={dv.id}>
                    {dv.Tendv}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Ngành" name="Nganh">
            <Select
              placeholder="Ngành"
              onChange={(txt) => onChange("Nganh", txt)}
            >
              {nganhs.map((n) => {
                return (
                  <Option key={n.id} value={n.id}>
                    {n.Tennganh}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Giáo viên cố vấn" name="Canbo">
            <Select
              placeholder="Giáo viên cố vấn"
              onChange={(txt) => onChange("Canbo", txt)}
            >
              {canbos.map((c) => {
                return (
                  <Option key={c.id} value={c.id}>
                    {c.Tencb}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {/* <Form.Item label="Biểu mẫu" name="Bieumau">
            <Upload
              {...props}
              onChange={(info) => onFileChange("Bieumau", info)}
              beforeUpload={(file) => {
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item> */}

          {/* <Form.Item label="Đề cương" name="Decuong">
            <Upload
              {...props}
              onChange={(info) => onFileChange("Decuong", info)}
              beforeUpload={(file) => {
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item> */}

          {/* <Form.Item label="Biểu mẫu" name="Bieumau">
            <CKEditor
              editor={ClassicEditor}
              data={lopRow.description}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                ckediter.current = editor;
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                onChange("biểu mẫu", data);
                console.log("kkkkk ckediter data", data, editor);
              }}
            />
          </Form.Item> */}
          <Row>
            {/* <AddImageUri
              ref={lopRef}
              onChange={(nams) => onChange("lop", nams)}
            /> */}
          </Row>
          <Row>
            {/* <Col span={8}>
              <Form.Item label="Is active" name="isActive">
                <Switch
                  checked={lopRow.isActive}
                  onChange={(val) => onChange("isActive", val)}
                />
              </Form.Item>
            </Col> */}
            {/* <Col span={8}>
              <Form.Item label="Is favorite" name="isFavorite">
                <Switch
                  checked={lopRow.isFavorite}
                  onChange={(val) => onChange("isFavorite", val)}
                />
              </Form.Item>
            </Col> */}
          </Row>

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
export default observer(Lop);
