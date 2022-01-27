import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signIn, signOut, showErrorNotification } from "../../../state/actions";

import ButtonTypes from "../../../core/Button/ButtonTypes.js";
import Button from "../../../core/Button/Button.js";
import LoginForm from "../../../components/LoginForm/LoginForm.js";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages.js";
import Routes from "../../../../../Server/Routes/Routes.js";
import Validator from "../../../../../Server/Validator.js";
import Views from "../../Views.js";
import Label from "../../../core/Label/Label";
import AuthView from "../AuthView";

/**
 * Used to display the login form and log the user in.
 * @param {function} clientSideLogin Used to log the user in from the client-side perspective.
 * @param {function} clientSideLogout Used to log the user out from the client-side perspective.
 * @param {function} setHomeView Used to set the view of the home page, if the user presses the create account button
 * @author Cameron Burkholder and Ethan Cannelongo
 * @date   10/21/2021
 */
const LoginView = (props) => {
    const BLANK = "";
    const [email, setEmail] = useState(BLANK);
    const [password, setPassword] = useState(BLANK);
    const dispatch = useDispatch();

    /**
     * Submits the login request to the server for verification.
     * @param {Event} event The form submission event that triggers the login.
     * @author Cameron Burkholder
     * @date   10/21/2021
     */
    const submitLogin = async (event) => {
        // PREVENT THE DEFAULT FORM SUBMISSION BEHAVIOR.
        event.preventDefault();
        event.stopPropagation();

        // SUBMIT THE LOGIN REQUEST.
        let response;
        try {
            response = await axios.post(Routes.Account.Login, {
                email,
                password
            });
        } catch (error) {
            console.log(error);
            dispatch(showErrorNotification("There was a problem connecting to the server:" + error));
        } finally {
            // IF THE LOGIN REQUEST HAS RECEIVED A RESPONSE, CHECK IF THE USER HAS BEEN LOGGED IN.
            const responseIsDefined = Validator.isDefined(response);
            if (responseIsDefined) {
                // IF THE USER HAS LOGGED IN, CONFIGURE THE CLIENT TO REFLECT THIS.
                const loginWasValid = ResponseMessages.Account.SuccessLogin === response.data.message;
                if (loginWasValid) {
                    const { authenticationToken, authenticationTokenExpirationDate, user, studyGroups } = response.data;
                    dispatch(signIn({ authenticationToken, authenticationTokenExpirationDate, user }));
                } else {
                    dispatch(showErrorNotification(response.data.message));
                    dispatch(signOut);
                }
            }
        }
    };

    /**
     * Used to update the email field in the login form.
     * @param {Event} e The change event to update the field with.
     * @author Cameron Burkholder
     * @date   10/21/2021
     */
    const updateEmailField = (e) => {
        setEmail(e.target.value);
    };

    /**
     * Used to update the password field in the login form.
     * @param {Event} e The change event to update the field with.
     * @author Cameron Burkholder
     * @date   10/21/2021
     */
    const updatePasswordField = (e) => {
        setPassword(e.target.value);
    };

    /**
     * Sets the home view to the sign up form.
     * @param {Event} e The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   10/21/2021
     */
    const signUpClicked = (e) => {
        props.setHomeView(Views.Home.CreateAccount);
    };

    return (
        <AuthView>
            <LoginForm
                email={email}
                password={password}
                submitLogin={submitLogin}
                updateEmailField={updateEmailField}
                updatePasswordField={updatePasswordField}
            />

            <div className="other-options">
                <p>Don't have an account?</p>
                <Button type={ButtonTypes.Creation} onClick={signUpClicked}>
                    Sign Up
                </Button>
            </div>
        </AuthView>
    );
};

export default LoginView;
