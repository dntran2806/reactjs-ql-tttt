/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useEffect, useState } from "react";
import { Row, Select, Modal, Spin } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import NamStore from "../../stores/NamStore";
import LopStore from "../../stores/LopStore";
import SinhvienStore from "../../stores/SinhvienStore";
import DangkyStore from "../../stores/DangkyStore";
import _ from "lodash";

const { Option } = Select;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const TITLE = "Thống kê tình hình đăng ký thực tập theo năm";

const OPTION = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: TITLE,
    },
  },
};

const Baocao = () => {
  const [reports, setReports] = useState({});
  const [options, setOptions] = useState(OPTION);
  const [loading, setLoading] = useState(false);

  const getData = (rp) => {
    return {
      labels: rp.lops.map((l) => l.Tenlop),
      datasets: [
        {
          label: "Chưa đăng ký",
          data: rp.lops.map((l) => l.allSV.length - l.dangkys?.length),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Đã đăng ký",
          data: rp.lops.map((l) => l.dangkys?.length),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
  };

  const [data, setData] = useState(null);
  const [nams, setNams] = useState([]);
  const [nam, setNam] = useState({});

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    //get năm
    const _nams = await NamStore.getList();
    const _nam = _nams?.[0];
    console.log("kkkkk nams", _nams);
    reportByNam(_nam?.id);
    setNams(_nams);
    setNam(_nam);
    OPTION.plugins.title.text = `${TITLE} ${_nam?.Nam}`;
    setOptions(OPTION);
  };

  const onChange = (e) => {
    console.log("kkkkk onChange baocao", e?.target?.value || e);
    let val = e?.target?.value || e;
    let _nam = nams.find((_) => _.id === val);
    if (_nam) {
      setNam(_nam);
      OPTION.plugins.title.text = `${TITLE} ${_nam?.Nam}`;
      console.log("kkkk _nam", _nam);
      setOptions(OPTION);
      reportByNam(_nam.id);
    }
  };

  //báo cáo theo năm
  const reportByNam = async (namId) => {
    try {
      if (!namId) return;
      setLoading(true);
      let report = { lops: [] };
      if (reports[namId]) {
        report = reports[namId];
      } else {
        //get lớp theo năm
        const lops = await LopStore.getList(true, [
          { key: "Nam", logic: "==", value: namId },
        ]);
        console.log("kkkkk lops", lops);
        if (lops?.length > 0) {
          for (let index = 0; index < lops.length; index++) {
            const _lop = lops[index];
            console.log("kkkkk _lop", _lop.Tenlop, _lop);
            //get all sv theo lớp
            const allSV = await SinhvienStore.getList(true, [
              { key: "Lop", logic: "==", value: _lop.id },
            ]);
            console.log("kkkkk allSV", _lop.Tenlop, allSV);
            //get đăng ký theo lớp => đã đăng ký
            let _dangkys = [];
            if (allSV.length > 0) {
              if (allSV.length > 30) {
                const childSVs = _.chunk(allSV, 30);
                for (let index = 0; index < childSVs.length; index++) {
                  const childArr = childSVs[index];
                  console.log(
                    "kkkkk allSV.length > 30",
                    index,
                    childArr.map((k) => k.id)
                  );
                  const _dks = await DangkyStore.getList(true, [
                    {
                      key: "Sinhvien",
                      logic: "in",
                      value: childArr.map((k) => k.id),
                    },
                  ]);
                  _dangkys = [..._dangkys, ..._dks];
                }
              } else {
                _dangkys = await DangkyStore.getList(true, [
                  {
                    key: "Sinhvien",
                    logic: "in",
                    value: allSV.map((k) => k.id),
                  },
                ]);
              }
            }
            console.log("kkkkk _dangkys", _lop.Tenlop, _dangkys);
            //chưa đăng ký = all sv - đã đăng ký
            report.lops.push({
              ..._lop,
              allSV,
              dangkys: _dangkys,
            });
          }
        }
      }

      console.log("kkkkk report", report);
      setReports({ ...reports, [namId]: report });
      setData(getData(report));
      setLoading(false);
    } catch (error) {
      console.log("kkkkk reportByNam error", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: 10,
        }}
      >
        {nams && (
          <Select
            value={nam?.id}
            style={{
              width: 120,
            }}
            onChange={(txt) => onChange(txt)}
          >
            {nams.map((n) => {
              return (
                <Option key={n.id} value={n.id}>
                  {n.Nam}
                </Option>
              );
            })}
          </Select>
        )}
      </div>
      <Row style={{ height: 500 }}>
        {data && (
          <Bar
            options={options}
            data={data}
            style={{ backgroundColor: "white" }}
          />
        )}
      </Row>
      <Modal
        open={loading}
        footer={null}
        closable={false}
        centered
        modalRender={() => (
          <Row
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                backgroundColor: "rgba(255,255,255, 0.5)",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin size="large" />
              <span style={{ marginTop: 8 }}>Loading...</span>
            </div>
          </Row>
        )}
      ></Modal>
    </>
  );
};

export default Baocao;
