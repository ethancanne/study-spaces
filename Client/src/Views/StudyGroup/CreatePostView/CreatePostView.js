import React, { useState } from "react";
import CreatePostForm from "../../../components/CreatePostForm/CreatePostForm";
import { sendPostRequest } from "../../../../Helper";
import Routes from "../../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import { useHistory } from "react-router";

/**
 * This is a specific view that is used in a popup
 * to allow a user to create a post for a study group
 * @author Ethan Cannelongo
 * @date   02/17/2022
 */
const CreatePostView = ({ group }) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [category, setCategory] = useState(""); //OW
    const [attachment, setAttachment] = useState("");

    /**
     * Makes an api call to the create meeting route, passing in the information entered in the form and rendering the client according to the response received
     * @author Ethan Cannelongo
     * @date   02/17/2022
     * @async
     * */
    const submitCreatePost = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(group, title, body, category, attachment);

        //...
    };
    /**
     * Used to update the title field in the create post form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateTitleField = (event) => {
        setTitle(event.target.value);
    };

    /**
     * Used to update the body field in the create post form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateBodyField = (event) => {
        setBody(event.target.value);
    };

    /**
     * Used to update the category field in the create post form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateCategoryField = (event) => {
        setCategory(event.target.value);
    };

    /**
     * Used to update the attachment put in the create post form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/17/2022
     */
    const updateAttachmentField = (event) => {
        setAttachment(event.target.value);
    };

    return (
        <CreatePostForm
            title={title}
            body={body}
            category={category}
            attachment={attachment}
            updateTitleField={updateTitleField}
            updateBodyField={updateBodyField}
            updateCategoryField={updateCategoryField}
            updateAttachmentField={updateAttachmentField}
            submitCreatePost={submitCreatePost}
        />
    );
};

export default CreatePostView;
