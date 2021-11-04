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
const FeedSchema = new Schema({
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
FeedSchema.set("toObject", {
  versionKey: false,
  transform: (document, object) => {
    delete object.__v;
    return object;
  }
});
const feedCollectionName = Configuration.getFeedCollectionName();
const FeedModel = Mongoose.model(feedCollectionName, FeedSchema);

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
class Feed {

}

module.exports = Feed;
