import React from "react";
import { Link } from "react-router-dom";
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
        <Link to={"/group/" + _id} style={{ textDecoration: "none" }}>
            <div
                className="study-group-view"
                style={{
                    border: `${groupColor} 4px solid`,
                    backgroundColor: groupColor + "99",
                    textDecoration: "none"
                }}
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
        </Link>
    );
};

export default StudyGroupView;
