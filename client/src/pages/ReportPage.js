import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table } from "antd";
const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const dispatch = useDispatch();
  const getAllReport = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/profit-reports/all`
      );
      setReportData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {
    getAllReport();
    //eslint-disable-next-line
  }, []);

  const columns = [
    {
      title: "Month",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="text-capitalize">{record.month}</div>
      ),
    },
    { title: "Year", dataIndex: "year" },
    {
      title: "Expenses",
      dataIndex: "expenses",
    },
    { title: "Revenue", dataIndex: "revenue" },
    {
      title: "Profit",
      dataIndex: "_id",
      render: (id, record) => <div>{record.profit.toFixed(2)}</div>,
    },
  ];

  return (
    <DefaultLayout>
      <div className="report-header">
        <h1>Reports</h1>
      </div>
      <Table
        columns={columns}
        dataSource={reportData}
        bordered
        pagination={false}
      />
    </DefaultLayout>
  );
};

export default ReportPage;
