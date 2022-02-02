// The following enumerations are used to simplify the process of working with meetings and time.
const Days = {
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday",
    Sunday: "Sunday"
};
const MeetingFrequencies = {
    Daily: "Daily",
    Monthly: "Monthly",
    OneTime: "One-time",
    Weekly: "Weekly",
    Yearly: "Yearly"
};
const PartOfDay = {
    Am: "AM",
    Pm: "PM"
};
let Times = [];
[...Array(12).keys()].map((hour) => {
    const Minutes = ["00", "15", "30", "45"];
    Minutes.map((minute) => {
        Times.push(`${hour}:${minute}`);
    });
});

/**
 * A model for representing time.
 * @property {String} hour The hour component of time (12-hour format).
 * @property {String} minute The minute component of time.
 * @property {String} partOfDay The part of the day (AM or PM).
 * @author Cameron Burkholder
 * @date   01/28/2022
 */
class Time {
    constructor(hour, minute, partOfDay) {
        this.hour = hour;
        this.minute = minute;
        this.partOfDay = partOfDay;
    }

    /**
     * Checks if one time is after another.
     * @param {Time} laterTime The time to compare against.
     * @return {Boolean} True if the second time comes after the first, false otherwise.
     * @author Cameron Burkholder
     * @date   01/28/2022
     */
    isAfter(laterTime) {
        let isAfter = false;
        // If the times are both AM or both PM.
        if (this.partOfDay === laterTime.partOfDay) {
            // If the later hour comes after this hour.
            if (this.hour < laterTime.hour) {
                isAfter = true;
                // If the later hour comes before this hour.
            } else if (this.hour > laterTime.hour) {
                isAfter = false;
                // If the times have the same hour.
            } else {
                isAfter = this.minute < laterTime.minute;
            }
            // If the later time is PM while this time is AM.
        } else if (this.partOfDay < laterTime.partOfDay) {
            isAfter = true;
            // If the later time is AM while this time is PM.
        } else {
            isAfter = false;
        }
        return isAfter;
    }

    /**
     * Checks whether a given meeting time is between the start and ending
     * of a user's availability times.
     * @param {Time} meetingTime The time of the meeting.
     * @param {Time} startTime The time availability starts.
     * @param {Time} endTime The time availability ends.
     * @return {Boolean} True if the meeting time is between the two times, false otherwise.
     * @author Cameron Burkholder
     * @date   01/28/2022
     */
    static isBetween(meetingTime, startTime, endTime) {
        const startTimeIsValid = meetingTime.isAfter(startTime);
        const endTimeIsValid = endTime.isAfter(meetingTime);

        return startTimeIsValid && endTimeIsValid;
    }

    /**
     * Parses the time from a time string.
     * @param {String} timeString The time string to parse.
     * @return {Time} The time object.
     * @author Cameron Burkholder
     * @date   01/28/2022
     */
    static parseTimeString(timeString) {
        // The time string will be in a predictable format.
        const COLON = ":";
        const colonIndex = timeString.indexOf(COLON);
        const beginningOfTimeString = 0;
        const hour = timeString.slice(beginningOfTimeString, colonIndex);
        const partOfDayIndex = timeString.length - 2;
        const minute = timeString.slice(colonIndex + 1, partOfDayIndex);
        const partOfDay = timeString.slice(partOfDayIndex, timeString.length);
        const time = new Time(hour, minute, partOfDay);
        return time;
    }
}

module.exports = { Days, MeetingFrequencies, PartOfDay, Times, Time };
