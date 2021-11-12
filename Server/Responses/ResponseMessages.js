/**
 * Defines the response messages the server can send.
 * @author Cameron Burkholder
 * @date   10/05/2021
 */
const ResponseMessages = {
  Account: {
    IncorrectPassword: "The password provided is incorrect",
    SuccessLogin: "The login was successful",
    SuccessfulAccountCreation: "The registration was successful",
    SuccessUpdateAuthenticationToken: "The authentication token has been successfully updated.",
    UserNotFound: "The user was not found"
  }
};
module.exports = ResponseMessages;
