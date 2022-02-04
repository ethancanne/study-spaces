import React from "react";
import "./Notification.scss";
import notificationTypes from "./notificationTypes";

//Redux
import { useSelector, useDispatch } from "react-redux";
import { hideNotification } from "../../state/actions";

/**
 * Renders a notification view, which will be shown whenever the
 * showNotification action is dispatched to the NotificationReducer.
 * @param {Boolean} props.isShowing true if the notification is currently being
 * shown
 * @author Ethan Cannelongo
 * @date   01/30/2022
 */
const Notification = (props) => {
    const type = useSelector((state) => state.notificationReducer.type);
    const message = useSelector((state) => state.notificationReducer.message);
    const dispatch = useDispatch();

    var className = "";
    var timeout;

    const configureTimeout = () => {
        clearTimeout(timeout);
        className = "error";
        timeout = setTimeout(function () {
            dispatch(hideNotification());
        }, 5000);
    };
    switch (type) {
        case notificationTypes.ERROR:
            configureTimeout();
            className = "error";
            break;
        case notificationTypes.SUCCESS:
            configureTimeout();
            className = "success";

            break;
    }

    return (
        <div className={"notification " + className + " " + (props.isShowing ? "active" : "")}>
            <h1>{message || "No Message"}</h1>
        </div>
    );
};

export default Notification;
