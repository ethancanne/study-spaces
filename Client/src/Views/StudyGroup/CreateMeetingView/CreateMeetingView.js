import React, { useState } from "react";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../../Server/Routes/Routes";
import { sendPostRequest } from "../../../../Helper";
import { useDispatch } from "react-redux";
import { closePopup } from "../../../state/actions";
import CreateMeetingForm from "../../../components/CreateMeetingForm/CreateMeetingForm";
import { useHistory } from "react-router";

/**
 * This is a specific view that is used in a popup
 * to allow a user to create a meeting
 * @author Ethan Cannelongo
 * @date   02/17/2022
 */
const CreateMeetingView = ({ group, isRecurringMeeting }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [date, setDate] = useState(
        isRecurringMeeting && group.recurringMeeting ? group.recurringMeeting.date.replace("/", "-") : ""
    );
    const [time, setTime] = useState(isRecurringMeeting && group.recurringMeeting ? group.recurringMeeting.time : "");
    const [frequency, setFrequency] = useState(
        isRecurringMeeting && group.recurringMeeting ? group.recurringMeeting.frequency : ""
    );
    const [details, setDetails] = useState(
        isRecurringMeeting && group.recurringMeeting ? group.recurringMeeting.details : ""
    );
    const [location, setLocation] = useState(
        isRecurringMeeting && group.recurringMeeting ? group.recurringMeeting.location : ""
    );
    const [roomNumber, setRoomNumber] = useState(
        isRecurringMeeting && group.recurringMeeting ? group.recurringMeeting.roomNumber : ""
    );

    /**
     * Makes an api call to the create meeting route, passing in the information entered in the form and rendering the client according to the response received
     * @author Ethan Cannelongo
     * @date   02/17/2022
     * @async
     * */
    const submitCreateMeeting = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (isRecurringMeeting)
            sendPostRequest(
                Routes.StudyGroup.SetRecurringMeeting,
                {
                    day: new Date(date).getDay(),
                    date: date.replace(/-/g, "/"),
                    time,
                    frequency,
                    details,
                    location,
                    roomNumber,
                    studyGroupId: group._id
                },
                ResponseMessages.StudyGroup.SetRecurringMeeting.Success,
                null,
                true,
                (data, error) => {
                    if (error) return;
                    dispatch(closePopup());
                    history.go(0);
                }
            );
        else
            sendPostRequest(
                Routes.StudyGroup.AddOneTimeMeeting,
                {
                    day: new Date(date).getDay(),
                    date: date.replace(/-/g, "/"),
                    time,
                    details,
                    location,
                    roomNumber,
                    studyGroupId: group._id
                },
                ResponseMessages.StudyGroup.AddOneTimeMeeting.Success,
                null,
                true,
                (data, error) => {
                    if (error) return;
                    dispatch(closePopup());
                    history.go(0);
                }
            );
    };
    /**
     * Used to update the date field in the create meeting form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateDateField = (event) => {
        setDate(event.target.value);
    };

    /**
     * Used to update the time field in the create meeting form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateTimeField = (event) => {
        setTime(event.target.value);
    };

    /**
     * Used to update the frequency value in the create meeting form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateFrequencyField = (event) => {
        setFrequency(event.target.value);
    };

    /**
     * Used to update the details field in the create meeting form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateDetailsField = (event) => {
        setDetails(event.target.value);
    };

    /**
     * Used to update the location field in the create meeting form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateLocationField = (event) => {
        setLocation(event.target.value);
    };

    /**
     * Used to update the room number field in the create meeting form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateRoomNumberField = (event) => {
        setRoomNumber(event.target.value);
    };
    return (
        <>
            <CreateMeetingForm
                date={date}
                time={time}
                frequency={frequency}
                details={details}
                location={location}
                roomNumber={roomNumber}
                updateDateField={updateDateField}
                updateTimeField={updateTimeField}
                updateFrequencyField={updateFrequencyField}
                updateDetailsField={updateDetailsField}
                updateLocationField={updateLocationField}
                updateRoomNumberField={updateRoomNumberField}
                submitCreateMeeting={submitCreateMeeting}
                isRecurringMeeting={isRecurringMeeting}
            />
        </>
    );
};

export default CreateMeetingView;
