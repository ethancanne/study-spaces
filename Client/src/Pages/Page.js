import React from "react";
import TopBar from "../components/TopBar/TopBar";
import "./Page.scss";

/**
 * Renders a page.
 * @author Cameron Burkholder and Ethan Cannelongo
 * @date   10/20/2021
 */
const Page = ({ currentPage, topBar, showingPageTitle, children }) => {
    return (
        <div>
            {topBar && <TopBar currentPage={currentPage} />}

            <div className={showingPageTitle === undefined ? "page showingPageTitle" : "page"}>{children}</div>
        </div>
    );
};

export default Page;
