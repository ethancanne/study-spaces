import { combineReducers } from "redux";
import authReducer from "./authReducer";
import popupReducer from "./popupReducer";
import studyGroupsReducer from "./studyGroupsReducer";

const allReducers = combineReducers({
  authReducer,
  popupReducer,
  studyGroupsReducer
});

export default allReducers;
