const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
 * Used to define the database schema for storing meetings.
 * @author Clifton Croom
 * @date   01/28/2022
 */
const MeetingSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    details: {
        type: String,
        required: false
    },
    frequency: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    roomNumber: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: true
    }
});
MeetingSchema.set("toObject", {
    versionKey: false,
    transform: (document, object) => {
        delete object.__v;
        return object;
    }
});
const MeetingCollectionName = Configuration.getMeetingCollectionName();
const MeetingModel = Mongoose.model(MeetingCollectionName, MeetingSchema);

/**
 *
 * @author Cliff Croom
 * @date   01/11/2021
 */
 class Meeting {
    /**
     * Initializes the meeting passed in from the database.
     * @param  {Mongoose.Schema} MeetingSchema The database record for a given post.
     * @author Cliff Croom
     * @date   01/11/2021
     */
    constructor(MeetingSchema) {
        // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
        // In order to maximize the usability of this class, the attributes stored in the database
        // record are copied to the instance of this class so they can be properly editied.
        // The post schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, PostSchema.toObject());
    }

    /**
     * Creates a meeting.
     * @author Cliff Croom
     * @return {meeting} The meeting created.
     * @async
     * @static
     */
     static async create(date, details, frequency, location, roomNumber, time) {
        // CREATE MEETING IN THE DATABASE.
        
        const meetingModel = new MeetingModel({
            date: date,
            details: details,
            frequency: frequency,
            location: location,
            roomNumber: roomNumber,
            time: time
        });
        try {
            await meetingModel.save();
        } catch (error) {
            console.log(error);
        }

        // RETURN THE CREATED INSTANCE.
        const meeting = new Meeting(meetingModel);
        return meeting;
    }

    //GETTERS

    /**
     * Gets the meeting's date.
     * @return {Date} The meeting's date.
     */
     getDate() {
        return Date(this.date);
    }

    /**
     * Gets the meeting's details.
     * @return {String} The meeting's details.
     */
     getDetails() {
        return String(this.details);
    }

    /**
     * Gets the meeting's frequency.
     * @return {String} The meeting's frequency.
     */
     getFrequency() {
        return String(this.frequency);
    }

    /**
     * Gets the meeting's location.
     * @return {String} The meeting's location.
     */
     getLocation() {
        return String(this.location);
    }

    /**
     * Gets the meeting's room number.
     * @return {String} The meeting's room number.
     */
     getRoomNumber() {
        return String(this.roomNumber);
    }

    /**
     * Gets the meeting time.
     * @return {String} The meeting time.
     */
     getTime() {
        return String(this.time);
    }

    //SETTERS

    /**
     * Sets the date.
     * @param {String} date The date to set.
     * @return {Boolean} True if the date was set, false otherwise.
     */
     setDate(date) {
        this.date = date;
        const dateSet = Validator.isDefined(this.date);
        return dateSet;
    }

    /**
     * Sets the details.
     * @param {String} details The details to set.
     * @return {Boolean} True if the details was set, false otherwise.
     */
     setDetails(details) {
        this.details = details;
        const detailsSet = Validator.isDefined(this.details);
        return detailsSet;
    }

    /**
     * Sets the frequency.
     * @param {String} frequency The frequency to set.
     * @return {Boolean} True if the frequency was set, false otherwise.
     */
     setFrequency(frequency) {
        this.frequency = frequency;
        const frequencySet = Validator.isDefined(this.frequency);
        return frequencySet;
    }

    /**
     * Sets the location.
     * @param {String} location The location to set.
     * @return {Boolean} True if the location was set, false otherwise.
     */
     setLocation(location) {
        this.location = location;
        const locationSet = Validator.isDefined(this.location);
        return locationSet;
    }

    /**
     * Sets the room number.
     * @param {String} roomNumber The room number to set.
     * @return {Boolean} True if the room number was set, false otherwise.
     */
     setRoomNumber(roomNumber) {
        this.roomNumber = roomNumber;
        const roomNumberSet = Validator.isDefined(this.roomNumber);
        return roomNumberSet;
    }

    /**
     * Sets the time.
     * @param {String} time The time to set.
     * @return {Boolean} True if the time was set, false otherwise.
     */
     setTime(time) {
        this.time = time;
        const timeSet = Validator.isDefined(this.time);
        return timeSet;
    }

}
module.exports = Meeting;