import "./ConversationView.scss";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ButtonTypes from "../../core/Button/ButtonTypes";
import Form from "../../core/Form/Form";
import Button from "../../core/Button/Button";
import InputField from "../../core/InputField/InputField";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";

/**
 * A view for messaging a certain user
 * @author Ethan Cannelongo
 */
const ConversationView = ({ user }) => {
    const Events = require("../../../../Server/Events.js");
    // Cameron's user ID, used for testing.
    const senderId = "61f16094f32ffcd874e0bfe9";
    const receiverId = "61f980f5b77a6bbd8237b476";

    const SERVER_URL = "http://localhost:5000";

    const [socket, setSocket] = useState({});
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        { content: "hi", receiving: false },
        { content: "hi", receiving: true }
    ]);

    useEffect(() => {
        let initialSocket = io(SERVER_URL, { autoConnect: false });
        initialSocket.auth = { id: senderId };
        initialSocket.on(Events.Message, ({ message, senderId }) => {
            let tempMessages = [...messages];
            const messageWasReceived = (senderId == receiverId);
            tempMessages.push({ content: message, receiving: messageWasReceived });
            setMessages(tempMessages);
            setMessage("");
        });
        initialSocket.on(Events.MessageFailure, (errorMessage) => {
            console.log(errorMessage);
        })
        initialSocket.connect();
        setSocket(initialSocket);
    }, []);
    // send request to get conversations
    // needs: auth token, recipientId

    const handleChange = (event) => {
        setMessage(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit(Events.Message, {
            message,
            receiverId: receiverId
        });
    };
    return (
        <div className="conversation-view">
            <div className="currentConversationInfo">
                <ProfilePicture image={""} />
                <h1>{user.name && user.name}</h1>
            </div>
            {messages.map((msg) => (
                <div className={"message-box " + (msg.receiving ? "receiving-msg" : "sending-msg")}>
                    {msg.receiving && <ProfilePicture image={""} />}
                    <p>{msg.content}</p>
                </div>
            ))}
            <div className="send-message-form">
                <Form>
                    <div className="side-by-side">
                        <InputField style={{ flex: "70%" }}>
                            <Label>Message</Label>
                            <TextInput value={message} onChange={handleChange} />
                        </InputField>

                        <Button type={ButtonTypes.Creation} onClick={handleSubmit}>
                            Send
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ConversationView;
