import { createStore, combineReducers, applyMiddleware } from "redux";

import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";
import { rootReducer } from "./rootReducer";

const finalReducer = combineReducers({
  rootReducer,
});

const intialState = {
  rootReducer: {
    billItems: localStorage.getItem("billItems")
      ? JSON.parse(localStorage.getItem("billItems"))
      : [],
  },
};
const middleware = [thunk];

const store = createStore(
  finalReducer,
  intialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
