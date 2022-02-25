import React, { useState } from "react";
import { useEffect } from "react";
import { Days, MeetingFrequencies } from "../../../../../Server/Models/Time";
import { getNextMeeting } from "../../../../Helper";
import "./ViewMeetingView.scss";

/**
 * This is a specific view that is used in a popup
 * to allow a user to view all the meetings in a study group
 * @param {Object} group The group to reference the meetings
 * @author Ethan Cannelongo
 * @date   02/23/2022
 */
const ViewMeetingView = ({ group }) => {
    const [nextMeeting, setNextMeeting] = useState("All Clear!");

    useEffect(() => {
        setNextMeeting(getNextMeeting(group));
    }, []);

    const getRecurringMeetingJSX = () => {
        if (group.recurringMeeting) {
            if (group.recurringMeeting.frequency === MeetingFrequencies.Daily)
                return (
                    <div>
                        <p>Every day at {group.recurringMeeting.time}</p>
                    </div>
                );

            if (group.recurringMeeting.frequency === MeetingFrequencies.Weekly)
                return (
                    <div>
                        <p>Every {group.recurringMeeting && group.recurringMeeting.day}</p>
                        <p>At {group.recurringMeeting && group.recurringMeeting.time}</p>
                    </div>
                );

            if (group.recurringMeeting.frequency === MeetingFrequencies.Monthly)
                return (
                    <div>
                        <p>
                            On {group.recurringMeeting && new Date(group.recurringMeeting.date).getDate()} of every
                            month
                        </p>
                        <p>At {group.recurringMeeting && group.recurringMeeting.time}</p>
                    </div>
                );

            if (group.recurringMeeting.frequency === MeetingFrequencies.Yearly)
                return (
                    <div>
                        <p>
                            On {group.recurringMeeting && new Date(group.recurringMeeting.date).getDate()} of{" "}
                            {new Date(group.recurringMeeting.date).getMonth()}
                        </p>
                        <p>At {group.recurringMeeting && group.recurringMeeting.time}</p>
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="next-meeting">
                <h1> Next Meeting: </h1>
                <p>{nextMeeting.date}</p>
                <p>{nextMeeting.time}</p>
                <p>{nextMeeting.details}</p>
                <p>{nextMeeting.location}</p>
                <p>{nextMeeting.roomNumber}</p>
            </div>
            <div className="recurring-schedule">
                <h1>Recurring Schedule:</h1>
                {getRecurringMeetingJSX()}
            </div>
            <div className="one-time-meetings">
                <h1>One-time Meetings</h1>
                {group.meetings.map((meeting) => (
                    <div>
                        <p>One-time:{meeting.date}</p>
                        <p>At {meeting.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewMeetingView;
