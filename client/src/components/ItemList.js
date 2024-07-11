import React from "react";
import { Button, Card, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  const { billItems } = useSelector((state) => state.rootReducer);
  const handleAddTOCart = (id) => {
    const findItemById = billItems.filter((item) => item._id === id);
    if (findItemById && findItemById.length > 0) {
      return message.error("Item already added to cart");
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, billQuantity: 1 },
    });
  };
  return (
    item?.quantity > 0 && (
      <Card
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: 5,
          width: 310,
          overflow: "hidden",
          border: "none",
        }}
      >
        <h2 className="card-title">{item.name}</h2>

        <div className="item-details">
          <p>
            <b>Serial No : </b> {item.serialNo}
          </p>
          <p>
            <b>Selling Price : </b> ₹ {item.sellingPrice}
          </p>
          <p>
            <b>Brand : </b> {item?.brand}
          </p>
          <p>
            <b>In stock : </b> {item.quantity}
          </p>
        </div>
        <div className="item-button">
          <Button
            onClick={() => handleAddTOCart(item._id)}
            disabled={item.quantity > 0 ? false : true}
          >
            Add
          </Button>
        </div>
      </Card>
    )
  );
};

export default ItemList;
