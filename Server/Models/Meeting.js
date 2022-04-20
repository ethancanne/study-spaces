const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const { Days, MeetingFrequencies, Minutes, PartOfDay, Time, Times } = require("./Time.js");
const Validator = require("../Validator.js");

/**
 * Provides an interface for representing the days and times a user is available for a meeting.
 * @property {String[]} days Each day of the week a user is available.
 * @property {String[]} meetingFrequencies The frequencies of meeting a user is available for.
 * @property {Time} startTime The starting time in the day of a user's availability.
 * @property {Time} endTime The ending time in the day of a user's availability.
 * @author Cameron Burkholder
 * @date   01/28/2022
 */
class MeetingAvailability {
    constructor(days, meetingFrequencies, startTime, endTime) {
        this.days = days;
        if (days.length === 0) {
            this.days = Object.keys(Days);
        }
        this.meetingFrequencies = meetingFrequencies;
        if (meetingFrequencies.length === 0) {
            this.meetingFrequencies = Object.keys(MeetingFrequencies);
        }
        this.startTime = new Time(startTime.hour, startTime.minute, startTime.partOfDay);
        this.endTime = new Time(endTime.hour, endTime.minute, endTime.partOfDay);
    }

    /**
     * Determines whether applicable filters have been applied to start filtering meetings.
     * @return {Boolean} True if there are no requirements for meeting times, false otherwise.
     * @author Cameron Burkholder
     * @date   03/08/2022
     */
    isOpen() {
        const daysAreFlexible = this.days.length === Object.keys(Days).length;
        const meetingFrequenciesAreFlexible = this.meetingFrequencies.length === Object.keys(MeetingFrequencies).length;
        const firstAvailableMeetingTime = new Time(12, 0, PartOfDay.Am);
        const lastAvailableMeetingTime = new Time(11, 45, PartOfDay.Pm);
        const meetingTimeIsFlexible = (this.startTime === firstAvailableMeetingTime) && (this.endTime === lastAvailableMeetingTime);
        return daysAreFlexible && meetingFrequenciesAreFlexible && meetingTimeIsFlexible;
    }

    /**
     * Checks if a given meeting matches the availability a user has.
     * @param {Meeting} meeting The meeting to check.
     * @return {Boolean} True if the meeting matches, false otherwise.
     * @author Cameron Burkholder
     * @date   01/28/2022
     */
    matchAvailability(meeting) {
        const NOT_FOUND_INDEX = -1;
        const daysMatch = NOT_FOUND_INDEX !== this.days.indexOf(meeting.day);
        const frequenciesMatch = NOT_FOUND_INDEX !== this.meetingFrequencies.indexOf(meeting.frequency);
        const meetingTime = meeting.time;
        const timesMatch = meetingTime.isBetween(this.startTime, this.endTime);
        return daysMatch && frequenciesMatch && timesMatch;
    }
}

/**
 * Used to define the database schema for storing meetings.
 * @author Clifton Croom
 * @date   01/28/2022
 */
const MeetingSchema = new Schema({
    date: {
        type: String,
        required: false
    },
    day: {
        type: String,
        required: false
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
 * Provides an interface for working with meetings.
 * @param {Date} date The date a one-time meeting will occur.
 * @param {Day} day The day a meeting occurs on.
 * @param {String=} details Notes about the meeting.
 * @param {String} frequency The frequency of a recurring meeting.
 * @param {String=} location The location where a meeting is to occur.
 * @param {String=} roomNumber The room number where the meeting will occur.
 * @param {String} time The meeting time.
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
        // The meeting schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, MeetingSchema.toObject());
        if (typeof this.time !== "Time") {
            this.time = Time.parse24HourTimeString(this.time);
        }
    }

    /**
     * Creates a meeting.
     * @author Cliff Croom
     * @return {meeting} The meeting created.
     * @async
     * @static
     */
    static async create(day, frequency, time, date, details, location, roomNumber) {
        // CREATE MEETING IN THE DATABASE.
        const days = Object.keys(Days);
        if (days.indexOf(day) < 0) {
            day = days[day];
        }
        const meetingModel = new MeetingModel({
            day: day,
            date: date,
            details: details,
            frequency: frequency,
            location: location,
            roomNumber: roomNumber,
            time
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

    /**
     * Creates a one-time meeting.
     * @param {Date} date The date of the meeting.
     * @param {Time} time The time of the meeting.
     * @param {String=} day The day of the week of the meeting.
     * @param {String=} details Additional notes about the meeting.
     * @param {String=} location The location of the meeting.
     * @param {String=} roomNumber The room where the meeting is to occur.
     * @return {Meeting} The meeting created.
     * @author Cameron Burkholder
     * @date   02/21/2022
     */
    static async createOneTime(date, time, day, details, location, roomNumber) {
        const newDate = new Date(date);
        if (!Validator.isDefined(day)) {
            day = Object.keys(Days)[newDate.getDay()];
        }
        // CREATE MEETING IN THE DATABASE.
        const meetingModel = new MeetingModel({
            day: day,
            date: date,
            details: details,
            frequency: MeetingFrequencies.OneTime,
            location: location,
            roomNumber: roomNumber,
            time: time
        });
        try {
            await meetingModel.save();
        } catch (error) {
            Log.write("An error occurred while attempting to create a one-time meeting.");
            Log.writeError(error);
        }

        // RETURN THE CREATED INSTANCE.
        const meeting = new Meeting(meetingModel);
        return meeting;
    }

    /**
     * @return {boolean} Returns whether or not the meeting is deleted.
     * @author Clifton Croom
     * @date 02/23/22
     * @async
     *
     */
    async delete() {
        let meetingModel = await MeetingModel.findOne({ _id: this._id }).exec();
        let meetingDeleted = false;
        try {
            await meetingModel.remove();
        } catch (error) {
            Log.write("An error occurred while attempting to delete a one-time meeting.");
            Log.writeError(error);
            return meetingDeleted;
        }
        meetingDeleted = true;
        return meetingDeleted;
    }

    /**
     * Retrieves the meeting using the provided document ID.
     * @param {Mongoose.Types.ObjectId} meetingId The meeting ID to use.
     * @return {Meeting} The meeting object.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     * @static
     */
    static async getById(meetingId) {
        // CONVERT THE ID TO THE ACCEPTABLE TYPE.
        const convertedMeetingId = Mongoose.Types.ObjectId(meetingId);

        // GET THE MEETING BASED ON THE GIVEN ID.
        let meetingRecord = false;
        try {
            meetingRecord = await MeetingModel.findOne({ _id: convertedMeetingId }).exec();
        } catch (error) {
            Log.write("An error occurred while attempting to get a meeting by ID.");
            Log.writeError(error);
            // If an error occurs, it should be returned.
            return error;
        } finally {
            // If the meeting wasn't able to be found in the database, this routine should return undefined.
            let meeting = undefined;
            let meetingWasFound = Validator.isDefined(meetingRecord);
            if (meetingWasFound) {
                // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
                meeting = new Meeting(meetingRecord);
            }
            return meeting;
        }
    }

    /**
     * Gets the meeting's date.
     * @return {Date} The meeting's date.
     */
    getDate() {
        return Date(this.date);
    }

    /**
     * Gets the meeting's day.
     * @return {Day} The meeting's day.
     */
    getDay() {
        return Date(this.day);
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
     * Gets the meeting's ID.
     * @return {Mongoose.Types.ObjectId} The meeting's ID.
     */
    getId() {
        return this._id;
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

    /**
     * This saves the associated meeting document in the database with the current properties
     * stored in this object.
     * @return {bool} True if the meeting was saved, false if the meeting wasn't saved.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     */
    async save() {
        let meetingWasSaved = false;
        try {
            // GET THE DATABASE INSTANCE OF THE USER.
            let meetingModel = await MeetingModel.findOne({ _id: this._id }).exec();

            // UPDATE THE DATABASE INSTANCE WITH THE CURRENT USER PROPERTIES.
            Object.assign(meetingModel, this);

            // SAVE THE UPDATED DATABASE INSTANCE.
            await meetingModel.save();
            meetingWasSaved = true;
        } catch (error) {
            Log.write("An error occurred while attempting to retrieve the meeting to save.");
            Log.writeError(error);
        } finally {
            return meetingWasSaved;
        }
    }

    /**
     * Sets the day.
     * @param {String} day The day to set.
     * @return {Boolean} True if the day was set, false otherwise.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     */
    async setDay(day) {
        this.day = day;
        let meetingWasUpdated = false;
        try {
            meetingWasUpdated = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to update the meeting.");
            Log.writeError(error);
        }
        return meetingWasUpdated;
    }

    /**
     * Sets the date.
     * @param {String} date The date to set.
     * @return {Boolean} True if the date was set, false otherwise.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     */
    async setDate(date) {
        this.date = date;
        let meetingWasUpdated = false;
        try {
            meetingWasUpdated = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to update the meeting.");
            Log.writeError(error);
        }
        return meetingWasUpdated;
    }

    /**
     * Sets the details.
     * @param {String} details The details to set.
     * @return {Boolean} True if the details was set, false otherwise.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     */
    async setDetails(details) {
        this.details = details;
        let meetingWasUpdated = false;
        try {
            meetingWasUpdated = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to update the meeting.");
            Log.writeError(error);
        }
        return meetingWasUpdated;
    }

    /**
     * Sets the frequency.
     * @param {String} day The frequency to set.
     * @return {Boolean} True if the frequency was set, false otherwise.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     */
    async setFrequency(frequency) {
        this.frequency = frequency;
        let meetingWasUpdated = false;
        try {
            meetingWasUpdated = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to update the meeting.");
            Log.writeError(error);
        }
        return meetingWasUpdated;
    }

    /**
     * Sets the location.
     * @param {String} location The location to set.
     * @return {Boolean} True if the location was set, false otherwise.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     */
    async setLocation(location) {
        this.location = location;
        let meetingWasUpdated = false;
        try {
            meetingWasUpdated = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to update the meeting.");
            Log.writeError(error);
        }
        return meetingWasUpdated;
    }

    /**
     * Sets the room number.
     * @param {String} roomNumber The room number to set.
     * @return {Boolean} True if the room number was set, false otherwise.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     */
    async setRoomNumber(roomNumber) {
        this.roomNumber = roomNumber;
        let meetingWasUpdated = false;
        try {
            meetingWasUpdated = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to update the meeting.");
            Log.writeError(error);
        }
        return meetingWasUpdated;
    }

    /**
     * Sets the time.
     * @param {String} time The time to set.
     * @return {Boolean} True if the time was set, false otherwise.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     */
    async setTime(time) {
        this.time = time;
        let meetingWasUpdated = false;
        try {
            meetingWasUpdated = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to update the meeting.");
            Log.writeError(error);
        }
        return meetingWasUpdated;
    }
}
module.exports = { Meeting, MeetingAvailability };
