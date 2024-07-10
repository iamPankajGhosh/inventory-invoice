import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Table, Button, Modal, message, Form, Input, Select } from "antd";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [billNumber, setBillNumber] = useState("");
  const [prevBills, setPrevBills] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { billItems } = useSelector((state) => state.rootReducer);

  //auto generate bill number
  const generateBillNumber = () => {
    console.log(billItems);
    const year = new Date().getFullYear();
    if (prevBills.length === 0) {
      const newBillNumber = `MMC/${year}/1`;
      setBillNumber(newBillNumber.toString());
    }
    const newBillNumber = `MMC/${year}/${
      Number(
        prevBills?.invoiceNumber.substring(9, prevBills?.invoiceNumber.length)
      ) + 1
    }`;
    setBillNumber(newBillNumber.toString());
  };

  //handle increament
  const handleIncreament = (record) => {
    if (record.quantity !== 1)
      dispatch({
        type: "UPDATE_CART",
        payload: {
          ...record,
          billQuantity: record.billQuantity + 1,
          quantity: record.quantity - 1,
        },
      });
    console.log(record);
  };

  const handleDecreament = (record) => {
    if (record.billQuantity !== 1)
      dispatch({
        type: "UPDATE_CART",
        payload: {
          ...record,
          billQuantity: record.billQuantity - 1,
          quantity: record.quantity + 1,
        },
      });
  };

  //handle price edit
  const handlePriceEdit = (value) => {
    console.log(value);
    console.log(billItems);
    setSelectedValue(value);
    setPopupModal(true);
  };

  const handleUpdatePrice = () => {
    dispatch({
      type: "UPDATE_CART",
      payload: {
        ...selectedValue,
        sellingPrice: selectedValue.sellingPrice,
      },
    });
    setPopupModal(false);
    message.success("Price Updated Successfully");
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "In Stock",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <b>{record.quantity - 1}</b>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecreament(record)}
          />

          <b>{record.billQuantity}</b>

          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncreament(record)}
          />
        </div>
      ),
    },
    {
      title: "Price (Rs.)",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex justify-content-between">
          <b>{record.sellingPrice}</b>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handlePriceEdit(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              dispatch({
                type: "DELETE_FROM_CART",
                payload: record,
              });
            }}
          />
        </div>
      ),
    },
  ];

  const getAllPrevBills = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/bills/get-last-bill`
    );
    setPrevBills(res.data);
  };

  useEffect(() => {
    let subTotalCalc = 0;
    billItems.forEach((item) => {
      subTotalCalc += item.billQuantity * item.sellingPrice;
    });
    setSubTotal(subTotalCalc);

    getAllPrevBills();
  }, [billItems, billNumber]);

  //handleSubmit
  const handleSubmit = async (value) => {
    try {
      if (
        [value.customerName, value.customerNumber].some(
          (item) => item.trim() === ""
        )
      ) {
        return message.error("Please fill all the fields");
      }

      const newObject = {
        ...value,
        invoiceNumber: billNumber,
        billItems,
        subTotal,
        tax:
          subTotal === 0 ? 0 : parseFloat(((subTotal / 100) * 18).toFixed(2)),

        totalAmount:
          subTotal === 0
            ? 0
            : // : parseFloat((subTotal + (subTotal / 100) * 18).toFixed(2)),
              parseFloat(subTotal.toFixed(2)),
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };

      // console.log(newObject);
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/bills/add-bills`,
        newObject
      );
      console.log(res.data);
      message.success("Bill Generated");
      navigate("/bills");
      dispatch({ type: "DELETE_ALL_FROM_CART" });
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <DefaultLayout>
      <h1>Invoice</h1>
      <Table columns={columns} dataSource={billItems} bordered />
      {/* popup modal */}
      {popupModal && (
        <div className="overlay" onClick={() => setPopupModal(false)} />
      )}
      <div className={`selling-price ${popupModal && "active"}`}>
        <h3 style={{ margin: 0 }}>Selling Price : </h3>
        <input
          placeholder="Price"
          value={selectedValue?.sellingPrice}
          onChange={(e) =>
            setSelectedValue({
              ...selectedValue,
              sellingPrice: Number(e.target.value),
            })
          }
          className="price-input"
        />
        <button
          onClick={() => {
            handleUpdatePrice();
          }}
        >
          Update
        </button>
      </div>
      <div className="d-flex flex-column align-items-end">
        <hr />
        <h3>
          Sub Total : ₹ <b>{subTotal}</b> /-{" "}
        </h3>
        <Button
          type="primary"
          onClick={() => {
            console.log(prevBills);
            generateBillNumber();
            setBillPopup(true);
          }}
        >
          Create Bill
        </Button>
      </div>
      <Modal
        title="Create Bill"
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="invoiceNumber" label="Bill Number">
            <Input
              defaultValue={billNumber}
              value={billNumber}
              onChange={(e) => {
                setBillNumber(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item name="customerName" label="Customer Name">
            <Input />
          </Form.Item>
          <Form.Item name="customerNumber" label="Contact Number">
            <Input />
          </Form.Item>

          <Form.Item name="paymentMode" label="Payment Method">
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>
          <div className="bill-it">
            <h5>Grand Total : ₹ {subTotal}</h5>
            {/* <h4 style={{ fontSize: 14 }}>
              GST 18% : ₹ {(subTotal * 18) / 100}
            </h4> */}
            {/* <h4>
              Grand total : <b>₹ {subTotal + (subTotal * 18) / 100}</b>
            </h4> */}
          </div>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
