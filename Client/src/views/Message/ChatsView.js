import "./ChatsView.scss";
import React, { useEffect, useState } from "react";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import { sendGetRequest, sendPostRequest } from "../../../Helper";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../Server/Routes/Routes";
import { useSelector } from "react-redux";

/**
 * A view for displaying the chats of a user
 * @author Ethan Cannelongo
 */
const ChatsView = ({ setSelectedConversation }) => {
    const [conversations, setConversations] = useState([]);
    const user = useSelector((state) => state.authReducer.user);

    /**
     * Sends chat get request.
     * @author Stacey Popenfoose
     * @date  03/18/22
     */
    const populateConversations = async () => {
        await sendPostRequest(
            Routes.Message.GetConversations,
            {},
            ResponseMessages.Message.GetConversations.Success,
            null,
            true,
            (data, error) => {
                if (error) return;
                console.log(data);
                setConversations(data.conversations);
            },
            false
        );
    };

    useEffect(() => {
        populateConversations();
    }, []);

    return (
        <div className="chats-view">
            {conversations.map((chat) => (
                <div
                    className={"chatItem " + (chat.active && "chatActive")}
                    onClick={() => {
                        conversations.forEach((otherChat) => {
                            otherChat.active = false;
                        });
                        chat.active = true;
                        setSelectedConversation(chat);
                    }}
                >
                    <ProfilePicture
                        image={
                            String(chat.participants[0]._id) !== user._id
                                ? chat.participants[0].profilePicture
                                : chat.participants[1].profilePicture
                        }
                    />
                    <p>
                        {String(chat.participants[0]._id) !== user._id
                            ? chat.participants[0].name
                            : chat.participants[1].name}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ChatsView;
