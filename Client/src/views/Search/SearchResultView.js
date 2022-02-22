import "./SearchResults.scss";
import React from "react";
import SearchListing from "../../components/SearchListing/SearchListing";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Loading from "../../components/Loading/Loading";

/**
 * A view for displaying resulting study groups from a search query
 * @author ???
 */
const SearchResultView = () => {
    const search = useSelector((state) => state.studyGroupsReducer.search);
    const isLoading = useSelector((state) => state.notificationReducer.loading);
    return (
        <div className="search-results">
            {/* Render groups from search using search listing found within state */}
            {isLoading ? <Loading /> : search.map((group) => <SearchListing group={group} key={group._id} />)}
        </div>
    );
};

export default SearchResultView;
