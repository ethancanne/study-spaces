import React, { useEffect, useRef, useState } from "react";
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
    const timeout = useRef();

    const configureTimeout = () => {
        clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            dispatch(hideNotification());
            clearTimeout(timeout.current);
        }, 5000);
    };
    switch (
        type //TODO: add a x or checkmark to the notification
    ) {
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
