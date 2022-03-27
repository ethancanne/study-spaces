import "./Search.scss";
import React, { useEffect, useState } from "react";

import TopBar from "../../components/TopBar/TopBar";
import SearchView from "../../Views/Search/SearchView";
import SearchResultsView from "../../Views/Search/SearchResultView";
import Page from "../Page";
import Button from "../../core/Button/Button";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Renders the Search page
 * @author Ethan Cannelongo
 * @date   1/24/2022
 */
const Search = () => {
    const [searchViewIsShowing, setSearchViewIsShowing] = useState(false);
    return (
        <>
            <Page topBar={true} currentPage="search">
                <div className="search-page">
                    <div className="page-title">
                        <h1>Search</h1>
                    </div>
                    <div className="search-area">
                        <SearchView
                            searchViewIsShowing={searchViewIsShowing}
                            setSearchViewIsShowing={setSearchViewIsShowing}
                        />
                        <SearchResultsView />
                    </div>
                    <div className="open-search-filter-button-container">
                        <Button
                            onClick={() => {
                                setSearchViewIsShowing(!searchViewIsShowing);
                            }}
                        >
                            <SearchIcon />
                        </Button>
                    </div>
                </div>
            </Page>
        </>
    );
};

export default Search;
