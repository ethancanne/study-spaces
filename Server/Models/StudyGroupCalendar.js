const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
* Used to define the database schema for storing study group calendars.
* @author Cameron Burkholder
* @date   11/01/2021
*/
const StudyGroupCalendarSchema = new Schema({
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
StudyGroupCalendarSchema.set("toObject", {
  versionKey: false,
  transform: (document, object) => {
    delete object.__v;
    return object;
  }
});
const studyGroupCalendarCollectionName = Configuration.getStudyGroupCalendarCollectionName();
const StudyGroupCalendarModel = Mongoose.model(studyGroupCalendarCollectionName, StudyGroupCalendarSchema);

/**
* Provides an interface for working with study group calendars in the database.
*
* @author Cameron Burkholder
* @date   11/01/2021
*/
class StudyGroupCalendar {
  /**
  * Initializes the calendar to the one passed in from the database.
  * @param  {Mongoose.Schema} studyGroupCalendarSchema The database record for a given study group calendar.
  * @author Cameron Burkholder
  * @date   11/01/2021
  */
  constructor(studyGroupCalendarSchema) {
    // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
    // In order to maximize the usability of this class, the attributes stored in the database
    // record are copied to the instance of this class so they can be properly editied.
    // The study group calendar schema is converted to a regular object to sanitize it of wrapper methods and properties.
    Object.assign(this, studyGroupCalendarSchema.toObject());
  }

}

module.exports = StudyGroupCalendar;
