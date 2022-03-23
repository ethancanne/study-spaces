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
import { sendGetRequest, sendPostRequest } from "../../../Helper";

/**
 * A view for messaging a certain user
 * @author Ethan Cannelongo
 */
const ConversationView = ({ conversation }) => {
    const messagesViewRef = useRef();

    const loggedInUser = useSelector((state) => state.authReducer.user);

    const receivingUser =
        conversation.participants &&
        (String(conversation.participants[0]._id) !== loggedInUser._id
            ? conversation.participants[0]
            : conversation.participants[1]);

    const receiverId = receivingUser && receivingUser._id;
    const senderId = loggedInUser._id; //set to loggedInUser._id

    const SERVER_URL = process.env.production ? process.env.PRODUCTION_SERVER_URL : process.env.DEVELOPMENT_SERVER_URL;

    const [socket, setSocket] = useState({});
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const loadConversation = async () => {
        await sendPostRequest(
            Routes.Message.GetConversation,
            { receiverId: receivingUser._id },
            ResponseMessages.Message.SuccessGetConversation,
            null,
            true,
            (data, error) => {
                if (error) return;
                setMessages(data.conversation.messages);
            }
        );
    };

    useEffect(() => {
        if (conversation.participants) {
            loadConversation();
        }
    }, [conversation]);

    useEffect(() => {
        if (receivingUser) {
            let initialSocket = io(SERVER_URL, { autoConnect: false });
            initialSocket.auth = { id: senderId };

            initialSocket.on(Events.Message, ({ message, senderId }) => {
                let tempMessages = [...messages];
                const messageWasReceived = senderId === receiverId;
                console.log("message was received");

                tempMessages.push({ value: message, senderId });
                setMessages(tempMessages);
            });
            initialSocket.on(Events.MessageFailure, (errorMessage) => {
                console.log(errorMessage);
                //TODO show notification
            });
            initialSocket.connect();
            setSocket(initialSocket);
            messagesViewRef.current.scrollTop = messagesViewRef.current.scrollHeight;
        }
    }, [messages]);

    // send request to get conversations
    // needs: auth token, recipientId

    const handleChange = (event) => {
        setMessage(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(message, receiverId);
        socket.emit(Events.Message, {
            message,
            receiverId
        });
        setMessage("");
    };
    return (
        <div className="conversation-view">
            {receivingUser && (
                <>
                    <div className="currentConversationInfo">
                        <ProfilePicture image={receivingUser.profilePicture} />
                        <h1>{receivingUser && receivingUser.name}</h1>
                    </div>

                    <div className="messages-view" ref={messagesViewRef}>
                        {messages.map((msg) => (
                            <div
                                className={
                                    "message-box " + (msg.senderId !== senderId ? "receiving-msg" : "sending-msg")
                                }
                            >
                                {msg.senderId !== senderId && <ProfilePicture image={receivingUser.profilePicture} />}
                                <p>{msg.value}</p>
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
                </>
            )}
        </div>
    );
};

export default ConversationView;
