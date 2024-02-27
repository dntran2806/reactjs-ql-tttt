import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

const Appdate = ({ finish }) => {
  const onChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  
  const onOk = (value) => {
    console.log("onOk: ", value);
    finish?.(value);
  };

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        showTime={{
          format: "HH:mm",
        }}
        format="YYYY-MM-DD HH:mm"
        onChange={onChange}
        onOk={onOk}
      />
    </Space>
  );
};
export default Appdate;
