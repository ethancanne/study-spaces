//AUTH REDUCERS
export const signIn = (user) => {
  return {
    type: "SIGN_IN",
    payload: user
  };
};
export const signOut = () => {
  return {
    type: "SIGN_OUT"
  };
};

export const createAccount = (unverifiedUser) => {
  return {
    type: "CREATE_ACCOUNT",
    payload: {
      unverifiedUser
    }
  };
};

//POPUP REDUCER
export const showStudyGroupPopup = () => {
  return {
    type: "SHOW_STUDY_GROUP_POPUP"
  };
};

export const closePopup = () => {
  return {
    type: "CLOSE_POPUP"
  };
};

//Study Groups Reducer
export const addStudyGroup = (group) => {
  return {
    type: "ADD_STUDY_GROUP",
    payload: group
  };
};
