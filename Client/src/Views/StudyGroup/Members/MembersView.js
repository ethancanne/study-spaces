import "./MembersView.scss";
import React from "react";
import Label from "../../../core/Label/Label";
import ProfilePicture from "../../../components/ProfilePicture/ProfilePicture";
import { useDispatch } from "react-redux";
import { showViewMemberPopup } from "../../../state/actions/index";
import SideView from "../../SideView/SideView";

const MembersView = ({ group, membersViewIsShowing, setMembersViewIsShowing }) => {
    const dispatch = useDispatch();
    return (
        <SideView
            nameOfClass="members-container"
            setSideViewIsShowing={setMembersViewIsShowing}
            sideViewIsShowing={membersViewIsShowing}
        >
            <div>
                <Label style={{ padding: "10px" }}>Owner</Label>

                <div
                    className="member owner"
                    onClick={() => dispatch(showViewMemberPopup(group.owner))}
                    style={{ borderColor: group.groupColor }}
                >
                    {group.owner && (
                        <>
                            <ProfilePicture image={group.owner.profilePicture} name={group.owner.name} />
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
                            <ProfilePicture image={member.profilePicture} name={member.name} />

                            <p>{member.name}</p>
                        </div>
                    ))}
            </div>
        </SideView>
    );
};

export default MembersView;
