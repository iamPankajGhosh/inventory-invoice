import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
import {
  SearchOutlined,
  PlusCircleFilled,
  DeleteFilled,
} from "@ant-design/icons";
import { message } from "antd";
const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selecedCategory, setSelecedCategory] = useState("all");
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [tempData, setTempData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  // handle search using serial no.
  const handleSearch = (value) => {
    const filteredItems = tempData.filter((item) =>
      item.serialNo.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredItems.length > 0) {
      setItemsData(filteredItems);
    } else {
      message.error("No items found for the given serial number.");
      setItemsData(tempData);
    }
  };

  //useEffect
  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/items/get-item`
        );
        setTempData(data.filter((item) => item.quantity !== 0));
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
        console.log(data);
      } catch (error) {
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

    getAllItems();
    getAllCategories();
  }, [dispatch]);

  const handleAddCategory = () => {
    if (!categoryName) {
      message.error("Please enter a category name.");
      return;
    }

    // Check if the category already exists
    if (categories.some((category) => category.name === categoryName)) {
      message.error("Category already exists.");
      return;
    }

    // Add the new category
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/categories/add-category`, {
        name: categoryName,
      })
      .then((response) => {
        console.log(response.data);
        setCategories([...categories, response.data]);
        setCategoryName("");
        setOpenForm(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setCategories([...categories, { name: categoryName }]);
    setCategoryName("");
    setOpenForm(false);
  };

  const handleDeleteCategory = (id) => {
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/delete-category`,
        { id }
      )
      .then((response) => {
        console.log(response.data);
        setCategories(categories.filter((category) => category._id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <DefaultLayout>
      <div className="home-header">
        <h3 style={{ fontWeight: 600, fontSize: 20 }}>Items</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Search Bar */}
          <div className="searchbar">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value.trim())}
              placeholder="Serial no."
              className="search-field"
            />
            <button
              className="search-icon"
              onClick={() => handleSearch(searchValue)}
            >
              <SearchOutlined />
            </button>
          </div>

          {/* Add Category Button */}
          <div className="position-relative">
            <button
              className="add-category"
              onClick={() => setOpenForm(!openForm)}
            >
              <span>
                <PlusCircleFilled />
              </span>
              <p>Add Category</p>
            </button>

            <form
              className={`position-absolute category-form ${
                openForm && "active"
              }`}
            >
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
              <button onClick={handleAddCategory}>Add</button>

              <div className="category-list mt-3">
                {categories.map((category) => (
                  <div key={category.name} className="category-item mb-2">
                    <p>{category.name}</p>
                    <DeleteFilled
                      className="delete-btn"
                      onClick={() => handleDeleteCategory(category._id)}
                    />
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="d-flex mb-4">
        <div
          key="all"
          className={`d-flex category ${
            selecedCategory === "all" && "category-active"
          }`}
          onClick={() => {
            setSelecedCategory("all");
          }}
        >
          <h4 className="text-white text-capitalize">all</h4>
          <p className="category-count">{tempData.length}</p>
        </div>
        {categories.map((category) => (
          <div
            key={category.name}
            className={`d-flex category ${
              selecedCategory === category.name && "category-active"
            }`}
            onClick={() => {
              setSelecedCategory(category.name);
              console.log(selecedCategory);
            }}
          >
            <h4 className="text-white text-capitalize">{category.name}</h4>
            <p className="category-count">
              {
                tempData.filter((item) => item.category === category.name)
                  .length
              }
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {
          // itemsData.length > 0 &&
          itemsData
            .filter((item) =>
              selecedCategory === "all"
                ? true
                : item.category === selecedCategory
            )
            .map((item) => (
              <ItemList key={item._id} item={item} />
            ))
        }
      </div>
    </DefaultLayout>
  );
};

export default Homepage;
