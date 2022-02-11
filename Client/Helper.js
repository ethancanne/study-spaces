import Routes from "../Server/Routes/Routes";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showErrorNotification, showSuccessNotification } from "./src/state/actions";
import ResponseMessages from "../Server/Responses/ResponseMessages";
import Validator from "../Server/Validator";

export const sendPostRequest = async (route, data, successResponseMessage, isAuthenticated, callback = () => {}) => {
    const dispatch = useDispatch();
    let response;
    try {
        if (isAuthenticated) axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

        response = await axios.post(route, data);
    } catch (error) {
        console.log(error);
        dispatch(showErrorNotification("There was a problem connecting to the server:" + error));
    } finally {
        const responseIsDefined = Validator.isDefined(response.data);
        if (responseIsDefined) {
            const requestWasValid = successResponseMessage === response.data.message;

            if (requestWasValid) {
                dispatch(showSuccessNotification(response.data.message));
            } else {
                dispatch(showErrorNotification("There was an error: " + response.data.message));
            }
        } else {
            dispatch(showErrorNotification("There was an error, the server sent undefined results"));
        }
    }
};
