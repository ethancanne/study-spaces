import "./ProfilePicture.scss";
import React from "react";

const ProfilePicture = ({ image }) => {
    return <img className="profile-picture" src={"data:image/png;charset=utf-8;base64," + image} alt="" />;
};

export default ProfilePicture;
