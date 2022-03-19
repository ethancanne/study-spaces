import "./MembersView.scss";
import React from "react";
import Label from "../../../core/Label/Label";
import ProfilePicture from "../../../components/ProfilePicture/ProfilePicture";
import { useDispatch } from "react-redux";
import { showViewMemberPopup } from "../../../state/actions/index";

const MembersView = ({ group }) => {
    const dispatch = useDispatch();
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
                    <div
                        className="member"
                        onClick={() => dispatch(showViewMemberPopup(member))}
                        style={{ borderColor: group.groupColor }}
                    >
                        <ProfilePicture image={member.profilePicture} />

                        <p>{member.name}</p>
                    </div>
                ))}
        </div>
    );
};

export default MembersView;
