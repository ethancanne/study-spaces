import React from "react";
import TopBar from "../components/TopBar/TopBar";
import "./Page.scss";

/**
 * Renders a page.
 * @author Cameron Burkholder and Ethan Cannelongo
 * @date   10/20/2021
 */
const Page = (props) => {
    return (
        <div>
            {props.topBar && <TopBar currentPage={props.currentPage} color={props.color} />}

            <div className="page" {...props} style={{ borderColor: props.color }}>
                {props.children}
            </div>
        </div>
    );
};

export default Page;
