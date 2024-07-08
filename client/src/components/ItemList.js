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
    <div>
      {item.quantity > 0 && (
        <Card
          style={{
            width: 240,
            margin: 15,
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#0f172a",
          }}
          // cover={}
        >
          {/* <img
          alt={item.name}
          src={item.image}
          style={{ height: 200, width: "100%", objectFit: "cover" }}
        /> */}
          <Meta title={item.name} />
          <p style={{ fontSize: 14, marginTop: 10 }}>
            <b>Serial No : </b> {item.serialNo}
          </p>
          <p style={{ fontSize: 14, marginTop: -8 }}>
            <b>Cost : </b> ₹ {item.sellingPrice}
          </p>
          <p style={{ fontSize: 14, marginTop: -8 }}>
            <b>In stock : </b> {item.quantity}
          </p>
          <div className="item-button">
            <Button
              onClick={() => handleAddTOCart(item._id)}
              disabled={item.quantity > 0 ? false : true}
            >
              Add to cart
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ItemList;
