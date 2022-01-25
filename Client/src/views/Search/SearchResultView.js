import "./SearchResults.scss";
import React from "react";
import SearchListing from "../../components/SearchListing/SearchListing";
import { useSelector } from "react-redux";

/**
 * A view for displaying resulting study groups from a search query
 * @author ???
 */
const SearchResultView = () => {
    const groups = useSelector((state) => state.studyGroupsReducer.groups);
    return (
        <div>
            {/* Render groups from search using search listing found within state */}
            {/* {groups.map((group) => (
                <SearchListing />
            ))} */}
        </div>
    );
};

export default SearchResultView;
