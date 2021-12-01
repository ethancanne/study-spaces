import { combineReducers } from "redux";
import authReducer from "./authReducer";
import popupReducer from "./popupReducer";

const allReducers = combineReducers({
    authReducer,
    popupReducer
});

export default allReducers;
