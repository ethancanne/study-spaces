import studyGroupsConstants from "../constants/studyGroupsConstants";

/**
 * This is the reducer for all actions relating to study groups
 * A reducer is how actions transform the state into the next state
 * @author Ethan Cannelongo
 * @date   12/20/2021
 */
const studyGroupsReducer = (state = { studyGroups: [{ title: "Test" }] }, action) => {
  switch (action.type) {
    case studyGroupsConstants.ADD_STUDY_GROUP:
      return { ...state, studyGroups: [...studyGroups, action.payload] };

    default:
      return state;
  }
};

export default studyGroupsReducer;
