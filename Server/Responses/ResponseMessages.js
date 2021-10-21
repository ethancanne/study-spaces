/**
* Defines the response messages the server can send.
* @author Cameron Burkholder
* @date   10/05/2021
*/
const ResponseMessages = {
  Account: {
    AuthenticationTokenWasUpdated: "The authentication token has been updated."
  },
  Notifications: {
    SuccessSubscribeToPushNotifications: "Push notifications have successfully been subscribed.",
    ErrorSubscribeToPushNotifications: "An error occurred while attempting to subscribe to push notifications."
  }
};
module.exports = ResponseMessages;
