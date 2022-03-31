import "./ProfilePicture.scss";
import React from "react";

const ProfilePicture = ({ image, name }) => {
    return image ? (
        <img className="profile-picture" src={"data:image/png;charset=utf-8;base64," + image} alt="" />
    ) : (
        <div className="profile-picture-initial">{name ? name[0] : ""}</div>
    );
};

export default ProfilePicture;
