import authConstants from "../constants/authConstants";

// Load the user into the state if it is already logged in
let user = JSON.parse(localStorage.getItem("user"));
const currentDate = Date.now();
const jwtExpirationDate = new Date(localStorage.getItem("authenticationTokenExpirationDate"));
const userIsLoggedIn = currentDate < jwtExpirationDate;
const initialState = user ? { isLoggedIn: userIsLoggedIn, user } : {};

/**
 * This is the reducer for all actions relating to authentication
 * A reducer is how actions transform the state into the next state
 * @author Ethan Cannelongo
 * @date   11/09/2021
 */
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    //Sign the user in and save the user to local storage
    case authConstants.SIGN_IN:
      localStorage.setItem("token", action.payload.authenticationToken);
      localStorage.setItem("authenticationTokenExpirationDate", action.payload.authenticationTokenExpirationDate);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user, isLoggedIn: true };

    case authConstants.SIGN_OUT:
      localStorage.clear();
      return { ...state, user: {}, isLoggedIn: false };

    case authConstants.CREATE_ACCOUNT:
      localStorage.setItem("unverifiedUser", JSON.stringify(action.payload.unverifiedUser));
      return { ...state, unverifiedUser: action.payload.unverifiedUser, isLoggedIn: true};

    default:
      return state;
  }
};

export default authReducer;
