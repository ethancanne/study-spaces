import React, { useEffect } from "react";
import "./SearchListing.scss";
import { useDispatch } from "react-redux";
import { showJoinStudyGroupPopup } from "../../state/actions";
/**
 * A view for displaying a single study group listing resulting from a search query
 * @author Ethan Cannelongo
 */
const SearchListing = ({ group }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        console.log(group);
    }, []);

    return (
        <div
            className="listing-container"
            style={{
                border: `${group.groupColor} 5px solid`
            }}
            onClick={() => dispatch(showJoinStudyGroupPopup(group))}
        >
            <div
                className="title-photo-container"
                style={{
                    backgroundColor: group.groupColor
                }}
            >
                <h1 className="group-title">{group.name}</h1>
            </div>
            <div className="group-info-container">
                <div className="group-info-item" id="owner-info">
                    {group.isTutor ? (
                        <p>
                            <strong>Tutor:</strong>
                        </p>
                    ) : (
                        <p>
                            <strong>Owner:</strong>
                        </p>
                    )}
                    <h2>{group.owner.name}</h2>
                </div>
                <div className="group-info-item" id="school-info">
                    <p>School:</p>
                    <h2>{group.school ? group.school : "None"}</h2>
                </div>
                <div className="group-info-item" id="subject-info">
                    <p>Subject:</p>
                    <h2>{group.subject}</h2>
                </div>
                <div className="group-info-item" id="courseCode-info">
                    <p>Course Code:</p>
                    <h2>{group.course ? group.course : "None"}</h2>
                </div>
                <div className="group-info-item" id="schedule-info">
                    {group.isOnline ? (
                        <p>
                            Meets <strong>Online</strong> Every:
                        </p>
                    ) : (
                        <p>
                            Meets <strong>In-Person</strong> Every:
                        </p>
                    )}
                    <h2>{group.schedule}</h2>
                </div>
            </div>
        </div>
    );
};

export default SearchListing;
