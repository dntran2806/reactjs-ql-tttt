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
  Switch,
  Row,
  Col,
  Image,
  Upload,
  message,
  Tag,
  Select,
} from "antd";
import { useEffect, useState, useRef, useCallback, React } from "react";
import {
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
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
import { FileModel, LopModel } from "../../models";
import jsPDF from "jspdf";
import "jspdf-autotable";
import _ from "lodash";
import SinhvienStore from "../../stores/SinhvienStore";
import LopStore from "../../stores/LopStore";
import diacritics from "diacritics";

const { Option } = Select;
const { TextArea } = Input;
const { Text, Link } = Typography;

const Sinhvien = () => {
  const formRef = useRef(null);
  const sinhvienRef = useRef();
  const location = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const [sinhvienList, setSinhvienList] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const [lops, setLops] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const [lopId, setLopId] = useState(searchParams.get("lopid") || "all");
  const [lopIdImport, setLopIdImport] = useState(null);
  const [importData, setImportData] = useState(null);
  const [timelines, setTimelines] = useState([]);

  const getColums = () => {
    return [
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
        title: "Lớp",
        dataIndex: "Lop",
        render: (l) => {
          return <span>{LopStore.list.find((_) => _.id === l)?.Tenlop}</span>;
        },
      },
      {
        title: "Email",
        dataIndex: "Email",
      },
      // {
      //   title: "Điều kiện đi thực tập",
      //   dataIndex: "Dieukien",
      //   render: (val) => {
      //     return (
      //       <Tag color={val === "0" ? "success" : "error"}>
      //         {val === "0" ? "Đủ điều kiện" : "Không đủ điều kiện"}
      //       </Tag>
      //     );
      //   },
      // },
      {
        title: "Updated At",
        dataIndex: "updatedAt",
        // fixed: "right",
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
    getLops();
  }, []);

  useEffect(() => {
    const col = {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, data) => (
        <Space size="middle">
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
      formRef.current?.setFieldsValue(sinhvienList);
    } else {
      formRef.current?.setFieldsValue({
        Massv: "",
        Hoten: "",
        // Gtinh: "",
        Lop: "",
        Email: "",
        // Tengv: "",
        // Sotc: "",
        // Dieukien: "",
      });
    }
  }, [isModalOpen, isEdit, formRef]);

  const getData = async () => {
    let _queries = [];
    // if (lopId) {
    //   _queries = [{ key: "Lop", logic: "==", value: lopId }];
    // }
    const list = await SinhvienStore.getList(true, _queries);
    console.log("list", list);
    if (list && list.length > 0) {
      // setDuans(list);
    } else {
      // notify.error({
      //   message: `Không có dữ liệu sinh viên!`,
      //   description: list,
      //   placement: "topRight",
      // });
    }
  };

  const onAdd = () => {
    setIsEdit(false);
    showModal();
    sinhvienRef.current?.clear();
    setSinhvienList({
      Massv: "",
      Hoten: "",
      // Gtinh: "",
      Lop: "",
      Email: "",
      // Tengv: "",
      // Sotc: "",
      // Dieukien: "",
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
    setSinhvienList((prevValues) => ({
      ...prevValues,
      [key]: val,
    }));
  };

  // const onChangeBtLop = (e) => {
  //   console.log("kkkkk onChangeBtLop", e?.target?.value || e);
  //   let val = e?.target?.value || e;
  //   let _lop = lops.find((_) => _.id === val);
  //   if (_lop) {
  //     setLops(_lop);
  //   }
  // };

  const onEdit = (id, event) => {
    const _sinhvienList = SinhvienStore.list.find((k) => k.id === id);
    sinhvienRef.current?.set(_sinhvienList.images);
    setIsModalOpen(true);
    setIsEdit(true);
    setSinhvienList({ ..._sinhvienList });
    console.log("kkkkk _sinhvienList", toJS(_sinhvienList));
  };

  const onDelete = (id, event) => {
    SinhvienStore.deleteList(id);
    if (id) {
      notify.success({
        message: `Xóa dữ liệu sinh viên thành công!`,
        placement: "topRight",
      });

      // getData();
    } else {
      notify.error({
        message: `Lỗi xóa dữ liệu sinh viên!`,
        description: id,
        placement: "topRight",
      });
    }
  };

  const onFinish = async () => {
    console.log("kkkkk sinhvienList", toJS(sinhvienList));
    console.log("kkkkk sinhvienList lop", toJS(sinhvienList.lop));
    if (isEdit) {
      const _sinhvienList = await SinhvienStore.updateList(sinhvienList);
      if (_sinhvienList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Cập nhật danh sách sinh viên thất bại",
          placement: "topRight",
        });
      }
    } else {
      const _existEmail = await SinhvienStore.getByEmail(sinhvienList.Email);
      if (_existEmail)
        return notify.error({
          message: `Lỗi!`,
          description: "Email đã tồn tại!",
          placement: "topRight",
        });
      const _existMa = await SinhvienStore.getByMa(sinhvienList.Massv);
      if (_existMa)
        return notify.error({
          message: `Lỗi!`,
          description: "Massv đã tồn tại!",
          placement: "topRight",
        });
      const _sinhvienList = await SinhvienStore.addList(sinhvienList);
      if (_sinhvienList) {
        setIsModalOpen(false);
      } else {
        notify.error({
          message: `Lỗi!`,
          description: "Thêm danh sách sinh viên thất bại",
          placement: "topRight",
        });
      }
    }
  };

  const getLops = async () => {
    const rs = await LopStore.getList();
    console.log("kkkkk getLops", rs);
    if (rs) {
      setLops(rs);
    }
  };

  const importDataFromExcel = async () => {
    if (!lopIdImport) {
      notify.error({
        message: `Lỗi!`,
        description: "Vui lòng chọn lớp trước khi import!",
        placement: "topRight",
      });
    } else {
      // import sinhvien
      console.log("kkkkk lopIdImport", lopIdImport);
      console.log("kkkk Importdata", importData);
      if (importData.length > 1 && importData[0].length > 0) {
        for (let index = 1; index < importData.length; index++) {
          const row = importData[index];
          if (row[0] && row[1] && row[2]) {
            setTimelines((prev) => [
              { label: `${row[0]}`, children: "Đang thêm vào..." },
              ...prev,
            ]);
            const _existMa = await SinhvienStore.getByMa(row[0]);
            if (_existMa) {
              updateTimeline(row[0], {
                children: "Thất bại! Massv đã tồn tại!",
                color: "red",
              });
              continue;
            }
            const _existEmail = await SinhvienStore.getByEmail(row[2]);
            if (_existEmail) {
              updateTimeline(row[0], {
                children: "Thất bại! Email đã tồn tại!",
                color: "red",
              });
              continue;
            }
            const _add = await SinhvienStore.addList({
              Massv: row[0],
              Hoten: row[1],
              Email: row[2],
              Lop: lopIdImport,
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
                children: `Thiếu các cột yêu cầu: Massv, Hoten, Email!`,
                color: "red",
              },
              ...prev,
            ]);
          }
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
      "https://docs.google.com/spreadsheets/d/1EZtrRWR4peJ0dcaAuXpR58qhmaPHlybOMZP2XSnYNBU/edit?usp=sharing",
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
          const requireColumns = ["Massv", "Hoten", "Email"];
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

  const handleExportToPDF = () => {
    const pdf = new jsPDF();
    const _columns = [
      { title: "Massv", dataKey: "Massv" },
      { title: "Hoten", dataKey: "Hoten" },
      { title: "Lop", dataKey: "Lop" },
      { title: "Email", dataKey: "Email" },
    ];
    const _svs =
      !lopId || lopId === "all"
        ? SinhvienStore.list
        : SinhvienStore.list.filter((_) => _.Lop === lopId);
    const _data = _svs.map((sv) => {
      return {
        Massv: sv.Massv,
        Hoten: diacritics.remove(sv.Hoten),
        Lop: lops.find((_) => _.id === sv.Lop)?.Tenlop,
        Email: sv.Email,
      };
    });
    console.log("kkkkk _data", _data);
    pdf.autoTable({
      head: [_columns.map((c) => c.title)],
      // body: _data,
      body: _data.map((row) => _columns.map((c) => row[c.dataKey])),
    });
    pdf.save("danh-sach-sinh-vien.pdf");
  };

  const _svs =
    !lopId || lopId === "all"
      ? SinhvienStore.list
      : SinhvienStore.list.filter((_) => _.Lop === lopId);

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            // marginTop: 5,
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
          {/* <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Add
        </Button> */}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: 10,
          }}
        >
          {lops && (
            <Select
              value={lopId}
              style={{
                width: 120,
              }}
              onChange={(txt) => setLopId(txt)}
            >
              <Option key={"all"} value={"all"}>
                {"Tất cả"}
              </Option>
              {lops.map((l) => {
                return (
                  <Option key={l.id} value={l.id}>
                    {l.Tenlop}
                  </Option>
                );
              })}
            </Select>
          )}
        </div>
      </div>
      {/* {SinhvienStore.list?.length > 0 && (

      )} */}
      <Table
        rowKey="id"
        columns={columns}
        style={{ marginTop: 8 }}
        dataSource={_svs}
        scroll={_svs?.length > 0 ? { x: 1600 } : {}}
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
            label="Mã số sinh viên"
            name="Massv"
            rules={[
              {
                required: true,
                message: "Please input title!",
              },
            ]}
          >
            <Input
              placeholder="Mã số sinh viên"
              disabled={isEdit}
              onChange={(txt) => onChange("Massv", txt)}
            />
          </Form.Item>
          <Form.Item label="Họ tên sinh viên" name="Hoten">
            <Input
              placeholder="Họ tên sinh viên"
              onChange={(txt) => onChange("Hoten", txt)}
            />
          </Form.Item>
          <Form.Item label="Lớp" name="Lop">
            <Select placeholder="Lớp" onChange={(txt) => onChange("Lop", txt)}>
              {lops.map((l) => {
                return (
                  <Option key={l.id} value={l.id}>
                    {l.Tenlop}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Email sinh viên"
            name="Email"
            rules={[
              {
                required: true,
                message: "Please input title!",
              },
            ]}
          >
            <Input
              placeholder="Email sinh viên"
              disabled={isEdit}
              onChange={(txt) => onChange("Email", txt)}
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
              disabled={!sinhvienList.Email || !sinhvienList.Massv}
            >
              {`${isEdit ? "Update" : "Add"}`}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        footer={null}
        title={`Import danh sách sinh viên`}
        open={isImportModalOpen}
        closeIcon={
          <div onClick={() => setIsImportModalOpen(false)}>
            <CloseOutlined />
          </div>
        }
      >
        <Select
          value={lopIdImport}
          style={{
            width: 120,
          }}
          onChange={(txt) => setLopIdImport(txt)}
        >
          {lops.map((l) => {
            return (
              <Option key={l.id} value={l.id}>
                {l.Tenlop}
              </Option>
            );
          })}
        </Select>
        <Button
          type="primary"
          style={{ marginLeft: 12 }}
          onClick={importDataFromExcel}
        >
          {`Import ${
            importData?.length > 1
              ? ` (${importData?.length - 1}) sinh viên`
              : ""
          }`}
        </Button>
        <Timeline style={{ marginTop: 12 }} mode={"left"} items={timelines} />
      </Modal>
      {contextHolder}
    </>
  );
};
export default observer(Sinhvien);
