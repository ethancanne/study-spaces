import { popupConstants } from "../constants/constants";
import popupTypes from "../../Views/Popup/PopupTypes.Js";
/**
 * This is the reducer for all actions relating to popus
 * @param  {object} state The inital state of the reducer
 * @param  {String} action The action from popupConstants that transforms the state into the next state
 * @author Ethan Cannelongo
 * @date   11/18/2021
 */
const popupReducer = (state = { view: "", isShowing: false }, action) => {
    switch (action.type) {
        case popupConstants.SHOW_STUDY_GROUP_POPUP:
            return { ...state, view: popupTypes.StudyGroup.Create, isShowing: true };

        case popupConstants.CLOSE_POPUP:
            return { ...state, view: "popups.StudyGroup.Create", isShowing: false };
        default:
            return state;
    }
};

export default popupReducer;
