import React from "react";
import "./StudyGroupView.scss";

/**
 * Used to display a joined study group on the study page
 * @param {String} title title of the study group
 * @author Ethan Cannelongo
 * @date   11/02/2021
 */
const StudyGroupView = ({ group }) => {
    const { name, school, owner, subject, course, isTutorGroup, isOnlineGroup, groupColor, description, _id } = group;

    return (
        <div
            className="study-group-view"
            style={{ border: `${groupColor} 4px solid`, backgroundColor: groupColor + "99" }}
        >
            <h1 className="group-title">{name}</h1>
            <div className="group-view-sub-details">
                <p>{isTutorGroup ? "Tutor" : "Group"}</p>
                <p>{isOnlineGroup ? "Online" : "In-person"}</p>
            </div>
            <div className="group-view-details">
                <p>Owner: {owner.name}</p>
                <p>Course Code: {course}</p>
            </div>
        </div>
    );
};

export default StudyGroupView;
