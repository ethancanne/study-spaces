import "./JoinStudyGroupView.scss";
import React from "react";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/ButtonTypes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../../Server/Routes/Routes";
import Label from "../../../core/Label/Label";
import { useDispatch, useSelector } from "react-redux";
import { addStudyGroup, showErrorNotification, closePopup } from "../../../state/actions";

const JoinStudyGroupView = ({ group }) => {
    const { name, school, owner, subject, course, isTutor, isOnline, groupColor, description, _id } = group;

    const user = useSelector((state) => state.authReducer.user);

    const dispatch = useDispatch();

    const submitJoin = async () => {
        // SUBMIT THE SEARCH REQUEST.
        e.preventDefault();
        e.stopPropagation();
        let response;
        try {
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

            response = await axios.post(Routes.Search.GetSearchResults, {
                studyGroupId: _id
            });
        } catch (error) {
            // console.log(error);
            // dispatch(showErrorNotification("Cannot search... Sorry"));
        } finally {
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                const studyGroupJoinWasValid =
                    ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved === response.data.message;

                if (studyGroupJoinWasValid) {
                    dispatch(addStudyGroup(group));
                    dispatch(closePopup());
                } else {
                    dispatch(showErrorNotification("Cannot search... Sorry"));
                }
            } else {
                dispatch(showErrorNotification("Cannot search... Sorry"));
            }
        }
    };
    return (
        <div>
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
                </div>
            </div>
            <Button type={ButtonTypes.Creation} onClick={submitJoin}>
                Join
            </Button>
        </div>
    );
};

export default JoinStudyGroupView;
