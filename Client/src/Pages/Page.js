import React from "react";
import "./Page.scss";

/**
 * Renders a page.
 * @author Cameron Burkholder and Ethan Cannelongo
 * @date   10/20/2021
 */
const Page = (props) => {
    return (
        <div className="page" {...props}>
            {props.children}
        </div>
    );
};

export default Page;
