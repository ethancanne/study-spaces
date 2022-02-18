import "./MembersView.scss";
import React from "react";
import Label from "../../../core/Label/Label";

const MembersView = ({ group }) => {
    return (
        <div className="members-container">
            <Label style={{ padding: "10px" }}>Owner</Label>

            <div className="member owner">
                {group.owner && (
                    <>
                        <img
                            className="profile-picture"
                            src={"data:image/png;charset=utf-8;base64," + group.owner.profilePicture}
                            alt=""
                        />
                        <p>{group.owner.name}</p>{" "}
                    </>
                )}
            </div>
            <Label style={{ padding: "10px" }}>Members</Label>
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
