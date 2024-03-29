import "./SearchView.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchForm from "../../components/SearchForm/SearchForm";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../Server/Routes/Routes";
import { Time } from "../../../../Server/Models/Time.js";
import Validator from "../../../../Server/Validator.js";
import { useDispatch } from "react-redux";
import { populateStudyGroupSearch, showErrorNotification } from "../../state/actions";
import MeetingFormats from "../../../../Server/Models/MeetingFormats";
import { sendPostRequest } from "../../../Helper";
import { useSelector } from "react-redux";
import Subjects from "../../../../Server/Models/Subjects.js";
import SideView from "../SideView/SideView";

/**
 * A view for inputting search terms and filters for searching study groups
 * The results of this search will be displayed on the SearchResults.js View
 * @author Ethan Cannelongo
 */
const SearchView = ({ searchViewIsShowing, setSearchViewIsShowing }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [subject, setSubject] = useState(Subjects.Any);
    const [isAssociatedWithSchool, setIsAssociatedWithSchool] = useState(false);
    const [meetingFormat, setMeetingFormat] = useState(MeetingFormats.Mixed);
    const [type, setType] = useState("Mixed");
    const [timeRange, setTimeRange] = useState(["12:00AM", "11:45PM"]);
    const [days, setDays] = useState([]);
    const [meetingFrequencies, setMeetingFrequencies] = useState([]);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.authReducer.user || "");
    /**
     * Retrieves study groups from search query by sending a request to the server
     * @author Ethan Cannelongo
     * @date 01/29/22
     */
    const submitSearch = async (e) => {
        // SUBMIT THE SEARCH REQUEST.
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setSearchViewIsShowing(false);

        await sendPostRequest(
            Routes.Search.GetSearchResults,
            {
                searchTerm,
                subject,
                school: isAssociatedWithSchool ? user.school : "",
                meetingFormat,
                meetingFrequencies,
                type,
                startTime: Time.parseTimeString(timeRange[0]),
                endTime: Time.parseTimeString(timeRange[1]),
                days
            },
            ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved,
            null,
            true,
            (data, error) => {
                if (error) return;
                dispatch(populateStudyGroupSearch(data.studyGroups));
            },
            false
        );
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

    /**
     * Sends a default search upon initially loading the page.
     */
    useEffect(() => {
        submitSearch();
    }, []);
    return (
        <SideView
            setSideViewIsShowing={setSearchViewIsShowing}
            sideViewIsShowing={searchViewIsShowing}
            nameOfClass="search-view"
        >
            <div>
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
                    userSchool={user.school || ""}
                />
            </div>
        </SideView>
    );
};

export default SearchView;
