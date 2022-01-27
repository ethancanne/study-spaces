import { studyGroupsConstants, authConstants, popupConstants, notificationConstants } from "../constants/constants";

//AUTH REDUCERS
export const signIn = (user) => {
    return {
        type: authConstants.SIGN_IN,
        payload: user
    };
};
export const signOut = () => {
    return {
        type: authConstants.SIGN_OUT
    };
};

export const createAccount = (unverifiedUser) => {
    return {
        type: authConstants.CREATE_ACCOUNT,
        payload: {
            unverifiedUser
        }
    };
};

//POPUP REDUCER
export const showStudyGroupPopup = () => {
    return {
        type: popupConstants.SHOW_STUDY_GROUP_POPUP
    };
};

export const closePopup = () => {
    return {
        type: popupConstants.CLOSE_POPUP
    };
};

//STUDY GROUP REDUCERS
export const addStudyGroup = (group, reset = false) => {
    return {
        type: studyGroupsConstants.ADD_STUDY_GROUP,
        payload: { group, reset }
    };
};

export const populateStudyGroupSearch = (group) => {
    return {
        type: studyGroupsConstants.POPULATE_SEARCH,
        payload: { groups }
    };
};

//NOTIFICATION REDUCERS
export const showErrorNotification = (message) => {
    return {
        type: notificationConstants.SHOW_ERROR_NOTIFICATION,
        payload: { message }
    };
};

export const hideNotification = () => {
    return {
        type: notificationConstants.HIDE_NOTIFICATION
    };
};
