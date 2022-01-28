import "./SearchView.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchForm from "../../components/SearchForm/SearchForm";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../Server/Routes/Routes";
import Validator from "../../../../Server/Validator.js";
import { useDispatch } from "react-redux";
import { populateStudyGroupSearch, showErrorNotification } from "../../state/actions";

/**
 * A view for inputting search terms and filters for searching study groups
 * The results of this search will be displayed on the SearchResults.js View
 * @author ???
 */
const SearchView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [subject, setSubject] = useState("");
    const [isAssociatedWithSchool, setIsAssociatedWithSchool] = useState(false);
    const [meetingFormat, setMeetingFormat] = useState("");
    const [type, setType] = useState("");

    const dispatch = useDispatch();

    /**
     * Retrieves study groups from search query by sending a request to the server
     * @author ???
     */
    const submitSearch = async (e) => {
        // SUBMIT THE SEARCH REQUEST.
        e.preventDefault();
        e.stopPropagation();
        let response;
        try {
            //TODO - Write out request
            response = await axios.post(Routes.Search.GetSearchResults, {
                searchTerm,
                subject,
                school: isAssociatedWithSchool ? "Liberty University" : null,
                meetingFormat,
                type
            });
        } catch (error) {
            console.log(error);
            dispatch(showErrorNotification("Cannot search... Sorry"));
        } finally {
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                const studyGroupsRetrivalWasValid =
                    ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved === response.data.message;

                if (studyGroupsRetrivalWasValid) {
                    dispatch(populateStudyGroupSearch(response.data));
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
     * @author ???
     * @date  ?/??/22
     */
    const updateSearchTerm = (e) => {
        setSearchTerm(e.target.value);
    };

    /**
     * Used to update the subject dropdown field in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    const updateSubject = (e) => {
        setSubject(e.target.value);
    };

    /**
     * Used to update the proximity dropdown field in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    // const updateProximity = (e) => {
    //     setProximity(e.target.value);
    // };

    /**
     * Used to update the "show only groups associated with school" checkbox in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    const updateIsAssociatedWithSchool = (e) => {
        setIsAssociatedWithSchool(e.target.checked);
    };

    /**
     * Used to update the chosen meeting format from the dropdown menu in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    const updateMeetingFormat = (e) => {
        setMeetingFormat(e.target.options[e.target.selectedIndex].value);
    };

    /**
     * Used to update the chosen type from the dropdown menu in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    const updateType = (e) => {
        setType(e.target.options[e.target.selectedIndex].value);
    };
    return (
        <div className="search-view">
            <SearchForm
                searchTerm={searchTerm}
                subject={subject}
                isAssociatedWithSchool={isAssociatedWithSchool}
                meetingFormat={meetingFormat}
                type={type}
                updateSearchTerm={updateSearchTerm}
                updateSubject={updateSubject}
                updateIsAssociatedWithSchool={updateIsAssociatedWithSchool}
                updateMeetingFormat={updateMeetingFormat}
                updateType={updateType}
                submitSearch={submitSearch}
            />
        </div>
    );
};

export default SearchView;
