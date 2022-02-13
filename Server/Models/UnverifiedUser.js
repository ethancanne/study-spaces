const Mongoose = require("mongoose");
const RandomWords = require("random-words");
const Schema = Mongoose.Schema;

const Authenticator = require("../Authenticator.js");
const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const User = require("./User.js");
const Validator = require("../Validator.js");

/**
 * Used to define the database schema for storing unverified users.
 * @author Cameron Burkholder
 * @date   10/29/2021
 */
const UnverifiedUserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    school: {
        type: String,
        default: "",
        required: false
    },
    verificationToken: {
        type: String,
        required: true
    }
});
UnverifiedUserSchema.set("toObject", {
    versionKey: false,
    transform: (document, object) => {
        delete object.__v;
        return object;
    }
});
const unverifiedUserCollectionName = Configuration.getUnverifiedUserCollectionName();
const UnverifiedUserModel = Mongoose.model(unverifiedUserCollectionName, UnverifiedUserSchema);

/**
 * Provides an interface for working with unverified users in the database.
 * @property {String} email The user's email.
 * @property {String} passwordHash The user's hashed password.
 * @property {String} verificationToken The token used to verify a user's account.
 * @author Cameron Burkholder
 * @date   10/29/2021
 */
class UnverifiedUser {
    /**
     * Initializes the unverified user to the account passed in from the database.
     * @param  {Mongoose.Schema} unverifiedUserSchema The database record for a given user.
     * @author Cameron Burkholder
     * @date   07/29/2021
     */
    constructor(unverifiedUserSchema) {
        // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
        // In order to maximize the usability of this class, the attributes stored in the database
        // record are copied to the instance of this class so they can be properly editied.
        // The unverified user schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, unverifiedUserSchema.toObject());
    }

    /**
     * Creates an unverified user.
     * @param {String} email The unverified user's email.
     * @param {String} password The unverified user's password.
     * @return {UnverifiedUser} The unverified user created.
     *
     * @async
     * @static
     */
    static async create(email, password, school) {
        // GENERATE THE USER'S HASHED PASSWORD.
        const hashedPassword = Authenticator.hashPassword(password);

        // GENERATE THE VERIFICATION TOKEN.
        // The verification token cannot already exist in the database.
        let tokenIsNotUnique = true;
        let verificationToken = undefined;
        while (tokenIsNotUnique) {
            // GENERATE A RANDOM TOKEN.
            verificationToken = RandomWords({ exactly: 5, join: "-" });

            // CHECK THE UNVERIFIED USERS LIST TO SEE IF THE TOKEN IS ALREADY IN USE.
            let existingUnverifiedUser = undefined;
            try {
                existingUnverifiedUser = await UnverifiedUser.getByVerificationToken(verificationToken);
            } catch (error) {
                Log.writeError(error);
                throw error;
            }
            tokenIsNotUnique = Validator.isDefined(existingUnverifiedUser);
        }

        var newUnverifiedUser = undefined;
        //CONFIRM THAT THE USER IS ASSOCIATED WITH A SCHOOL
        if (school !== false && school !== true && school) {
            // CREATE THE UNVERIFIED USER ACCOUNT WITH A SCHOOL
            newUnverifiedUser = new UnverifiedUserModel({
                email,
                passwordHash: hashedPassword,
                school,
                verificationToken
            });
        } else {
            // CREATE THE UNVERIFIED USER ACCOUNT WITHOUT A SCHOOL
            newUnverifiedUser = new UnverifiedUserModel({
                email,
                passwordHash: hashedPassword,
                verificationToken
            });
        }

        // SAVE THE USER ACCOUNT.
        try {
            await newUnverifiedUser.save();
        } catch (error) {
            Log.writeError(error);
        }

        // INSTANTIATE THE MODEL.
        const unverifiedUser = new UnverifiedUser(newUnverifiedUser);
        return unverifiedUser;
    }

    /**
     * Deletes an unverified user.
     * @return {Boolean} True if the unverified user was deleted, false otherwise.
     *
     * @async
     */
    async delete() {
        // DELETE THE UNVERIFIED USER.
        let userWasDeleted = false;
        let recordsDeleted = undefined;
        try {
            recordsDeleted = await UnverifiedUserModel.deleteOne({ _id: this._id });
        } catch (error) {
            Log.writeError(error);
        } finally {
            userWasDeleted = recordsDeleted.ok;
            return userWasDeleted;
        }
    }

    /**
     * Gets the user record from the database using the user's email.
     * @param  {String} verificationToken The verification token used to search for an unverified user.
     * @return {UnverifiedUser} The user instance, if found; otherwise undefined.
     * @author Cameron Burkholder
     * @date   10/22/2021
     * @async
     * @static
     */
    static async getByEmail(email) {
        // GET THE USER BASED ON THE GIVEN EMAIL.
        let unverifiedUserRecord = false;
        try {
            unverifiedUserRecord = await UnverifiedUserModel.findOne({ email: email }).exec();
        } catch (error) {
            Log.write("An error occurred while attempting to get an unverified user by email.");
            Log.writeError(error);
            // If an error occurs, it should be returned.
            return error;
        } finally {
            // If the user wasn't able to be found in the database, this routine should return undefined.
            let unverifiedUser = undefined;
            let unverifiedUserWasFound = Validator.isDefined(unverifiedUserRecord);
            if (unverifiedUserWasFound) {
                // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
                unverifiedUser = new UnverifiedUser(unverifiedUserRecord);
            }
            return unverifiedUser;
        }
    }

    /**
     * Gets the user record from the database using the user's email.
     * @param  {String} verificationToken The verification token used to search for an unverified user.
     * @return {UnverifiedUser} The user instance, if found; otherwise undefined.
     * @author Cameron Burkholder
     * @date   10/22/2021
     * @async
     * @static
     */
    static async getByVerificationToken(verificationToken) {
        // GET THE USER BASED ON THE GIVEN VERIFICATION TOKEN.
        let unverifiedUserRecord = false;
        try {
            unverifiedUserRecord = await UnverifiedUserModel.findOne({ verificationToken: verificationToken }).exec();
        } catch (error) {
            Log.write("An error occurred while attempting to get an unverified user by verification token.");
            Log.writeError(error);
            // If an error occurs, it should be returned.
            return error;
        } finally {
            // If the user wasn't able to be found in the database, this routine should return undefined.
            let unverifiedUser = undefined;
            let userWasFound = Validator.isDefined(unverifiedUserRecord);
            if (userWasFound) {
                // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
                unverifiedUser = new UnverifiedUser(unverifiedUserRecord);
            }
            return unverifiedUser;
        }
    }

    /**
     * Gets the unverified user's email.
     * @return {String} The unverified user's email.
     * @author Cameron Burkholder
     * @date 11/15/2021
     */
    getEmail() {
        return this.email;
    }

    /**
     * Gets the unverified user's hashed password.
     * @return {String} The unverified user's hashed password.
     * @author Cameron Burkholder
     * @date   11/15/2021
     */
    getPasswordHash() {
        return this.passwordHash;
    }

    /**
     * Gets the unverified user's school.
     * @return {String} The unverified user's hashed school.
     * @author Ethan Cannelongo
     * @date   02/12/2022
     */
    getSchool() {
        return this.school;
    }

    /**
     * Gets the unverified user's verificaion token.
     * @return {String} The unverified user's verificaion token.
     * @author Cameron Burkholder
     * @date   11/15/2021
     */
    getVerificationToken() {
        return this.verificationToken;
    }

    /**
     * Removes any sensitive attributes from the user.
     * @return {UnverifiedUser} The unverified user with sensitive attributes removed.
     * @author Cameron Burkholder
     * @date   11/12/2021
     */
    removeSensitiveAttributes() {
        delete this.passwordHash;
        return this;
    }

    /**
     * Saves the unverified user to the database.
     * @return {Boolean} True if the unverified user was saved, false otherwise.
     * @author Cameron Burkholder
     * @date   11/12/2021
     * @async
     */
    async save() {
        let unverifiedUserWasSaved = false;
        try {
            // GET THE DATABASE INSTANCE OF THE USER.
            let unverifiedUserModel = await UnverifiedUserModel.findOne({ _id: this._id }).exec();

            // UPDATE THE DATABASE INSTANCE WITH THE CURRENT USER PROPERTIES.
            Object.assign(unverifiedUserModel, this);

            // SAVE THE UPDATED DATABASE INSTANCE.
            await unverifiedUserModel.save();
            unverifiedUserWasSaved = true;
        } catch (error) {
            Log.write("An error occurred while attempting to retrieve the unverified user to save.");
            Log.writeError(error);
        } finally {
            return unverifiedUserWasSaved;
        }
    }

    /**
     * Verifies a user's account. This process involves creating a normal user document and deleting
     *    the unverified user document.
     * @param {String} verificationToken The verification token to identify the user being verified.
     * @param {String} areaCode The user's area code.
     * @param {String} name The user's name.
     * @param {Buffer=} profilePicture The user's profile picture.
     * @return {User} The verified user.
     * @author Cameron Burkholder
     * @date   11/15/2021
     * @async
     * @static
     */
    static async verify(verificationToken, areaCode, name, profilePicture) {
        // GET THE UNVERIFIED USER ASSOCIATED WITH THE VERIFICATION TOKEN.
        let unverifiedUser = undefined;
        try {
            unverifiedUser = await UnverifiedUser.getByVerificationToken(verificationToken);
        } catch (error) {
            Log.writeError(error);
        } finally {
            const unverifiedUserExists = Validator.isDefined(unverifiedUser);
            if (unverifiedUserExists) {
                // CREATE THE VERIFIED USER.
                const user = await User.create(unverifiedUser, areaCode, name, profilePicture);

                // DELETE THE UNVERIFIED USER.
                const userWasCreated = Validator.isDefined(user);
                if (userWasCreated) {
                    await unverifiedUser.delete();
                }
                return user;
            } else {
                return unverifiedUser;
            }
        }
    }
}

module.exports = UnverifiedUser;
