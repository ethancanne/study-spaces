const Path = require("path");

const Log = require("../Log.js");
const Routes = require("../Routes/Routes.js");
const ResponseCodes = require("../Responses/ResponseCodes.js");
const ResponseMessages = require("../Responses/ResponseMessages.js");
const User = require("../Models/User.js");

/**
* This defines the router used to serve notifications requests.
* @param {Server} server The server instance to use.
* @param {Authenticator} authenticator The authenticator to use.
* @async
* @author Cameron Burkholder
* @date   07/31/2021
*/
async function NotificationsRouter(server, authenticator) {
  // This allows users to subscribe to push notifications. This route should be protected.
  server.post(Routes.Notifications.Subscribe, authenticator.protectRoute(), subscribeToPushNotifications);
}

// POST ROUTES.
/**
* This subscribes a user to push notifications.
* @param  {object} request The request to serve.
* @param  {object} response The response to generate.
* @async
* @author Cameron Burkholder
* @date   08/02/2021
*/
async function subscribeToPushNotifications(request, response) {
  // GET THE USER ACCOUNT.
  const user = await User.getById(request.user._id);

  // CHECK THAT THE USER WAS FOUND.
  let userWasFound = ("error" !== typeof user);
  if (userWasFound) {
    // SET THE USER'S NOTIFICATIONS SUBSCRIPTION.
    const subscriptionWasSaved = await user.subscribeToPushNotifications(request.body.subscription);

    // CHECK IF THE SUBSCRIPTION WAS SAVED.
    if (subscriptionWasSaved) {
      response.status(ResponseCodes.Success);
      return response.send(ResponseMessages.Notifications.SuccessSubscribeToPushNotifications);
    }
  }

  // HANDLE ANY ERRORS.
  // If the execution reaches this point then the user has not been found and the
  // subscription has not been saved. This indicates an error.
  response.status(ResponseCodes.Error);
  return response.send(ResponseMessages.Notifications.ErrorSubscribeToPushNotifications);
}

module.exports = NotificationsRouter;
