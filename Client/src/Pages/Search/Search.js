import "./Search.scss";
import React, { useEffect } from "react";

import TopBar from "../../components/TopBar/TopBar";
import SearchView from "../../Views/Search/SearchView";
import SearchResultsView from "../../Views/Search/SearchResultView";
import Page from "../Page";

/**
 * Renders the Search page
 * @author Ethan Cannelongo
 * @date   1/24/2022
 */
const Search = () => {
    return (
        <>
            <TopBar currentPage="search" />
            <Page>
                <div className="search-page">
                    <h1 className="page-title">Search</h1>
                    <div className="search-area">
                        <SearchView />
                        <SearchResultsView />
                    </div>
                </div>
            </Page>
        </>
    );
};

export default Search;
