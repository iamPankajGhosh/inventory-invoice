import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { FaAngleRight, FaCirclePlus } from "react-icons/fa6";
const PreviousStockPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/items/get-item`
      );
      setItemsData(data.filter((item) => item.quantity === 0));
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  const getAllCategories = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/get-category`
      );
      console.log(data);
      setCategories(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {
    getAllItems();
    getAllCategories();
  }, []);

  //handle delete
  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/items/delete-item`,
        { itemId: record._id }
      );
      message.success("Item Deleted Succesfully");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  //able data
  const columns = [
    { title: "Serial No.", dataIndex: "serialNo" },
    { title: "Name", dataIndex: "name" },
    { title: "Cost Price (Rs.)", dataIndex: "price" },
    { title: "Sell Price (Rs.)", dataIndex: "sellingPrice" },
    { title: "Quantity", dataIndex: "quantity" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              // notAllowed();
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // handle form  submit
  const handleSubmit = async (value) => {
    if (editItem === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/items/add-item`,
          value
        );
        console.log(res.data);
        message.success("Item Added Succesfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/items/edit-item`,
          {
            ...value,
            itemId: editItem._id,
          }
        );
        message.success("Item Updated Succesfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="header">
        {/* Header */}
        <h2>Out of Stock</h2>

        <button className="add-category" onClick={() => navigate("/items")}>
          <span>Current stock</span>
          <FaAngleRight color="#ffffff" size={20} />
        </button>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item " : "Add New Item"}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
            // onFinish={notAllowed}
          >
            <Form.Item name="serialNo" label="Serial No.">
              <Input placeholder="Item serial no" style={{ borderRadius: 5 }} />
            </Form.Item>
            <Form.Item name="name" label="Name">
              <Input placeholder="Item name" style={{ borderRadius: 5 }} />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Select placeholder="Select category">
                {categories.map((c) => (
                  <Select.Option value={c.name} className="text-capitalize">
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="price" label="Cost">
              <Input placeholder="Item cost" style={{ borderRadius: 5 }} />
            </Form.Item>
            <Form.Item name="quantity" label="Quantity">
              <Input placeholder="Item quantity" style={{ borderRadius: 5 }} />
            </Form.Item>
            {/* <Form.Item name="image" label="Image URL">
              <Input />
            </Form.Item> */}

            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default PreviousStockPage;
