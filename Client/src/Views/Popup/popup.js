import "./Popup.scss";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closePopup, showJoinStudyGroupPopup } from "../../state/actions";
import CreateStudyGroupView from "../Study/CreateStudyGroupView";
import JoinStudyGroupView from "../Study/joinStudyGroupView/JoinStudyGroupView";
import InputView from "../Input/InputView";
import ConfirmationForm from "../ConfirmationForm/ConfirmationForm";

import views from "../Views";
import EditStudyGroup from "../../Views/StudyGroup/EditStudyGroup/EditStudyGroupView";
import CreateMeetingView from "../StudyGroup/CreateMeetingView/CreateMeetingView";
import CreatePostView from "../StudyGroup/CreatePostView/CreatePostView";
import ViewPostView from "../StudyGroup/ViewPostView/ViewPostView";
import Loading from "../../components/Loading/Loading";

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
    const isLoading = useSelector((state) => state.notificationReducer.loading);

    const dispatch = useDispatch();
    let popupView = <></>;

    switch (view) {
        case views.Popup.StudyGroup.Create:
            popupView = <CreateStudyGroupView />;
            break;
        case views.Popup.StudyGroup.Join:
            popupView = <JoinStudyGroupView group={payload} />;
            break;

        case views.Popup.StudyGroup.Edit:
            popupView = <EditStudyGroup group={payload} />;
            break;

        case views.Popup.StudyGroup.CreateMeeting:
            popupView = <CreateMeetingView group={payload.group} isRecurringMeeting={payload.isRecurringMeeting} />;
            break;

        case views.Popup.StudyGroup.CreatePost:
            popupView = <CreatePostView group={payload} />;
            break;

        case views.Popup.StudyGroup.ViewPost:
            popupView = <ViewPostView post={payload} />;
            break;
        case views.Popup.Input:
            popupView = (
                <InputView
                    label={payload.label}
                    defaultInput={payload.defaultInput}
                    callback={payload.callback}
                    label2={payload.label2}
                />
            );
            break;

        case views.Popup.Confirmation:
            popupView = (
                <ConfirmationForm
                    callback={payload.callback}
                    title={payload.title}
                    message={payload.message}
                    isConfirmation={payload.isConfirmation}
                    firstButtonTitle={payload.firstButtonTitle}
                    secondButtonTitle={payload.secondButtonTitle}
                />
            );
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
                    <h1>{payload.title || view}</h1>
                    <button onClick={() => dispatch(closePopup())}>X</button>
                </div>

                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="popup-body">{!props.children ? popupView : props.children}</div>
                )}
            </div>
        </div>
    );
};

export default Popup;
