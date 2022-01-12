import React from "react";
import "./StudyGroupView.scss";

/**
 * Used to display a joined study group on the study page
 * @param {string} title title of the study group
 * @author Ethan Cannelongo
 * @date   11/02/2021
 */
const StudyGroupView = ({ title }) => {
    return (
        <div className="study-group-view">
            <h1>{title}</h1>
        </div>
    );
};

export default StudyGroupView;
