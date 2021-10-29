const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
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
  * Creates an unverified user.
  * @param {String} email The unverified user's email.
  * @param {String} password The unverified user's password.
  * @return {UnverifiedUser} The unverified user created.
  *
  */
  static async create(email, password) {

  }

  /**
  * Deletes an unverified user.
  * @return {Boolean} True if the unverified user was deleted, false otherwise.
  */
  async delete() {

  }

  /**
  * Gets the user record from the database using the user's email.
  * @param  {String} userEmail The user email to search for.
  * @return {UnverifiedUser} The user instance, if found; otherwise undefined.
  * @async
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  static async getByVerificationToken(verificationToken) {
    // GET THE USER BASED ON THE GIVEN EMAIL.
    let unverifiedUserRecord = false;
    try {
      unverifiedUserRecord = await UnverifiedUserModel.findOne({ verificationToken: verificationToken }).exec();
    } catch(error) {
      Log.write("An error occurred while attempting to get an unverified user by verification token.");
      Log.writeError(error);
      // If an error occurs, it should be returned.
      return error;
    } finally {
      // If the user wasn't able to be found in the database, this routine should return undefined.
      let user = undefined;
      let userWasFound = Validator.isDefined(unverifiedUserRecord);
      if (userWasFound) {
        // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
        user = new User(unverifiedUserRecord);
      }
      return user;
    }
  }

  /**
  * Gets the unverified user's email.
  * @return {String} The unverified user's email.
  *
  */
  getEmail() {

  }

  /**
  * Gets the unverified user's hashed password.
  * @return {String} The unverified user's hashed password.
  *
  */
  getPasswordHash() {

  }

  /**
  * Gets the unverified user's verificaion token.
  * @return {String} The unverified user's verificaion token.
  *
  */
  getVerificationToken() {

  }

  /**
  * Verifies a user's account. This process involves creating a normal user document and deleting
  * the unverified user document.
  * @return {User} The verified user.
  */
  async verify() {

  }

}

module.exports = User;
