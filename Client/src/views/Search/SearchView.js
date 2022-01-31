import "./SearchView.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchForm from "../../components/SearchForm/SearchForm";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../Server/Routes/Routes";
import Validator from "../../../../Server/Validator.js";
import { useDispatch } from "react-redux";
import { populateStudyGroupSearch, showErrorNotification } from "../../state/actions";
import MeetingFormats from "../../../../Server/Models/MeetingFormats";

/**
 * A view for inputting search terms and filters for searching study groups
 * The results of this search will be displayed on the SearchResults.js View
 * @author ???
 */
const SearchView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [subject, setSubject] = useState("");
    const [isAssociatedWithSchool, setIsAssociatedWithSchool] = useState(false);
    const [meetingFormat, setMeetingFormat] = useState(MeetingFormats.InPerson);
    const [type, setType] = useState("Group");
    const [timeRange, setTimeRange] = useState(["00:00", "24:00"]);
    const [days, setDays] = useState([]);
    const [meetingFrequencies, setMeetingFrequencies] = useState([]);

    const dispatch = useDispatch();

    /**
     * Retrieves study groups from search query by sending a request to the server
     * @author Ethan Cannelongo
     * @date 01/29/22
     */
    const submitSearch = async (e) => {
        console.log({
            searchTerm,
            subject,
            school: isAssociatedWithSchool ? "Liberty University" : null,
            meetingFormat,
            type,
            startTime: timeRange[0],
            endTime: timeRange[1],
            days,
            meetingFrequencies
        });
        // SUBMIT THE SEARCH REQUEST.
        e.preventDefault();
        e.stopPropagation();
        let response;
        try {
            //Send Search Request -  TODO: change the value that is sent if isAssociatedWithSchool is true to the school of the logged in user
            response = await axios.post(Routes.Search.GetSearchResults, {
                searchTerm,
                subject,
                school: isAssociatedWithSchool ? "Liberty University" : null,
                meetingFormat,
                meetingFrequencies,
                type,
                startTime: timeRange[0],
                endTime: timeRange[1],
                days
            });
        } catch (error) {
            console.log(error);
            dispatch(showErrorNotification("Cannot search... Sorry"));
        } finally {
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                console.log(response.data);
                const studyGroupsRetrivalWasValid =
                    ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved === response.data.message;

                if (studyGroupsRetrivalWasValid) {
                    dispatch(populateStudyGroupSearch(response.data.studyGroups));
                    console.log(response.data.studyGroups);
                } else {
                    dispatch(showErrorNotification("Cannot search... Sorry"));
                }
            } else {
                dispatch(showErrorNotification("Cannot search... Sorry"));
            }
        }
    };

    /**
     * Used to update the search term field in the search form.
     * @param {Event} e The change event to update the field with.
     * @author Ethan Cannelongo
     * @date  01/26/22
     */
    const updateSearchTerm = (e) => {
        setSearchTerm(e.target.value);
    };

    /**
     * Used to update the subject dropdown field in the search form.
     * @param {Event} e The change event to update the field with.
     * @author Ethan Cannelongo
     * @date  01/26/22
     */
    const updateSubject = (e) => {
        setSubject(e.target.value);
    };

    /**
     * Used to update the "show only groups associated with school" checkbox in the search form.
     * @param {Event} e The change event to update the field with.
     * @author Ethan Cannelongo
     * @date  01/26/22
     */
    const updateIsAssociatedWithSchool = (e) => {
        setIsAssociatedWithSchool(e.target.checked);
    };

    /**
     * Used to update the chosen meeting format from the dropdown menu in the search form.
     * @param {Event} e The change event to update the field with.
     * @author Ethan Cannelongo
     * @date  01/26/22
     */
    const updateMeetingFormat = (e) => {
        setMeetingFormat(e.target.options[e.target.selectedIndex].value);
    };

    /**
     * Used to update the chosen type from the dropdown menu in the search form.
     * @param {Event} e The change event to update the field with.
     * @author Ethan Cannelongo
     * @date  01/26/22
     */
    const updateType = (e) => {
        setType(e.target.options[e.target.selectedIndex].value);
    };

    /**
     * Used to update the chosen time range in the search form.
     * @param {Array} value The [startTime, endTime]
     * @author Ethan Cannelongo
     * @date  01/29/22
     */
    const updateTimeRange = (value) => {
        setTimeRange(value);
    };

    /**
     * Used to update the chosen time range in the search form.
     * @param {Array} value An array of chosen days
     * @author Ethan Cannelongo
     * @date  01/29/22
     */
    const updateDays = (value) => {
        setDays(value);
    };

    /**
     * Used to update the chosen time range in the search form.
     * @param {Array} value An array of chosen meeting frequencies
     * @author Ethan Cannelongo
     * @date  01/29/22
     */
    const updateMeetingFrequencies = (value) => {
        setMeetingFrequencies(value);
    };
    return (
        <div className="search-view">
            <SearchForm
                searchTerm={searchTerm}
                subject={subject}
                isAssociatedWithSchool={isAssociatedWithSchool}
                meetingFormat={meetingFormat}
                type={type}
                timeRange={timeRange}
                days={days}
                meetingFrequencies={meetingFrequencies}
                updateSearchTerm={updateSearchTerm}
                updateSubject={updateSubject}
                updateIsAssociatedWithSchool={updateIsAssociatedWithSchool}
                updateMeetingFormat={updateMeetingFormat}
                updateType={updateType}
                updateTimeRange={updateTimeRange}
                updateDays={updateDays}
                updateMeetingFrequencies={updateMeetingFrequencies}
                submitSearch={submitSearch}
            />
        </div>
    );
};

export default SearchView;
