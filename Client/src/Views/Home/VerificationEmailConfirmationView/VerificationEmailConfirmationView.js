import React from "react";
import "./VerificationEmailConfirmationView.scss";
import { useSelector } from "react-redux";
import Views from "../../Views";
import Button from "../../../core/Button/Button";

/**
 * Once a user creates an account, this view will be displayed on the home page to indicate that the user needs to verify the account to continue setting it up
 * @param {function} setHomeView Used to set the view of the home page, if the user presses the log in button
 * @author Ethan Cannelongo
 * @date   11/02/2021
 */
const VerificationEmailConfirmationView = (props) => {
    const unverifiedUser = useSelector((state) => state.authReducer.unverifiedUser);
    return (
        <div className="verification-email-confirmation-view">
            <h1>You're almost there</h1>
            <p>
                Check your email: <strong>{unverifiedUser.email}</strong> for a link to continue the signup process
            </p>

            <Button
                onClick={() => {
                    props.setHomeView(Views.Home.Login);
                }}
            >
                Return
            </Button>
        </div>
    );
};

export default VerificationEmailConfirmationView;
