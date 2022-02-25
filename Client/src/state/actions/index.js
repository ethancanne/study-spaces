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

export const setUser = (user) => {
    return {
        type: authConstants.SET_USER,
        payload: {
            user
        }
    };
};

//POPUP REDUCER
export const showCreateStudyGroupPopup = () => {
    return {
        type: popupConstants.SHOW_CREATE_STUDY_GROUP_POPUP
    };
};

export const showJoinStudyGroupPopup = (group) => {
    return {
        type: popupConstants.SHOW_JOIN_STUDY_GROUP_POPUP,
        payload: group
    };
};

export const showEditStudyGroupPopup = (group) => {
    return {
        type: popupConstants.SHOW_EDIT_STUDY_GROUP_POPUP,
        payload: group
    };
};

export const showCreateMeetingStudyGroupPopup = (group, isRecurringMeeting) => {
    return {
        type: popupConstants.SHOW_CREATE_MEETING_STUDY_GROUP_POPUP,
        payload: { group, isRecurringMeeting }
    };
};

export const showCreatePostStudyGroupPopup = (group) => {
    return {
        type: popupConstants.SHOW_CREATE_POST_STUDY_GROUP_POPUP,
        payload: group
    };
};

export const showViewPostStudyGroupPopup = (post) => {
    return {
        type: popupConstants.SHOW_VIEW_POST_STUDY_GROUP_POPUP,
        payload: post
    };
};

export const showViewMeetingsStudyGroupPopup = (group) => {
    return {
        type: popupConstants.SHOW_VIEW_MEETINGS_STUDY_GROUP_POPUP,
        payload: group
    };
};

export const showInputPopup = (title, label, defaultInput, callback, label2) => {
    return {
        type: popupConstants.SHOW_INPUT_POPUP,
        payload: { title, label, defaultInput, callback, label2 }
    };
};

export const showConfirmationPopup = (
    callback,
    title,
    message,
    isConfirmation = true,
    firstButtonTitle = "Yes",
    secondButtonTitle = "No"
) => {
    return {
        type: popupConstants.SHOW_CONFIRMATION_POPUP,
        payload: { callback, title, message, isConfirmation, firstButtonTitle, secondButtonTitle }
    };
};

export const closePopup = () => {
    return {
        type: popupConstants.CLOSE_POPUP
    };
};

//STUDY GROUP REDUCERS
export const addStudyGroup = (group) => {
    return {
        type: studyGroupsConstants.ADD_STUDY_GROUP,
        payload: { group }
    };
};

export const loadStudyGroup = (groups) => {
    return {
        type: studyGroupsConstants.LOAD_STUDY_GROUPS,
        payload: { groups }
    };
};

export const populateStudyGroupSearch = (groups) => {
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

export const showSuccessNotification = (message) => {
    return {
        type: notificationConstants.SHOW_SUCCESS_NOTIFICATION,
        payload: { message }
    };
};

export const hideNotification = () => {
    return {
        type: notificationConstants.HIDE_NOTIFICATION
    };
};

export const startLoading = () => {
    return {
        type: notificationConstants.START_LOADING
    };
};
export const stopLoading = () => {
    return {
        type: notificationConstants.STOP_LOADING
    };
};
