import "./FeedView.scss";
import React from "react";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { showCreateMeetingStudyGroupPopup, showCreatePostStudyGroupPopup } from "../../../state/actions";
import Post from "../../../components/Feed/Post";
import PostTypes from "../../../../../Server/Models/PostTypes";

const FeedView = ({ group }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authReducer.user);
    return (
        <div className="feed-container">
            <div className="posts-container">
                {[
                    {
                        title: "Congratulations!",
                        body: "You successfully created your group: " + group.name,
                        creator: "Study Spaces Robot",
                        date: new Date(),
                        type: PostTypes.Announcement
                    }
                ].map((post) => (
                    <Post
                        title={post.title}
                        body={post.body}
                        creator={post.creator}
                        dateCreated={post.date}
                        type={post.type}
                    />
                ))}
            </div>
            <div className="options-container">
                <Button onClick={() => dispatch(showCreatePostStudyGroupPopup(group))}>Start Post</Button>
                {user._id === group.owner && (
                    <Button onClick={() => dispatch(showCreateMeetingStudyGroupPopup(group))}>Schedule Meeting</Button>
                )}
            </div>
        </div>
    );
};

export default FeedView;
