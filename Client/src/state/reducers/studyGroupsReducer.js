import studyGroupsConstants from "../constants/studyGroupsConstants";

/**
 * This is the reducer for all actions relating to study groups
 * A reducer is how actions transform the state into the next state
 * @author Ethan Cannelongo
 * @date   12/20/2021
 */
const studyGroupsReducer = (state = {studyGroups: []}, action) => {
  switch (action.type) {
    case studyGroupsConstants.ADD_STUDY_GROUP:
      if (!action.payload.reset)
        return { ...state, studyGroups: [...(state.studyGroups), action.payload.group] };

      return { ...state, studyGroups: [action.payload.group] };


    default:
      return state;
  }
};

export default studyGroupsReducer;