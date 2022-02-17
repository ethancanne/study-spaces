import React, { useState } from "react";
import CreateMeetingForm from "../../../components/CreateMeetingForm/CreateMeetingForm";

/**
 * This is a specific view that is used in a popup
 * to allow a user to create a meeting
 * @author Ethan Cannelongo
 * @date   02/17/2022
 */
const CreateMeetingView = ({ group }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [frequency, setFrequency] = useState(""); //OW
    const [details, setDetails] = useState("");
    const [location, setLocation] = useState("");
    const [roomNumber, setRoomNumber] = useState("");

    /**
     * Makes an api call to the create meeting route, passing in the information entered in the form and rendering the client according to the response received
     * @author Ethan Cannelongo
     * @date   02/17/2022
     * @async
     * */
    const submitCreateMeeting = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(group, date, time, frequency, details, location, roomNumber);

        //...
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
        />
    );
};

export default CreateMeetingView;
