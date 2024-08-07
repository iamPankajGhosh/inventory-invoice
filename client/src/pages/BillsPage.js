import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { toWords } from "number-to-words";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Button, Table, message, Select, Form } from "antd";
import BillLogo from "../assets/bill-logo.png";
import "../styles/InvoiceStyles.css";
import {
  FaDownload,
  FaEye,
  FaFileLines,
  FaFilter,
  FaMagnifyingGlass,
  FaTrashCan,
} from "react-icons/fa6";

const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [tempData, setTempData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    if (searchValue === "") {
      setBillsData(tempData);
    }
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let i = currentYear; i <= currentYear + 16; i++) {
      yearsArray.push(i);
    }
    setYears(yearsArray);
  };

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/bills/get-bills`
      );
      setBillsData(data);
      setTempData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  const handleSearch = (value) => {
    const filteredItems = tempData.filter((item) =>
      item.invoiceNumber.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredItems.length > 0) {
      setBillsData(filteredItems);
    } else {
      message.error("No items found for the given invoice number.");
      setBillsData(tempData);
    }
  };

  //delete bills
  const handleDelete = async (id) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/bills/delete-bills`,
        {
          id,
        }
      );
      getAllBills();
      message.success("Bill Deleted Succesfully");
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  const handleFilter = () => {
    if ([selectedMonth, selectedYear].some((item) => item === "")) {
      return message.error("Please select both month and year");
    }

    const filterData = tempData.filter(
      (item) =>
        item.createdAt.toString().substring(0, 4) === selectedYear.toString() &&
        item.createdAt
          .toString()
          .substring(5, 7)
          .includes(selectedMonth.toString())
    );

    if (filterData.length === 0) {
      return message.error("No data found for the given filter");
    }

    setBillsData(filterData);
  };

  //useEffect
  useEffect(() => {
    getAllBills();
    getYears();
  }, []);
  //print function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //able data
  const columns = [
    { title: "Bill Number", dataIndex: "invoiceNumber" },
    {
      title: "Date",
      dataIndex: "_id",
      render: (id, record) => (
        <div>{record.createdAt.toString().substring(0, 10)}</div>
      ),
    },
    {
      title: "Cutomer Name",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="text-capitalize">{record.customerName}</div>
      ),
    },
    { title: "Contact No", dataIndex: "customerNumber" },
    // { title: "Subtotal (Rs.)", dataIndex: "subTotal" },
    // { title: "GST (Rs.)", dataIndex: "tax" },
    { title: "Total Amount (Rs.)", dataIndex: "totalAmount" },

    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="action-btn-grp">
          <button
            className="action-btn"
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          >
            <FaEye size={20} />
          </button>
          {/* <button className="action-btn" onClick={() => {}}>
            <FaDownload size={20} />
          </button> */}
          <button
            className="action-btn"
            onClick={() => {
              console.log(record._id);
              handleDelete(record._id);
            }}
          >
            <FaTrashCan size={20} />
          </button>
        </div>
      ),
    },
  ];
  // console.log(selectedBill);
  return (
    <DefaultLayout>
      <div className="header">
        {/* Header */}
        <h2>Bills</h2>

        <button
          className="add-category"
          onClick={() => {
            setSearchValue("");
            setBillsData(tempData);
          }}
        >
          <FaFileLines size={15} />
          <span>All Bills</span>
        </button>

        {/* Search Bar */}
        <div className="searchbar">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value.trim())}
            placeholder="Bill no."
            className="search-field"
          />
          <button
            className="search-btn"
            onClick={() => handleSearch(searchValue)}
          >
            <FaMagnifyingGlass size={20} />
          </button>
        </div>

        {/* Filter by Brand and Category */}
        <div className="filter">
          <Form layout="vertical" onFinish={handleFilter}>
            <Form.Item name="category" style={{ margin: 0 }}>
              <Select
                placeholder={months[0]}
                style={{ width: 150 }}
                onChange={(value) => setSelectedMonth(value)}
              >
                {months.map((m, i) => (
                  <Select.Option key={m} value={i + 1}>
                    {m}
                  </Select.Option>
                ))}
              </Select>
              <span className="p-2 text-white">-</span>
              <Select
                placeholder={years[0]}
                style={{ width: 100 }}
                onChange={(value) => setSelectedYear(value)}
              >
                {years.map((y) => (
                  <Select.Option key={y} value={y}>
                    {y}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button htmlType="submit" type="primary" className="filter-btn">
              <FaFilter size={15} />
              <span>Filter</span>
            </Button>
          </Form>
        </div>
      </div>

      <Table columns={columns} dataSource={billsData} bordered />

      {popupModal && (
        <>
          <div className="overlay" onClick={() => setPopupModal(false)} />

          <div className={`bill-popup ${popupModal && "active"}`}>
            <div className="bill">
              <h2>Bill Details</h2>
              <div className="content" ref={componentRef}>
                <div className="content-head-top">
                  <p>
                    <span style={{ color: "#000000", marginRight: "10px" }}>
                      Bill No :{" "}
                    </span>
                    {selectedBill?.invoiceNumber}
                  </p>
                  <p>
                    <span style={{ color: "#000000", marginRight: "10px" }}>
                      Data :{" "}
                    </span>
                    {selectedBill?.createdAt?.toString().substring(0, 10)}
                  </p>
                </div>
                <div className="content-head">
                  <h1 className="title">MALLICK MUSICAL CO.</h1>
                  <p className="sub-title">
                    Seller & Repairer of Musical Instruments
                  </p>
                  <p className="address">
                    38 Gariahat Road (S) Dhakuria Kolkata-700031
                  </p>
                  <p className="contact">
                    Call : 9874314690 | Email: mallickmusical110&gmail.com
                  </p>
                </div>
                <div className="customer-details">
                  <p>
                    <span style={{ color: "#000000", marginRight: "10px" }}>
                      Customer Name :{" "}
                    </span>
                    {selectedBill?.customerName}
                  </p>
                  <p>
                    <span style={{ color: "#000000", marginRight: "10px" }}>
                      Customer Number :{" "}
                    </span>
                    {selectedBill?.customerNumber}
                  </p>
                </div>
                <div className="invoice-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Serial No.</th>
                        <th>Item Description</th>
                        <th>Quantity</th>
                        <th>Price (Rs.)</th>
                        <th>Amount (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill?.billItems?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.billQuantity}</td>
                          <td>{item.sellingPrice}</td>
                          <td>{item.billQuantity * item.sellingPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="total">
                  <p className="text-capitalize" style={{ maxWidth: 300 }}>
                    <span style={{ color: "#000000" }}>Rupees in Words : </span>
                    <br />
                    {selectedBill &&
                      toWords(selectedBill?.totalAmount.toFixed(2))}{" "}
                    Rupees Only
                  </p>
                  <p style={{ fontSize: 18 }}>
                    <span style={{ color: "#000000", marginRight: "10px" }}>
                      Grand Total :
                    </span>
                    <br />
                    Rs. {selectedBill?.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="logo">
                  <p>E.&O.E.</p>
                  <img src={BillLogo} height={30} alt="logo" />
                </div>
                <div className="footer">
                  <p>Thank you for your business!</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                console.log(selectedBill);
                handlePrint();
              }}
            >
              Print
            </button>
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;
