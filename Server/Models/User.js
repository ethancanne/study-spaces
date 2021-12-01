const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
 * Used to define the database schema for storing users.
 * @author Cameron Burkholder
 * @date   07/29/2021
 */
const UserSchema = new Schema({
    areaCode: {
        type: String,
        required: true
    },
    conversations: {
        type: [String],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    profilePicture: {
        type: Buffer,
        required: false
    },
    studyGroups: {
        type: [String],
        required: true
    }
});
UserSchema.set("toObject", {
    versionKey: false,
    transform: (document, object) => {
        delete object.__v;
        return object;
    }
});
const userCollectionName = Configuration.getUserCollectionName();
const UserModel = Mongoose.model(userCollectionName, UserSchema);

/**
 * Provides an interface for working with users in the database.
 * @property {String} areaCode - The user's area code.
 * @property {String[]} conversations - The user's conversations/chats. This is stored as a list of
 *   MongoDB document IDs so that the conversations can be accessed directly from the user.
 * @property {String} email - The user's email address.
 * @property {String} name - The user's name.
 * @property {String} passwordHash - The user's hashed password.
 * @property {Buffer} profilePicture - The user's profile picture. This must be less than 16MB.
 * @property {String[]} studyGroups - The study groups the user is a part of. This is stored as a list
 *   of MongoDB document IDs so that the study groups can be accessed directly from the user.
 * @author Cameron Burkholder
 * @date   07/29/2021
 */
class User {
    /**
     * Initializes the user to the account passed in from the database.
     * @param  {Mongoose.Schema} userSchema The database record for a given user.
     * @author Cameron Burkholder
     * @date   07/29/2021
     */
    constructor(userSchema) {
        // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
        // In order to maximize the usability of this class, the attributes stored in the database
        // record are copied to the instance of this class so they can be properly editied.
        // The user schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, userSchema.toObject());
    }

    /**
     * @param {StudyGroup} studyGroup The study group to add.
     * @return {Boolean} True if the study group was added, false otherwise.
     */
    async addStudyGroup(studyGroup) {
        // ADD THE STUDY GROUP TO THE USER'S STUDY GROUP LIST.
        this.studyGroups.push(studyGroup.getId());

        // SAVE THE CHANGE.
        let studyGroupWasAdded = true;
        try {
            await this.save();
        } catch (error) {
            studyGroupWasAdded = false;
            Log.writeError(error);
        }
        return studyGroupWasAdded;
    }

    /**
     * Creates a user.
     * @param {UnverifiedUser} unverifiedUser The unverified user to create from.
     * @return {User} The created user.
     * @author Cameron Burkholder
     * @date   11/15/2021
     */
    static async create(unverifiedUser) {
        // CREATE THE USER IN THE DATABASE.
        const BLANK = "BLANK";
        const EMPTY = [];
        const userModel = new UserModel({
            areaCode: BLANK,
            conversations: EMPTY,
            email: unverifiedUser.getEmail(),
            name: BLANK,
            passwordHash: unverifiedUser.getPasswordHash(),
            studyGroups: EMPTY
        });
        try {
            await userModel.save();
        } catch (error) {
            console.log(error);
        }

        // RETURN THE CREATED INSTANCE.
        const user = new User(userModel);
        return user;
    }

    /**
     * Deletes a user.
     * @return {Boolean} True if the user was deleted, false otherwise.
     */
    async delete() {}

    /**
     * Gets the user's area code.
     * @return {String} The user's area code.
     *
     */
    getAreaCode() {
        return String(this.areaCode);
    }

    /**
     * Gets the user record from the database using the document ID.
     * @param  {String} userId The user ID to search for.
     * @return {User} The user instance, if found; otherwise undefined.
     * @async
     * @author Cameron Burkholder
     * @date   07/29/2021
     */
    static async getById(userId) {
        // CONVERT THE USER ID TO THE ACCEPTABLE TYPE.
        const convertedUserId = Mongoose.Types.ObjectId(userId);

        // GET THE USER BASED ON THE GIVEN ID.
        let userRecord = false;
        try {
            userRecord = await UserModel.findOne({ _id: convertedUserId }).exec();
        } catch (error) {
            Log.write("An error occurred while attempting to get a user by ID.");
            Log.writeError(error);
            // If an error occurs, it should be returned.
            return error;
        } finally {
            // If the user wasn't able to be found in the database, this routine should return undefined.
            let user = undefined;
            let userWasFound = Validator.isDefined(userRecord);
            if (userWasFound) {
                // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
                user = new User(userRecord);
            }
            return user;
        }
    }

    /**
     * Gets the user record from the database using the user's email.
     * @param  {String} userEmail The user email to search for.
     * @return {User} The user instance, if found; otherwise undefined.
     * @async
     * @author Cameron Burkholder
     * @date   10/22/2021
     */
    static async getByEmail(userEmail) {
        // GET THE USER BASED ON THE GIVEN EMAIL.
        let userRecord = false;
        try {
            userRecord = await UserModel.findOne({ email: userEmail }).exec();
        } catch (error) {
            Log.write("An error occurred while attempting to get a user by email.");
            Log.writeError(error);
            // If an error occurs, it should be returned.
            return error;
        } finally {
            // If the user wasn't able to be found in the database, this routine should return undefined.
            let user = undefined;
            let userWasFound = Validator.isDefined(userRecord);
            if (userWasFound) {
                // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
                user = new User(userRecord);
            }
            return user;
        }
    }

    /**
     * Gets the user's conversations.
     * @return {Conversation[]} The user's conversations.
     *
     */
    async getConversations() {
        // ID -> Conversation;

        // LOOP THROUGH EACH CONVERSATION ID.
        let conversations = [];
        this.conversations.map(async (conversationId) => {
            let conversation = undefined;
            try {
                conversation = await Conversation.getById(conversationId);
            } catch (error) {
                Log.writeError(error);
            } finally {
                const conversationWasFound = Validator.isDefined(conversation);
                if (conversationWasFound) {
                    conversations.push(conversation);
                }
            }
        });

        // RETURN CONVERSATIONS.
        return conversations;
    }

    /**
     * Gets the user's email.
     * @return {String} The user's email.
     *
     */
    getEmail() {
        return String(this.email);
    }

    /**
     * Gets the document id of the user in the database as a string.
     * @return {String} The document id of the user.
     * @author Cameron Burkholder
     * @date   10/10/2021
     */
    getId() {
        // GET THE DOCUMENT ID OF THE USER.
        return String(this._id);
    }

    /**
     * Gets the user's name.
     * @return {String} The user's name.
     *
     */
    getName() {
        return String(this.name);
    }

    /**
     * Gets the hash of the user's password.
     * @return {String} The user's password hash.
     * @author Cameron Burkholder
     * @date   10/22/2021
     */
    getPasswordHash() {
        // GET THE PASSWORD HASH.
        return this.passwordHash;
    }

    /**
     * Gets the user's profile picture.
     * @return {String} The user's profile picture.
     *
     */
    getProfilePicture() {
        return this.profilePicture; //Needs second look
    }

    /**
     * Used to remove any sensitive attributes so the object can be sent to the client.
     * @return {User} The user instance without any sensitive attributes.
     * @author Cameron Burkholder
     * @date   10/22/2021
     */
    removeSensitiveAttributes() {
        // DELETE SENSITIVE ATTRIBUTES FROM THE USER.
        delete this.passwordHash;
        return this;
    }

    /**
     * This saves the associated user document in the database with the current properties
     * stored in this object.
     * @return {bool} True if the user was saved, false if the user wasn't saved.
     * @async
     * @author Cameron Burkholder
     * @date   08/02/2021
     */
    async save() {
        let userWasSaved = false;
        try {
            // GET THE DATABASE INSTANCE OF THE USER.
            let userModel = await UserModel.findOne({ _id: this._id }).exec();

            // UPDATE THE DATABASE INSTANCE WITH THE CURRENT USER PROPERTIES.
            Object.assign(userModel, this);

            // SAVE THE UPDATED DATABASE INSTANCE.
            await userModel.save();
            userWasSaved = true;
        } catch (error) {
            Log.write("An error occurred while attempting to retrieve the user to save.");
            Log.writeError(error);
        } finally {
            return userWasSaved;
        }
    }

    /**
     * Sets the user's area code.
     * @param {String} areaCode The area code to set.
     * @return {Boolean} True if the area code was set, false otherwise.
     *
     */
    async setAreaCode(areaCode) {
        this.areaCode = areaCode;
        const areaCodeSet = Validator.isDefined(this.areaCode);
        return areaCodeSet;
    }

    /**
     * Sets the user's email.
     * @param {String} email The email to set.
     * @return {Boolean} True if the email was set, false otherwise.
     *
     */
    async setEmail(email) {
        this.email = email;
        const emailSet = Validator.isDefined(this.email);
        return emailSet;
    }

    /**
     * Sets the user's name.
     * @param {String} name The name to set.
     * @return {Boolean} True if the name was set, false otherwise.
     *
     */
    async setName(name) {
        this.name = name;
        const nameSet = Validator.isDefined(this.name);
        return nameSet;
    }

    /**
     * Sets the user's profile picture.
     * @param {String} newProfilePicture The profile picture to set.
     * @return {Boolean} True if the profile picture was set, false otherwise.
     *
     */
    async setProfilePicture(newProfilePicture) {}

    /**
     * Update's the user's password.
     * @param {String} newPassword The new password to set.
     * @return {Boolean} True if the password was updated, false otherwise.
     *
     */
    async updatePassword(newPassword) {}
}

module.exports = User;
