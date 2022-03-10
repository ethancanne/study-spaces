import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Events = require("../../../Server/Events.js");

const SERVER_URL = "http://localhost:5000";

const Message = (props) => {
    const [socket, setSocket] = useState({});
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        let initialSocket = io(SERVER_URL);
        initialSocket.on(Events.Message, (message) => {
            let tempMessages = [...messages];
            tempMessages.push(<li>{message}</li>);
            setMessages(tempMessages);
            setMessage("");
        });
        setSocket(initialSocket);
    }, []);
    // send request to get conversations
    // needs: auth token, recipientId

    const handleChange = (event) => {
        setMessage(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit(Events.Message, message);
    };

    return (
        <div>
            Message
            <script src="/socket.io/socket.io.js"></script>
            <input type="text" value={message} onChange={handleChange} />
            <button onClick={handleSubmit}>Send</button>
            {messages}
        </div>
    );
};

export default Message;
