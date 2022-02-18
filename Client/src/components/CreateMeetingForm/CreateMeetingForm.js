import React from "react";
import Form from "../../core/Form/Form";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import InputField from "../../core/InputField/InputField";
import Dropdown from "../../core/Dropdown/Dropdown";
import { MeetingFrequencies } from "../../../../Server/Models/Time";

const CreateMeetingForm = ({
    date,
    time,
    frequency,
    details,
    location,
    roomNumber,
    updateDateField,
    updateTimeField,
    updateFrequencyField,
    updateDetailsField,
    updateLocationField,
    updateRoomNumberField,
    submitCreateMeeting
}) => {
    return (
        <div className="create-meeting-form">
            <Form onSubmit={submitCreateMeeting}>
                <div className="side-by-side">
                    <InputField>
                        <Label>Date</Label>
                        <TextInput value={date} onChange={updateDateField} type="date" />
                    </InputField>

                    <InputField>
                        <Label>Time</Label>
                        <TextInput value={time} onChange={updateTimeField} type="time" />
                    </InputField>

                    <InputField>
                        <Label>Frequency</Label>
                        <Dropdown
                            options={[...Object.values(MeetingFrequencies)]}
                            value={frequency}
                            onChange={updateFrequencyField}
                        />
                    </InputField>
                </div>
                <InputField>
                    <Label>Details</Label>
                    <TextInput value={details} onChange={updateDetailsField} isTextArea={true} />
                </InputField>
                <InputField>
                    <Label>Location</Label>
                    <TextInput value={location} onChange={updateLocationField} />
                </InputField>
                <InputField>
                    <Label>Room Number (if applicable)</Label>
                    <TextInput value={roomNumber} onChange={updateRoomNumberField} />
                </InputField>
                <Button type={ButtonTypes.Creation}>Create</Button>
            </Form>
        </div>
    );
};

export default CreateMeetingForm;
