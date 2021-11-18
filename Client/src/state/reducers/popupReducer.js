import popupConstants from "../constants/popupConstants";
import popups from "../../Views/Popups";
/**
 * This is the reducer for all actions relating to authentication
 * A reducer is how actions transform the state into the next state
 * @author Ethan Cannelongo
 * @date   11/18/2021
 */
const popupReducer = (state = { view: "", isShowing: false }, action) => {
  switch (action.type) {
    //Sign the user in and save the user to local storage
    case popupConstants.SHOW_STUDY_GROUP_POPUP:
      return { ...state, view: popups.StudyGroup.Create, isShowing: true };

    case popupConstants.CLOSE_POPUP:
      return { ...state, view: "popups.StudyGroup.Create", isShowing: false };
    default:
      return state;
  }
};

export default popupReducer;
