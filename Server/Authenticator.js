const Bcrypt = require("bcryptjs");
const ExtractJsonWebToken = require("passport-jwt").ExtractJwt;
const JsonWebToken = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const Mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const Configuration = require("../Configuration.js");
const Log = require("./Log.js");
const ResponseCodes = require("./Responses/ResponseCodes.js");
const ResponseMessages = require("./Responses/ResponseMessages.js");
const User = require("./Models/User.js");
const Validator = require("./Validator.js");

/**
 * Used to model the options a JSON web token-based authentication strategy can have.
 * @author Cameron Burkholder
 * @date   07/29/2021
 */
class JsonWebTokenStrategyOptions {
    /**
     * Initializes a set of default JSON web token options.
     * @author Cameron Burkholder
     * @date   07/29/2021
     */
    constructor() {
        this.jwtFromRequest = ExtractJsonWebToken.fromAuthHeaderAsBearerToken();
        this.secretOrKey = Configuration.getPublicRsaKey();
        this.algorithms = ["RS256"];
    }
}

/**
 * Used to protect routes and manage authentication tokens.
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
        const jsonWebTokenStrategy = new JwtStrategy(jsonWebTokenStrategyOptions, Authenticator.verifyJsonWebToken);
        this.passport.use(jsonWebTokenStrategy);

        // BIND THE FUNCTIONS TO THIS OBJECT.
        // Since the methods may be called from multiple scopes where "this" is defined
        // to be something other than the class instance, certain methods need to be bound
        // to this instance of the class.
        this.protectRoute = this.protectRoute.bind(this);
    }

    /**
     * Creates a hash for a user's password.
     * @param {String} password The password to hash.
     * @author Cameron Burkholder
     * @date   11/15/2021
     */
    static hashPassword(password) {
        const saltRounds = 10;
        const salt = Bcrypt.genSaltSync(saltRounds);
        const hash = Bcrypt.hashSync(password, salt);
        return hash;
    }

    /**
     * Generates an authentication token for a user.
     * @param {User} user The user to generate a token for.
     * @returns {JsonWebToken} The authentication token.
     * @author Cameron Burkholder
     * @date   10/20/2021
     */
    static issueAuthenticationToken(user) {
        // GENERATE THE AUTHENTICATION TOKEN.
        const userId = user.getId();
        // The authentication token is valid for a week.
        const authenticationDurationInMilliseconds = 1000 * 60 * 60 * 24 * 7;
        const authenticationTokenPayload = {
            sub: userId,
            iat: Date.now()
        };
        const privateRsaKey = Configuration.getPrivateRsaKey();
        const authenticationTokenBody = JsonWebToken.sign(authenticationTokenPayload, privateRsaKey, {
            expiresIn: authenticationDurationInMilliseconds,
            algorithm: "RS256"
        });
        const authenticationToken = {
            token: `Bearer ${authenticationTokenBody}`,
            expires: authenticationDurationInMilliseconds
        };
        return authenticationToken;
    }

    /**
     * Sends an email to a user.
     * @param {UnverifiedUser} user The user to send the email to.
     * @param {String} subject The subject of the email.
     * @param {String} body The body of the email.
     * @return {Boolean} True if the email was sent, false otherwise.
     * @author Cameron Burkholder
     * @date   01/12/2022
     * @async
     */
    static async sendEmail(user, subject, body) {
        // GET THE USERS EMAIL ADDRESS.
        const temporaryEmailExists = Validator.isDefined(user.temporaryEmail);
        let emailAddress;
        if (temporaryEmailExists) {
            emailAddress = user.temporaryEmail;
        } else {
            emailAddress = user.getEmail();
        }

        // SEND THE EMAIL.
        // Generate test SMTP service account from ethereal.email
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        var worked = "testing";

        // send mail with defined transport object
        try {
            let info = await transporter.sendMail({
                from: process.env.EMAIL_ACCOUNT,
                to: emailAddress, // list of receivers
                subject: subject, // Subject line
                text: body, // plain text body
                html: "<h1>" + body + "</h1>" // html body
            });
            return true;
        } catch (error) {
            Log.write("Sending email failed.");
            Log.writeError(error);
            return false;
        }
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
        const errorOccurred = user instanceof Error;
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
     * Checks if the provided password is correct.
     * @param {String} password The password to check.
     * @param {User} user The user to check the password for.
     * @return {boolean} True if the password is correct, false otherwise.
     * @author Cameron Burkholder
     * @date   10/22/2021
     */
    static verifyPassword(password, user) {
        // CHECK IF THE PASSWORD IS CORRECT.
        const passwordHash = user.getPasswordHash();
        const passwordIsCorrect = Bcrypt.compareSync(password, passwordHash);
        return passwordIsCorrect;
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
