import "./Popup.scss";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closePopup, showJoinStudyGroupPopup } from "../../state/actions";
import CreateStudyGroupView from "../Study/CreateStudyGroupView";
import JoinStudyGroupView from "../Study/joinStudyGroupView/JoinStudyGroupView";
import popupTypes from "./PopupTypes";

/**
 * This is the presentational component that presents different popup views according to the
 * view property in the popupReducer.
 * @param {boolean} isShowing true if the popup is currently showing on the screen and false otherwise
 * @param {JSX} children content of the popup
 * @author Ethan Cannelongo
 * @date   11/25/2021
 */
const Popup = (props) => {
    const { view, payload } = useSelector((state) => state.popupReducer);

    const dispatch = useDispatch();
    let popupView = <></>;

    switch (view) {
        case popupTypes.StudyGroup.Create:
            popupView = <CreateStudyGroupView />;
            break;
        case popupTypes.StudyGroup.Join:
            popupView = <JoinStudyGroupView group={payload} />;
            break;
        default:
            console.log(popupTypes.StudyGroup.Join, view, popupTypes.StudyGroup.Join === view);
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
