import "./ChatsView.scss";
import React, { useState } from "react";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";

/**
 * A view for displaying the chats of a user
 * @author Ethan Cannelongo
 */
const ChatsView = ({ setSelectedUserConversation }) => {
    const [chats, setChats] = useState([
        { name: "Ethan", active: false },
        { name: "Johnny", active: false }
    ]);
    return (
        <div className="chats-view">
            {chats.map((chat) => (
                <div
                    className={"chatItem " + (chat.active && "chatActive")}
                    onClick={() => {
                        chats.forEach((otherChat) => {
                            otherChat.active = false;
                        });
                        chat.active = true;
                        setSelectedUserConversation(chat);
                    }}
                >
                    <ProfilePicture src="" />
                    <p>{chat.name}</p>
                </div>
            ))}
        </div>
    );
};

export default ChatsView;
