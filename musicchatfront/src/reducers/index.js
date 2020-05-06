import { combineReducers } from "redux";
import user from "./reducerLogin";
import teacher from "./reducerTeacher";

export default combineReducers({
  user,
  teacher,
});
