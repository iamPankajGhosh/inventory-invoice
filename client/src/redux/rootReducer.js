const intialState = {
  loading: false,
  billItems: [],
};

export const rootReducer = (state = intialState, action) => {
  switch (action.type) {
    case "SHOW_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "HIDE_LOADING":
      return {
        ...state,
        loading: false,
      };
    case "ADD_TO_CART":
      return {
        ...state,
        billItems: [...state.billItems, action.payload],
      };
    case "UPDATE_CART":
      return {
        ...state,
        billItems: state.billItems.map((item) =>
          item._id === action.payload._id
            ? {
                ...item,
                billQuantity: action.payload.billQuantity,
                quantity: action.payload.quantity,
              }
            : item
        ),
      };
    case "DELETE_FROM_CART":
      return {
        ...state,
        billItems: state.billItems.filter(
          (item) => item._id !== action.payload._id
        ),
      };
    case "DELETE_ALL_FROM_CART":
      return {
        ...state,
        billItems: [],
      };
    default:
      return state;
  }
};
