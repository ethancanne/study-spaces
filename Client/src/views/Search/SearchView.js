import "./SearchView.scss";
import React, { useState, useEffect } from "react";
import SearchForm from "../../components/SearchForm/SearchForm";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../Server/Routes/Routes";
import Validator from "../../../../Server/Validator.js";
import { useDispatch } from "react-redux";
import { populateStudyGroupSearch } from "../../state/actions";

/**
 * A view for inputting search terms and filters for searching study groups
 * The results of this search will be displayed on the SearchResults.js View
 * @author ???
 */
const SearchView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [proximity, setProximity] = useState("");
    const [schoolOnly, setSchoolOnly] = useState(false);
    const [onlineOnly, setOnlineOnly] = useState(false);
    const [tutorOnly, setTutorOnly] = useState(false);

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
            response = await axios.post();
        } catch (error) {
            console.log(error);
        } finally {
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                const studyGroupsRetrivalWasValid =
                    ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved === response.data.message;

                if (studyGroupsRetrivalWasValid) {
                    dispatch(populateStudyGroupSearch(response.data));
                }
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
     * Used to update the category dropdown field in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    const updateCategory = (e) => {
        setCategory(e.target.value);
    };

    /**
     * Used to update the proximity dropdown field in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    const updateProximity = (e) => {
        setProximity(e.target.value);
    };

    /**
     * Used to update the "show only groups associated with school" checkbox in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    const updateSchoolOnly = (e) => {
        setSchoolOnly(e.target.checked);
    };

    /**
     * Used to update the "show only online groups" checkbox in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    const updateOnlineOnly = (e) => {
        setOnlineOnly(e.target.checked);
    };

    /**
     * Used to update the "show only tutor groups" checkbox in the search form.
     * @param {Event} e The change event to update the field with.
     * @author ???
     * @date  ?/??/22
     */
    const updateTutorOnly = (e) => {
        setTutorOnly(e.target.checked);
    };

    return (
        <div>
            <SearchForm
                searchTerm={searchTerm}
                category={category}
                proximity={proximity}
                schoolOnly={schoolOnly}
                onlineOnly={onlineOnly}
                tutorOnly={tutorOnly}
                updateSearchTerm={updateSearchTerm}
                updateCategory={updateCategory}
                updateProximity={updateProximity}
                updateSchoolOnly={updateSchoolOnly}
                updateOnlineOnly={updateOnlineOnly}
                updateTutorOnly={updateTutorOnly}
                submitSearch={submitSearch}
            />
        </div>
    );
};

export default SearchView;
