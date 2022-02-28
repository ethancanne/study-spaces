import "./Post.scss";
import React from "react";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import { useDispatch } from "react-redux";
import { showViewPostStudyGroupPopup } from "../../state/actions";
ButtonTypes;
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import PostTypes from "../../../../Server/Models/PostTypes";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark"; //Question
import CampaignIcon from "@mui/icons-material/Campaign"; //Announcement
import CommentIcon from "@mui/icons-material/Comment"; //Discussion
import ErrorIcon from "@mui/icons-material/Error"; //Problem

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
    }
    return { icon, responseType };
};
const Post = (props) => {
    const dispatch = useDispatch();

    return (
        <div className="post-container" onClick={() => dispatch(showViewPostStudyGroupPopup(props))}>
            <div className="post-details">
                <div className="post-top">
                    {getPostTypeDetails(props).icon}
                    <h1 style={{ backgroundColor: props.color }}>{props.type}</h1>
                </div>
                <h1 className="post-title">{props.title}</h1>
                <p className="post-body">{props.message}</p>
                <p className="post-response-count">
                    <span>{props.responses.length}</span> Responses
                </p>
                <Button onClick={() => dispatch(showViewPostStudyGroupPopup({ props }))}>Answer</Button>
            </div>
            <div className="post-metainfo">
                <p className="post-date">{props.dateCreated.toLocaleString()}</p>
            </div>

            <div className="post-creator">
                <ProfilePicture image={props.creator.profilePicture} />
            </div>
        </div>
    );
};

export default Post;
