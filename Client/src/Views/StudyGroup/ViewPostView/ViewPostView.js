import "./ViewPostView.scss";
import React from "react";

const ViewPostView = ({ post }) => {
    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </div>
    );
};

export default ViewPostView;
