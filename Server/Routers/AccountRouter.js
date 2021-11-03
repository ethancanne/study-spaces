const Path = require("path");

const Authenticator = require("../Authenticator.js");
const Configuration = require("../../Configuration.js");
const ResponseCodes = require("../Responses/ResponseCodes.js");
const ResponseMessages = require("../Responses/ResponseMessages.js");
const Routes = require("../Routes/Routes.js");
const StaticResources = require("../Routes/StaticResources.js");
const User = require("../Models/User.js");
const Validator = require("../Validator.js");

/**
* The router used to serve account-related requests.
* @author Cameron Burkholder
* @date   10/20/2021
*/
class AccountRouter {
  /**
  * Initialize the router and serve the routes.
  * @param {Server} server The server instance used to provide the routes.
  * @param {Authenticator} authenticator The authenticator used to protect the routes.
  * @author Cameron Burkholder
  * @date   10/20/2021
  */
  static serveRoutes(server, authenticator) {
    // This is used to log users in.
    server.post(Routes.Account.Login, AccountRouter.login);
    // This is used to check if an authentication token is valid. If it is valid, a new token is generated
    // so that the user can have persistent logins.
    server.get(Routes.Account.UpdateAuthenticationToken, authenticator.protectRoute(), AccountRouter.updateAuthenticationToken);
  }

  // GET ROUTES.
  /**
  * This updates a user's authentication token. This is done
  * for the purpose of persistent logins.
  * @param  {object} request The request being served.
  * @param  {object} response The response being generated.
  * @author Cameron Burkholder
  * @date   07/31/2021
  */
  static updateAuthenticationToken(request, response) {
    // GET THE AUTHENTICATION TOKEN.
    const authenticationToken = authenticator.issueAuthenticationToken(request.user);

    // SEND THE RESPONSE.
    const responseMessage = {
      message: ResponseMessages.Account.AuthenticationTokenWasUpdated,
      authenticationToken: authenticationToken.token,
      authenticationTokenExpirationDate: authenticationToken.expires,
      user: request.user
    };
    response.json(responseMessage);
  }

  // POST ROUTES.
  /**
  * This allows the user to log in.
  * @param {string} request.body.email The email address of the user.
  * @param {string} request.body.password The password of the user.
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  static async login(request, response) {
    // GET THE USER ASSOCIATED WITH THE EMAIL ADDRESS ENTERED.
    const user = await User.getByEmail(request.body.email);

    // CHECK IF A USER WITH THE EMAIL ADDRESS EXISTS.
    const userWasNotFound = Validator.isUndefined(user);
    if (userWasNotFound) {
      return response.json({ message: ResponseMessages.Account.UserNotFound });
    }

    // CHECK IF THE PASSWORD IS CORRECT.
    const passwordIsCorrect = Authenticator.verifyPassword(request.body.password, user);
    if (passwordIsCorrect) {
      // IF THE PASSWORD IS CORRECT, THE USER SHOULD BE LOGGED IN.
      // Since logging the user in requires supplying their account to the client,
      // the account object has to have any sensitive attributes removed before it gets sent.
      const authentication = Authenticator.issueAuthenticationToken(user);
      const authenticationToken = authentication.token;
      const authenticationTokenExpirationDate = authentication.expires;
      user.removeSensitiveAttributes();
      return response.json({
        authenticationToken: authenticationToken,
        authenticationTokenExpirationDate: authenticationTokenExpirationDate,
        message: ResponseMessages.Account.SuccessLogin,
        user: user
      });
    } else {
      // IF THE PASSWORD IS INCORRECT, THE LOGIN ATTEMPT SHOULD FAIL.
      return response.json({ message: ResponseMessages.Account.IncorrectPassword });
    }
  }
}

module.exports = AccountRouter;
