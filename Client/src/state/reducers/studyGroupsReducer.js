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
        search: [
            {
                title: "Hello Group",
                owner: "Ethan Cannelongo",
                subject: "Computer Science",
                school: "Liberty University",
                courseCode: "CSIS 215",
                isOnline: true,
                groupColor: "#8a593b7c",
                schedule: "Mondays at 8:00pm"
            }
        ]
    },
    action
) => {
    switch (action.type) {
        case studyGroupsConstants.ADD_STUDY_GROUP:
            if (!action.payload.reset) return { ...state, studyGroups: [...state.studyGroups, action.payload.group] };

            return { ...state, studyGroups: [action.payload.group] };

        case studyGroupsConstants.POPULATE_SEARCH:
            return { ...state, search: [action.payload.groups] };

        default:
            return state;
    }
};

export default studyGroupsReducer;
