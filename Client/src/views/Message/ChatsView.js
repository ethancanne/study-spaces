import "./ChatsView.scss";
import React, { useState } from "react";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import { sendGetRequest } from "../../../Helper";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";

/**
 * A view for displaying the chats of a user
 * @author Ethan Cannelongo
 */
const ChatsView = ({ setSelectedUserConversation }) => {

    
    const [chats, setChats] = useState([
        { name: "Ethan", active: false, _id: 1 },
        { name: "Johnny", active: false, _id: 2 }
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

    /**
     * Sends chat get request.
     * @author Stacey Popenfoose
     * @date  03/18/22
     */
     const submitRequest = async (e) => {

         await sendGetRequest(
             Routes.Message.GetConversations,
             {
                 name,
                 active,
                 _id
             },
             
         )
     };
    };
};

export default ChatsView;
