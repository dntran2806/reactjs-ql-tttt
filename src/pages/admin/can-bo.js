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
  Timeline,
  Select,
  Upload,
} from "antd";
import { useEffect, useState, useRef, useCallback, React } from "react";
import {
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import UserStore from "../../stores/UserStore";
import { Colors, Images } from "../../utils/index";
import { observer } from "mobx-react";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { toJS } from "mobx";
import CanboStore from "../../stores/CanboStore";
import jsPDF from "jspdf";
import _ from "lodash";
import "jspdf-autotable";

const { Option } = Select;
const { TextArea } = Input;
const { Text, Link } = Typography;
const ROLES = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "gv",
    label: "Giáo viên",
  },
];

const Canbo = () => {
  const formRef = useRef(null);
  const lopRef = useRef();
  const location = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const [canboList, setCanboList] = useState({
    isActive: true,
    isFavorite: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const history = useHistory();
  const ckediter = useRef(null);
  const [importData, setImportData] = useState(null);
  const [timelines, setTimelines] = useState([]);

  const getColums = () => {
    return [
      {
        title: "Mã cán bộ",
        dataIndex: "Macb",
      },
      {
        title: "Tên cán bộ",
        dataIndex: "Tencb",
      },
      {
        title: "Email",
        dataIndex: "Email",
      },
      {
        title: "Vai trò",
        dataIndex: "Vaitro",
        render: (vt) => <span>{ROLES.find((_) => _.value === vt)?.label}</span>,
      },
      {
        title: "Updated At",
        dataIndex: "updatedAt",
        // width: 120,
        render: (val) => (
          <Text>{moment(val?.toDate?.()).format("DD-MM-YYYY")}</Text>
        ),
      },
    ];
  };

  const [columns, setColumns] = useState(getColums());

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const col = {
      title: "Action",
      // width: 50,
      render: (_, data) => (
        <Space size="middle">
          {/* <a
            onClick={() => onsinhVien(data.id)}
            style={{ color: Colors.orange }}
          >
            Sinh viên
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
    console.log("kkkkk isModalOpen isEdit", isModalOpen, isEdit);
    if (isModalOpen && isEdit) {
      formRef.current?.setFieldsValue(canboList);
    } else {
      formRef.current?.setFieldsValue({
        Macb: "",
        Tencb: "",
        Email: "",
        Lop: "",
        Vaitro: "",
      });
    }
  }, [isModalOpen, isEdit, formRef]);

  const getData = async () => {
    // let _queries = [];
    // if (namId) {
    //   _queries = [{ key: "Nam", logic: "==", value: namId }];
    // }
    const list = await CanboStore.getList();
    console.log("list", list);
    if (list && list.length > 0) {
      // setDuans(list);
    } else {
      // notify.error({
      //   message: `Không có dữ liệu cán bộ!`,
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
    setCanboList({
      Macb: "",
      Tencb: "",
      Email: "",
      Lop: "",
      Vaitro: "",
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
    setCanboList((prevValues) => ({
      ...prevValues,
      [key]: val,
    }));
  };

  const onEdit = (id, event) => {
    const _list = CanboStore.list.find((k) => k.id === id);
    ckediter.current?.data?.set(_list.description);
    lopRef.current?.set(_list.images);
    setIsModalOpen(true);
    setIsEdit(true);
    setCanboList({ ..._list });
    console.log("kkkkk _list", toJS(_list));
  };

  const onDelete = (id, event) => {
    CanboStore.deleteList(id);
    if (id) {
      notify.success({
        message: `Xóa dữ liệu cán bộ thành công!`,
        placement: "topRight",
      });

      // getData();
    } else {
      notify.error({
        message: `Lỗi xóa dữ liệu cán bộ!`,
        description: id,
        placement: "topRight",
      });
    }
  };

  const onFinish = async () => {
    console.log("kkkkk canboList", toJS(canboList));
    console.log("kkkkk canboList lop", toJS(canboList.lop));
    if (isEdit) {
      const _list = await CanboStore.updateList(canboList);
      // const _user = await UserStore.getByEmail(canboList.Email);
      // if (_user) {
      //   await UserStore.update({ ..._user, role: canboList.Vaitro });
      // }
      if (_list) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Cập nhật danh sách cán bộ thất bại",
          placement: "topRight",
        });
      }
    } else {
      const _existEmail = await CanboStore.getByEmail(canboList.Email);
      if (_existEmail)
        return notify.error({
          message: `Lỗi!`,
          description: "Email đã tồn tại!",
          placement: "topRight",
        });
      const _existMa = await CanboStore.getByMa(canboList.Macb);
      if (_existMa)
        return notify.error({
          message: `Lỗi!`,
          description: "MaCB đã tồn tại!",
          placement: "topRight",
        });
      const _list = await CanboStore.addList(canboList);
      if (_list) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Thêm danh sách cán bộ thất bại",
          placement: "topRight",
        });
      }
    }
  };

  const importDataFromExcel = async () => {
    if (importData.length > 1 && importData[0].length > 0) {
      for (let index = 1; index < importData.length; index++) {
        const row = importData[index];
        if (row[0] && row[1] && row[2]) {
          setTimelines((prev) => [
            { label: `${row[0]}`, children: "Đang thêm vào..." },
            ...prev,
          ]);
          const _existMa = await CanboStore.getByMa(row[0]);
          if (_existMa) {
            updateTimeline(row[0], {
              children: "Thất bại! Macb đã tồn tại!",
              color: "red",
            });
            continue;
          }
          const _existEmail = await CanboStore.getByEmail(row[2]);
          if (_existEmail) {
            updateTimeline(row[0], {
              children: "Thất bại! Email đã tồn tại!",
              color: "red",
            });
            continue;
          }
          const _add = await CanboStore.addList({
            Macb: row[0],
            Tencb: row[1],
            Email: row[2],
            Vaitro: "gv",
          });
          if (_add) {
            updateTimeline(row[0], {
              children: "Đã thêm!",
              color: "green",
            });
          } else {
            updateTimeline(row[0], {
              children: "Lỗi trong quá trình thêm dữ liệu!",
              color: "red",
            });
          }
        } else {
          setTimelines((prev) => [
            {
              label: `${row[0] || row[1] || row[2]}`,
              children: `Thiếu các cột yêu cầu: Macb, Tencb, Email!`,
              color: "red",
            },
            ...prev,
          ]);
        }
      }
    }
  };

  const updateTimeline = (key, data) => {
    setTimelines((prev) =>
      prev.map((k) => {
        if (k.label === key) {
          return { ...k, ...data };
        }
        return k;
      })
    );
  };

  const handleDownloadFileExcel = () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1Du_Drw8PcA7n86kidXsa2fi8DhBCIFEz3ITTjjIfMyA/edit?usp=sharing",
      "_blank"
    );
  };

  const handleReadFileExcel = (e) => {
    setTimelines([]);
    try {
      const file = e.file;

      if (file) {
        if (!file.name?.includes(".xlsx")) {
          return notify.error({
            message: `Lỗi!`,
            description: "Vui lòng chọn file excel (.xlsx)!",
            placement: "topRight",
          });
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: "binary" });

          // Assuming there's only one sheet in the workbook
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Parse sheet data to JSON
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          console.log("kkkkk handleImportFromExcel jsonData", jsonData);
          const requireColumns = ["Macb", "Tencb", "Email"];
          const difference = _.difference(requireColumns, jsonData[0]);
          if (difference.length === 0) {
            setIsImportModalOpen(true);
            setImportData(jsonData.filter((_) => _.length > 0));
          } else {
            return notify.error({
              message: `Lỗi!`,
              description: `File excel không đúng cấu trúc! Yêu cầu các cột: ${requireColumns.join(
                ", "
              )}.`,
              placement: "topRight",
            });
          }
        };

        reader.readAsBinaryString(file);
      }
    } catch (error) {
      notify.error({
        message: `Lỗi!`,
        description: "Import thất bại!",
        placement: "topRight",
      });
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
            onClick={handleDownloadFileExcel}
            type="primary"
            icon={<EyeOutlined />}
            style={{ marginLeft: 8 }}
          >
            Xem file mẫu
          </Button>
        )}
        {UserStore.userInfo?.role === "admin" && (
          <Upload
            onChange={handleReadFileExcel}
            maxCount={1}
            beforeUpload={(file) => {
              return false;
            }}
            showUploadList={false}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              style={{ marginLeft: 8 }}
            >
              Import from excel
            </Button>
          </Upload>
        )}
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
        columns={columns}
        style={{ marginTop: 8 }}
        dataSource={CanboStore.list}
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
            label="Mã cán bộ"
            name="Macb"
            rules={[
              {
                required: true,
                message: "Please input title!",
              },
            ]}
          >
            <Input
              placeholder="Mã cán bộ"
              disabled={isEdit}
              onChange={(txt) => onChange("Macb", txt)}
            />
          </Form.Item>
          <Form.Item label="Tên cán bộ" name="Tencb">
            <Input
              placeholder="Tên cán bộ"
              onChange={(txt) => onChange("Tencb", txt)}
            />
          </Form.Item>
          <Form.Item
            label="Email cán bộ"
            name="Email"
            rules={[
              {
                required: true,
                message: "Please input title!",
              },
            ]}
          >
            <Input
              placeholder="Email cán bộ"
              disabled={isEdit}
              onChange={(txt) => onChange("Email", txt)}
            />
          </Form.Item>
          <Form.Item label="Vai trò" name="Vaitro">
            <Select
              defaultValue="gv"
              style={{
                width: 120,
              }}
              onChange={(txt) => onChange("Vaitro", txt)}
              options={ROLES}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: 12 }}
              disabled={!canboList.Email || !canboList.Macb}
            >
              {`${isEdit ? "Update" : "Add"}`}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        footer={null}
        title={`Import danh sách cán bộ`}
        open={isImportModalOpen}
        closeIcon={
          <div onClick={() => setIsImportModalOpen(false)}>
            <CloseOutlined />
          </div>
        }
      >
        <Button type="primary" onClick={importDataFromExcel}>
          {`Import ${
            importData?.length > 1 ? ` (${importData?.length - 1}) cán bộ` : ""
          }`}
        </Button>
        <Timeline style={{ marginTop: 12 }} mode={"left"} items={timelines} />
      </Modal>
      {contextHolder}
    </>
  );
};
export default observer(Canbo);
