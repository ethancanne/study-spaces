import "./MembersView.scss";
import React from "react";

const MembersView = ({ group }) => {
    return (
        <div className="members-container">
            {console.log(group)}
            {group.members &&
                group.members.map((member) => (
                    <div className="member">
                        <img
                            className="profile-picture"
                            src={"data:image/png;charset=utf-8;base64," + member.profilePicture}
                            alt=""
                        />
                        <p>{member.name}</p>
                    </div>
                ))}
        </div>
    );
};

export default MembersView;
