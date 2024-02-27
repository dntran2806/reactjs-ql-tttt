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
import NamStore from "../../stores/NamStore";
// import AddImageUri from "@components/AddImageUri";
import { toJS } from "mobx";
import { FileModel } from "../../models";
import { async } from "@firebase/util";

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

const Nam = () => {
  const formRef = useRef(null);
  const namRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [namList, setNamList] = useState({
    isActive: true,
    isFavorite: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const history = useHistory();
  const ckediter = useRef(null);

  const [dcFile, setDcFile] = useState([]);
  const [bmFile, setBmFile] = useState([]);

  const handleDCChange = ({ fileList: newFileList }) => setDcFile(newFileList);
  const handleBMChange = ({ fileList: newFileList }) => setBmFile(newFileList);

  const getColums = () => {
    return [
      {
        title: "Năm",
        dataIndex: "Nam",
      },
      {
        title: "Khóa học",
        dataIndex: "Khoahoc",
      },
      {
        title: "Biểu mẫu",
        dataIndex: "Bieumau",
        render: (val) => (
          <a onClick={() => onDownloadFile(val)}>{val?.oname}</a>
        ),
      },
      {
        title: "Đề cương",
        dataIndex: "Decuong",
        render: (val) => (
          <a onClick={() => onDownloadFile(val)}>{val?.oname}</a>
        ),
      },
      {
        title: "Updated At",
        dataIndex: "updatedAt",
        render: (val) => (
          <Text>{moment(val?.toDate?.()).format("DD-MM-YYYY")}</Text>
        ),
      },
    ];
  };

  const [columns, setColumns] = useState(getColums());

  useEffect(() => {
    const col = {
      title: "Action",
      render: (_, data) => (
        <Space size="middle">
          {/* <a onClick={() => onlop(data.id)} style={{ color: Colors.orange }}>
            Lớp
          </a> */}
          <EditOutlined
            onClick={() => onEdit(data.id)}
            style={{ color: Colors.green }}
          />
          <Popconfirm
            title="Chắc chắn xóa?"
            onConfirm={() => onDelete(data.id)}
          >
            <DeleteOutlined style={{ color: Colors.red }} />
          </Popconfirm>
        </Space>
      ),
    };
    if (UserStore.userInfo?.role === "admin") {
      const _action = columns.find((c) => c.title === "Action");
      if (!_action) {
        const data = [...getColums(), col];
        setColumns(data);
        console.log("kkkk col", data);
      }
    }
    console.log("kkkk user", UserStore.userInfo);
  }, [UserStore.userInfo]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("kkkkk isModalOpen isEdit", isModalOpen, isEdit);
    if (isModalOpen && isEdit) {
      formRef.current?.setFieldsValue(namList);
    } else {
      formRef.current?.setFieldsValue({
        Nam: "",
        Khoahoc: "",
        Bieumau: "",
        Decuong: "",
      });
    }
  }, [isModalOpen, isEdit, formRef]);

  const getData = async () => {
    const list = await NamStore.getList();
    console.log("list", list);
    if (list && list.length > 0) {
      // setDuans(list);
    } else {
      // notify.error({
      //   message: `Không có dữ liệu năm!`,
      //   description: list,
      //   placement: "topRight",
      // });
    }
  };

  const onAdd = () => {
    setIsEdit(false);
    showModal();
    setDcFile([]);
    setBmFile([]);
    ckediter.current?.data?.set("");
    setNamList({
      Nam: "",
      Khoahoc: "",
      Bieumau: "",
      Decuong: "",
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const onChange = (key, e) => {
    console.log("kkkkk ", key, e?.target?.value || e);
    let val = e?.target?.value || e;
    setNamList((prevValues) => ({
      ...prevValues,
      [key]: val,
    }));
  };

  const onEdit = (id, event) => {
    const _namList = NamStore.list.find((k) => k.id === id);
    ckediter.current?.data?.set(_namList.description);
    namRef.current?.set(_namList.images);
    setIsModalOpen(true);
    setIsEdit(true);
    setNamList({ ..._namList });
    setDcFile([]);
    setBmFile([]);
    console.log("kkkkk _namList", toJS(_namList));
  };

  const onDelete = async (id, event) => {
    const _id = await NamStore.deleteList(id);
    if (_id) {
      notify.success({
        message: `Xóa dữ liệu năm thành công!`,
        placement: "topRight",
      });
      // getData();
    } else {
      notify.error({
        message: `Lỗi xóa dữ liệu năm!`,
        placement: "topRight",
      });
    }
  };

  const onFinish = async () => {
    console.log("kkkkk namList, bmFile, dcFile", toJS(namList), bmFile, dcFile);
    const _bieumau = await FileModel.upload(
      bmFile?.[0]?.originFileObj,
      FileModel.BIEUMAU_FOLDER
    );
    console.log("kkkbm", _bieumau);
    const _decuong = await FileModel.upload(
      dcFile?.[0]?.originFileObj,
      FileModel.DECUONG_FOLDER
    );
    console.log("kkkdc", _decuong);
    if (isEdit) {
      const _data = { ...namList };
      if (_bieumau) {
        await FileModel.delete(_data.Bieumau?.name, FileModel.BIEUMAU_FOLDER);
        _data.Bieumau = _bieumau;
      } else {
        delete _data.Bieumau;
      }
      if (_decuong) {
        await FileModel.delete(_data.Decuong?.name, FileModel.DECUONG_FOLDER);
        _data.Decuong = _decuong;
      } else {
        delete _data.Decuong;
      }
      const _namList = await NamStore.updateList(_data);
      if (_namList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Cập nhật danh sách năm thất bại",
          placement: "topRight",
        });
      }
    } else {
      // return;
      const _namList = await NamStore.addList({
        ...namList,
        Bieumau: _bieumau,
        Decuong: _decuong,
      });
      if (_namList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Thêm danh sách năm thất bại",
          placement: "topRight",
        });
      }
    }
  };

  const onFileChange = async (key, info) => {
    if (info.file.status !== "uploading") {
      console.log("kkkonfilechange", info.file, info.fileList);
      // const base64 = await getBase64(info.file);
      // console.log("kkkbase64", base64);
      if (key === "Bieumau") {
        setNamList({ ...namList, Bieumau: info.file });
      } else {
        setNamList({ ...namList, Decuong: info.file });
      }
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const onDownloadFile = async (file) => {
    const url = await FileModel.getURL(file.fullPath);
    if (url) {
      FileModel.downloadFile(url);
    }
  };

  const onlop = (id) => {
    history.push(`/lop?namid=${id}`);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 5,
        }}
      >
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
        columns={columns}
        style={{ marginTop: 8 }}
        dataSource={NamStore.list}
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
          <Form.Item
            label="Năm"
            name="Nam"
            // rules={[
            //   {
            //     required: true,
            //     message: "Please input title!",
            //   },
            // ]}
          >
            <Input placeholder="Năm" onChange={(txt) => onChange("Nam", txt)} />
          </Form.Item>
          <Form.Item
            label="Khóa học"
            name="Khoahoc"
            // rules={[
            //   {
            //     required: true,
            //     message: "Please input title!",
            //   },
            // ]}
          >
            <Input
              placeholder="Khóa học"
              onChange={(txt) => onChange("Khoahoc", txt)}
            />
          </Form.Item>
          <Form.Item label="Biểu mẫu" name="Bieumau">
            <Upload
              {...props}
              maxCount={1}
              fileList={bmFile}
              onChange={handleBMChange}
              beforeUpload={(file) => {
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Đề cương" name="Decuong">
            <Upload
              {...props}
              maxCount={1}
              fileList={dcFile}
              onChange={handleDCChange}
              beforeUpload={(file) => {
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          {/* <Form.Item label="Biểu mẫu" name="Bieumau">
            <CKEditor
              editor={ClassicEditor}
              data={namList.description}
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
              ref={namRef}
              onChange={(nams) => onChange("nam", nams)}
            /> */}
          </Row>
          <Row>
            {/* <Col span={8}>
              <Form.Item label="Is active" name="isActive">
                <Switch
                  checked={namList.isActive}
                  onChange={(val) => onChange("isActive", val)}
                />
              </Form.Item>
            </Col> */}
            {/* <Col span={8}>
              <Form.Item label="Is favorite" name="isFavorite">
                <Switch
                  checked={namList.isFavorite}
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
export default observer(Nam);
