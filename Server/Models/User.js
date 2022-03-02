const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");
var StudyGroup = require("./StudyGroup.js");

/**
 * Used to define the database schema for storing users.
 * @author Cameron Burkholder
 * @date   07/29/2021
 */
const UserSchema = new Schema({
    active: {
        type: Boolean,
        required: true
    },
    areaCode: {
        type: String,
        required: false
    },
    conversations: {
        type: [Mongoose.Schema.Types.ObjectId],
        ref: Configuration.getConversationCollectionName(),
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
        type: String,
        required: false
    },
    school: {
        type: String,
        required: false
    },
    studyGroups: {
        type: [Mongoose.Schema.Types.ObjectId],
        ref: Configuration.getStudyGroupCollectionName(),
        required: true
    },
    temporaryEmail: {
        type: String,
        required: false
    },
    verificationToken: {
        type: String,
        required: false
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
 * @property {String} areaCode The user's area code.
 * @property {Mongoose.Schema.Types.ObjectId[]} conversations The user's conversations/chats. This is stored as a list of
 *   MongoDB document IDs so that the conversations can be accessed directly from the user.
 * @property {String} email The user's email address.
 * @property {String} name The user's name.
 * @property {String} passwordHash The user's hashed password.
 * @property {Buffer} profilePicture The user's profile picture. This must be less than 16MB.
 * @property {Mongoose.Schema.Types.ObjectId[]} studyGroups The study groups the user is a part of. This is stored as a list
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
     *
     * @async
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
     * @param {StudyGroup} studyGroup The study group to remove.
     * @return {Boolean} True if the study group was removed, false otherwise.
     *
     * @async
     */
     async removeStudyGroup(studyGroup) {
        // REMOVE THE STUDY GROUP TO THE USER'S STUDY GROUP LIST.
        this.studyGroups.pop(studyGroup.getId());

        // SAVE THE CHANGE.
        let studyGroupWasRemoved = true;
        try {
            await this.save();
        } catch (error) {
            studyGroupWasRemoved = false;
            Log.writeError(error);
        }
        return studyGroupWasRemoved;
    }

    /**
     * Creates a user.
     * @param {UnverifiedUser} unverifiedUser The unverified user to create from.
     * @param {String} areaCode The user's area code.
     * @param {String} name The user's name.
     * @param {Buffer=} profilePicture The user's profile picture.
     * @return {User} The created user.
     * @author Cameron Burkholder
     * @date   11/15/2021
     * @async
     * @static
     */
    static async create(unverifiedUser, areaCode, name, profilePicture) {
        // CREATE THE USER IN THE DATABASE.
        const EMPTY = [];
        const userModel = new UserModel({
            active: true,
            areaCode: areaCode,
            conversations: EMPTY,
            email: unverifiedUser.getEmail(),
            name: name,
            passwordHash: unverifiedUser.getPasswordHash(),
            school: unverifiedUser.getSchool(),
            studyGroups: EMPTY,
            profilePicture: profilePicture
        });
        try {
            await userModel.save();
        } catch (error) {
            Log.write("An error occurred while attempting to create a user.");
            Log.writeError(error);
        }

        // RETURN THE CREATED INSTANCE.
        const user = new User(userModel);
        return user;
    }

    /**
     * Deletes a user.
     * @return {Boolean} True if the user was deactivated, false otherwise.
     *
     * @async
     */
    async delete() {
        // Deactivate the user.
        let userDeactivated = false;
        this.active = false;
        // Unnecessary validation
        try {
            userDeactivated = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to delete a user.");
            Log.writeError(error);
            userDeactivated = false;
        }
        return userDeactivated;
    }

    /**
     * Reactivates a user.
     * @return {Boolean} True if the user was reactivated, false otherwise.
     *
     * @async
     */
    async reactivate() {
        // Activate the user.
        let userReactivated = false;
        this.active = true;
        // Unnecessary validation
        if (this.active == true) {
            userReactivated = true;
        }
        return userReactivated;
    }

    /**
     * Gets the user's area code.
     * @return {String} The user's area code.
     */
    getAreaCode() {
        return String(this.areaCode);
    }

    /**
     * Gets the user record from the database using the document ID.
     * @param  {String} userId The user ID to search for.
     * @return {User} The user instance, if found; otherwise undefined.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @async
     * @static
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
     * @author Cameron Burkholder
     * @date   10/22/2021
     * @async
     * @static
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
     * Gets the user record from the database using the user's verification token.
     * @param  {String} verificationToken The verification token used to search for a user.
     * @return {User} The user instance, if found; otherwise undefined.
     * @author Cameron Burkholder
     * @date   02/11/2021
     * @async
     * @static
     */
    static async getByVerificationToken(verificationToken) {
        // GET THE USER BASED ON THE GIVEN VERIFICATION TOKEN.
        let userRecord = false;
        try {
            userRecord = await UserModel.findOne({ verificationToken: verificationToken }).exec();
        } catch (error) {
            Log.write("An error occurred while attempting to get a user by verification token.");
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
     * Gets the user's Study Groups.
     * @return {StudyGroup[]} The user's Study Groups.
     * @author Cameron Burkholder
     * @date 02/03/2022
     * @async
     */
    async getStudyGroups() {
        // GET THE DATABASE INSTANCE OF THE USER.
        let userModel;
        try {
            userModel = await UserModel.findOne({ _id: this.getId() });
        } catch (error) {
            Log.write("An error occurred while attempting to get a user's study groups.");
            Log.writeError(error);
        }
        const userWasNotFound = Validator.isUndefined(userModel);
        if (userWasNotFound) {
            return undefined;
        }

        // GET THE USER'S STUDY GROUPS.
        let studyGroupsWereFound = true;
        let studyGroups = undefined;
        try {
            await userModel.populate("studyGroups");
        } catch (error) {
            Log.write("An error occurred while attempting to get a user's study groups.");
            Log.writeError(error);
        } finally {
            if (studyGroupsWereFound) {
                studyGroups = userModel.studyGroups;
            }
        }

        // FILTER OUT INACTIVE STUDY GROUPS.
        studyGroups = studyGroups.filter((studyGroup) => studyGroup.active);
        //studyGroups array DOES NOT INCLUDE CLASS INSTANCES, so we can't use .isActive()

        // POPULATE ALL THE STUDY GROUPS WITH THEIR OWNER ATTRIBUTES.
        let studyGroupIndex = 0;
        while (studyGroupIndex < studyGroups.length) {
            let ownerWasPopulated = false;
            try {
                await studyGroups[studyGroupIndex].populate("owner");
            } catch (error) {
                Log.write("An error occurred while attempting to get a user's study groups.");
                Log.writeError(error);
            }
            studyGroupIndex++;
        }

        // CONVERT THE STUDY GROUP DATABASE INSTANCES TO STUDY GROUP MODELS.
        studyGroups = studyGroups.map((studyGroup) => new StudyGroup(studyGroup));
        return studyGroups;
    }

    /**
     * Gets the user's email.
     * @return {String} The user's email.
     * @author Cameron Burkholder
     * @date   11/14/2022
     */
    getEmail() {
        return String(this.email);
    }

    /**
     * Gets the document id of the user in the database as a string.
     * @return {Mongoose.Types.ObjectId} The document id of the user.
     * @author Cameron Burkholder
     * @date   10/10/2021
     */
    getId() {
        return this._id;
    }

    /**
     * Gets the user's name.
     * @return {String} The user's name.
     * @author Cameron Burkholder
     * @date   11/14/2021
     */
    getName() {
        return String(this.name);
    }

    /**
     * Gets the user's school.
     * @return {String} The user's school.
     * @author Ethan Cannelongo
     * @date   02/12/2022
     */
    getSchool() {
        return String(this.school);
    }

    /**
     * Gets the hash of the user's password.
     * @return {String} The user's password hash.
     * @author Cameron Burkholder
     * @date   10/22/2021
     */
    getPasswordHash() {
        return this.passwordHash;
    }

    /**
     * Gets the user's profile picture.
     * @return {String} The user's profile picture.
     * @author Cameron Burkholder
     * @date   01/14/2022
     */
    getProfilePicture() {
        return this.profilePicture;
    }

    /**
     * Used to remove any sensitive attributes so the object can be sent to the client.
     * @return {User} The user instance without any sensitive attributes.
     * @author Cameron Burkholder
     * @date   10/22/2021
     */
    removeSensitiveAttributes() {
        delete this.passwordHash;
        return this;
    }

    /**
     * Removes the temporary email and verification token associated with changing an email.
     * @return {Boolean} True if the attributes were removed, false otherwise.
     * @author Cameron Burkholder
     * @date   02/11/2022
     * @async
     */
    async removeTemporaryEmail() {
        this.temporaryEmail = undefined;
        this.verificationToken = undefined;
        let temporaryEmailWasRemoved = false;
        try {
            temporaryEmailWasRemoved = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to remove the temporary email.");
            Log.writeError(error);
        }
        return temporaryEmailWasRemoved;
    }

    /**
     * This saves the associated user document in the database with the current properties
     * stored in this object.
     * @return {bool} True if the user was saved, false if the user wasn't saved.
     * @author Cameron Burkholder
     * @date   08/02/2021
     * @async
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
     * @author Ethan Cannelongo
     * @date   01/14/2022
     * @async
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
     * @author Ethan Cannelongo
     * @date   01/14/2022
     * @async
     */
    async setEmail(email) {
        this.email = email;
        const emailSet = Validator.isDefined(this.email);
        try {
            await this.save();
        } catch (error) {
            emailSet = false;
            Log.writeError(error);
        }
        return emailSet;
    }

    /**
     * Sets the user's name.
     * @param {String} name The name to set.
     * @return {Boolean} True if the name was set, false otherwise.
     * @author Ethan Cannelongo
     * @date   01/14/2022
     * @async
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
     * @author Ethan Cannelongo
     * @date   01/14/2022
     * @async
     */
    async setProfilePicture(newProfilePicture) {
        this.profilePicture = newProfilePicture;
        const profilePictureSet = Validator.isDefined(this.profilePicture);
        return profilePictureSet;
    }

    /**
     * Sets the user's temporary email
     * @param {String} temporaryEmail
     * @returns {Boolean} True if the temporary email is set.
     * @author Cameron Burkholder
     * @date    02/11/2022
     * @async
     */
    async setTemporaryEmail(temporaryEmail) {
        this.temporaryEmail = temporaryEmail;
        let temporaryEmailSet = false;
        try {
            temporaryEmailSet = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to save the temporary email.");
            Log.writeError(error);
        }
        return temporaryEmailSet;
    }

    /**
     * Sets the user's verification token
     * @param {String} newVerificationToken
     * @returns {Boolean} True if the verification token is set.
     * @author Clifton Croom
     * @date 02/09/2022
     * @async
     */
    async setVerificationToken(verificationToken) {
        this.verificationToken = verificationToken;
        let verificationTokenSet = false;
        try {
            verificationTokenSet = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to save the temporary email.");
            Log.writeError(error);
        }
        return verificationTokenSet;
    }
    /**
     * Update's the user's password.
     * @param {String} newPassword The new password to set.
     * @return {Boolean} True if the password was updated, false otherwise.
     * @author Cameron Burkholder
     * @date   02/09/2022
     * @async
     */
    async updatePassword(newPasswordHash) {
        // STORE THE NEW PASSWORD.
        this.passwordHash = newPasswordHash;
        let passwordWasUpdated = false;
        try {
            passwordWasUpdated = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to updated a user's password.");
            Log.writeError(error);
        }
        return passwordWasUpdated;
    }
}
module.exports = User;
