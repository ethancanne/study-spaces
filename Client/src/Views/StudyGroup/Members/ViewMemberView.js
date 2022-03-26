import React from "react";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/ButtonTypes";
import ProfilePicture from "../../../components/ProfilePicture/ProfilePicture";
import "./ViewMemberView.scss";
import { sendPostRequest } from "../../../../Helper";
import Routes from "../../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import { useDispatch } from "react-redux";
import { closePopup, showReportPopup } from "../../../state/actions";
import { useHistory } from "react-router";
import { ReportTypes } from "../../Report/ReportTypes";

const ViewMemberView = ({ member }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const createConversation = () => {
        sendPostRequest(
            Routes.Message.CreateConversation,
            { receiverId: member._id },
            ResponseMessages.Message.SuccessCreateConversation,
            null,
            true,
            (data, error) => {
                history.push("/message");
                dispatch(closePopup());
                if (error) return;
            }
        );
    };
    return (
        <div className="view-member-view-container">
            <div className="member-details">
                <div className="member-primary-info">
                    <ProfilePicture image={member.profilePicture} />
                    <h1>{member.name}</h1>
                </div>
                <div className="member-secondary-info">
                    <p>{member.email}</p>
                </div>
            </div>

            <hr />
            <div className="options side-by-side">
                <Button type={ButtonTypes.Creation} onClick={createConversation}>
                    Message
                </Button>
                <Button
                    type={ButtonTypes.Destrucive}
                    onClick={() => dispatch(showReportPopup(ReportTypes.USER, member))}
                >
                    Report
                </Button>
            </div>
        </div>
    );
};

export default ViewMemberView;
