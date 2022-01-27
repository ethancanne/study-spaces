import React from "react";
import "./Notification.scss";
import notificationTypes from "./notificationTypes";
import { useSelector, useDispatch } from "react-redux";
import { hideNotification } from "../../state/actions";

const Notification = (props) => {
    const type = useSelector((state) => state.notificationReducer.type);
    const message = useSelector((state) => state.notificationReducer.message);
    const dispatch = useDispatch();

    var className = "";

    switch (type) {
        case notificationTypes.ERROR:
            className = "error";
            setTimeout(function () {
                dispatch(hideNotification());
            }, 5000);
    }

    return (
        <div className={"notification " + className + " " + (props.isShowing ? "active" : "")}>
            <h1>{message || "No Message"}</h1>
        </div>
    );
};

export default Notification;
