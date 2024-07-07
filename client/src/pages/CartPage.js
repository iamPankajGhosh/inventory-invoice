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
import { render } from "react-dom";
const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { billItems } = useSelector((state) => state.rootReducer);

  let gstAmount = ((sellingPrice / 100) * 18).toFixed(2);
  let grandTotal = (Number(sellingPrice) + Number(gstAmount)).toFixed(2);

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
    setSelectedValue(value);
    setSellingPrice(value.price);
    setPopupModal(true);
  };

  const handleUpdatePrice = () => {
    billItems.forEach((item) => {
      if (item._id === selectedValue._id) {
        item.price = sellingPrice;
      }
    });
    console.log(billItems);
    setPopupModal(false);
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   render: (image, record) => (
    //     <img src={image} alt={record.name} height="60" width="60" />
    //   ),
    // },
    {
      title: "Stock",
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
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handlePriceEdit(record)}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSellingPrice(0);
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

  useEffect(() => {
    let subTotalCalc = 0;
    billItems.forEach((item) => {
      subTotalCalc += item.billQuantity * item.price;
    });
    setSubTotal(subTotalCalc);
  }, [billItems, sellingPrice]);

  //handleSubmit
  const handleSubmit = async (value) => {
    try {
      if (
        sellingPrice === 0 ||
        [value.customerName, value.customerNumber].some(
          (item) => item.trim() === ""
        )
      ) {
        return message.error("Please fill all the fields");
      }

      const newObject = {
        ...value,
        billItems,
        subTotal,
        tax: gstAmount,
        totalAmount: grandTotal,
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
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          className="price-input"
        />
        <button onClick={() => handleUpdatePrice()}>Update</button>
      </div>
      <div className="d-flex flex-column align-items-end">
        <hr />
        <h3>
          Sub Total : ₹ <b> {subTotal}</b> /-{" "}
        </h3>
        <Button type="primary" onClick={() => setBillPopup(true)}>
          Create Invoice
        </Button>
      </div>
      <Modal
        title="Create Invoice"
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
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
            <h5>Sub Total : ₹ {sellingPrice}</h5>
            <h4 style={{ fontSize: 14 }}>GST 18% : ₹ {gstAmount}</h4>
            <h4>
              Grand total : <b>₹ {grandTotal}</b>
            </h4>
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
