import React from "react";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/ButtonTypes";
import ProfilePicture from "../../../components/ProfilePicture/ProfilePicture";
import "./ViewMemberView.scss";

const ViewMemberView = ({ member }) => {
    return (
        <div className="view-member-view-container">
            <div className="member-details">
                <div className="member-primary-info">
                    <ProfilePicture image={member.profilePicture} />
                    <h1>{member.name}</h1>
                </div>
                <div className="member-secondary-info">
                    <p>{member.email}</p>
                    <p></p>
                </div>
            </div>

            <hr />
            <div className="options side-by-side">
                <Button type={ButtonTypes.Creation}>Message</Button>
                <Button type={ButtonTypes.Destrucive}>Report</Button>
            </div>
        </div>
    );
};

export default ViewMemberView;
