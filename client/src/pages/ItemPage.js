import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaCirclePlus, FaMagnifyingGlass } from "react-icons/fa6";
const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [serialNumber, setSerialNumber] = useState(0);
  const navigate = useNavigate();

  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/items/get-item`
      );
      setTempData(data);
      setItemsData(data.filter((item) => item.quantity !== 0));
      dispatch({ type: "HIDE_LOADING" });
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

  useEffect(() => {
    if (searchValue === "") {
      setItemsData(tempData);
    }
  }, [searchValue]);

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

  const handleSearch = (value) => {
    const filteredItems = tempData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredItems.length > 0) {
      setItemsData(filteredItems);
    } else {
      message.error("No items found for the given name.");
      setItemsData(tempData);
    }
  };

  //able data
  const columns = [
    { title: "Serial No.", dataIndex: "serialNo" },
    { title: "Name", dataIndex: "name" },
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   render: (image, record) => (
    //     <img src={image} alt={record.name} height="60" width="60" />
    //   ),
    // },
    // { title: "Price", dataIndex: "price" },
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
      const findItemBySerialNumber = tempData.filter(
        (item) => item.serialNo === value.serialNo
      );

      if (findItemBySerialNumber.length > 0) {
        return message.error("Serial Number already exists");
      }

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
        message.error("Failed to add item");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/items/edit-item`,
          {
            ...value,
            itemId: editItem._id,
          }
        );
        message.success("Item Updated Succesfully");
        console.log(res.data);
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Failed to update item");
        console.log(error);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="header">
        {/* Header */}
        <h2>Stock</h2>

        <button
          className="add-category"
          onClick={() => navigate("/items/previous-stock")}
        >
          <FaAngleLeft color="#ffffff" size={20} />
          <span>Previous stock</span>
        </button>

        {/* Search Bar */}
        <div className="searchbar">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value.trim())}
            placeholder="Item name"
            className="search-field"
          />
          <button
            className="search-btn"
            onClick={() => handleSearch(searchValue)}
          >
            <FaMagnifyingGlass size={20} />
          </button>
        </div>

        <button
          className="add-category"
          onClick={() => {
            setPopupModal(true);
          }}
        >
          <FaCirclePlus color="#ffffff" size={20} />
          <span>Item</span>
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
          >
            <Form.Item name="serialNo" label="Serial No.">
              <p style={{ display: "none" }}>{tempData[0].serialNo}</p>
              <Input
                value={Number(tempData[0].serialNo) + 1}
                placeholder="Item serial no"
                style={{ borderRadius: 5 }}
              />
            </Form.Item>
            <Form.Item name="name" label="Name">
              <Input placeholder="Item name" style={{ borderRadius: 5 }} />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Select placeholder="Select category">
                {categories.map((c) => (
                  <Select.Option
                    key={c._id}
                    value={c.name}
                    className="text-capitalize"
                  >
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="brand" label="Brand">
              <Input placeholder="Item brand" style={{ borderRadius: 5 }} />
            </Form.Item>
            <Form.Item name="price" label="Cost Price">
              <Input placeholder="Item cost" style={{ borderRadius: 5 }} />
            </Form.Item>
            <Form.Item name="sellingPrice" label="Sell Price">
              <Input placeholder="Item cost" style={{ borderRadius: 5 }} />
            </Form.Item>
            <Form.Item name="quantity" label="Quantity">
              <Input placeholder="Item quantity" style={{ borderRadius: 5 }} />
            </Form.Item>

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

export default ItemPage;
