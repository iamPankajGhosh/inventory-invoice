import React from "react";
import { Button, Card } from "antd";
import { useDispatch } from "react-redux";
const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  //update cart handler
  const handleAddTOCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, billQuantity: 1 },
    });
  };
  const { Meta } = Card;
  return (
    <div>
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
        <p style={{ fontSize: 14, marginTop: 20 }}>Price: ₹ {item.newPrice}</p>
        <p style={{ fontSize: 14, marginTop: -8 }}>Stock: {item.quantity}</p>
        <div className="item-button">
          <Button
            onClick={() => handleAddTOCart()}
            disabled={item.quantity === 0}
          >
            Add to cart
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
