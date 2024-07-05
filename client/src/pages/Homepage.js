import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
import { SearchOutlined, PlusCircleFilled } from "@ant-design/icons";
import { message } from "antd";
const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selecedCategory, setSelecedCategory] = useState("Guitar");
  const categories = [
    {
      name: "Guitar",
    },
    {
      name: "Flute",
    },
    {
      name: "Drum",
    },
    {
      name: "Violin",
    },
    {
      name: "Saxophone",
    },
    {
      name: "Piano",
    },
  ];
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [tempData, setTempData] = useState(null);

  // handle search using serial no.
  const handleSearch = (value) => {
    console.log(value);
    const filteredItems = tempData.filter((item) =>
      item.serialNo.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredItems.length > 0) {
      setItemsData(filteredItems);
    } else {
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
        setTempData(data);
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);

  const handleAddCategory = () => {
    console.log("Add Category");
    message.error("This feature is under development");
  };

  return (
    <DefaultLayout>
      <div className="home-header">
        <h3 style={{ fontWeight: 600, fontSize: 20 }}>Items</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="add-category" onClick={() => handleAddCategory()}>
            <span>
              <PlusCircleFilled />
            </span>
            <p>Add Category</p>
          </button>
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
        </div>
      </div>
      <div className="d-flex mb-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`d-flex category ${
              selecedCategory === category.name && "category-active"
            }`}
            onClick={() => setSelecedCategory(category.name)}
          >
            <h4 className="text-white">{category.name}</h4>
            {/* <img
              src={category.imageUrl}
              alt={category.name}
              height="40"
              width="60"
            /> */}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {itemsData
          .filter((i) => i.category === selecedCategory)
          .map((item) => (
            <ItemList key={item.id} item={item} />
          ))}
      </div>
    </DefaultLayout>
  );
};

export default Homepage;
