import { combineReducers } from "redux";
import authReducer from "./authReducer";
import popupReducer from "./popupReducer";
import studyGroupsReducer from "./studyGroupsReducer";
import notificationReducer from "./notificationReducer";

/**
 * This function combines all the reducers so they all can be referenced from this file
 * @author Ethan Cannelongo
 * @date   11/09/2021
 */
const allReducers = combineReducers({
    authReducer,
    popupReducer,
    studyGroupsReducer,
    notificationReducer
});

export default allReducers;
