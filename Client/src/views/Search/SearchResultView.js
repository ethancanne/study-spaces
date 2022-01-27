import "./SearchResults.scss";
import React from "react";
import SearchListing from "../../components/SearchListing/SearchListing";
import { useSelector } from "react-redux";

/**
 * A view for displaying resulting study groups from a search query
 * @author ???
 */
const SearchResultView = () => {
    const search = useSelector((state) => state.studyGroupsReducer.search);
    return (
        <div className="search-results">
            {/* Render groups from search using search listing found within state */}
            {search.map((group) => (
                <SearchListing
                    title={group.title}
                    school={group.school}
                    owner={group.owner}
                    category={group.category}
                    courseCode={group.courseCode}
                    isTutor={group.isTutor}
                    isOnline={group.isOnline}
                    schedule={group.schedule}
                    groupColor={group.groupColor}
                    key={group.title}
                />
            ))}
        </div>
    );
};

export default SearchResultView;
