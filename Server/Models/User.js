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
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
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
  * Gets the user record from the database using the document ID.
  * @param  {Mongoose.types.ObjectId} userId The user ID to search for.
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
    } catch(error) {
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
  * @param  {Mongoose.types.ObjectId} userEmail The user email to search for.
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
    } catch(error) {
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
  * Gets the hash of the user's password.
  * @return {string} The user's password hash.
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  getPasswordHash() {
    // GET THE PASSWORD HASH.
    return this.password;
  }

  /**
  * Used to remove any sensitive attributes so the object can be sent to the client.
  * @return {User} The user instance without any sensitive attributes.
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  removeSensitiveAttributes() {
    delete this.password;
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
    } catch(error) {
      Log.write("An error occurred while attempting to retrieve the user to save.");
      Log.writeError(error);
    } finally {
      return userWasSaved;
    }
  }
}

module.exports = User;
