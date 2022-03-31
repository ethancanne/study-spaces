import "./JoinStudyGroupView.scss";
import React from "react";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/ButtonTypes";
import { sendPostRequest } from "../../../../Helper";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../../Server/Routes/Routes";
import Label from "../../../core/Label/Label";
import axios from "axios";
import Validator from "../../../../../Server/Validator";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { addStudyGroup, showErrorNotification, closePopup, showSuccessNotification } from "../../../state/actions";

const JoinStudyGroupView = ({ group }) => {
    const { name, school, owner, subject, course, isTutorGroup, isOnlineGroup, groupColor, description, _id } = group;

    const user = useSelector((state) => state.authReducer.user);

    const dispatch = useDispatch();
    const history = useHistory();

    const submitJoin = async (e) => {
        // SUBMIT THE SEARCH REQUEST.
        e.preventDefault();
        e.stopPropagation();

        console.log("Submitting");

        await sendPostRequest(
            Routes.StudyGroup.JoinStudyGroup,
            { studyGroupId: _id },
            ResponseMessages.StudyGroup.SuccessStudyGroupJoined,
            null,
            true,
            (data, error) => {
                if (error) return;
                dispatch(addStudyGroup(group));
                dispatch(closePopup());
            }
        );
    };

    const submitMessageStudyGroupOwner = async (e) => {
        // SUBMIT THE SEARCH REQUEST.
        e.preventDefault();
        e.stopPropagation();

        await sendPostRequest(
            Routes.Message.CreateConversation,
            { receiverId: owner._id },
            ResponseMessages.Message.SuccessCreateConversation,
            null,
            true,
            (data, error) => {
                history.push("/message");
                dispatch(closePopup());
                if (error) return;
            }
        );
    };

    return (
        <div className="join-group-container">
            <div className="group-popup-title" style={{ backgroundColor: `${groupColor}70` }}>
                <h1>{name}</h1>
            </div>
            <div className="popup-info-fields">
                <div className="info">
                    <Label>Description</Label>
                    <p>{description}</p>
                </div>
                <div className="sub-info">
                    <div className="info">
                        <Label>Owner</Label>
                        <p>{owner.name}</p>
                    </div>
                    <div className="info">
                        <Label>Course Code</Label>
                        <p>{course}</p>
                    </div>
                    <div className="info">
                        <Label>Subject</Label>
                        <p>{subject}</p>
                    </div>
                    <div className="info">
                        <Label>Associated With</Label>
                        <p>{school}</p>
                    </div>
                    <div className="info">
                        <Label>Type</Label>
                        <p>{isTutorGroup ? <p>Tutor</p> : <p>Group</p>}</p>
                    </div>
                    <div className="info">
                        <Label>Meeting Format</Label>
                        <p>{isOnlineGroup ? <p>Online</p> : <p>In Person</p>}</p>
                    </div>
                    {group.recurringMeeting && (
                        <div className="info">
                            {group.isOnlineGroup ? (
                                <Label>
                                    Meets <strong>Online</strong>:
                                </Label>
                            ) : (
                                <Label>
                                    Meets <strong>In-Person</strong>:
                                </Label>
                            )}
                            <p>
                                {group.recurringMeeting.frequency} on {group.recurringMeeting.day} at{" "}
                                {group.recurringMeeting.time}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="side-by-side">
                <Button type={ButtonTypes.Primary} onClick={submitMessageStudyGroupOwner}>
                    Message Study Group Owner
                </Button>
                <Button type={ButtonTypes.Creation} onClick={submitJoin}>
                    Join
                </Button>
            </div>
        </div>
    );
};

export default JoinStudyGroupView;
