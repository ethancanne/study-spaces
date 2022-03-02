import "./DetailsView.scss";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "../../../core/Button/Button";
import {
    showEditStudyGroupPopup,
    showConfirmationPopup,
    showViewMeetingsStudyGroupPopup
} from "../../../state/actions";
import { getNextMeeting, sendDeleteRequest, sendLeaveRequest } from "../../../../Helper";
import Routes from "../../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";

/**
 * Renders a view for a user to view details about a joined or edit an owned study group
 * @author Ethan Cannelongo
 * @date   02/15/2022
 * @param {Object} group the study group
 * */
const DetailsView = ({ group }) => {
    const user = useSelector((state) => state.authReducer.user);
    const dispatch = useDispatch();
    const history = useHistory();

    /**
     * Makes an api call to the Delete study group route, passing in the information entered in
     * the form and rendering the client according to the response received
     * @author Ethan Cannelongo
     * @date   02/16/2022
     * @async
     * */
    const submitDelete = async (confirmed) => {
        if (confirmed)
            await sendDeleteRequest(
                Routes.StudyGroup.DeleteStudyGroup,
                { studyGroupId: group._id },
                ResponseMessages.StudyGroup.SuccessStudyGroupDeleted,
                null,
                true,
                (data, error) => {
                    if (error) return;
                    history.push("/");
                }
            );
    };
    const submitLeave = async (confirmed) => {
        if (confirmed) {
            await sendLeaveRequest(
                Routes.StudyGroup.LeaveStudyGroup,
                { studyGroupId: group._id },
                ResponseMessages.StudyGroup.SuccessStudyGroupLeft,
                null,
                true,
                (data, error) => {
                    if (error) return;
                    history.push("/");
                }
            );
        }
    };
    return (
        <div className="details-container">
            <div className="meetinginfo-container" onClick={() => dispatch(showViewMeetingsStudyGroupPopup(group))}>
                <h1>Next Meeting</h1>
                <div className="meetinginfo-description">
                    <p>
                        Date: <strong>{group && getNextMeeting(group).date}</strong>
                    </p>
                    <p>
                        Time: <strong>{group && getNextMeeting(group).time}</strong>
                    </p>
                </div>
            </div>
            <div className="description-container">
                <h1>Group Description</h1>
                <p className="details-description">{group.description}</p>
            </div>

            <div className="buttons">
                {group.owner && group.owner._id === user._id && (
                    <>
                        <Button onClick={() => dispatch(showEditStudyGroupPopup(group))}>EDIT</Button>
                        <Button
                            onClick={() =>
                                dispatch(
                                    showConfirmationPopup(
                                        submitDelete,
                                        "Confirm Deletion",
                                        "Are you sure you want to delete the study group: " + group.name + "?"
                                    )
                                )
                            }
                        >
                            Delete
                        </Button>
                    </>
                )}
                {group.owner && group.owner._id !== user._id && (
                    <>
                        <Button
                            onClick={() =>
                                dispatch(
                                    showConfirmationPopup(
                                        submitLeave,
                                        "Confirm Leave",
                                        "Are you sure you want to leave the study group: " + group.name + "?"
                                    )
                                )
                            }
                        >
                            Leave Group
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DetailsView;
