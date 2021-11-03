const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
* Used to define the database schema for storing study group feeds.
* @author Cameron Burkholder
* @date   11/03/2021
*/
const StudyGroupFeedSchema = new Schema({
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
StudyGroupFeedSchema.set("toObject", {
  versionKey: false,
  transform: (document, object) => {
    delete object.__v;
    return object;
  }
});
const studyGroupFeedCollectionName = Configuration.getStudyGroupFeedCollectionName();
const StudyGroupFeedModel = Mongoose.model(studyGroupFeedCollectionName, StudyGroupFeedSchema);

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
class StudyGroupFeed {
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

module.exports = StudyGroupFeed;
