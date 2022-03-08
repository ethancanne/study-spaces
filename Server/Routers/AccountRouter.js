const multer = require("multer");
const Path = require("path");
const RandomWords = require("random-words");
const sharp = require("sharp");
const swot = require("swot-node");

const Authenticator = require("../Authenticator.js");
const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const ResponseCodes = require("../Responses/ResponseCodes.js");
const ResponseMessages = require("../Responses/ResponseMessages.js");
const Routes = require("../Routes/Routes.js");
const StaticResources = require("../Routes/StaticResources.js");
const UnverifiedUser = require("../Models/UnverifiedUser.js");
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
        // This is used to check if an authentication token is valid. If it is valid, a new token is generated
        // so that the user can have persistent logins.
        server.get(
            Routes.Account.UpdateAuthenticationToken,
            authenticator.protectRoute(),
            AccountRouter.updateAuthenticationToken
        );
        server.post(
            Routes.Account.ChangeEmail,
            authenticator.protectRoute(),
            Validator.validateChangeEmail,
            AccountRouter.changeEmail
        );
        server.post(
            Routes.Account.ChangePassword,
            authenticator.protectRoute(),
            Validator.validatePasswordInput,
            AccountRouter.changePassword
        );
        // This is used to create accounts.
        server.post(Routes.Account.CreateAccount, Validator.validateCreateAccountInput, AccountRouter.createAccount);
        // Gets the unverified user to complete the verification process.
        server.post(Routes.Account.GetUnverifiedUser, AccountRouter.getUnverifiedUser);
        // This is used to log users in.
        server.post(Routes.Account.Login, AccountRouter.login);
        // This is used to delete an account.
        server.delete(Routes.Account.Delete, authenticator.protectRoute(), AccountRouter.deleteAccount);

        // This is used to allow users to upload profile pictures.
        const fileFilter = (req, file, cb) => {
            const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (allowedFileTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                req.profilePictureFailed = true;
                Log.write("The file format is not supported.");
                cb(null, false, req.profilePictureFailed);
            }
        };

        //Limit the file size
        const upload = multer({
            limits: {
                fileSize: 2000000
            },
            fileFilter: fileFilter
        });

        // This is used to complete the account setup process.
        server.post(
            Routes.Account.SetupAccount,
            Validator.validateSetupAccount,
            upload.single("profilePicture"),
            AccountRouter.setupAccount
        );
        // This is used to complete the email change process.
        server.post(Routes.Account.VerifyEmailChange, AccountRouter.verifyEmailChange);
    }

    // GET ROUTES.
    /**
     * This updates a user's authentication token. This is done
     * for the purpose of persistent logins.
     * @param  {object} request The request being served.
     * @param  {object} response The response being generated.
     * @author Cameron Burkholder
     * @date   07/31/2021
     * @static
     */
    static updateAuthenticationToken(request, response) {
        // GET THE AUTHENTICATION TOKEN.
        const authenticationToken = authenticator.issueAuthenticationToken(request.user);

        // SEND THE RESPONSE.
        const responseMessage = {
            message: ResponseMessages.Account.AuthenticationTokenWasUpdated,
            authenticationToken: authenticationToken.token,
            authenticationTokenExpirationDate: new Date(Date.now() + authentication.expires).toDateString(),
            user: request.user
        };
        response.json(responseMessage);
    }

    // POST ROUTES.
    /**
     * Creates an unverified account.
     * @param {String} request.body.email The email address of the user to be created.
     * @param {String} request.body.password The password of the user to be created.
     * @param {String} request.body.confirmPassword The password confirmation of the user to be created.
     * @author Ethan Cannelongo
     * @date   01/14/2022
     * @async
     * @static
     */
    static async createAccount(request, response) {
        try {
            // CHECK FOR AN EXISTING UNVERIFIED ACCOUNT.
            const existingUnverifiedUser = await UnverifiedUser.getByEmail(request.body.email);
            const unverifiedUserAlreadyExists = Validator.isDefined(existingUnverifiedUser);
            if (unverifiedUserAlreadyExists) {
                return response.json({ message: ResponseMessages.Account.UserAlreadyExists });
            }

            // CHECK FOR AN EXISTING ACCOUNT.
            const existingUser = await User.getByEmail(request.body.email);
            const userAlreadyExists = Validator.isDefined(existingUser);
            if (userAlreadyExists) {
                return response.json({ message: ResponseMessages.Account.UserAlreadyExists });
            }

            //SET SCHOOL PROPERTY
            var school = undefined;
            try {
                school = await swot.getSchoolName(request.body.email);
            } catch (e) {
                Log.write(
                    "An error occurred while attempting to find a school associated with the provided email address."
                );
                return response.json({ message: ResponseMessages.Account.ErrorCreateAccount });
            }

            // CREATE THE UNVERIFIED ACCOUNT.
            const unverifiedUser = await UnverifiedUser.create(request.body.email, request.body.password, school);
            const accountWasNotCreated = Validator.isUndefined(unverifiedUser);
            if (accountWasNotCreated) {
                return response.json({ message: ResponseMessages.Account.ErrorCreateAccount });
            }

            // EMAIL THE VERIFICATION LINK TO THE USER.
            const verificationToken = unverifiedUser.verificationToken;
            let verificationLink = `http://${request.hostname}:3000/verify/${verificationToken}`;
            const emailSubject = "Your Study Spaces Verification Link";
            const emailBody = "Click this: " + verificationLink;

            // Send the Verification
            let emailWasSent = false;
            try {
                emailWasSent = await Authenticator.sendEmail(unverifiedUser, emailSubject, emailBody);
            } catch (error) {
                Log.write("An error occurred while sending an email during the account creation process.");
                Log.writeError(error);
                return response.json({ message: ResponseMessages.Account.ErrorCreateAccount });
            }
            if (!emailWasSent) {
                return response.json({ message: ResponseMessages.Account.ErrorSendingEmail });
            }

            // SEND THE RESPONSE.
            unverifiedUser.removeSensitiveAttributes();
            response.json({
                message: ResponseMessages.Account.SuccessAccountCreated,
                unverifiedUser: unverifiedUser
            });
        } catch {
            return response.json({ message: ResponseMessages.Account.ErrorCreateAccount });
        }
    }

    /**
     * Route to process the request for changing email and generate verification link.
     * @param {String} request.body.newEmail
     * @param {String} request.body.currentPassword
     * @author Clifton Croom
     * @date 02/09/2022
     * @async
     * @static
     */
    static async changeEmail(request, response) {
        //GENERATE VERIFICATION TOKEN
        const passwordIsCorrect = Authenticator.verifyPassword(request.body.currentPassword, request.user);

        if (!passwordIsCorrect) {
            return response.json({ message: ResponseMessages.Account.IncorrectPassword });
        } else {
            let tokenIsNotUnique = true;
            let verificationToken = undefined;

            // GENERATE A RANDOM TOKEN.
            while (tokenIsNotUnique) {
                verificationToken = RandomWords({ exactly: 5, join: "-" });

                // CHECK THE USERS LIST TO SEE IF THE TOKEN IS ALREADY IN USE.
                let existingUser = undefined;
                try {
                    existingUser = await User.getByVerificationToken(verificationToken); // NTDT
                } catch (error) {
                    Log.writeError(error);
                    throw error;
                }
                tokenIsNotUnique = Validator.isDefined(existingUser);
            }

            // SET THE VERIFICATION TOKEN.
            const tokenSet = await request.user.setVerificationToken(verificationToken);
            if (!tokenSet) {
                return response.json({ message: ResponseMessages.Account.ErrorSendingEmail });
            }

            // SET THE TEMPORARY EMAIL.
            const emailSet = await request.user.setTemporaryEmail(request.body.newEmail);
            if (!emailSet) {
                return response.json({ message: ResponseMessages.Account.ErrorSendingEmail });
            }

            // EMAIL THE VERIFICATION LINK TO THE USER.
            let verificationLink = `http://${request.hostname}:3000/verifyEmail/${verificationToken}`;
            const emailSubject = "Your Study Spaces Verification Link";
            const emailBody = "Click this: " + verificationLink;
            let emailWasSent = false;
            try {
                emailWasSent = await Authenticator.sendEmail(request.user, emailSubject, emailBody);
            } catch (error) {
                Log.write("An error occurred while sending an email during the account creation process.");
                Log.writeError(error);
                return response.json({ message: ResponseMessages.Account.ErrorSendingEmail });
            }
            if (!emailWasSent) {
                return response.json({ message: ResponseMessages.Account.ErrorSendingEmail });
            }
            return response.json({ message: ResponseMessages.Account.EmailSent });
        }
    }

    /**
     * @param {String} request.body.password
     * @param {String} request.body.confirmPassword
     * @author Clifton Croom
     * @date 02/01/2022
     * @async
     * @static
     */
    static async changePassword(request, response) {
        const passwordIsCorrect = Authenticator.verifyPassword(request.body.currentPassword, request.user);
        let passwordChanged = false;
        if (passwordIsCorrect) {
            try {
                let newPassHash = Authenticator.hashPassword(request.body.newPassword);
                passwordChanged = await request.user.updatePassword(newPassHash);
            } catch (error) {
                Log.write("An error occurred while attempting to change user's password.");
                Log.writeError(error);
            }
        } else {
            return response.json({ message: ResponseMessages.Account.IncorrectPassword });
        }
        if (passwordChanged) {
            return response.json({ message: ResponseMessages.Account.SuccessChangingPassword });
        } else {
            return response.json({ message: ResponseMessages.Account.ErrorChangingPassword });
        }
    }

    /**
     * This allows the user to log in.
     * @param {String} request.body.email The email address of the user.
     * @param {String} request.body.password The password of the user.
     * @author Cameron Burkholder
     * @date   10/22/2021
     * @async
     * @static
     */
    static async login(request, response) {
        // GET THE USER ASSOCIATED WITH THE EMAIL ADDRESS ENTERED.
        const user = await User.getByEmail(request.body.email);

        // CHECK IF A USER WITH THE EMAIL ADDRESS EXISTS.
        const userWasNotFound = Validator.isUndefined(user);
        if (userWasNotFound) {
            return response.json({ message: ResponseMessages.Account.UserNotFound });
        }

        // CHECK IF THE USER IS ACTIVE
        if (user.active == false) {
            return response.json({ message: ResponseMessages.Account.InactiveAccount });
        }

        // CHECK IF THE PASSWORD IS CORRECT.
        const passwordIsCorrect = Authenticator.verifyPassword(request.body.password, user);
        if (passwordIsCorrect) {
            // IF THE PASSWORD IS CORRECT, THE USER SHOULD BE LOGGED IN.
            // Since logging the user in requires supplying their account to the client,
            // the account object has to have any sensitive attributes removed before it gets sent.
            const authentication = Authenticator.issueAuthenticationToken(user);
            const authenticationToken = authentication.token;
            const authenticationTokenExpirationDate = new Date(Date.now() + authentication.expires).toDateString();
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

    /**
     * Finishes setting up an account.
     * @param {String} request.body.areaCode The user's area code.
     * @param {String} request.body.name The name to set for the user.
     * @author Cliff Croom
     * @date   11/16/2021
     * @async
     * @static
     */
    static async setupAccount(request, response) {
        // CHECK THAT THE PROFILE PICTURE (IF PROVIDED) HAS NOT FAILED.
        if (request.profilePictureFailed) {
            return response.json({ message: ResponseMessages.Account.ErrorUploadProfilePicture });
        }

        //VERIFY THE USER IS OVER 18
        if (!request.body.is18OrOver) {
            return response.json({ message: ResponseMessages.Account.NotOver18 });
        }

        try {
            // GET THE USER BEING SET UP.
            const unverifiedUser = await UnverifiedUser.getByVerificationToken(request.body.verificationToken);
            const unverifiedUserWasNotFound = !Validator.isDefined(unverifiedUser);
            if (unverifiedUserWasNotFound) {
                return response.json({ message: ResponseMessages.Account.ErrorCreateAccount });
            }

            // DETERMINE IF A PROFILE PICTURE HAS BEEN PROVIDED.
            let encoded = undefined;
            if (Validator.isDefined(request.file)) {
                // Resize the profile picture and convert it to a png
                const profilePicture = await sharp(request.file.buffer)
                    .resize({ height: 200, width: 200 })
                    .png()
                    .toBuffer();
                // Encode the picture to base64 and store it in db
                encoded = profilePicture.toString("base64");
            }

            // VERIFY THE USER.
            const verificationToken = unverifiedUser.getVerificationToken();
            const verifiedUser = await UnverifiedUser.verify(
                verificationToken,
                request.body.areaCode,
                request.body.name,
                encoded
            );

            // SAVE THE UPDATED ACCOUNT TO THE DATABSE.
            const userWasSaved = await verifiedUser.save();
            if (userWasSaved) {
                const authentication = Authenticator.issueAuthenticationToken(verifiedUser);
                const authenticationToken = authentication.token;
                const authenticationTokenExpirationDate = new Date(Date.now() + authentication.expires).toDateString();
                verifiedUser.removeSensitiveAttributes();
                response.json({
                    authenticationToken: authenticationToken,
                    authenticationTokenExpirationDate: authenticationTokenExpirationDate,
                    message: ResponseMessages.Account.SuccessAccountSetup,
                    user: verifiedUser
                });
            } else {
                return response.json({ message: ResponseMessages.Account.ErrorCreateAccount });
            }
        } catch {
            return response.json({ message: ResponseMessages.Account.ErrorCreateAccount });
        }
    }

    /**
     * Gets the unverified user to complete the verification process.
     * @param {String} verificationToken The verification token used to verify the account.
     * @author Cameron Burkholder
     * @date   11/12/2021
     * @async
     * @static
     */
    static async getUnverifiedUser(request, response) {
        // PARSE THE VERIFICATION TOKEN.
        const verificationToken = request.body.verificationToken;

        // GET THE UNVERIFIED USER.
        let unverifiedUser = undefined;
        try {
            unverifiedUser = await UnverifiedUser.getByVerificationToken(verificationToken);
        } catch (error) {
            Log.writeError(error);
            console.log(error);
            return response.json({ message: ResponseMessages.Account.ErrorCreateAccount });
        } finally {
            const unverifiedUserWasFound = Validator.isDefined(unverifiedUser);
            if (unverifiedUserWasFound) {
                unverifiedUser.removeSensitiveAttributes();
                return response.json({
                    message: ResponseMessages.Account.UnverifiedUserWasFound,
                    unverifiedUser: unverifiedUser
                });
            } else {
                return response.json({ message: ResponseMessages.Account.UserNotFound });
            }
        }
    }

    /**
     * Deletes a user's account.
     * @author Cameron Burkholder
     * @date   02/04/2022
     * @async
     * @static
     */
    static async deleteAccount(request, response) {
        // CHECK THAT THE CORRECT PASSWORD HAS BEEN PROVIDED.
        const currentPassword = request.body.currentPassword;
        const user = request.user;
        const passwordIsCorrect = Authenticator.verifyPassword(currentPassword, user);
        if (!passwordIsCorrect) {
            return response.json({ message: ResponseMessages.Account.IncorrectPassword });
        }

        // GET THE USER.
        let userWasDeleted = false;
        try {
            userWasDeleted = await user.delete();
        } catch (error) {
            Log.write("An error occurred while attempting to delete an account.");
            Log.writeError(error);
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.Account.ErrorDeleteAccount });
        }
        if (!userWasDeleted) {
            return response.json({ message: ResponseMessages.Account.ErrorDeleteAccount });
        }

        // SEND THE RESPONSE.
        // If the execution reaches this point, then the account was been deleted.
        return response.json({ message: ResponseMessages.Account.SuccessAccountDeleted });
    }

    /**
     * Completes the email change process.
     * @param {String} request.body.verificationToken The token used to identify
     *   the user account to complete the email change process for.
     * @author Cameron Burkholder
     * @date   02/11/2022
     * @async
     * @static
     */
    static async verifyEmailChange(request, response) {
        // GET THE VERIFICATION TOKEN.
        const verificationToken = request.body.verificationToken;
        const verificationTokenExists = Validator.isDefined(verificationToken);
        if (!verificationTokenExists) {
            return response.json({ message: ResponseMessages.Account.UserNotFound });
        }

        // FIND THE USER ACCOUNT ASSOCIATED WITH THE TOKEN.
        let user = undefined;
        try {
            user = await User.getByVerificationToken(verificationToken);
        } catch (error) {
            Log.write("An error occurred while attempting to get the user by verification token.");
            Log.writeError(error);
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.Account.ErrorChangingEmail });
        }
        const userWasNotFound = Validator.isUndefined(user);
        if (userWasNotFound) {
            return response.json({ message: ResponseMessages.Account.UserNotFound });
        }

        // CHANGE THE USER'S EMAIL TO THE NEW EMAIL.
        let emailWasChanged = false;
        const newEmail = user.temporaryEmail;
        try {
            emailWasChanged = await user.setEmail(newEmail);
        } catch (error) {
            Log.write("An error occurred while attempting to set the email to the new email.");
            Log.writeError(error);
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.Account.ErrorChangingEmail });
        }
        if (emailWasChanged) {
            // DELETE THE TEMPORARY EMAIL AND VERIFICATION TOKEN ATTRIBUTES.
            const userWasSaved = await user.removeTemporaryEmail();
            if (userWasSaved) {
                Authenticator.sendEmail(
                    user.removeSensitiveAttributes(),
                    "Email Successfully Updated",
                    `Your email has been successfully changed to ${newEmail}. If you did not initiate this action, please change your password immediately.`
                );
                return response.json({ user, message: ResponseMessages.Account.SuccessChangingEmail });
            }
        }
        // INDICATE AN ERROR HAS OCCURRED.
        // If execution reaches this point, an error has occurred.
        response.status(ResponseCodes.Error);
        return response.json({ message: ResponseMessages.Account.ErrorChangingEmail });
    }
}

module.exports = AccountRouter;
