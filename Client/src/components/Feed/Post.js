import "./Post.scss";
import React from "react";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import { useDispatch } from "react-redux";
import { showViewPostStudyGroupPopup, showViewMeetingsStudyGroupPopup, showViewMemberPopup } from "../../state/actions";
ButtonTypes;
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import PostTypes from "../../../../Server/Models/PostTypes";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark"; //Question
import CampaignIcon from "@mui/icons-material/Campaign"; //Announcement
import CommentIcon from "@mui/icons-material/Comment"; //Discussion
import ErrorIcon from "@mui/icons-material/Error"; //Problem
import EventNoteIcon from "@mui/icons-material/EventNote"; //Meeting

export const getPostTypeDetails = (post) => {
    var icon;
    var responseType;
    switch (post.type) {
        case PostTypes.Question:
            icon = <QuestionMarkIcon className="top-icon" style={{ color: post.color }} />;
            responseType = "Answer";
            break;
        case PostTypes.Announcement:
            icon = <CampaignIcon className="top-icon" style={{ color: post.color }} />;
            responseType = "Comment";
            break;
        case PostTypes.Discussion:
            icon = <CommentIcon className="top-icon" style={{ color: post.color }} />;
            responseType = "Reply";
            break;
        case PostTypes.Problem:
            icon = <ErrorIcon className="top-icon" style={{ color: post.color }} />;
            responseType = "Solution";
            break;
        case PostTypes.Meeting:
            icon = <EventNoteIcon className="top-icon" style={{ color: post.color }} />;
            break;
    }
    return { icon, responseType };
};
const Post = (props) => {
    const dispatch = useDispatch();
    console.log(props);
    return (
        <div className="post-container">
            <div className="post-inner">
                <div
                    className="post-details"
                    style={{
                        backgroundColor:
                            props.type !== PostTypes.Meeting ? "rgba(255, 255, 255, 0.9)" : props.color + "10",
                        border: props.type === PostTypes.Meeting && "white 9px solid"
                    }}
                    onClick={() => {
                        if (props.type !== PostTypes.Meeting) dispatch(showViewPostStudyGroupPopup(props));
                        else dispatch(showViewMeetingsStudyGroupPopup(props.group));
                    }}
                >
                    <div className="post-inner-content">
                        <div className="post-top">
                            {getPostTypeDetails(props).icon}
                            <h1 style={{ backgroundColor: props.color }}>{props.type}</h1>
                        </div>
                        <h1 className="post-title">{props.title}</h1>
                        <p className="post-body"> {props.message}</p>
                    </div>
                    {props.attachment !== "" ? (
                        <img
                            className="attachment"
                            src={"data:image/png;charset=utf-8;base64," + props.attachment}
                            alt=""
                        />
                    ) : (
                        ""
                    )}
                </div>
                <div className="post-metainfo">
                    {/* <p className="post-response-count">
                        <span>{props.responses.length} </span>Responses
                    </p> */}
                    <p className="post-date">{props.timestamp && new Date(props.timestamp).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="post-creator" onClick={() => dispatch(showViewMemberPopup(props.creator))}>
                <ProfilePicture image={props.creator.profilePicture} name={props.creator.name} />
            </div>
        </div>
    );
};

export default Post;
