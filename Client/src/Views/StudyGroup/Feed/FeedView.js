import "./FeedView.scss";
import React, { useEffect, useRef } from "react";
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
    const feedRef = useRef();

    useEffect(() => {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
        console.log("running");
    }, [group.posts]);

    const handleSelectMeeting = (recurringMeetingSelected) => {
        dispatch(showCreateMeetingStudyGroupPopup(group, recurringMeetingSelected));
    };
    return (
        <>
            <div className="feed-container" ref={feedRef}>
                <div className="posts-container">
                    {group.posts ? (
                        group.posts.map((post) => (
                            <Post
                                attachment={post.attachment}
                                title={post.title}
                                message={post.message}
                                creator={post.creator}
                                timestamp={post.createdAt}
                                type={post.type}
                                color={group.groupColor}
                                responses={post.responses}
                                group={group}
                            />
                        ))
                    ) : (
                        <h1>Nothing yet</h1>
                    )}
                </div>
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
        </>
    );
};

export default FeedView;
