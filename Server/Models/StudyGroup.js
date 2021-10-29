const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
* Used to define the database schema for storing study groups.
* @param {String} areaCode The area code for the study group.
* @param {String} calendar The study group's calendar.
* @param {String=} class The class the study group is associated with.
* @param {String} feed The document ID for the study group's feed.
* @param {Boolean} isOnlineGroup Indicates whether or not the study group is an online group.
* @param {Boolean} isTutorGroup Indicates whether or not the study group is a tutor group.
* @param {String[]} members The list of document IDs for members in the study group.
* @param {String} name The name of the study group.
* @param {String} owner The study group owner's documnet ID.
* @param {String=} school The school the study group is associated with.
* @param {String} subject The subject the study group supports.
* @author Cameron Burkholder
* @date   10/29/2021
*/
const StudyGroupSchema = new Schema({
  areaCode: {
    type: String,
    required: true
  },
  calendar: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: false
  },
  feed: {
    type: String,
    required: true
  },
  isOnlineGroup: {
    type: Boolean,
    required: true
  },
  isTutorGroup: {
    type: Boolean,
    required: true
  },
  members: {
    type: [String],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: true
  }
});
StudyGroupSchema.set("toObject", {
  versionKey: false,
  transform: (document, object) => {
    delete object.__v;
    return object;
  }
});
const studyGroupCollectionName = Configuration.getStudyGroupCollectionName();
const StudyGroupModel = Mongoose.model(studyGroupCollectionName, StudyGroupSchema);

/**
* Provides an interface for working with study groups in the database.
* @author Cameron Burkholder
* @date   10/29/2021
*/
class StudyGroup {
  /**
  * Initializes the user to the account passed in from the database.
  * @param  {Mongoose.Schema} studyGroupSchema The database record for a given study group.
  * @author Cameron Burkholder
  * @date   10/29/2021
  */
  constructor(studyGroupSchema) {
    // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
    // In order to maximize the usability of this class, the attributes stored in the database
    // record are copied to the instance of this class so they can be properly editied.
    // The study group schema is converted to a regular object to sanitize it of wrapper methods and properties.
    Object.assign(this, studyGroupSchema.toObject());
  }

  /**
  * Creates a study group.
  * @param {String} name The study group name.
  * @param {User} owner The owner of the study group.
  * @param {String} subject The study group's subject.
  * @return {StudyGroup} The created user.
  *
  */
  static async create(name, owner, subject) {

  }

  /**
  * Deletes a study group.
  * @return {Boolean} True if the study group was deleted, false otherwise.
  */
  async delete() {

  }

  /**
  * Gets the study group's area code.
  * @return {String} The study group's area code.
  *
  */
  getAreaCode() {

  }

  /**
  * Gets the study group record from the database using the document ID.
  * @param  {String} studyGroupId The study group ID to search for.
  * @return {StudyGroup} The study group instance, if found; otherwise undefined.
  * @async
  *
  */
  static async getById(studyGroupId) {

  }

  /**
  * Gets the document id of the study group in the database as a string.
  * @return {String} The document id of the study group.
  *
  */
  getId() {

  }

  /**
  * Gets the study group's name.
  * @return {String} The study group's name.
  *
  */
  getName() {

  }

  /**
  * This saves the associated user document in the database with the current properties
  * stored in this object.
  * @return {bool} True if the user was saved, false if the user wasn't saved.
  *
  */
  async save() {

  }

  /**
  * Sets the study group's area code.
  * @param {String} areaCode The area code to set.
  * @return {Boolean} True if the area code was set, false otherwise.
  *
  */
  async setAreaCode(areaCode) {

  }

  /**
  * Sets the study group's name.
  * @param {String} name The name to set.
  * @return {Boolean} True if the name was set, false otherwise.
  *
  */
  async setName(name) {

  }

}

module.exports = User;
