import React from "react";
import "./ViewMeetingView.scss";

/**
 * This is a specific view that is used in a popup
 * to allow a user to view all the meetings in a study group
 * @param {Object} group The group to reference the meetings
 * @author Ethan Cannelongo
 * @date   02/23/2022
 */
const ViewMeetingView = ({ group }) => {
    const getNextMeeting = () => {
        var nextMeeting;
        group.meetings.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        return new Date(group.meetings[0].date) < Date.now() &&
            new Date(group.meetings[0].date) < new Date(group.recurringMeeting.date)
            ? group.meetings[0]
            : group.recurringMeeting;
    };

    return (
        <div>
            <div className="next-meeting">
                <p> Next Meeting: {getNextMeeting().date.toString()}</p>
            </div>
            <div className="recurring-meeting">
                <p> Recurring Meeting:{group.recurringMeeting && group.recurringMeeting.date}</p>
            </div>
            <div className="one-time-meeting">
                {group.meetings.map((meeting) => (
                    <p>One-time:{meeting.date}</p>
                ))}
            </div>
        </div>
    );
};

export default ViewMeetingView;
