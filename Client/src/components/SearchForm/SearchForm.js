import React, { useState, useEffect } from "react";
import "./SearchForm.scss";
import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";
import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label.js";
import ToggleField from "../../core/ToggleField/ToggleField.js";
import Toggle from "../../core/Toggle/Toggle.js";
import Dropdown from "../../core/Dropdown/Dropdown.js";
import MeetingFormats from "../../../../Server/Models/MeetingFormats";
import TimeRange from "../../core/Range/TimeRange";
import MultipleDropdown from "../../core/Dropdown/MultipleDropdown";
import { Days, MeetingFrequencies } from "../../../../Server/Models/Time";

/**
 * Renders a search form for searching study groups
 * @author Stacey Popenfoose and Ethan Cannelongo
 * @date 1/27/2022
 */
const SearchForm = ({
    searchTerm,
    subject,
    isAssociatedWithSchool,
    meetingFormat,
    type,
    timeRange,
    days,
    meetingFrequencies,
    updateSearchTerm,
    updateSubject,
    updateIsAssociatedWithSchool,
    updateMeetingFormat,
    updateType,
    updateTimeRange,
    updateDays,
    updateMeetingFrequencies,
    submitSearch,
    userSchool
}) => {
    return (
        <div>
            <Form onSubmit={submitSearch} className="search-form">
                <InputField>
                    <Label>Search Term</Label>
                    <TextInput value={searchTerm} onChange={updateSearchTerm} />
                </InputField>
                <InputField>
                    <Label>Category</Label>
                    <Dropdown options={["This", "That"]} value={subject} onChange={updateSubject} />
                </InputField>
                <InputField>
                    <Label>Meeting Frequency</Label>
                    <MultipleDropdown
                        items={[...Object.values(MeetingFrequencies)]}
                        setItems={updateMeetingFrequencies}
                    />
                </InputField>
                <InputField>
                    <Label>Meeting Days</Label>
                    <MultipleDropdown items={[...Object.values(Days)]} setItems={updateDays} />
                </InputField>
                <InputField>
                    <Label>Meeting Time Range</Label>
                    <h4>
                        {timeRange[0]} to {timeRange[1]}
                    </h4>
                    <TimeRange updateTimeRange={updateTimeRange} />
                </InputField>
                <div className="side-by-side">
                    <InputField>
                        <Label>Meeting Format</Label>
                        <Dropdown
                            options={[...Object.values(MeetingFormats)]}
                            onChange={updateMeetingFormat}
                            value={meetingFormat}
                        />
                    </InputField>
                    <InputField>
                        <Label>Type</Label>
                        <Dropdown options={["Group", "Tutor", "Mixed"]} onChange={updateType} value={type} />
                    </InputField>
                </div>
                {userSchool !== "" && (
                    <ToggleField>
                        <Label>Show Only Groups Associated with {userSchool}?</Label>
                        <Toggle
                            value={isAssociatedWithSchool}
                            onChange={updateIsAssociatedWithSchool}
                            type="checkbox"
                        />
                    </ToggleField>
                )}

                <Button type={ButtonTypes.Primary}>Search</Button>
            </Form>
        </div>
    );
};

export default SearchForm;
