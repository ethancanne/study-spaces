import React, { useState, useEffect } from "react";
import "./Message.scss";
import io from "socket.io-client";
import Page from "../Page.js";
import ConversationView from "../../Views/Message/ConversationView";
import ChatsView from "../../Views/Message/ChatsView";
import { useSelector } from "react-redux";

const Events = require("../../../../Server/Events.js");

const SERVER_URL = "http://localhost:5000";

const Message = (props) => {
    const [selectedConversation, setSelectedConversation] = useState({});
    const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
    return (
        <Page currentPage="message" topBar={true}>
            <div className="message-page">
                <div className="page-title">
                    <h1>Message</h1>
                </div>
                {isLoggedIn ? (
                    <>
                        <script src="/socket.io/socket.io.js"></script>

                        <div className="message-area">
                            <ChatsView setSelectedConversation={setSelectedConversation} />
                            <ConversationView conversation={selectedConversation} />
                        </div>
                    </>
                ) : (
                    <div className="guest-message">
                        <h1>You are currently browsing Study Spaces as a guest!</h1>
                        <p>Please sign-up or log-in to be able to message users</p>
                        <p>Feel free to use our search tool to discover study groups in your area.</p>
                    </div>
                )}
            </div>
        </Page>
    );
};

export default Message;
