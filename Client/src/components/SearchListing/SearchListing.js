import React from "react";
import "./SearchListing.scss";
/**
 * A view for displaying a single study group listing resulting from a search query
 * @author ???
 */
const SearchListing = ({ title, school, owner, category, courseCode, isTutor, isOnline, schedule, groupColor }) => {
    return (
        <div
            className="listing-container"
            style={{
                border: `${groupColor} 5px solid`
            }}
        >
            <div
                className="title-photo-container"
                style={{
                    backgroundColor: groupColor
                }}
            >
                <h1 className="group-title">{title}</h1>
            </div>
            <div className="group-info-container">
                <div className="group-info-item" id="owner-info">
                    {isTutor ? (
                        <p>
                            <strong>Tutor:</strong>
                        </p>
                    ) : (
                        <p>
                            <strong>Owner:</strong>
                        </p>
                    )}
                    <h2>{owner}</h2>
                </div>
                <div className="group-info-item" id="school-info">
                    <p>School:</p>
                    <h2>{school}</h2>
                </div>
                <div className="group-info-item" id="category-info">
                    <p>Category:</p>
                    <h2>{category}</h2>
                </div>
                <div className="group-info-item" id="courseCode-info">
                    <p>Course Code:</p>
                    <h2>{courseCode}</h2>
                </div>
                <div className="group-info-item" id="schedule-info">
                    {isOnline ? (
                        <p>
                            Meets <strong>Online</strong> Every:
                        </p>
                    ) : (
                        <p>
                            Meets <strong>In-Person</strong> Every:
                        </p>
                    )}
                    <h2>{schedule}</h2>
                </div>
            </div>
        </div>
    );
};

export default SearchListing;
