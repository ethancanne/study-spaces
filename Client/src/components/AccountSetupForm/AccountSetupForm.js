import React from "react";
import "./AccountSetupForm.scss";
import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";
import FileBase64 from "react-file-base64";
import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import Label from "../../core/Label/Label.js";
import Routes from "../../../../Server/Routes/Routes.js";
import TextInput from "../../core/Inputs/TextInput/TextInput.js";

/**
 * Renders an account setup form.
 * @param {string} props.name The value of the full name field in the form
 * @param {string} props.areaCode The value of the area code field in the form
 * @param {boolean} props.is18OrOver The value of the is 18 or over switch in the form.
 * @param {string} props.profilePicture the binary value of the uploaded profile picture
 * @param {function} props.submitAccountSetup Used to submit the Account Setup form.
 * @param {function} props.updateNameField The function used to update the name value.
 * @param {function} props.updateAreaCodeField The function used to update the area code value.
 * @param {function} props.updateIs18OrOver The function used to update the value of the is 18 or over switch.
 * @param {function} props.updateProfilePicture The function used to update the profile picture.
 * @author Ethan Cannelongo
 * @date   11/10/2021
 */
const AccountSetupForm = (props) => {
    return (
        <div>
            <Form onSubmit={props.submitAccountSetup}>
                <InputField>
                    <Label>Full Name</Label>
                    <TextInput value={props.name} onChange={props.updateNameField} type="text" />
                </InputField>

                <InputField>
                    <Label>Area Code</Label>
                    <TextInput value={props.areaCode} onChange={props.updateAreaCodeField} type="text" />
                </InputField>
                <InputField>
                    <div className="inline">
                        <Label className="left Label">Are you 18 or older</Label>
                        <TextInput
                            className="right"
                            value={props.is18OrOver}
                            onChange={props.updateIs18OrOver}
                            type="checkbox"
                        />
                    </div>
                </InputField>
                <InputField>
                    <Label>Profile Picture</Label>
                    <div className="photo">
                        <FileBase64
                            id="fileInput right"
                            multiple={false}
                            onDone={({ base64 }) => props.updateProfilePicture(base64)}
                        />
                        <img className="imgPreview" id="left" src={props.profilePicture} alt="" />
                    </div>
                </InputField>

                <Button type={ButtonTypes.Creation}>Create Account</Button>
            </Form>
        </div>
    );
};

export default AccountSetupForm;
