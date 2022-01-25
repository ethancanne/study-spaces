import "./Search.scss";
import React, { useEffect } from "react";

import TopBar from "../../components/TopBar/TopBar";
import SearchView from "../../Views/Search/SearchView";
import SearchResultsView from "../../Views/Search/SearchResultView";

/**
 * Renders the Search page
 * @author Ethan Cannelongo
 * @date   1/24/2022
 */
const Search = () => {
    return (
        <div>
            <TopBar currentPage="search" />
            <div className="searchPage">
                <SearchView />
                <SearchResultsView />
            </div>
        </div>
    );
};

export default Search;
