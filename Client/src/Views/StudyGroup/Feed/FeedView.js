import "./FeedView.scss";
import React from "react";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
    showConfirmationPopup,
    showCreateMeetingStudyGroupPopup,
    showCreatePostStudyGroupPopup
} from "../../../state/actions";
import Post from "../../../components/Feed/Post";
import PostTypes from "../../../../../Server/Models/PostTypes";

const FeedView = ({ group }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authReducer.user);

    const handleSelectMeeting = (recurringMeetingSelected) => {
        dispatch(showCreateMeetingStudyGroupPopup(group, recurringMeetingSelected));
    };
    return (
        <div className="feed-container">
            <div className="posts-container">
                {group.feed && group.feed.posts ? (
                    group.feed.posts.map((post) => (
                        <Post
                            title={post.title}
                            message={post.message}
                            creator={post.creator}
                            dateCreated={post.date}
                            type={post.type}
                            color={group.groupColor}
                            responses={post.responses}
                        />
                    ))
                ) : (
                    <h1>Nothing yet</h1>
                )}
            </div>
            <div className="options-container">
                <Button onClick={() => dispatch(showCreatePostStudyGroupPopup(group))}>Start Post</Button>
                {group.owner && user._id === group.owner._id && (
                    <Button
                        onClick={() =>
                            dispatch(
                                showConfirmationPopup(
                                    handleSelectMeeting,
                                    "Choose Meeting",
                                    "Which meeting would you like to create",
                                    false,
                                    "Recurring Meeting",
                                    "One-time Meeting"
                                )
                            )
                        }
                    >
                        Schedule Meeting
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FeedView;
