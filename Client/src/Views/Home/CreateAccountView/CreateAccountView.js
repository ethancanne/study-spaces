import React from "react";
import axios from "axios";
import Validator from "../../../../../Server/Validator";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createAccount, showErrorNotification, showSuccessNotification } from "../../../state/actions";
import CreateAccountForm from "../../../components/CreateAccountForm/CreateAccountForm";
import Routes from "../../../../../Server/Routes/Routes.js";
import ButtonTypes from "../../../core/Button/ButtonTypes.js";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages.js";
import Button from "../../../core/Button/Button.js";
import Views from "../../Views.js";

import AuthView from "../AuthView";
import { sendPostRequest } from "../../../../Helper";

/**
 * This view presents the create account form on the home page
 * @param {function} setHomeView Used to set the view of this page, if the user presses the log in button
 * @author Ethan Cannelongo
 * @date   10/21/2021
 */
const CreateAccountView = (props) => {
    const BLANK = "";
    const [email, setEmail] = useState(BLANK);
    const [password, setPassword] = useState(BLANK);
    const [confirmPassword, setConfirmPassword] = useState(BLANK);

    const dispatch = useDispatch();

    /**
     * Submits the create account request to the server for verification.
     * @param {Event} event The form submission event that triggers the login.
     * @author Ethan Cannelongo
     * @date   10/21/2021
     */
    const submitAccountCreation = async (event) => {
        // PREVENT THE DEFAULT FORM SUBMISSION BEHAVIOR.
        event.preventDefault();
        event.stopPropagation();

        // FIRST, COMPARE THE PASSWORD AND CONFIRM PASSWORD FIELDS
        if (password === BLANK && confirmPassword === BLANK && email === BLANK) {
            dispatch(showErrorNotification("Please fill in the information"));
            return;
        }

        if (password !== confirmPassword) {
            dispatch(showErrorNotification("Passwords don't match"));
            return;
        }

        await sendPostRequest(
            Routes.Account.CreateAccount,
            {
                email,
                password,
                password_confirmation: confirmPassword
            },
            ResponseMessages.Account.SuccessAccountCreated,
            null,
            false,
            (data, error) => {
                if (error) return;
                const { unverifiedUser } = data;

                dispatch(createAccount(unverifiedUser));

                props.setHomeView(Views.Home.VerificationEmailConfirmation);
            }
        );
    };

    /**
     * Used to update the email field in the create account form.
     * @param {Event} event The change event to update the field with.
     * @author Cameron Burkholder
     * @date   10/21/2021
     */
    const updateEmailField = (event) => {
        setEmail(event.target.value);
    };

    /**
     * Used to update the password field in the create account form.
     * @param {Event} event The change event to update the field with.
     * @author Cameron Burkholder
     * @date   10/21/2021
     */
    const updatePasswordField = (event) => {
        setPassword(event.target.value);
    };

    /**
     * Used to update the confirm password field in the create account form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   10/21/2021
     */
    const updateConfirmPasswordField = (event) => {
        setConfirmPassword(event.target.value);
    };

    /**
     * Sets the home view to the sign in form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   10/21/2021
     */
    const signInClicked = (event) => {
        props.setHomeView(Views.Home.Login);
    };

    return (
        <AuthView>
            <p>Create Your Account</p>
            <CreateAccountForm
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                submitAccountCreation={submitAccountCreation}
                updateEmailField={updateEmailField}
                updatePasswordField={updatePasswordField}
                updateConfirmPasswordField={updateConfirmPasswordField}
            />

            <div className="other-options">
                <p>Already have an account?</p>
                <Button type={ButtonTypes.Primary} onClick={signInClicked}>
                    Sign In
                </Button>
            </div>
        </AuthView>
    );
};

export default CreateAccountView;
