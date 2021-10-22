/**
* Defines the response messages the server can send.
* @author Cameron Burkholder
* @date   10/05/2021
*/
const ResponseMessages = {
  Account: {
    IncorrectPassword: "The password provided is incorrect",
    SuccessLogin: "The login was successful",
    SuccessUpdateAuthenticationToken: "The authentication token has been successfully updated.",
    UserNotFound: "The user was not found"
  },
  Notifications: {
    SuccessSubscribeToPushNotifications: "Push notifications have successfully been subscribed.",
    ErrorSubscribeToPushNotifications: "An error occurred while attempting to subscribe to push notifications."
  }
};
module.exports = ResponseMessages;
