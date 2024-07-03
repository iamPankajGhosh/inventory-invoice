import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
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
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);
  return (
    <DefaultLayout>
      <div className="d-flex">
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
