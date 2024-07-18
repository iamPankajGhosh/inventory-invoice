import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table, message } from "antd";
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
  const [editItem, setEditItem] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  const stockLoginForm = useForm();
  const addItemForm = useForm({
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      price: "",
      sellingPrice: "",
      quantity: "",
    },
  });

  const handleStockLogin = async (data) => {
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
      addItemForm.setValue(
        "serialNo",
        data.length > 0 ? Number(data[0]?.serialNo) + 1 : 101
      );
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
              setEditItem(true);
              addItemForm.setValue("itemId", record._id);
              addItemForm.setValue("serialNo", record.serialNo);
              addItemForm.setValue("name", record.name);
              addItemForm.setValue("category", record.category);
              addItemForm.setValue("brand", record.brand);
              addItemForm.setValue("price", record.price);
              addItemForm.setValue("sellingPrice", record.sellingPrice);
              addItemForm.setValue("quantity", record.quantity);
              setPopupModal(true);
            }}
          >
            <FaPenToSquare size={20} />
          </button>
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
  const addItemHandler = async (data) => {
    setIsLoading(true);
    const itemValue = data;

    if (Object.values(itemValue).some((item) => item === "")) {
      setIsLoading(false);
      return message.error("Please fill all the fields");
    }

    if (!editItem) {
      const findItemBySerialNumber = tempData.filter(
        (item) => item.serialNo === itemValue.serialNo
      );

      if (findItemBySerialNumber.length > 0) {
        setIsLoading(false);
        return message.error("Serial Number already exists");
      }

      try {
        setIsLoading(true);
        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/items/add-item`,
          itemValue
        );
        console.log(res.data);
        message.success("Item Added Succesfully");
        addItemForm.reset();
        getAllItems();
        setPopupModal(false);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        message.error("Failed to add item");
        console.log(error);
      }
    } else {
      try {
        setIsLoading(true);

        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/items/edit-item`,
          itemValue
        );
        message.success("Item Updated Succesfully");
        addItemForm.reset();

        getAllItems();
        setEditItem(false);
        setPopupModal(false);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
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
            <div className="overlay" onClick={() => setPopupModal(false)} />
          )}

          <form
            onSubmit={addItemForm.handleSubmit(addItemHandler)}
            className={`add-item-form ${popupModal && "active"}`}
          >
            <label htmlFor="serialNo">Serial No.</label>
            <input
              id="serialNo"
              placeholder="Item serial no."
              {...addItemForm.register("serialNo")}
            />

            <label htmlFor="name">Name</label>
            <input
              id="name"
              placeholder="Item name"
              {...addItemForm.register("name")}
            />

            <label htmlFor="category">Category</label>
            <select
              id="category"
              placeholder="Item category"
              {...addItemForm.register("category")}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              placeholder="Item brand"
              {...addItemForm.register("brand")}
            />

            <label htmlFor="price">Cost Price</label>
            <input
              id="price"
              placeholder="Item cost price"
              {...addItemForm.register("price")}
            />

            <label htmlFor="sellingPrice">Sell Price</label>
            <input
              id="sellingPrice"
              placeholder="Item sell price"
              {...addItemForm.register("sellingPrice")}
            />

            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              placeholder="Item quantity"
              {...addItemForm.register("quantity")}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <FaC size={20} className="loader" />
              ) : (
                <span>Submit</span>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="stock-login-form-outer">
          <h1>Stock</h1>
          <form
            onSubmit={stockLoginForm.handleSubmit(handleStockLogin)}
            className="stock-login-form"
          >
            <label htmlFor="userId">User Id</label>
            <input
              id="userId"
              {...stockLoginForm.register("userId")}
              placeholder="User Id"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...stockLoginForm.register("password")}
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
