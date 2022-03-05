import { studyGroupsConstants } from "../constants/constants";

/**
 * This is the reducer for all actions relating to study groups
 * A reducer is how actions transform the state into the next state
 * @param  {object} state The inital state of the reducer
 * @param  {String} action The action from popupConstants that transforms the state into the next state
 * @author Ethan Cannelongo
 * @date   12/20/2021
 */
const studyGroupsReducer = (
    state = {
        studyGroups: [],
        search: []
    },
    action
) => {
    switch (action.type) {
        case studyGroupsConstants.ADD_STUDY_GROUP:
            return { ...state, studyGroups: [...state.studyGroups, action.payload.group] };
        case studyGroupsConstants.LOAD_STUDY_GROUPS:
            return { ...state, studyGroups: action.payload.groups };

        case studyGroupsConstants.POPULATE_SEARCH:
            return { ...state, search: [...action.payload.groups] };

        case studyGroupsConstants.CLEAR_STUDY_GROUPS:
            return { ...state, studyGroups: [] };

        default:
            return state;
    }
};

export default studyGroupsReducer;
