import "./ConversationView.scss";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { showErrorNotification } from "../../state/actions";
import Loading from "../../components/Loading/Loading";

/**
 * A view for messaging a certain user
 * @author Ethan Cannelongo
 */
const ConversationView = ({ conversation }) => {
    const messagesViewRef = useRef();
    const dispatch = useDispatch();

    const loggedInUser = useSelector((state) => state.authReducer.user);
    const isLoading = useSelector((state) => state.notificationReducer.loading);

    const receivingUser =
        conversation.participants &&
        (String(conversation.participants[0]._id) !== loggedInUser._id
            ? conversation.participants[0]
            : conversation.participants[1]);

    const receiverId = receivingUser && receivingUser._id;
    const loggedInUserId = loggedInUser._id;

    const SERVER_URL =
        process.env.NODE_ENV === "production" ? process.env.PRODUCTION_SERVER_URL : process.env.DEVELOPMENT_SERVER_URL;

    const [socket, setSocket] = useState({});

    const [inputtedMessage, setInputtedMessage] = useState("");
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
            },
            false
        );
    };

    //Load the conversation messages
    useEffect(() => {
        if (conversation.participants) {
            loadConversation();
        }
    }, [conversation]);

    //Setup socket connection
    useEffect(() => {
        if (receivingUser) {
            let initialSocket = io(SERVER_URL, { autoConnect: false });

            initialSocket.auth = { id: loggedInUserId };

            initialSocket.on(Events.Message, ({ message, senderId }) => {
                let tempMessages = [...messages];
                const messageWasReceived = senderId === receiverId;
                if (messageWasReceived) {
                    tempMessages.push({ value: message, senderId });
                    setMessages(tempMessages);
                }
            });

            initialSocket.on(Events.MessageFailure, (errorMessage) => {
                console.log(errorMessage);
                dispatch(showErrorNotification(errorMessage));
            });

            initialSocket.connect();
            setSocket(initialSocket);

            messagesViewRef.current.scrollTop = messagesViewRef.current.scrollHeight;
        }
    }, [messages]);

    const handleChange = (event) => {
        setInputtedMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputtedMessage, receiverId);

        let tempMessages = [...messages];
        tempMessages.push({ value: inputtedMessage, senderId: loggedInUserId });
        setMessages(tempMessages);

        socket.emit(Events.Message, {
            message: inputtedMessage,
            receiverId
        });
        setInputtedMessage("");
    };

    return (
        <div className="conversation-view">
            {receivingUser && (
                <>
                    <div className="currentConversationInfo">
                        <ProfilePicture image={receivingUser.profilePicture} name={receivingUser.name} />
                        <h1>{receivingUser && receivingUser.name}</h1>
                    </div>

                    {!isLoading ? (
                        <>
                            <div className="messages-view" ref={messagesViewRef}>
                                {messages.map((msg) => (
                                    <div className="message-container">
                                        <div
                                            className={
                                                msg.senderId !== loggedInUserId
                                                    ? "message-box receiving-msg"
                                                    : "message-box sending-msg"
                                            }
                                        >
                                            {msg.senderId !== loggedInUserId && (
                                                <ProfilePicture
                                                    image={receivingUser.profilePicture}
                                                    name={receivingUser.name}
                                                />
                                            )}
                                            <p className="message-content">{msg.value}</p>
                                        </div>
                                        <p
                                            className={
                                                msg.senderId !== loggedInUserId
                                                    ? "message-timestamp receiving-msg"
                                                    : "message-timestamp sending-msg"
                                            }
                                        >
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="send-message-form">
                                <Form>
                                    <div className="side-by-side">
                                        <InputField style={{ flex: "50%", overflow: "hidden" }}>
                                            <Label>Message</Label>
                                            <TextInput value={inputtedMessage} onChange={handleChange} />
                                        </InputField>

                                        <Button type={ButtonTypes.Creation} onClick={handleSubmit}>
                                            Send
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </>
                    ) : (
                        <Loading />
                    )}
                </>
            )}
        </div>
    );
};

export default ConversationView;
