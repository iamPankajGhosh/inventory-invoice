import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table } from "antd";
const CutomerPage = () => {
  const [billsData, setBillsData] = useState([]);
  const dispatch = useDispatch();
  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/bills/get-bills`
      );
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {
    getAllBills();
    //eslint-disable-next-line
  }, []);

  const columns = [
    { title: "ID ", dataIndex: "_id" },
    {
      title: "Cutomer Name",
      dataIndex: "_id",
      render: (id, record) => (
        <b className="text-capitalize">{record.customerName}</b>
      ),
    },
    { title: "Contact No", dataIndex: "customerNumber" },
  ];

  return (
    <DefaultLayout>
      <h1>Cutomers</h1>
      <Table
        columns={columns}
        dataSource={billsData}
        bordered
        pagination={false}
      />
    </DefaultLayout>
  );
};

export default CutomerPage;
