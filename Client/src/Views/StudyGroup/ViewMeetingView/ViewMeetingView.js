import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showConfirmationPopup, showViewMeetingsStudyGroupPopup } from "../../../state/actions";
import { Days, MeetingFrequencies } from "../../../../../Server/Models/Time";
import { getNextMeeting, sendDeleteRequest } from "../../../../Helper";
import Button from "../../../core/Button/Button";
import "./ViewMeetingView.scss";
import Routes from "../../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";

/**
 * This is a specific view that is used in a popup
 * to allow a user to view all the meetings in a study group
 * @param {Object} group The group to reference the meetings
 * @author Ethan Cannelongo
 * @date   02/23/2022
 */
const ViewMeetingView = ({ group }) => {
    const [nextMeeting, setNextMeeting] = useState("All Clear!");
    const user = useSelector((state) => state.authReducer.user);
    const dispatch = useDispatch();

    useEffect(() => {
        setNextMeeting(getNextMeeting(group));
    }, []);

    const getRecurringMeetingFrequencyJSX = () => {
        if (group.recurringMeeting) {
            if (group.recurringMeeting.frequency === MeetingFrequencies.Daily) return <>Every day</>;

            if (group.recurringMeeting.frequency === MeetingFrequencies.Weekly)
                return <>Every {group.recurringMeeting.day}</>;

            if (group.recurringMeeting.frequency === MeetingFrequencies.Monthly)
                return <>On the {new Date(group.recurringMeeting.date).getDate}th of every month.</>;

            if (group.recurringMeeting.frequency === MeetingFrequencies.Yearly)
                return <>On {group.recurringMeeting.date} of every year.</>;
        }
    };

    const submitDeleteOneTimeMeeting = (meetingId) => {
        console.log("PUSSHHHHSHS");
        dispatch(
            showConfirmationPopup(
                async (confirmed) => {
                    if (confirmed)
                        await sendDeleteRequest(
                            Routes.StudyGroup.DeleteMeeting,
                            { studyGroupId: group._id },
                            ResponseMessages.StudyGroup.SuccessMeetingDeleted,
                            null,
                            true,
                            (data, error) => {
                                if (error) return;
                            }
                        );
                },
                "Confirm Deletion",
                "Are you sure you want to delete the meeting?"
            )
        );

        // dispatch(showViewMeetingsStudyGroupPopup(group));
    };

    return (
        <div>
            <div className="meeting-container">
                <h1>Next Meeting:</h1>

                <div className="meeting">
                    <div className="meeting-time">
                        <p>
                            <span>Date: </span> {nextMeeting.date}
                        </p>
                        <p>
                            <span>Time: </span>
                            {nextMeeting.time}
                        </p>
                        <p>
                            <span>Location: </span>
                            {nextMeeting.location}
                        </p>
                    </div>
                    <div className="meeting-details">
                        <p>
                            <span>Details: </span>
                            {nextMeeting.details}
                        </p>
                    </div>
                </div>
            </div>
            {group.recurringMeeting && (
                <div className="meeting-container">
                    <h1>Recurring Schedule:</h1>

                    <div className="meeting">
                        <div className="meeting-time">
                            <p>
                                <span>Frequency: </span> {getRecurringMeetingFrequencyJSX()}
                            </p>
                            <p>
                                <span>Time: </span>
                                {group.recurringMeeting.time}
                            </p>
                            <p>
                                <span>Location: </span>
                                {group.recurringMeeting.location}
                            </p>
                        </div>
                        <div className="meeting-details">
                            <p>
                                <span>Details: </span>
                                {group.recurringMeeting.details}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="one-time-meetings-container">
                <h1>One-time Meetings</h1>

                {group.owner &&
                    group.owner._id === user._id &&
                    group.meetings.map((meeting) => (
                        <div className="one-time-meeting-container">
                            <div className="one-time-meeting">
                                <p>
                                    <span>Date</span>
                                    {meeting.date}
                                </p>
                                <p>
                                    <span>Time</span>
                                    {meeting.time}
                                </p>
                            </div>
                            {
                                <div className="delete-meeting-container">
                                    <Button
                                        onClick={() => {
                                            submitDeleteOneTimeMeeting(meeting._id);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            }
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ViewMeetingView;
