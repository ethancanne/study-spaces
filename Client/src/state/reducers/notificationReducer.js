import { notificationConstants } from "../constants/constants";

import notificationTypes from "../../Views/Notification/notificationTypes";
/**
 * This is the reducer for all actions relating to notifications (errors, info, success)
 * @param  {object} state The inital state of the reducer
 * @param  {String} action The action from notificationConstants that transforms the state into the next state
 * @author Ethan Cannelongo
 * @date   1/27/2022
 */
const notificationReducer = (state = { isShowing: false, loading: false }, action) => {
    switch (action.type) {
        case notificationConstants.SHOW_ERROR_NOTIFICATION:
            return { ...state, type: notificationTypes.ERROR, isShowing: true, message: action.payload.message };

        case notificationConstants.SHOW_SUCCESS_NOTIFICATION:
            return {
                ...state,
                type: notificationTypes.SUCCESS,
                isShowing: true,
                message: action.payload.message
            };
        case notificationConstants.HIDE_NOTIFICATION:
            return { ...state, isShowing: false };

        case notificationConstants.START_LOADING:
            return { ...state, loading: true };

        case notificationConstants.STOP_LOADING:
            return { ...state, loading: false };

        default:
            return state;
    }
};

export default notificationReducer;
