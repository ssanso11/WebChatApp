import { combineReducers } from "redux";

const initialState = "not authenticated";

export default function user(state = initialState, action) {
  switch (action.type) {
    case "ADD_USER":
      console.log(action.payload.auth);
      return action.payload;
    case "LOGOUT_USER":
      return initialState;
    default:
      return state;
  }
}
