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
    * Checks if two times are equal.
    * @param {Time} otherTime The time to compare against for equality.
    */
    equals(otherTime) {
        const hoursMatch = this.hour == otherTime.hour;
        const minutesMatch = this.minute == otherTime.minute;
        const partsOfDayMatch = this.partOfDay == otherTime.partOfDay;
        return hoursMatch && minutesMatch && partsOfDayMatch;
    }

    /**
     * Checks if one time is after another.
     * @param {Time} laterTime The time to compare against.
     * @return {Boolean} True if the second time comes before the first, false otherwise.
     * @author Cameron Burkholder
     * @date   01/28/2022
     */
    isAfter(firstTime) {
        let isAfter = false;
        let hour = parseInt(this.hour);
        let firstHour = parseInt(firstTime.hour);
        let minute = parseInt(this.minute);
        let firstMinute = parseInt(firstTime.minute);
        // If the times are both AM or both PM.
        if (this.partOfDay === firstTime.partOfDay) {
            // If this hour comes after the first hour.
            if (this.partOfDay === PartOfDay.Am) {
                hour = hour % 12;
                firstHour = firstHour % 12;
            }
            if (hour > firstHour) {
                isAfter = true;
                // If this hour comes before the first hour.
            } else if (hour < firstHour) {
                isAfter = false;
                // If the hours are equal.
            } else {
                isAfter = minute > firstMinute;
            }
            // If this time of day comes after the first time of day.
        } else if (this.partOfDay > firstTime.partOfDay) {
            isAfter = true;
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
    isBetween(startTime, endTime) {
        const startTimeIsValid = this.isAfter(startTime);
        const endTimeIsValid = endTime.isAfter(this);
        return startTimeIsValid && endTimeIsValid;
    }

    /**
     * Parses the time from a 24-hour format time string.
     * @param {String} timeString The time string to parse.
     * @return {Time} The time object.
     * @author Cameron Burkholder
     * @date   02/01/2022
     * @static
     */
    static parse24HourTimeString(timeString) {
        // The time string will be in a predictable format.
        const COLON = ":";
        timeString = String(timeString);
        const colonIndex = timeString.indexOf(COLON);
        const beginningOfTimeString = 0;
        let hour = parseInt(timeString.slice(beginningOfTimeString, colonIndex));
        const partOfDayIndex = timeString.length;
        let minute = parseInt(timeString.slice(colonIndex + 1, partOfDayIndex));
        let partOfDay = undefined;
        // Convert 24-hour format to 12-hour format.
        if (hour < 12) {
            partOfDay = PartOfDay.Am;
            if (hour == 0) {
                hour = 12;
            }
        } else {
            partOfDay = PartOfDay.Pm;
            if (hour > 12) {
                if (hour == 24) {
                    hour = 11;
                    minute = 45;
                } else {
                    hour -= 12;
                }
            }
        }
        // Pad numbers with zeroes.
        hour = hour < 10 ? `0${hour}` : `${hour}`;
        minute = minute < 10 ? `0${minute}` : `${minute}`;
        const time = new Time(hour, minute, partOfDay);
        return time;
    }

    /**
     * Parses the time from a time string.
     * @param {String} timeString The time string to parse.
     * @return {Time} The time object.
     * @author Cameron Burkholder
     * @date   01/28/2022
     * @static
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

    /**
     * Convers the object to standard time string syntax.
     * @return {String} The time as a string.
     * @author Cameron Burkholder
     * @date   02/01/2022
     */
    toString() {
        return `${this.hour}:${this.minute}${this.partOfDay}`;
    }
}

module.exports = { Days, MeetingFrequencies, PartOfDay, Times, Time };
