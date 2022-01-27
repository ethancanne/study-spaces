import { notificationConstants } from "../constants/constants";

import notificationTypes from "../../Views/Notifications/notificationTypes";
/**
 * This is the reducer for all actions relating to notifications (errors, info, success)
 * @param  {object} state The inital state of the reducer
 * @param  {String} action The action from notificationConstants that transforms the state into the next state
 * @author Ethan Cannelongo
 * @date   1/27/2022
 */
const notificationReducer = (state = { isShowing: false }, action) => {
    switch (action.type) {
        case notificationConstants.SHOW_ERROR_NOTIFICATION:
            return { ...state, type: notificationTypes.ERROR, isShowing: true, message: action.payload.message };

        case notificationConstants.HIDE_NOTIFICATION:
            return { ...state, isShowing: false };

        default:
            return state;
    }
};

export default notificationReducer;
