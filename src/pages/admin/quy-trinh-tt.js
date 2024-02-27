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
} from "@ant-design/icons";
import UserStore from "../../stores/UserStore";
import { Colors, Images } from "../../utils/index";
import { observer } from "mobx-react";
import moment from "moment";
import { useHistory } from "react-router-dom";
// import { UploadImages } from "@components";
import { getBase64 } from "../../utils/Common";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toJS } from "mobx";
import QuytrinhttModel from "../../stores/QuytrinhttStore";
import QuytrinhttStore from "../../stores/QuytrinhttStore";

const { Option } = Select;
const { TextArea } = Input;
const { Text, Link } = Typography;
const MAX_IMAGE_SIZE = 100 * 1000;

const Quytrinhtt = () => {
  const formRef = useRef(null);
  const [isEdit, setIsEdit] = useState(false);
  const [quytrinh, setQuytrinh] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const history = useHistory();
  const ckediter = useRef(null);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("kkkkk isModalOpen isEdit", isModalOpen, isEdit);
    if (isModalOpen && isEdit) {
      formRef.current?.setFieldsValue(quytrinh);
    } else {
      formRef.current?.setFieldsValue({
        Maqt: "",
        Tieude: "",
        Noidung: "",
      });
    }
  }, [isModalOpen, isEdit, formRef]);

  const getData = async () => {
    const list = await QuytrinhttStore.getList();
    console.log("QuytrinhttStore getList", list);
    if (list && list.length > 0) {
      // setQuytrinh(list[0]);
    }
  };

  const onAdd = () => {
    setIsEdit(false);
    showModal();
    ckediter.current?.data?.set("");
    setQuytrinh({
      Maqt: "",
      Tieude: "",
      Noidung: "",
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const onChange = async (key, e) => {
    let val = e?.target?.value || e;
    console.log("kkkkk onChange", val);
    setQuytrinh((prevValues) => ({
      ...prevValues,
      [key]: val,
    }));
  };

  const onEdit = (id, event) => {
    const _quytrinh = QuytrinhttStore.list[0] || quytrinh;
    ckediter.current?.data?.set(_quytrinh.Noidung);
    setIsModalOpen(true);
    setIsEdit(true);
    setQuytrinh({ ..._quytrinh });
    console.log("kkkkk onEdit quytrinh", toJS(_quytrinh));
  };

  const onFinish = async () => {
    console.log("kkkkk quytrinhList", toJS(quytrinh));
    // console.log("kkkkk quytrinhList lop", toJS(quytrinhList.lop));
    if (quytrinh.id) {
      const _quytrinhList = await QuytrinhttStore.updateList(quytrinh);
      if (_quytrinhList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Cập nhật quy trình thất bại",
          placement: "topRight",
        });
      }
    } else {
      const _quytrinhList = await QuytrinhttStore.addList(quytrinh);
      if (_quytrinhList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Thêm quy trình thất bại",
          placement: "topRight",
        });
      }
    }
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
        {UserStore.userInfo?.role === "admin" && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={onEdit}
            style={{ marginLeft: 8 }}
          >
            Update
          </Button>
        )}
      </div>

      {QuytrinhttStore.list?.length > 0 && (
        <>
          <h3>{QuytrinhttStore.list[0].Tieude}</h3>

          <div
            dangerouslySetInnerHTML={{
              __html: QuytrinhttStore.list[0].Noidung,
            }}
            style={{ flex: 1, textAlign: "left" }}
          />
        </>
      )}

      <Modal
        title={`Cập nhật quy trình`}
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
          <Form.Item label="Tiêu đề" name="Tieude">
            <Input
              placeholder="Tiêu đề"
              onChange={(txt) => onChange("Tieude", txt)}
            />
          </Form.Item>
          <Form.Item label="Nội dung" name="Noidung">
            <CKEditor
              editor={ClassicEditor}
              data={quytrinh.Noidung}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                ckediter.current = editor;
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                onChange("Noidung", data);
                console.log("kkkkk ckediter data", data, editor);
              }}
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
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};
export default observer(Quytrinhtt);
