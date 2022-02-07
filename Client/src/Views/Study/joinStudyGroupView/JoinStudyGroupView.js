import "./JoinStudyGroupView.scss";
import React from "react";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/ButtonTypes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../../Server/Routes/Routes";
import Label from "../../../core/Label/Label";
import axios from "axios";
import Validator from "../../../../../Server/Validator";
import { useDispatch, useSelector } from "react-redux";
import { addStudyGroup, showErrorNotification, closePopup, showSuccessNotification } from "../../../state/actions";

const JoinStudyGroupView = ({ group }) => {
    const { name, school, owner, subject, course, isTutorGroup, isOnlineGroup, groupColor, description, _id } = group;

    const user = useSelector((state) => state.authReducer.user);

    const dispatch = useDispatch();

    const submitJoin = async (e) => {
        // SUBMIT THE SEARCH REQUEST.
        e.preventDefault();
        e.stopPropagation();

        console.log("Submitting");
        let response;
        try {
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

            response = await axios.post(Routes.StudyGroup.JoinStudyGroup, {
                studyGroupId: _id
            });
        } catch (e) {
            dispatch(showErrorNotification("Cannot Join... Sorry: " + e.message));
        } finally {
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                const studyGroupJoinWasValid =
                    ResponseMessages.StudyGroup.SuccessStudyGroupJoined === response.data.message;

                if (studyGroupJoinWasValid) {
                    dispatch(addStudyGroup(group));
                    dispatch(closePopup());
                    dispatch(showSuccessNotification(ResponseMessages.StudyGroup.SuccessStudyGroupJoined));
                } else {
                    dispatch(showErrorNotification("Cannot Join... Sorry: The server sent some weird results."));
                }
            } else {
                dispatch(showErrorNotification("Cannot join... Sorry: Undefined response"));
            }
        }
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
                </div>
            </div>

            <Button type={ButtonTypes.Creation} onClick={submitJoin}>
                Join
            </Button>
        </div>
    );
};

export default JoinStudyGroupView;