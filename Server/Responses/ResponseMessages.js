/**
 * Defines the response messages the server can send.
 * @author Cameron Burkholder
 * @date   10/05/2021
 */
const ResponseMessages = {
  Account: {
    ErrorCreateAccount: "An error occurred while attempting to create an account.",
    IncorrectPassword: "The password provided is incorrect",
    SuccessAccountCreated: "The account was created successfully",
    SuccessLogin: "The login was successful",
    SuccessUpdateAuthenticationToken: "The authentication token has been successfully updated.",
    UserNotFound: "The user was not found"
  }
};
module.exports = ResponseMessages;
