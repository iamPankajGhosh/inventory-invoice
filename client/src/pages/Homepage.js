import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
import {
  FaC,
  FaCirclePlus,
  FaFilter,
  FaMagnifyingGlass,
  FaTrashCan,
} from "react-icons/fa6";
import { Button, Form, message, Select } from "antd";
const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selecedCategory, setSelecedCategory] = useState("all");
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [tempData, setTempData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState("");

  const handleFilter = () => {
    console.log(selectedBrand);
    setItemsData(
      tempData.filter((item) =>
        selectedBrand === "all" ? true : item.brand === selectedBrand
      )
    );
  };

  const getCategoryWiseBrandList = (data) => {
    let filteredBrandList = [];

    data.forEach((item) => {
      const isDuplicate = filteredBrandList.some(
        (existingItem) =>
          existingItem.brand === item.brand &&
          existingItem.category === item.category
      );

      if (!isDuplicate) {
        filteredBrandList.push({
          category: item.category,
          brand: item.brand,
        });
      }
    });

    console.log(filteredBrandList);
    setBrands(filteredBrandList);
  };

  useEffect(() => {
    if (searchValue === "") {
      setItemsData(tempData);
    }
  }, [searchValue]);

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
    getAllItems();
    getAllCategories();
  }, []);

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
      getCategoryWiseBrandList(data.filter((item) => item.quantity !== 0));
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/get-category`
      );
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCategory = async () => {
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
    setLoading("add-category");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/add-category`,
        {
          name: categoryName,
        }
      );
      getAllCategories();
      message.success(res.data);
    } catch (error) {
      console.log(error);
      message.error("Failed to add category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/delete-category/`,
        {
          id,
        }
      );
      console.log(res.data);
      getAllCategories();
      message.success(res.data);
    } catch (error) {
      console.log(error);
      message.error("Failed to delete category");
    }
  };

  return (
    <DefaultLayout>
      <div className="header">
        {/* Header */}
        <h2>Items</h2>

        {/* Search Bar */}
        <div className="searchbar">
          <input
            type="text"
            placeholder="Serial no."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value.trim())}
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
            <Form.Item name="brand" style={{ margin: 0 }}>
              <Select
                placeholder="Brand Name"
                style={{ width: 150 }}
                onChange={(value) => setSelectedBrand(value)}
                className="text-capitalize"
              >
                <Select.Option
                  key="all"
                  value="all"
                  className="text-capitalize"
                >
                  all
                </Select.Option>
                {brands
                  .filter((item) =>
                    selecedCategory === "all"
                      ? true
                      : item.category === selecedCategory
                  )
                  .reduce((uniqueBrands, item) => {
                    if (selecedCategory === "all") {
                      if (
                        !uniqueBrands.some(
                          (brand) => brand.brand === item.brand
                        )
                      ) {
                        uniqueBrands.push(item);
                      }
                    } else {
                      uniqueBrands.push(item);
                    }
                    return uniqueBrands;
                  }, [])
                  .map((item, index) => (
                    <Select.Option
                      key={index}
                      value={item.brand}
                      className="text-capitalize"
                    >
                      {item.brand}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Button htmlType="submit" type="primary" className="filter-btn">
              <FaFilter size={20} />
              <span>Filter</span>
            </Button>
          </Form>
        </div>

        {/* Add Category Button */}
        <div className="position-relative">
          <button
            className="add-category"
            onClick={() => setOpenForm(!openForm)}
          >
            <FaCirclePlus color="#ffffff" size={20} />
            <span>Category</span>
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
            <button type="button" onClick={() => handleAddCategory()}>
              {loading === "add-cetegory" ? (
                <FaC size={20} className="loader" />
              ) : (
                "Add"
              )}
            </button>

            <div className="category-list mt-3">
              {categories.map((category) => (
                <div key={category.name} className="category-item mb-2">
                  <p>{category.name}</p>
                  <button
                    className="category-delete-btn"
                    type="button"
                    onClick={() => {
                      handleDeleteCategory(category._id);
                    }}
                  >
                    <FaTrashCan size={20} />
                  </button>
                </div>
              ))}
            </div>
          </form>
        </div>

        {openForm && (
          <div
            className="overlay"
            style={{
              zIndex: 9,
            }}
            onClick={() => setOpenForm(false)}
          />
        )}
      </div>

      <div className="category-outer">
        <button
          className={`category-btn ${selecedCategory === "all" && "active"}`}
          onClick={() => setSelecedCategory("all")}
        >
          <span>all</span>
          <span className="category-count">{tempData.length}</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            className={`category-btn ${
              selecedCategory === category.name && "active"
            }`}
            onClick={() => setSelecedCategory(category.name)}
          >
            <span>{category.name}</span>
            <span className="category-count">
              {
                tempData.filter((item) => item.category === category.name)
                  .length
              }
            </span>
          </button>
        ))}
      </div>

      <div className="item-list-outer">
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
