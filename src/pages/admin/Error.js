import { Result, Button } from "antd";
import { Route, Switch, HashRouter, useHistory } from "react-router-dom";

const Error = () => {
  const history = useHistory();

  const goBack = () => {
    history.replace("/quy-trinh-tt");
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Bạn không có quyền truy cập trang này."
      extra={
        <Button onClick={goBack} type="primary">
          Go home
        </Button>
      }
    />
  );
};

export default Error;
