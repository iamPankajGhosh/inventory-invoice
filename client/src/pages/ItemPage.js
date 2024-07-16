import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  FaAngleLeft,
  FaCirclePlus,
  FaMagnifyingGlass,
  FaPenToSquare,
  FaTrashCan,
  FaC,
} from "react-icons/fa6";
import { useForm } from "react-hook-form";
const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [serialNumber, setSerialNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/stock/login`,
        {
          name: "stockHandler",
          ...data,
        }
      );
      console.log(res.data.message);
      if (!res.data?.verified) {
        setIsLoading(false);
        return setErrorMessage(res.data.message);
      }
      localStorage.setItem("token", res.data?._id);
      setIsAuth(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to login");
      setIsLoading(false);
    }
  };

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

    if (localStorage.getItem("token")) {
      setIsAuth(true);
      navigate("/items");
    }
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
        <div className="action-btn-grp">
          <button
            className="action-btn"
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          >
            <FaPenToSquare size={20} />
          </button>
          {/* <button className="action-btn" onClick={() => {}}>
                  <FaDownload size={20} />
                </button> */}
          <button
            className="action-btn"
            onClick={() => {
              handleDelete(record);
            }}
          >
            <FaTrashCan size={20} />
          </button>
        </div>
      ),
    },
  ];

  // handle form  submit
  const handleSubmitItem = async (value) => {
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
      {isAuth ? (
        <div>
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
                onFinish={handleSubmitItem}
              >
                <Form.Item name="serialNo" label="Serial No.">
                  <Input
                    placeholder={`${tempData[0].serialNo}`}
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
                  <Input
                    placeholder="Item quantity"
                    style={{ borderRadius: 5 }}
                  />
                </Form.Item>

                <div className="d-flex justify-content-end">
                  <Button type="primary" htmlType="submit">
                    SAVE
                  </Button>
                </div>
              </Form>
            </Modal>
          )}
        </div>
      ) : (
        <div className="stock-login-form-outer">
          <h1>Stock</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="stock-login-form">
            <label htmlFor="userId">User Id</label>
            <input id="userId" {...register("userId")} placeholder="User Id" />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Password"
            />
            <p>{errorMessage}</p>
            <button type="submit">
              {isLoading ? (
                <FaC size={20} className="loader" />
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
