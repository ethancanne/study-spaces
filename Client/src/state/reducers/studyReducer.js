import studyConstants from "../constants/studyConstants";

/**
 * This is the reducer for all actions relating to study groups
 * A reducer is how actions transform the state into the next state
 * @author Ethan Cannelongo
 * @date   12/20/2021
 */
const studyReducer = (state = { studyGroups: {} }, action) => {
    switch (action.type) {
        case studyConstants.CREATE_STUDY_GROUP:
            return { ...state, studyGroups: popups.StudyGroup.Create };

        default:
            return state;
    }
};

export default popupReducer;
