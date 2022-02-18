import React from "react";
import Form from "../../core/Form/Form";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import InputField from "../../core/InputField/InputField";
import Dropdown from "../../core/Dropdown/Dropdown";

const CreatePostForm = ({
    title,
    body,
    category,
    attachment,
    updateTitleField,
    updateBodyField,
    updateCategoryField,
    updateAttachmentField,
    submitCreatePost
}) => {
    return (
        <div className="create-meeting-form">
            <Form onSubmit={submitCreatePost}>
                <InputField>
                    <Label>Title</Label>
                    <TextInput value={title} onChange={updateTitleField} />
                </InputField>

                <InputField>
                    <Label>Body</Label>
                    <TextInput value={body} onChange={updateBodyField} isTextArea={true} />
                </InputField>

                <div className="side-by-side">
                    <InputField>
                        <Label>Category</Label>
                        <Dropdown
                            value={category}
                            onChange={updateCategoryField}
                            options={["Problem", "Discussion", "Question", "Announcement"]}
                        />
                    </InputField>

                    <InputField>
                        <Label>Attachment</Label>
                        <TextInput value={attachment} onChange={updateAttachmentField} type="file" />
                    </InputField>
                </div>

                <Button type={ButtonTypes.Creation}>Create</Button>
            </Form>
        </div>
    );
};

export default CreatePostForm;
