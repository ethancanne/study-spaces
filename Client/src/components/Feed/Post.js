import "./Post.scss";
import React from "react";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import { useDispatch } from "react-redux";
import { showViewPostStudyGroupPopup } from "../../state/actions";
ButtonTypes;
//{ title, body, creator, dateCreated, type }
const Post = (props) => {
    const dispatch = useDispatch();
    return (
        <div className="post-container" onClick={() => dispatch(showViewPostStudyGroupPopup(props))}>
            <div className="post-details">
                <h1 className="post-type">{props.type}</h1>
                <h1 className="post-title">{props.title}</h1>
                <p className="post-body">{props.body}</p>

                <Button onClick={() => dispatch(showViewPostStudyGroupPopup(props))}>Answer</Button>
            </div>
            <div className="post-metainfo">
                <p className="post-date">{props.dateCreated.toLocaleString()}</p>
            </div>
            <img className="post-creator" />
        </div>
    );
};

export default Post;
