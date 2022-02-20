import "./Post.scss";
import React from "react";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
ButtonTypes;

const Post = ({ title, body, creator, dateCreated, type }) => {
    return (
        <div className="post-container">
            <div className="post-details">
                <h1 className="post-type">{type}</h1>
                <h1 className="post-title">{title}</h1>
                <p className="post-body">{body}</p>

                <Button>Answer</Button>
            </div>
            <div className="post-metainfo">
                <p className="post-date">{dateCreated.toLocaleString()}</p>
            </div>
            <img className="post-creator" />
        </div>
    );
};

export default Post;
