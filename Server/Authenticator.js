const ExtractJsonWebToken = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const Mongoose = require("mongoose");

const Configuration = require("./Configuration.js");
const Log = require("./Log.js");
const ResponseCodes = require("./Responses/ResponseCodes.js");
const User = require("./Models/User.js");
const Validator = require("./Validator.js");

class JsonWebTokenStrategyOptions {
  constructor() {
    this.jwtFromRequest = ExtractJsonWebToken.fromAuthHeaderAsBearerToken();
    this.secretOrKey = Configuration.getPublicRsaKey();
    this.algorithms = ["RS256"];
  }
}

/**
* This is used for the purpose of authenticating users and protecting routes.
* @author Cameron Burkholder
* @date   07/29/2021
*/
class Authenticator {
  /**
  * Handles creating the instance of the authentication tool.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  constructor(server, passport) {
    // STORE THE SERVER AND PASSPORT INSTANCE.
    this.server = server;
    this.passport = passport;

    // INITIALIZE PASSPORT.
    const jsonWebTokenStrategyOptions = new JsonWebTokenStrategyOptions();
    const jsonWebTokenStrategy = new JwtStrategy(jsonWebTokenStrategyOptions, Authenticator.verifyJsonWebToken)
    this.passport.use(jsonWebTokenStrategy);

    // BIND THE FUNCTIONS TO THIS OBJECT.
    // Since the methods may be called from multiple scopes where "this" is defined
    // to be something other than the class instance, certain methods need to be bound
    // to this instance of the class.
    this.protectRoute = this.protectRoute.bind(this);
  }

  /**
  * Used to verify that a JSON web token is associated with a valid user.
  * @param {object} jsonWebTokenPayload The JSON web token payload to check.
  * @param {function} nextMiddlewareFunction The next function to execute after this one.
  * @async
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static async verifyJsonWebToken(jsonWebTokenPayload, nextMiddlewareFunction) {
    // GET THE USER ASSOCIATED WITH THE REQUEST.
    const userIdToSearchFor = jsonWebTokenPayload.sub;
    const user = await User.getById(userIdToSearchFor);

    // CHECK TO SEE IF AN ERROR OCCURRED.
    const errorOccurred = (user instanceof Error);
    let error = null;
    if (errorOccurred) {
      // If an error occurred while getting the user, the error will be returned,
      // so instead of the returned value representing a user, it represents an error.
      error = user;
    }

    // CHECK TO SEE IF THE USER EXISTS.
    let userExists = Validator.isDefined(user);
    if (userExists) {
      // If the user exists, then continue to the next routine, indicating that no
      // errors have occurred and supplying the user account found.
      const noErrors = null;
      return nextMiddlewareFunction(noErrors, user);
    } else {
      // If the user doesn't exist, then continue to the next routine indicating that
      // no errors have occured, but no user was found with the given ID.
      return nextMiddlewareFunction(error, userExists);
    }
  }

  /**
  * Used to prevent unauthorized users from accessing a route.
  * @return {function} The middleware function to protect the route.
  * @author Cameron Burkholder
  * @date   08/01/2021
  */
  protectRoute() {
    // USE THE PASSPORT LIBRARY TO PROTECT THE ROUTE.
    return this.passport.authenticate("jwt", { session: false });
  }
}

module.exports = Authenticator;
