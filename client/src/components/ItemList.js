import React, { useState } from "react";
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
  const { Meta } = Card;
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
        <Meta title={item.name} />
        <p style={{ fontSize: 14, marginTop: 10 }}>
          <b>Serial No : </b> {item.serialNo}
        </p>
        <p style={{ fontSize: 14, marginTop: -8 }}>
          <b>Selling Price : </b> ₹ {item.sellingPrice}
        </p>
        <p style={{ fontSize: 14, marginTop: -8 }} className="text-capitalize">
          <b>Brand : </b> {item?.brand}
        </p>
        <p style={{ fontSize: 14, marginTop: -8 }}>
          <b>In stock : </b> {item.quantity}
        </p>
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
