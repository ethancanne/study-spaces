import React, { useState, useEffect } from "react";
import "./Message.scss";
import io from "socket.io-client";
import Page from "../Page.js";
import ConversationView from "../../Views/Message/ConversationView";
import ChatsView from "../../Views/Message/ChatsView";

const Events = require("../../../../Server/Events.js");

const SERVER_URL = "http://localhost:5000";

const Message = (props) => {
    // const initialUser = {
    //     name: "Ethan",
    //     _property: "value",
    //     id: "61f980f5b77a6bbd8237b476"
    // };
    const [selectedConversation, setSelectedConversation] = useState({});
    return (
        <Page currentPage="message" topBar={true}>
            <div className="message-page">
                <div className="page-title">
                    <h1>Message</h1>
                </div>
                <script src="/socket.io/socket.io.js"></script>

                <div className="message-area">
                    <ChatsView setSelectedConversation={setSelectedConversation} />
                    <ConversationView conversation={selectedConversation} />
                </div>
            </div>
        </Page>
    );
};

export default Message;
