import { popupConstants } from "../constants/constants";
import views from "../../Views/Views";
/**
 * This is the reducer for all actions relating to popus
 * @param  {object} state The inital state of the reducer
 * @param  {String} action The action from popupConstants that transforms the state into the next state
 * @author Ethan Cannelongo
 * @date   11/18/2021
 */
const popupReducer = (state = { view: "", isShowing: false, payload: {}, showTop: true }, action) => {
    switch (action.type) {
        case popupConstants.SHOW_CREATE_STUDY_GROUP_POPUP:
            return { ...state, view: views.Popup.StudyGroup.Create, isShowing: true, payload: {}, showTop: true };
        case popupConstants.SHOW_JOIN_STUDY_GROUP_POPUP:
            return {
                ...state,
                view: views.Popup.StudyGroup.Join,
                isShowing: true,
                payload: action.payload,
                showTop: false
            };

        case popupConstants.SHOW_EDIT_STUDY_GROUP_POPUP:
            return {
                ...state,
                view: views.Popup.StudyGroup.Edit,
                isShowing: true,
                payload: action.payload,
                showTop: true
            };

        case popupConstants.SHOW_CREATE_MEETING_STUDY_GROUP_POPUP:
            return {
                ...state,
                view: views.Popup.StudyGroup.CreateMeeting,
                isShowing: true,
                payload: action.payload,
                showTop: true
            };

        case popupConstants.SHOW_CREATE_POST_STUDY_GROUP_POPUP:
            return {
                ...state,
                view: views.Popup.StudyGroup.CreatePost,
                isShowing: true,
                payload: action.payload,
                showTop: true
            };

        case popupConstants.SHOW_VIEW_POST_STUDY_GROUP_POPUP:
            return {
                ...state,
                view: views.Popup.StudyGroup.ViewPost,
                isShowing: true,
                showTop: false,
                payload: action.payload
            };

        case popupConstants.SHOW_VIEW_MEETINGS_STUDY_GROUP_POPUP:
            return {
                ...state,
                view: views.Popup.StudyGroup.ViewMeetings,
                isShowing: true,
                showTop: false,
                payload: action.payload
            };

        case popupConstants.SHOW_VIEW_MEMBER_POPUP:
            return {
                ...state,
                view: views.Popup.StudyGroup.ViewMember,
                isShowing: true,
                showTop: false,
                payload: action.payload
            };

        case popupConstants.SHOW_INPUT_POPUP:
            return { ...state, view: views.Popup.Input, isShowing: true, payload: action.payload, showTop: true };

        case popupConstants.SHOW_CONFIRMATION_POPUP:
            return {
                ...state,
                view: views.Popup.Confirmation,
                isShowing: true,
                payload: action.payload,
                showTop: true
            };
        case popupConstants.SHOW_REPORT_POPUP:
            return {
                ...state,
                view: views.Popup.Report,
                isShowing: true,
                payload: action.payload,
                showTop: true
            };

        case popupConstants.CLOSE_POPUP:
            return { ...state, isShowing: false, view: "" };
        default:
            return state;
    }
};

export default popupReducer;
