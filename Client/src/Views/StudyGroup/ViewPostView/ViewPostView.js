import "./ViewPostView.scss";

import React, { useState } from "react";
import PostTypes from "../../../../../Server/Models/PostTypes";
import Form from "../../../core/Form/Form";
import ButtonTypes from "../../../core/Button/ButtonTypes";
import TextInput from "../../../core/Inputs/TextInput/TextInput.js";
import Button from "../../../core/Button/Button.js";
import InputField from "../../../core/InputField/InputField.js";
import ProfilePicture from "../../../components/ProfilePicture/ProfilePicture";
import { getPostTypeDetails } from "../../../components/Feed/Post";
import { showReportPopup, showViewMemberPopup } from "../../../state/actions";
import { useDispatch } from "react-redux";
import { ReportTypes } from "../../Report/ReportTypes";

const ViewPostView = ({ post }) => {
    const [response, setResponse] = useState("");
    const dispatch = useDispatch();

    const updateResponseField = (e) => {
        setResponse(e.target.value);
    };

    const submitResponse = () => {
        console.log(response);
    };
    return (
        <div>
            <div className="view-post-top">
                {getPostTypeDetails(post).icon}
                <h1 style={{ backgroundColor: post.color }}>{post.type}</h1>
            </div>
            <div className="post-contents">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-body">
                    <p className="post-message">{post.message}</p>
                    <img className="post-attachment" src={"data:image/png;charset=utf-8;base64," + post.attachment} />
                </div>
                <div className="post-creator" onClick={() => dispatch(showViewMemberPopup(post.creator))}>
                    {/* TODO - populate post.creator */}
                    <p>{post.creator.name}</p>
                    <ProfilePicture image={post.creator.profilePicture} />
                </div>
            </div>
            <div className="responses-container">
                <h1>{getPostTypeDetails(post).responseType}s:</h1>
                {post.responses.map((response) => (
                    <div className="response">
                        <p>{response.message}</p>
                        <ProfilePicture image={response.profilePicture} />
                    </div>
                ))}
                <Form style={{ padding: 0, margin: 0 }} onSubmit={submitResponse}>
                    <div className="side-by-side">
                        <InputField style={{ flex: "70%" }}>
                            <TextInput
                                value={response}
                                onChange={updateResponseField}
                                placeholder={getPostTypeDetails(post).responseType}
                            />
                        </InputField>

                        <Button type={ButtonTypes.Creation}>Submit</Button>
                    </div>
                </Form>
            </div>
            <Button
                onClick={() => {
                    dispatch(showReportPopup(ReportTypes.POST, post));
                }}
            >
                Report
            </Button>
        </div>
    );
};

export default ViewPostView;
