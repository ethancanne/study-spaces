import { store } from "./src";
import axios from "axios";
import {
    clearStudyGroups,
    showErrorNotification,
    showSuccessNotification,
    signOut,
    startLoading,
    stopLoading
} from "./src/state/actions";
import Validator from "../Server/Validator";
import { Schedule } from "./rschedule";

/**
 * Submits a general post request to the server.
 * @param {String} route The route of which to send the request
 * @param {Object} data The data to be sent to the server
 * @param {String} successResponseMessage The message to indicate a successful request
 * @param {String} catchMessage If the catch statement runs, a notification will be shown with this message
 * @param {Boolean} isAuthenticated True if this route requires authentication
 * @param {Function} callback the function that gets called on error or success and returns (data, error)
 * @author Ethan Cannelongo
 * @date   2/11/2022
 * @async
 */
export const sendPostRequest = async (
    route,
    data,
    successResponseMessage,
    catchMessage,
    isAuthenticated,
    callback = () => {},
    shouldShowNotification = true
) => {
    let response;
    try {
        if (isAuthenticated) axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

        store.dispatch(startLoading());
        response = await axios.post(route, data);
    } catch (e) {
        console.log(e);
        shouldShowNotification &&
            store.dispatch(
                showErrorNotification(catchMessage || "Cannot connect to the server, please try again later.")
            );
        callback(null, "There was a problem connecting to the server: " + e);
    } finally {
        store.dispatch(stopLoading());

        const responseIsDefined = Validator.isDefined(response.data);
        if (responseIsDefined) {
            const requestWasValid = successResponseMessage === response.data.message;

            if (requestWasValid) {
                shouldShowNotification && store.dispatch(showSuccessNotification(response.data.message));
                callback(response.data);
            } else {
                shouldShowNotification &&
                    store.dispatch(showErrorNotification("There was an error: " + response.data.message));
                callback(null, response.data.message);
            }
        } else {
            store.dispatch(showErrorNotification("There was an error, the server sent undefined results"));
            callback(null, "There was an error, the server sent undefined results");
        }
    }
};

/**
 * Submits a general get request to the server.
 * @param {String} route The route of which to send the request
 * @param {String} successResponseMessage The message to indicate a successful request
 * @param {String} catchMessage If the catch statement runs, a notification will be shown with this message
 * @param {Boolean} isAuthenticated True if this route requires authentication
 * @param {Function} callback the function that gets called on error or success and returns (data, error)
 * @author Ethan Cannelongo
 * @date   2/11/2022
 * @async
 */
export const sendGetRequest = async (
    route,
    successResponseMessage,
    catchMessage,
    isAuthenticated,
    callback = () => {},
    shouldShowNotification = true
) => {
    let response;
    try {
        if (isAuthenticated) axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

        store.dispatch(startLoading());
        response = await axios.get(route);
    } catch (e) {
        console.log(e);
        shouldShowNotification &&
            store.dispatch(
                showErrorNotification(catchMessage || "Cannot connect to the server, please try again later.")
            );
        callback(null, "There was a problem connecting to the server: " + e);
    } finally {
        store.dispatch(stopLoading());

        const responseIsDefined = Validator.isDefined(response.data);
        if (responseIsDefined) {
            const requestWasValid = successResponseMessage === response.data.message;

            if (requestWasValid) {
                shouldShowNotification && store.dispatch(showSuccessNotification(response.data.message));
                callback(response.data);
            } else {
                shouldShowNotification &&
                    store.dispatch(showErrorNotification("There was an error: " + response.data.message));
                callback(null, response.data.message);
            }
        } else {
            store.dispatch(showErrorNotification("There was an error, the server sent undefined results"));
            callback(null, "There was an error, the server sent undefined results");
        }
    }
};

/**
 * Submits a general delete request to the server.
 * @param {String} route The route of which to send the request
 * @param {Object} data The data to be sent to the server
 * @param {String} successResponseMessage The message to indicate a successful request
 * @param {String} catchMessage If the catch statement runs, a notification will be shown with this message
 * @param {Boolean} isAuthenticated True if this route requires authentication
 * @param {Function} callback the function that gets called on error or success and returns (data, error)
 * @author Ethan Cannelongo
 * @date   2/11/2022
 * @async
 */
export const sendDeleteRequest = async (
    route,
    data,
    successResponseMessage,
    catchMessage,
    isAuthenticated,
    callback = () => {},
    shouldShowNotification = true
) => {
    let response;
    try {
        if (isAuthenticated) axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

        store.dispatch(startLoading());
        response = await axios.delete(route, { data });
    } catch (e) {
        callback(null, "There was a problem connecting to the server: " + e);
        shouldShowNotification &&
            store.dispatch(
                showErrorNotification(catchMessage || "Cannot connect to the server, please try again later.")
            );
    } finally {
        store.dispatch(stopLoading());

        const responseIsDefined = Validator.isDefined(response.data);
        if (responseIsDefined) {
            const requestWasValid = successResponseMessage === response.data.message;
            if (requestWasValid) {
                callback(response.data);
                shouldShowNotification && store.dispatch(showSuccessNotification(response.data.message));
            } else {
                callback(null, response.data.message);
                shouldShowNotification &&
                    store.dispatch(showErrorNotification("There was an error: " + response.data.message));
            }
        } else {
            callback(null, "There was an error, the server sent undefined results");
            store.dispatch(showErrorNotification("There was an error, the server sent undefined results"));
        }
    }
};

/**
 * Submits a general delete request to the server.
 * @param {String} route The route of which to send the request
 * @param {Object} formData The formData to be sent to the server
 * @param {String} successResponseMessage The message to indicate a successful request
 * @param {String} catchMessage If the catch statement runs, a notification will be shown with this message
 * @param {Boolean} isAuthenticated True if this route requires authentication
 * @param {Function} callback the function that gets called on error or success and returns (data, error)
 * @author Ethan Cannelongo
 * @date   2/11/2022
 * @async
 */
export const sendPostRequestWithFormData = async (
    route,
    formdata,
    successResponseMessage,
    catchMessage,
    isAuthenticated,
    callback = () => {}
) => {
    let response;
    try {
        if (isAuthenticated) axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

        store.dispatch(startLoading());
        response = await axios.post(route, formdata, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    } catch (e) {
        console.log(e);
        store.dispatch(showErrorNotification(catchMessage || "Cannot connect to the server, please try again later."));
        callback(null, "There was a problem connecting to the server: " + e);
    } finally {
        store.dispatch(stopLoading());

        const responseIsDefined = Validator.isDefined(response.data);
        if (responseIsDefined) {
            const requestWasValid = successResponseMessage === response.data.message;

            if (requestWasValid) {
                store.dispatch(showSuccessNotification(response.data.message));
                callback(response.data);
            } else {
                store.dispatch(showErrorNotification("There was an error: " + response.data.message));
                callback(null, response.data.message);
            }
        } else {
            store.dispatch(showErrorNotification("There was an error, the server sent undefined results"));
            callback(null, "There was an error, the server sent undefined results");
        }
    }
};

export const getNextMeeting = (group) => {
    var nextOneTimeMeeting = {};

    if (group.meetings && group.meetings.length !== 0) {
        nextOneTimeMeeting = group.meetings[0];
        group.meetings.forEach((meeting) => {
            if (new Date(meeting.date) <= new Date(nextOneTimeMeeting.date) && new Date(meeting.date) >= new Date())
                nextOneTimeMeeting = meeting;
            console.log(nextOneTimeMeeting);
        });
    }

    if (group.recurringMeeting) {
        const recurringStartDate = new Date(group.recurringMeeting.date);
        console.log("START DATE", recurringStartDate, group.recurringMeeting);
        const schedule = new Schedule({
            rrules: [
                {
                    frequency: group.recurringMeeting.frequency.toUpperCase(),
                    start: recurringStartDate,
                    end: new Date(
                        recurringStartDate.getFullYear() + 5,
                        recurringStartDate.getMonth(),
                        recurringStartDate.getDate()
                    )
                }
            ]
        });

        var nextRecurringMeeting = {};
        nextRecurringMeeting = schedule
            .occurrences()
            .toArray()
            .filter(({ date }) => date >= new Date())
            .map(({ date }) => new Date(date).toLocaleDateString())[0];

        group.recurringMeeting.date = nextRecurringMeeting;

        if (group.meetings.length !== 0) {
            return new Date(nextRecurringMeeting) > new Date(nextOneTimeMeeting.date)
                ? nextOneTimeMeeting
                : group.recurringMeeting;
        } else {
            return group.recurringMeeting;
        }
    }
    return nextOneTimeMeeting;
};

export const performSignOut = () => {
    store.dispatch(signOut());
    store.dispatch(showSuccessNotification("You have been successfully signed out."));
    store.dispatch(clearStudyGroups());
};
