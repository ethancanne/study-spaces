import "./Popup.scss";

import React, { useState } from "react";
import popupTypes from "./PopupTypes";
import { useSelector, useDispatch } from "react-redux";
import { closePopup } from "../../state/actions";
import CreateStudyGroupView from "../Study/CreateStudyGroupView";

/**
 * This is the presentational component that presents different popup views according to the
 * view property in the popupReducer.
 * @param {boolean} isShowing true if the popup is currently showing on the screen and false otherwise
 * @param {JSX} children content of the popup
 * @author Ethan Cannelongo
 * @date   11/25/2021
 */
const Popup = (props) => {
    const view = useSelector((state) => state.popupReducer.view);
    const dispatch = useDispatch();
    let popupView = <></>;

    switch (view) {
        case popupTypes.StudyGroup.Create:
            popupView = <CreateStudyGroupView />;
            break;
    }

    return (
        <div className="popup-wrapper">
            <div
                className={"background " + (props.isShowing ? "active" : "")}
                onClick={() => dispatch(closePopup())}
            ></div>
            <div className={"popup " + (props.isShowing ? "active" : "")}>
                <div className="popup-top">
                    <h1>{view}</h1>
                    <button onClick={() => dispatch(closePopup())}>X</button>
                </div>
                <div className="popup-body">{!props.children ? popupView : props.children}</div>
            </div>
        </div>
    );
};

export default Popup;
