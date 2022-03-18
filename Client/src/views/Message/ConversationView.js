import "./ConversationView.scss";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Events from "../../../../Server/Events.js";
import io from "socket.io-client";
import ButtonTypes from "../../core/Button/ButtonTypes";
import Form from "../../core/Form/Form";
import Button from "../../core/Button/Button";
import InputField from "../../core/InputField/InputField";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import Routes from "../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import { sendGetRequest } from "../../../Helper";

/**
 * A view for messaging a certain user
 * @author Ethan Cannelongo
 */
const ConversationView = ({ receivingUser }) => {
    // Cameron's user ID, used for testing.
    const loggedInUser = useSelector((state) => state.authReducer.user);

    const messagesViewRef = useRef();
    const senderId = loggedInUser._id; //set to loggedInUser._id
    const receiverId = "61f980f5b77a6bbd8237b476"; //receivingUser._id

    const SERVER_URL = "http://localhost:5000";

    const [socket, setSocket] = useState({});
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const loadConversation = async () => {
        await sendPostRequest(
            Routes.Message.GetConversation,
            { receiverId: owner._id },
            ResponseMessages.Message.SuccessGetConversation,
            null,
            true,
            (data, error) => {
                if (error) return;
                setMessage(data.conversations);
            }
        );
    };

    useEffect(() => {
        loadConversation();
        let initialSocket = io(SERVER_URL, { autoConnect: false });
        initialSocket.auth = { id: senderId };
        initialSocket.on(Events.Message, ({ message, senderId }) => {
            let tempMessages = [...messages];
            const messageWasReceived = senderId === receiverId;
            tempMessages.push({ content: message, receiving: messageWasReceived });
            setMessages(tempMessages);
            console.log(tempMessages);
        });
        initialSocket.on(Events.MessageFailure, (errorMessage) => {
            console.log(errorMessage);
        });
        initialSocket.connect();
        setSocket(initialSocket);

        messagesViewRef.current.scrollTop = messagesViewRef.current.scrollHeight;
    }, [messages]);

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
        setMessage("");
    };
    return (
        <div className="conversation-view">
            <div className="currentConversationInfo">
                <ProfilePicture image={""} />
                <h1>{receivingUser.name && receivingUser.name}</h1>
            </div>
            <div className="messages-view" ref={messagesViewRef}>
                {messages.map((msg) => (
                    <div className={"message-box " + (msg.receiving ? "receiving-msg" : "sending-msg")}>
                        {msg.receiving && <ProfilePicture image={""} />}
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
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
