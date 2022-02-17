import "./FeedView.scss";
import React from "react";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { showCreateMeetingStudyGroupPopup } from "../../../state/actions";

const FeedView = ({ group }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authReducer.user);
    return (
        <div className="feed-container">
            <div className="posts-container"></div>
            <div className="options-container">
                <Button>Start Post</Button>
                {user._id === group.owner && (
                    <Button onClick={() => dispatch(showCreateMeetingStudyGroupPopup(group))}>Schedule Meeting</Button>
                )}
            </div>
        </div>
    );
};

export default FeedView;
