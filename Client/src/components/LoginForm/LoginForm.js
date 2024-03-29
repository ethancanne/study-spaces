import "./LoginForm.scss";
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
 * @param {String} props.email The email address in the form.
 * @param {String} props.password The password in the form.
 * @param {function} props.submitLogin Used to submit the login form.
 * @param {function} props.updateEmailField The function used to update the email address.
 * @param {function} props.updatePasswordField The function used to update the password.
 * @author Cameron Burkholder
 * @date   10/21/2021
 */
const LoginForm = (props) => {
    return (
        <div className="login-form">
            <Form onSubmit={props.submitLogin}>
                <InputField>
                    <Label>Email</Label>
                    <TextInput value={props.email} onChange={props.updateEmailField} type="email" />
                </InputField>
                <InputField>
                    <Label>Password</Label>
                    <TextInput value={props.password} onChange={props.updatePasswordField} type="password" />
                </InputField>
                {/* {props.loginDidFail} */}
                <Button type={ButtonTypes.Primary}>Sign in</Button>
            </Form>
        </div>
    );
};

export default LoginForm;
