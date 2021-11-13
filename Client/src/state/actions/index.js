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
