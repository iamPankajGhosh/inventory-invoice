import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table, message, Select, Form } from "antd";
import "../styles/InvoiceStyles.css";

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
    { title: "Invoice Number", dataIndex: "invoiceNumber" },
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
    { title: "Subtotal (Rs.)", dataIndex: "subTotal" },
    { title: "GST (Rs.)", dataIndex: "tax" },
    { title: "Total Amount (Rs.)", dataIndex: "totalAmount" },

    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />

          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log(record._id);
              handleDelete(record._id);
            }}
          />
        </div>
      ),
    },
  ];
  // console.log(selectedBill);
  return (
    <DefaultLayout>
      <div className="d-flex color-white justify-content-between mb-4">
        <div className="d-flex gap-4 align-items-center">
          <h1>Invoice List</h1>
          <button
            className="previous-stock-btn"
            onClick={() => {
              setSearchValue("");
              setBillsData(tempData);
            }}
          >
            <span>All Invoice</span>
          </button>

          <Form
            layout="vertical"
            onFinish={handleFilter}
            style={{
              display: "flex",
              gap: 10,
            }}
          >
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
            <Button htmlType="submit" type="primary">
              Filter
            </Button>
          </Form>
        </div>

        {/* Search Bar */}
        <div className="searchbar">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value.trim())}
            placeholder="Invoice no."
            className="search-field"
          />
          <button
            className="search-icon"
            onClick={() => handleSearch(searchValue)}
          >
            <SearchOutlined />
          </button>
        </div>
      </div>

      <Table columns={columns} dataSource={billsData} bordered />

      {popupModal && (
        <Modal
          width={400}
          pagination={false}
          title="Invoice Details"
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={false}
        >
          {/* ============ invoice modal start ==============  */}
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              <div className="info">
                <h2>Mallick Musical Company</h2>
                <p style={{ textAlign: "center" }}>
                  {" "}
                  38 Gariahat Road, Identity Apartment, Shop No :
                  3 ,Kolkata 700031
                </p>
              </div>
              {/*End Info*/}
            </center>
            {/*End InvoiceTop*/}
            <div id="mid">
              <div className="mt-2">
                <p>
                  Invoice Number : <b>{selectedBill.invoiceNumber}</b>
                  <br />
                  Customer Name : <b>{selectedBill.customerName}</b>
                  <br />
                  Phone No : <b>{selectedBill.customerNumber}</b>
                  <br />
                  Date : <b>{selectedBill.date.toString().substring(0, 10)}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            {/*End Invoice Mid*/}
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item">
                        <h2>Item</h2>
                      </td>
                      <td className="Hours">
                        <h2>Qty</h2>
                      </td>
                      <td className="Rate">
                        <h2>Price</h2>
                      </td>
                      <td className="Rate">
                        <h2>Total</h2>
                      </td>
                    </tr>
                    {selectedBill.billItems.map((item) => (
                      <>
                        <tr className="service">
                          <td className="tableitem">
                            <p className="itemtext">{item.name}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.billQuantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.sellingPrice}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.billQuantity * item.sellingPrice}
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}

                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>GST</h2>
                      </td>
                      <td className="payment">
                        <h2>Rs {selectedBill.tax}</h2>
                      </td>
                    </tr>
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>Grand Total</h2>
                      </td>
                      <td className="payment">
                        <h2>
                          <b>Rs {selectedBill.totalAmount}</b>
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/*End Table*/}
              <div id="legalcopy">
                <p className="legal">
                  <strong>Thank you for your order!</strong> 18% GST application
                  on total amount.Please note that this is non refundable amount
                  for any assistance please write email
                  <b> mallickmusical110@gmail.com</b>
                </p>
              </div>
            </div>
            {/*End InvoiceBot*/}
          </div>
          {/*End Invoice*/}
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>
              Print
            </Button>
          </div>
          {/* ============ invoice modal ends ==============  */}
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;
