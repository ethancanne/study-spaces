import { store } from "./src";
import axios from "axios";
import { showErrorNotification, showSuccessNotification } from "./src/state/actions";
import Validator from "../Server/Validator";

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
    callback = () => {}
) => {
    let response;
    try {
        if (isAuthenticated) axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

        response = await axios.post(route, data);
    } catch (e) {
        console.log(e);
        store.dispatch(showErrorNotification(catchMessage || "Cannot connect to the server, please try again later."));
        callback(null, "There was a problem connecting to the server: " + e);
    } finally {
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
    callback = () => {}
) => {
    let response;
    try {
        if (isAuthenticated) axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

        response = await axios.get(route);
    } catch (e) {
        console.log(e);
        store.dispatch(showErrorNotification(catchMessage || "Cannot connect to the server, please try again later."));
        callback(null, "There was a problem connecting to the server: " + e);
    } finally {
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
    callback = () => {}
) => {
    let response;
    try {
        if (isAuthenticated) axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

        response = await axios.delete(route, { data });
    } catch (e) {
        console.log(e);
        store.dispatch(showErrorNotification(catchMessage || "Cannot connect to the server, please try again later."));
        callback(null, "There was a problem connecting to the server: " + e);
    } finally {
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
