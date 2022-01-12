import React, { useEffect, useState } from "react";
import AccountSetupForm from "../../../components/AccountSetupForm/AccountSetupForm";
import Label from "../../../core/Label/Label";
import "./AccountSetupView.scss";
import { useParams } from "react-router-dom";
import Routes from "../../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signIn } from "../../../state/actions";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/ButtonTypes";
import Validator from "../../../../../Server/Validator";
import Views from "../../Views";
import InputField from "../../../core/InputField/InputField";

/**
 * Once the user has verified their account and clicked the link, this view is used to present the acount setup form so they can offically create their account on the home page
 * @param {function} setHomeView Used to set the view of this page, if the user presses the log in button
 * @author Ethan Cannelongo
 * @date   10/21/2021
 */
const AccountSetupView = (props) => {
    const BLANK = "";
    const [userIsVerified, setUserIsVerified] = useState(false);
    const [name, setName] = useState(BLANK);
    const [areaCode, setAreaCode] = useState(BLANK);
    const [is18OrOver, setIs18OrOver] = useState(false);
    const [profilePicture, setProfilePicture] = useState(BLANK);
    const [accountSetupErrorMsg, setAccountSetupErrorMsg] = useState(BLANK);
    const [user, setUser] = useState({});
    const verificationToken = props.verificationToken;

    const dispatch = useDispatch();

    useEffect(async () => {
        await verifyUser(verificationToken);
    }, []);

    /**
     * Used to verify the user associated with the token that was received from the link
     * @author Ethan Cannelongo
     * @param {String} token The verification token
     * @date   11/13/21
     */
    const verifyUser = async (verificationToken) => {
        // SUBMIT THE VERIFY USER REQUEST.
        let response;
        try {
            response = await axios.post(Routes.Account.GetUnverifiedUser, {
                verificationToken: verificationToken
            });
        } catch (error) {
            console.log(error);
        } finally {
            const responseIsDefined = Validator.isDefined(response);
            if (responseIsDefined) {
                // IF THE USER VERIFICATION WAS SUCCESSFUL, CONFIGURE THE CLIENT TO REFLECT THIS.
                const verificationWasValid = ResponseMessages.Account.UnverifiedUserWasFound === response.data.message;

                if (verificationWasValid) {
                    setUser(response.data.unverifiedUser);
                    setUserIsVerified(true);
                }
            }
        }
    };

    /**
     * Sends the request to the server for the new (complete) user to be created with the provided information
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const submitAccountSetup = async (event) => {
        // SUBMIT THE CREATE ACCOUNT REQUEST. (Test in Postman)
        event.preventDefault();
        event.stopPropagation();

        if (!is18OrOver) {
            return setAccountSetupErrorMsg("Uh oh, you're not old enough?");
        }

        let response;
        try {
            response = await axios.post(Routes.Account.SetupAccount, {
                verificationToken,
                user,
                name,
                areaCode,
                is18OrOver,
                profilePicture
            });
        } catch (error) {
            console.log(error);
            setAccountSetupErrorMsg("Uh oh, there's been an error: " + error.message);
        } finally {
            // IF THE LOGIN REQUEST HAS RECEIVED A RESPONSE, CHECK IF THE USER HAS BEEN LOGGED IN.
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                // IF THE ACCOUNT CREATION WAS SUCCESSFUL, CONFIGURE THE CLIENT TO REFLECT THIS.
                const accountSetupWasValid = ResponseMessages.Account.SuccessAccountSetup === response.data.message;

                if (accountSetupWasValid) {
                    dispatch(signIn(response.data));
                }
            }
        }
    };

    /**
     * Sets the home view to the sign in form.
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const signInClicked = () => {
        props.setHomeView(Views.Home.Login);
    };

    /**
     * Used to update the full name field in the setup account form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const updateNameField = (event) => {
        setName(event.target.value);
        setAccountSetupErrorMsg(BLANK);
    };

    /**
     * Used to update the full name field in the setup account form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const updateAreaCodeField = (event) => {
        setAreaCode(event.target.value);
        setAccountSetupErrorMsg(BLANK);
    };

    /**
     * Used to update the date of birth field in the setup account form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const updateIs18OrOver = (event) => {
        setIs18OrOver(event.target.checked);
        setAccountSetupErrorMsg(BLANK);
    };

    /**
     * Used to update the full name field in the setup account form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const updateProfilePicture = (base64) => {
        setProfilePicture(base64);
        setAccountSetupErrorMsg(BLANK);
    };

    return (
        <div className="account-setup-view">
            <h1>Study Spaces</h1>
            <h3>Setup Your Account</h3>
            <p>{user.email}</p>
            {userIsVerified ? (
                <div>
                    <AccountSetupForm
                        user={user}
                        name={name}
                        areaCode={areaCode}
                        is18OrOver={is18OrOver}
                        profilePicture={profilePicture}
                        updateNameField={updateNameField}
                        updateAreaCodeField={updateAreaCodeField}
                        updateIs18OrOver={updateIs18OrOver}
                        updateProfilePicture={updateProfilePicture}
                        submitAccountSetup={submitAccountSetup}
                    />
                    <p className="error-message">{accountSetupErrorMsg}</p>
                </div>
            ) : (
                <h1>You shouldn't be here!</h1>
            )}

            <div className="other-options">
                <Label>Already have an account?</Label>
                <Button type={ButtonTypes.Creation} onClick={signInClicked}>
                    Sign In
                </Button>
            </div>
        </div>
    );
};
export default AccountSetupView;
