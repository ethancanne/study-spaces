import "./CreateAccountForm.scss";
import React from "react";

import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";

import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import Label from "../../core/Label/Label.js";
import Routes from "../../../../Server/Routes/Routes.js";
import TextInput from "../../core/Inputs/TextInput/TextInput.js";

/**
 * Renders a login form.
 * @param {string} props.email The email address in the form.
 * @param {string} props.password The password in the form.
 * @param {string} props.confirmPassword The value of the confirm password field in the form.
 * @param {function} props.submitAccountCreation Used to submit the AccountCreation form.
 * @param {function} props.updateEmailField The function used to update the email address.
 * @param {function} props.updatePasswordField The function used to update the password.
 * @param {function} props.updateConfirmPasswordField The function used to update the confirm password.
 * @author Ethan Cannelongo
 * @date   11/10/2021
 */
const CreateAccountForm = (props) => {
    return (
        <div className="create-account-form">
            <Form onSubmit={props.submitAccountCreation}>
                <InputField>
                    <Label>Email</Label>
                    <TextInput value={props.email} onChange={props.updateEmailField} type="email" />
                </InputField>
                <InputField>
                    <Label>Password</Label>
                    <TextInput value={props.password} onChange={props.updatePasswordField} type="password" />
                </InputField>
                <InputField>
                    <Label>Confirm Password</Label>
                    <TextInput
                        value={props.confirmPassword}
                        onChange={props.updateConfirmPasswordField}
                        type="password"
                    />
                </InputField>

                {props.loginDidFail}
                <Button type={ButtonTypes.Creation}>Next</Button>
            </Form>
        </div>
    );
};

export default CreateAccountForm;
