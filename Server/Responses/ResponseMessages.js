/**
 * Defines the response messages the server can send.
 * @author Cameron Burkholder
 * @date   10/05/2021
 */
const ResponseMessages = {
  Account: {
    ErrorCreateAccount: "An error occurred while attempting to create an account.",
    NotOver18: "You need to be 18 or older to create an account.",
    IncorrectPassword: "The password provided is incorrect.",
    SuccessAccountCreated: "The account was created successfully.",
    SuccessAccountSetup: "The account was setup successfully.",
    SuccessLogin: "The login was successful.",
    SuccessUpdateAuthenticationToken: "The authentication token has been successfully updated.",
    UnverifiedUserWasFound: "The unverified user was found.",
    UserAlreadyExists: "A user with that email address already exists.",
    UserNotFound: "The user was not found."
  },
  Study: {
    SuccessCreateStudyGroup: "The study group was created sucessfully"
  }
};
module.exports = ResponseMessages;
