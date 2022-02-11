import Routes from "../Server/Routes/Routes";
import { store } from "./src";
import axios from "axios";
import { showErrorNotification, showSuccessNotification } from "./src/state/actions";
import ResponseMessages from "../Server/Responses/ResponseMessages";
import Validator from "../Server/Validator";

export const sendPostRequest = async (route, data, successResponseMessage, isAuthenticated, callback = () => {}) => {
    let response;
    try {
        if (isAuthenticated) axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

        response = await axios.post(route, data);
    } catch (error) {
        console.log(error);
        store.dispatch(showErrorNotification("There was a problem connecting to the server:" + error));
    } finally {
        const responseIsDefined = Validator.isDefined(response.data);
        if (responseIsDefined) {
            const requestWasValid = successResponseMessage === response.data.message;

            if (requestWasValid) {
                store.dispatch(showSuccessNotification(response.data.message));
            } else {
                store.dispatch(showErrorNotification("There was an error: " + response.data.message));
            }
        } else {
            store.dispatch(showErrorNotification("There was an error, the server sent undefined results"));
        }
    }
};
