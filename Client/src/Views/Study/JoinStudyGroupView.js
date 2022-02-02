import React from "react";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import { useDispatch } from "react-redux";
import { addStudyGroup, showErrorNotification } from "../../state/actions";

const JoinStudyGroupView = ({ group }) => {
    const { name, school, owner, subject, courseCode, isTutor, isOnline, groupColor, description, _id } = group;

    const dispatch = useDispatch();

    const submitJoin = async () => {
        // SUBMIT THE SEARCH REQUEST.
        e.preventDefault();
        e.stopPropagation();
        let response;
        try {
            response = await axios.post(Routes.Search.GetSearchResults, {
                studyGroupId: _id,
                ownerId: owner.id
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
            <h1>{name}</h1>
            <div className="info">
                <Label>Description</Label>
                <p>{description}</p>
            </div>
            <div className="info">
                <Label>Owner</Label>
                <p>{owner}</p>
            </div>
            <div className="info">
                <Label>Course Code</Label>
                <p>{courseCode}</p>
            </div>
            <div className="info">
                <Label>Subject</Label>
                <p>{subject}</p>
            </div>
            <div className="info">
                <Label>Associated With</Label>
                <p>{school}</p>
            </div>
            <Button type={ButtonTypes.Creation} onClick={submitJoin}>
                Join
            </Button>
        </div>
    );
};

export default JoinStudyGroupView;
