import "./MembersView.scss";
import React from "react";
import Label from "../../../core/Label/Label";
import ProfilePicture from "../../../components/ProfilePicture/ProfilePicture";

const MembersView = ({ group }) => {
    return (
        <div className="members-container">
            <Label style={{ padding: "10px" }}>Owner</Label>

            <div className="member owner">
                {group.owner && (
                    <>
                        <ProfilePicture image={group.owner.profilePicture} />
                        <p>{group.owner.name}</p>{" "}
                    </>
                )}
            </div>
            <Label style={{ padding: "10px" }}>Members</Label>
            {group.members &&
                group.members.map((member) => (
                    <div className="member">
                        <ProfilePicture image={member.profilePicture} />

                        <p>{member.name}</p>
                    </div>
                ))}
        </div>
    );
};

export default MembersView;
